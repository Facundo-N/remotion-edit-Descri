/**
 * Improved word timing generation for Beat 2.
 * Uses temp_scene2_preview.wav to detect speech regions,
 * then maps transcript words to those regions.
 *
 * Usage: node scripts/generate_beat2_words_improved.js
 */
const fs = require('fs');

const FPS = 30;
const TOTAL_FRAMES = 99;
const WAV_PATH = 'temp_scene2_preview.wav';

// Known transcript for beat 2
const TRANSCRIPT = 'Cápsulas premium variadas Variedad de cápsulas premium';
const WORDS = TRANSCRIPT.split(' ');

function countSyllables(word) {
    const clean = word.replace(/[¿?¡!,.]/g, '');
    const vowels = clean.match(/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]+/g);
    return vowels ? vowels.length : 1;
}

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
    for (let i = 0; i < dataBuf.length; i += bytesPerSample * numChannels) {
        let sample;
        if (bitsPerSample === 16) sample = dataBuf.readInt16LE(i);
        else if (bitsPerSample === 32) sample = dataBuf.readInt32LE(i);
        else if (bitsPerSample === 8) sample = (dataBuf.readUInt8(i) - 128) * 256;
        else sample = dataBuf.readInt16LE(i);
        samples.push(sample / 32768.0);
    }
    return { samples, sampleRate, durationSec: samples.length / sampleRate };
}

function detectSpeech(wav) {
    const { samples, sampleRate } = wav;
    const windowMs = 20;
    const hopMs = 5;
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

    // Adaptive threshold: use mean + 0.5*std
    const mean = rmsValues.reduce((a, b) => a + b, 0) / rmsValues.length;
    const std = Math.sqrt(rmsValues.reduce((a, b) => a + (b - mean) ** 2, 0) / rmsValues.length);
    const threshold = Math.max(0.01, mean + 0.3 * std);

    // Classify speech/silence
    const isSpeech = rmsValues.map(v => v > threshold);

    // Merge into regions (min 50ms silence gap)
    const regions = [];
    let inSpeech = false, start = 0;
    for (let i = 0; i < isSpeech.length; i++) {
        if (isSpeech[i] && !inSpeech) { start = times[i]; inSpeech = true; }
        else if (!isSpeech[i] && inSpeech) {
            if ((times[i] - start) * 1000 > 50) regions.push({ start, end: times[i] });
            inSpeech = false;
        }
    }
    if (inSpeech && (times[times.length - 1] - start) * 1000 > 50) {
        regions.push({ start, end: times[times.length - 1] });
    }

    // Merge close regions (less than 200ms gap)
    const merged = [regions[0]];
    for (let i = 1; i < regions.length; i++) {
        const gap = regions[i].start - merged[merged.length - 1].end;
        if (gap < 0.2) merged[merged.length - 1].end = regions[i].end;
        else merged.push(regions[i]);
    }

    return { regions: merged, threshold, mean };
}

function assignWordsBySyllables(regions, words, wavDurationSec) {
    const wordSyllables = words.map(w => countSyllables(w));
    const totalSyllables = wordSyllables.reduce((a, b) => a + b, 0);

    // If no WAV or too short, use pure syllable estimation across total frames
    if (regions.length === 0) {
        console.log('No WAV data - using pure syllable estimation');
        const framesPerSyllable = TOTAL_FRAMES / totalSyllables;
        let cf = 0;
        const timings = [];
        for (let i = 0; i < words.length; i++) {
            const dur = Math.round(wordSyllables[i] * framesPerSyllable);
            timings.push({ text: words[i], startFrame: cf, endFrame: Math.min(cf + dur, TOTAL_FRAMES) });
            cf += dur;
        }
        timings[timings.length - 1].endFrame = TOTAL_FRAMES;
        return timings;
    }

    // Map words to regions: assign proportional to region duration
    const totalSpeechSec = regions.reduce((a, r) => a + (r.end - r.start), 0);
    const wordsPerRegion = [];
    let wordIdx = 0;
    for (let ri = 0; ri < regions.length; ri++) {
        const regDuration = regions[ri].end - regions[ri].start;
        const fraction = regDuration / totalSpeechSec;
        let count = Math.round(words.length * fraction);
        if (ri === regions.length - 1) count = words.length - wordIdx;
        else count = Math.max(1, Math.min(count, words.length - wordIdx - 1));
        wordsPerRegion.push(count);
        wordIdx += count;
    }

    // Now distribute within each region by syllables
    wordIdx = 0;
    const timings = [];
    for (let ri = 0; ri < regions.length; ri++) {
        const regStartSec = regions[ri].start;
        const regEndSec = regions[ri].end;
        const regDuration = regEndSec - regStartSec;
        const count = wordsPerRegion[ri];

        let regSyllables = 0;
        for (let w = wordIdx; w < wordIdx + count; w++) regSyllables += wordSyllables[w];
        const secPerSyllable = regDuration / regSyllables;

        let currentSec = regStartSec;
        for (let w = 0; w < count && wordIdx < words.length; w++) {
            const dur = wordSyllables[wordIdx] * secPerSyllable;
            const startSec = currentSec;
            const endSec = Math.min(currentSec + dur, regEndSec);
            timings.push({
                text: words[wordIdx],
                startFrame: Math.round(startSec * FPS),
                endFrame: Math.round(endSec * FPS),
            });
            currentSec = endSec;
            wordIdx++;
        }
    }

    // Scale to TOTAL_FRAMES
    if (timings.length > 0) {
        const lastFrame = timings[timings.length - 1].endFrame;
        const scaleFactor = TOTAL_FRAMES / Math.max(lastFrame, 1);
        for (const t of timings) {
            t.startFrame = Math.round(t.startFrame * scaleFactor);
            t.endFrame = Math.round(t.endFrame * scaleFactor);
        }
        timings[timings.length - 1].endFrame = TOTAL_FRAMES;
    }

    return timings;
}

function main() {
    if (!fs.existsSync(WAV_PATH)) {
        console.log(`WAV not found at ${WAV_PATH}. Using pure syllable estimation.`);
        // Fallback
        const wordSyllables = WORDS.map(w => countSyllables(w));
        const totalSyllables = wordSyllables.reduce((a, b) => a + b, 0);
        const framesPerSyllable = TOTAL_FRAMES / totalSyllables;
        let cf = 0;
        const timings = [];
        for (let i = 0; i < WORDS.length; i++) {
            const dur = Math.round(wordSyllables[i] * framesPerSyllable);
            timings.push({ text: WORDS[i], startFrame: cf, endFrame: Math.min(cf + dur, TOTAL_FRAMES) });
            cf += dur;
        }
        timings[timings.length - 1].endFrame = TOTAL_FRAMES;
        return printOutput(timings);
    }

    const wav = readWav(WAV_PATH);
    console.log(`WAV: ${wav.sampleRate}Hz, ${wav.durationSec.toFixed(3)}s`);

    const { regions, threshold, mean } = detectSpeech(wav);
    console.log(`Energy threshold: ${threshold.toFixed(4)} (mean: ${mean.toFixed(4)})`);
    console.log(`Detected ${regions.length} speech regions:`);
    regions.forEach((r, i) => {
        console.log(`  [${i}] ${r.start.toFixed(3)}s - ${r.end.toFixed(3)}s (${((r.end - r.start) * 1000).toFixed(0)}ms)`);
    });

    const timings = assignWordsBySyllables(regions, WORDS, wav.durationSec);
    printOutput(timings);

    console.log('\n--- Word syllable breakdown ---');
    WORDS.forEach(w => console.log(`  ${w}: ${countSyllables(w)} syllable(s)`));
}

function printOutput(timings) {
    // Add 2-frame overlap between consecutive words
    const withOverlap = timings.map((t, i) => ({
        text: t.text,
        startFrame: t.startFrame,
        endFrame: i < timings.length - 1
            ? Math.min(t.endFrame + 2, timings[i + 1].startFrame + 1)
            : t.endFrame,
    }));

    console.log('\n' + '='.repeat(70));
    console.log('BEAT2_WORDS for TypeScript:');
    console.log('='.repeat(70));
    console.log('const BEAT2_WORDS: Array<{ text: string; startFrame: number; endFrame: number }> = [');
    withOverlap.forEach((w, i) => {
        const comma = i < withOverlap.length - 1 ? ',' : ',';
        console.log(`  { text: '${w.text}', startFrame: ${w.startFrame}, endFrame: ${w.endFrame} },`);
    });
    console.log('];');

    console.log('\n--- Timeline ---');
    withOverlap.forEach(w => {
        const ss = (w.startFrame / FPS).toFixed(2);
        const se = (w.endFrame / FPS).toFixed(2);
        const bar = '█'.repeat(Math.max(1, Math.round((w.endFrame - w.startFrame) / 2)));
        console.log(`  ${ss.padStart(6)}s-${se.padStart(6)}s [${bar}] ${w.text}`);
    });
}

main();