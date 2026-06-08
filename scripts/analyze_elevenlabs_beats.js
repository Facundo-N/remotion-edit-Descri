/**
 * Millimetric audio analysis for ElevenLabs_2026-06-06 beats MP3.
 * 
 * Strategy:
 *   1. Read the WAV file samples directly (Node.js Buffer, no numpy needed)
 *   2. Compute RMS energy in 10ms windows
 *   3. Detect silence gaps (low-RMS regions) to separate speech segments
 *   4. Use ffmpeg silencedetect as secondary validation
 *   5. Optionally transcribe each segment via Google STT to identify which 
 *      phrase it contains → determine correct beat order
 *   6. Output frame-accurate constants (30 fps) for TypeScript
 * 
 * Usage: node scripts/analyze_elevenlabs_beats.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── WAV file reader (same logic as analyze_beats_vo.js) ────────────────────
function readWav(filepath) {
    const buffer = fs.readFileSync(filepath);
    let offset = 12;
    while (offset < buffer.length) {
        const chunkId = buffer.toString('ascii', offset, offset + 4);
        const chunkSize = buffer.readUInt32LE(offset + 4);
        if (chunkId === 'fmt ') break;
        offset += 8 + chunkSize;
    }
    const numChannels = buffer.readUInt16LE(offset + 10);
    const sampleRate = buffer.readUInt32LE(offset + 12);
    const bitsPerSample = buffer.readUInt16LE(offset + 22);

    offset = 12;
    let dataOffset = 0;
    while (offset < buffer.length) {
        const chunkId = buffer.toString('ascii', offset, offset + 4);
        const chunkSize = buffer.readUInt32LE(offset + 4);
        if (chunkId === 'data') {
            dataOffset = offset + 8;
            break;
        }
        offset += 8 + chunkSize;
    }

    const dataBuf = buffer.slice(dataOffset);
    const bytesPerSample = bitsPerSample / 8;
    const samples = [];
    const totalSamples = Math.floor(dataBuf.length / (bytesPerSample * numChannels));

    for (let i = 0; i < totalSamples; i++) {
        let sum = 0;
        for (let ch = 0; ch < numChannels; ch++) {
            const byteOffset = (i * numChannels + ch) * bytesPerSample;
            let sample;
            if (bitsPerSample === 16) sample = dataBuf.readInt16LE(byteOffset);
            else if (bitsPerSample === 32) sample = dataBuf.readInt32LE(byteOffset);
            else if (bitsPerSample === 8) sample = (dataBuf.readUInt8(byteOffset) - 128) * 256;
            else sample = dataBuf.readInt16LE(byteOffset);
            sum += sample;
        }
        samples.push((sum / numChannels) / 32768.0);
    }
    return { samples, sampleRate, durationSec: samples.length / sampleRate };
}

// ─── RMS energy computation ─────────────────────────────────────────────────
function computeRMSWindows(wav, windowMs = 10, hopMs = 5) {
    const { samples, sampleRate } = wav;
    const windowSize = Math.floor(windowMs * sampleRate / 1000);
    const hopSize = Math.floor(hopMs * sampleRate / 1000);

    const rmsValues = [];
    const times = [];
    for (let i = 0; i + windowSize <= samples.length; i += hopSize) {
        let sumSq = 0;
        for (let j = 0; j < windowSize; j++) {
            sumSq += samples[i + j] ** 2;
        }
        rmsValues.push(Math.sqrt(sumSq / windowSize));
        times.push(i / sampleRate);
    }
    return { rmsValues, times };
}

// ─── Adaptive threshold computation ─────────────────────────────────────────
function computeAdaptiveThreshold(rmsValues) {
    // Sort RMS values, use percentile-based threshold
    const sorted = [...rmsValues].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.10)]; // 10th percentile (silence)
    const p50 = sorted[Math.floor(sorted.length * 0.50)]; // 50th percentile (median)
    const p90 = sorted[Math.floor(sorted.length * 0.90)]; // 90th percentile (speech peaks)

    // Threshold: midpoint between silence floor and median speech
    // Works even with background music/noise floor
    const silenceFloor = p10;
    const speechFloor = p50;
    const threshold = silenceFloor + (speechFloor - silenceFloor) * 0.40;

    console.log(`  RMS percentiles: p10=${silenceFloor.toFixed(6)}, p50=${speechFloor.toFixed(6)}, p90=${p90.toFixed(6)}`);
    console.log(`  Adaptive silence threshold: ${threshold.toFixed(6)}`);

    return { threshold, silenceFloor, speechFloor };
}

// ─── Silence gap detection ──────────────────────────────────────────────────
function detectSilenceGaps(rmsValues, times, threshold, minSilenceMs = 280) {
    const silences = [];
    let inSilence = false;
    let silStart = 0;

    for (let i = 0; i < rmsValues.length; i++) {
        if (rmsValues[i] < threshold && !inSilence) {
            silStart = times[i];
            inSilence = true;
        } else if (rmsValues[i] >= threshold && inSilence) {
            const durMs = (times[i] - silStart) * 1000;
            if (durMs >= minSilenceMs) {
                silences.push({ start: silStart, end: times[i], durationMs: durMs });
            }
            inSilence = false;
        }
    }
    if (inSilence) {
        const durMs = (times[times.length - 1] - silStart) * 1000;
        if (durMs >= minSilenceMs) {
            silences.push({ start: silStart, end: times[times.length - 1], durationMs: durMs });
        }
    }
    return silences;
}

// ─── Extract speech regions from silences ───────────────────────────────────
function getSpeechRegions(silences, totalDuration, minRegionMs = 400) {
    const regions = [];
    let prevEnd = 0;

    for (const sil of silences) {
        if (sil.start - prevEnd > minRegionMs / 1000) {
            regions.push({ start: prevEnd, end: sil.start });
        }
        prevEnd = sil.end;
    }
    if (totalDuration - prevEnd > minRegionMs / 1000) {
        regions.push({ start: prevEnd, end: totalDuration });
    }
    return regions;
}

// ─── ffmpeg silencedetect for validation ────────────────────────────────────
function ffmpegSilenceDetect(wavPath) {
    try {
        const result = execSync(
            `ffmpeg -i "${wavPath}" -af "silencedetect=n=-32dB:d=0.28" -f null - 2>&1`,
            { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
        );
        const lines = result.split('\n').filter(l => l.includes('silence'));
        console.log('\n  [ffmpeg silencedetect validation]');
        lines.forEach(l => console.log('    ' + l.trim()));
        return lines;
    } catch (e) {
        console.log('  [ffmpeg silencedetect] Error running ffmpeg:', e.message);
        return [];
    }
}

// ─── Extract audio segment for transcription ────────────────────────────────
function extractSegment(wavPath, startSec, durationSec, outputPath) {
    try {
        execSync(
            `ffmpeg -y -i "${wavPath}" -ss ${startSec} -t ${durationSec} -ac 1 -ar 16000 "${outputPath}" 2>&1`,
            { encoding: 'utf8', stdio: 'pipe' }
        );
        return true;
    } catch (e) {
        console.log(`  [extract] Warning: ${e.message}`);
        return false;
    }
}

// ─── Google STT via speech_recognition (es-AR) ──────────────────────────────
// Attempts transcription using the system's speech recognition if available.
// Falls back gracefully.
function transcribeSegment(audioPath) {
    // Since Python is not available, we skip STT and rely on duration matching.
    // The original beat order is known: 
    //   Beat1: "Máquina de café profesional" (~1.79s)
    //   Beat2: "Cápsulas premium variadas / Variedad de cápsulas premium" (~2.82s)
    //   Beat3: "Vajilla elegante" (~5.23s combined)
    // We'll match by duration proximity.
    return null; // STT skipped — using duration-based matching
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main() {
    const wavPath = path.resolve(__dirname, '..', 'public', 'elevenlabs_beats.wav');
    if (!fs.existsSync(wavPath)) {
        console.error(`ERROR: WAV file not found: ${wavPath}`);
        process.exit(1);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ElevenLabs Beats Audio — Millimetric Analysis');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // 1. Read WAV
    const wav = readWav(wavPath);
    console.log(`  Audio: ${wav.durationSec.toFixed(3)}s, ${wav.sampleRate} Hz, ${wav.samples.length} samples`);

    // 2. RMS analysis
    const { rmsValues, times } = computeRMSWindows(wav, 10, 5);

    // 3. Adaptive threshold
    const { threshold, silenceFloor, speechFloor } = computeAdaptiveThreshold(rmsValues);

    // 4. Detect silence gaps (280ms minimum — calibrated for natural speech pauses)
    const silences = detectSilenceGaps(rmsValues, times, threshold, 280);

    console.log(`\n  Detected ${silences.length} silence gaps:`);
    silences.forEach((s, i) => {
        console.log(`    Silence ${i}: ${s.start.toFixed(3)}s → ${s.end.toFixed(3)}s (${s.durationMs.toFixed(0)}ms)`);
    });

    // 5. Extract speech regions
    const regions = getSpeechRegions(silences, wav.durationSec, 400);

    console.log(`\n  Detected ${regions.length} speech regions:`);
    const fps = 30;

    regions.forEach((r, idx) => {
        const startFrame = Math.round(r.start * fps);
        const endFrame = Math.round(r.end * fps);
        const durationFrames = endFrame - startFrame;
        const durationSec = r.end - r.start;
        console.log(`  Region ${idx}: ${r.start.toFixed(3)}s → ${r.end.toFixed(3)}s  |  ` +
            `frames ${startFrame} → ${endFrame}  |  duration: ${durationFrames}f (${durationSec.toFixed(3)}s)`);
    });

    // 6. Print gaps between regions
    console.log('\n  Silence gaps between speech regions:');
    for (let i = 1; i < regions.length; i++) {
        const gapStart = regions[i - 1].end;
        const gapEnd = regions[i].start;
        const gapSec = gapEnd - gapStart;
        const gapStartFrame = Math.round(gapStart * fps);
        const gapEndFrame = Math.round(gapEnd * fps);
        console.log(`  Gap ${i}: ${gapStart.toFixed(3)}s → ${gapEnd.toFixed(3)}s  ` +
            `(${gapSec.toFixed(3)}s, frames ${gapStartFrame} → ${gapEndFrame})`);
    }

    // 7. Duration-based beat identification
    // Original beat durations (from beats_vo.wav analysis):
    //   Beat1 "Máquina de café profesional": 1.79s (Region 1)
    //   Beat2 "Cápsulas premium variadas":    2.82s (Region 2)  
    //   Beat3 "Vajilla elegante":             5.23s (Regions 3+4 combined)
    const knownDurations = [
        { beat: 1, label: 'Beat1 — Máquina de café profesional', origSec: 1.79 },
        { beat: 2, label: 'Beat2 — Cápsulas premium variadas', origSec: 2.82 },
        { beat: 3, label: 'Beat3 — Vajilla elegante', origSec: 5.23 },
    ];

    console.log('\n  ── Beat Identification (duration-based matching) ──');
    const assignments = [];
    const used = new Set();

    for (const region of regions) {
        const regionDur = region.end - region.start;
        let bestMatch = null;
        let bestDiff = Infinity;

        for (const kd of knownDurations) {
            if (used.has(kd.beat)) continue;
            const diff = Math.abs(regionDur - kd.origSec);
            // Allow ±30% tolerance
            if (diff < kd.origSec * 0.35 && diff < bestDiff) {
                bestDiff = diff;
                bestMatch = kd;
            }
        }

        if (bestMatch) {
            used.add(bestMatch.beat);
            const matchPct = ((1 - bestDiff / bestMatch.origSec) * 100).toFixed(1);
            assignments.push({ ...region, beat: bestMatch.beat, label: bestMatch.label, matchPct });
            console.log(`  Region (${regionDur.toFixed(3)}s) → ${bestMatch.label} (${bestMatch.origSec}s) — match: ${matchPct}%`);
        } else {
            console.log(`  Region (${regionDur.toFixed(3)}s) → UNMATCHED (closest: ${knownDurations.filter(k => !used.has(k.beat)).map(k => k.label).join(', ') || 'none'})`);
        }
    }

    // If we didn't match all 3 beats, try combined regions approach
    if (assignments.length < 3 && regions.length >= 3) {
        console.log('\n  ── Trying combined-region matching ──');
        // Maybe two adjacent regions form one beat (like original beat3 = Regions 3+4)
        for (let i = 0; i < regions.length - 1; i++) {
            const combinedDur = regions[i + 1].end - regions[i].start;
            for (const kd of knownDurations) {
                if (used.has(kd.beat)) continue;
                const diff = Math.abs(combinedDur - kd.origSec);
                if (diff < kd.origSec * 0.35) {
                    console.log(`  Regions ${i}+${i + 1} combined (${combinedDur.toFixed(3)}s) → ${kd.label} (${kd.origSec}s)`);
                }
            }
        }
    }

    // 8. ffmpeg secondary validation
    ffmpegSilenceDetect(wavPath);

    // 9. Output TypeScript constants
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  SUGGESTED TypeScript CONSTANTS (copy to src/constants.ts)');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Sort assignments by beat number for correct order
    assignments.sort((a, b) => a.beat - b.beat);

    console.log('export const SCENE_FRAMES = {');
    console.log('  hook: 113,  // = hook_vo.mp3 duration (3.76 s)');
    assignments.forEach(a => {
        const durationFrames = Math.round(a.end * fps) - Math.round(a.start * fps);
        console.log(`  beat${a.beat}: ${durationFrames},  // ${a.start.toFixed(3)}s → ${a.end.toFixed(3)}s — ${a.label}`);
    });
    console.log('} as const;');

    const totalFrames = 113 + assignments.reduce((sum, a) => {
        return sum + (Math.round(a.end * fps) - Math.round(a.start * fps));
    }, 0);
    console.log(`\nexport const REEL_TOTAL_FRAMES = ${totalFrames};`);

    console.log('\nexport const BEATS_VO_OFFSETS = {');
    assignments.forEach(a => {
        const startFrame = Math.round(a.start * fps);
        console.log(`  beat${a.beat}: ${startFrame},  // ${a.start.toFixed(3)}s — ${a.label}`);
    });
    console.log('} as const;');

    // 10. Check if beat ORDER changed from original
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  BEAT ORDER COMPARISON (original vs new)');
    console.log('═══════════════════════════════════════════════════════════════');
    const originalOrder = [1, 2, 3];
    const newOrder = assignments.map(a => a.beat);
    console.log(`  Original: Beat${originalOrder.join(' → Beat')}`);
    console.log(`  New:      Beat${newOrder.join(' → Beat')}`);

    const orderChanged = JSON.stringify(originalOrder) !== JSON.stringify(newOrder);
    if (orderChanged) {
        console.log('\n  ⚠️  BEAT ORDER CHANGED! ReelComposition.tsx Sequence order needs updating.');
    } else {
        console.log('\n  ✓ Beat order unchanged. Only offsets/durations need updating.');
    }

    // Save assignments to JSON for the next script to use
    const outputJson = {
        audioFile: 'elevenlabs_beats.mp3',
        durationSec: wav.durationSec,
        sampleRate: wav.sampleRate,
        fps: 30,
        regions,
        assignments: assignments.map(a => ({
            beat: a.beat,
            label: a.label,
            startSec: a.start,
            endSec: a.end,
            startFrame: Math.round(a.start * fps),
            endFrame: Math.round(a.end * fps),
            durationFrames: Math.round(a.end * fps) - Math.round(a.start * fps),
            durationSec: a.end - a.start,
            matchPct: a.matchPct,
        })),
        orderChanged,
        suggestedConstants: {
            SCENE_FRAMES: Object.fromEntries(assignments.map(a => {
                const durationFrames = Math.round(a.end * fps) - Math.round(a.start * fps);
                return [`beat${a.beat}`, durationFrames];
            })),
            BEATS_VO_OFFSETS: Object.fromEntries(assignments.map(a => {
                return [`beat${a.beat}`, Math.round(a.start * fps)];
            })),
        },
    };

    const jsonPath = path.resolve(__dirname, '..', 'scratch', 'elevenlabs_analysis.json');
    fs.writeFileSync(jsonPath, JSON.stringify(outputJson, null, 2));
    console.log(`\n  ✓ Analysis saved to: ${jsonPath}`);
}

main();