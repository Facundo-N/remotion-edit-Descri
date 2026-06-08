const fs = require('fs');

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

    const mean = rmsValues.reduce((a, b) => a + b, 0) / rmsValues.length;
    const std = Math.sqrt(rmsValues.reduce((a, b) => a + (b - mean) ** 2, 0) / rmsValues.length);
    const threshold = Math.max(0.005, mean + 0.2 * std);

    const isSpeech = rmsValues.map(v => v > threshold);
    const regions = [];
    let inSpeech = false, start = 0;
    for (let i = 0; i < isSpeech.length; i++) {
        if (isSpeech[i] && !inSpeech) { start = times[i]; inSpeech = true; }
        else if (!inSpeech) {
            // Keep updating start if we are just transitioning or ignore
        } else if (!isSpeech[i] && inSpeech) {
            if ((times[i] - start) * 1000 > 50) regions.push({ start, end: times[i] });
            inSpeech = false;
        }
    }
    if (inSpeech) {
        regions.push({ start, end: times[times.length - 1] });
    }

    const merged = [];
    if (regions.length > 0) {
        merged.push(regions[0]);
        for (let i = 1; i < regions.length; i++) {
            const gap = regions[i].start - merged[merged.length - 1].end;
            if (gap < 0.15) {
                merged[merged.length - 1].end = regions[i].end;
            } else {
                merged.push(regions[i]);
            }
        }
    }

    return merged;
}

try {
    for (const f of ['temp.wav', 'temp_audio.wav', 'temp_scene2_preview.wav']) {
        if (fs.existsSync(f)) {
            const wav = readWav(f);
            console.log(`\nFile: ${f}`);
            console.log(`Duration: ${wav.durationSec.toFixed(3)}s`);
            const regions = detectSpeech(wav);
            regions.forEach((r, idx) => {
                console.log(`  Region ${idx}: ${r.start.toFixed(2)}s - ${r.end.toFixed(2)}s (frames: ${Math.round(r.start*30)} - ${Math.round(r.end*30)})`);
            });
        }
    }
} catch (e) {
    console.error(e);
}
