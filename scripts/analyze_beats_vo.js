const fs = require('fs');
const path = require('path');

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

/**
 * Strategy: detect SILENCES (low-RMS gaps) between speech segments.
 * Works when there's background music — silences are the quiet pauses
 * between the 3 beat voiceover segments.
 */
function analyzeGaps(wav, options = {}) {
    const {
        windowMs = 30,
        hopMs = 10,
        silenceMaxRMS = 0.006,
        minSilenceMs = 300,
        minRegionMs = 500,
    } = options;

    const { samples, sampleRate } = wav;
    const windowSize = Math.floor(windowMs * sampleRate / 1000);
    const hopSize = Math.floor(hopMs * sampleRate / 1000);

    const rmsValues = [];
    const times = [];
    for (let i = 0; i + windowSize <= samples.length; i += hopSize) {
        let sumSq = 0;
        for (let j = 0; j < windowSize; j++) sumSq += samples[i + j] ** 2;
        rmsValues.push(Math.sqrt(sumSq / windowSize));
        times.push(i / sampleRate);
    }

    // Find silence gaps
    const silences = [];
    let inSilence = false;
    let silStart = 0;

    for (let i = 0; i < rmsValues.length; i++) {
        if (rmsValues[i] < silenceMaxRMS && !inSilence) {
            silStart = times[i];
            inSilence = true;
        } else if (rmsValues[i] >= silenceMaxRMS && inSilence) {
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

    console.log(`  Found ${silences.length} silence gaps:`);
    silences.forEach((s, i) => {
        console.log(`    Silence ${i}: ${s.start.toFixed(3)}s → ${s.end.toFixed(3)}s (${s.durationMs.toFixed(0)}ms)`);
    });

    // Speech regions are between silences
    const regions = [];
    let prevEnd = 0;
    for (const sil of silences) {
        if (sil.start - prevEnd > minRegionMs / 1000) {
            regions.push({ start: prevEnd, end: sil.start });
        }
        prevEnd = sil.end;
    }
    if (wav.durationSec - prevEnd > minRegionMs / 1000) {
        regions.push({ start: prevEnd, end: wav.durationSec });
    }

    const mean = rmsValues.reduce((a, b) => a + b, 0) / rmsValues.length;
    console.log(`\n  Audio duration: ${wav.durationSec.toFixed(3)}s`);
    console.log(`  RMS stats: mean=${mean.toFixed(6)}, silence threshold=${silenceMaxRMS.toFixed(6)}`);

    return regions;
}

function main() {
    const wavPath = path.resolve(__dirname, '..', 'public', 'beats_vo.wav');
    if (!fs.existsSync(wavPath)) {
        console.error(`ERROR: File not found: ${wavPath}`);
        process.exit(1);
    }

    console.log(`Analyzing: ${wavPath}`);
    const wav = readWav(wavPath);
    const regions = analyzeGaps(wav);
    const fps = 30;

    console.log(`\n  Detected ${regions.length} speech regions:`);
    regions.forEach((r, idx) => {
        const startFrame = Math.round(r.start * fps);
        const endFrame = Math.round(r.end * fps);
        const durationFrames = endFrame - startFrame;
        console.log(`  Region ${idx}: ${r.start.toFixed(3)}s → ${r.end.toFixed(3)}s  (frames ${startFrame} → ${endFrame}, duration: ${durationFrames}f)`);
    });

    console.log('\n  Silence gaps between speech regions:');
    for (let i = 1; i < regions.length; i++) {
        const gapStart = regions[i - 1].end;
        const gapEnd = regions[i].start;
        const gapSec = gapEnd - gapStart;
        const gapStartFrame = Math.round(gapStart * fps);
        const gapEndFrame = Math.round(gapEnd * fps);
        console.log(`  Gap ${i}: ${gapStart.toFixed(3)}s → ${gapEnd.toFixed(3)}s  (${gapSec.toFixed(3)}s, frames ${gapStartFrame} → ${gapEndFrame})`);
    }

    console.log('\n=== SUGGESTED CONSTANTS VALUES ===');
    console.log('// Copy these into src/constants.ts:');
    console.log('export const SCENE_FRAMES = {');
    console.log('  hook: 113,  // = hook_vo.mp3 duration (3.76 s)');
    regions.forEach((r, idx) => {
        const durationFrames = Math.round(r.end * fps) - Math.round(r.start * fps);
        const label = idx === 0 ? 'beat1' : idx === 1 ? 'beat2' : `beat${idx + 1}`;
        console.log(`  ${label}: ${durationFrames},  // ${r.start.toFixed(2)}s → ${r.end.toFixed(3)}s (${(r.end - r.start).toFixed(3)}s)`);
    });
    console.log('} as const;');
    console.log('\nexport const BEATS_VO_OFFSETS = {');
    regions.forEach((r, idx) => {
        const startFrame = Math.round(r.start * fps);
        const label = idx === 0 ? 'beat1' : idx === 1 ? 'beat2' : `beat${idx + 1}`;
        console.log(`  ${label}: ${startFrame},  // ${r.start.toFixed(3)}s`);
    });
    console.log('} as const;');

    // Also print total frames
    const total = 113 + regions.reduce((sum, r) => sum + Math.round(r.end * fps) - Math.round(r.start * fps), 0);
    console.log(`\n  REEL_TOTAL_FRAMES = ${total}`);
}

main();