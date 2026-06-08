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

const wavPath = path.resolve(__dirname, '..', 'public', 'beats_vo.wav');
const wav = readWav(wavPath);
const fps = 30;

// Analyze 2.0s to 5.5s with 10ms windows, 10ms hop
const windowMs = 10;
const hopMs = 10;
const windowSize = Math.floor(windowMs * wav.sampleRate / 1000);
const hopSize = Math.floor(hopMs * wav.sampleRate / 1000);

console.log(`Detailed RMS analysis: 2.0s – 5.5s (10ms windows)`);
console.log(`Audio duration: ${wav.durationSec.toFixed(3)}s, sampleRate: ${wav.sampleRate}`);
console.log(`frame = time * 30 (rounded)\n`);
console.log(`time(s)   frame   RMS          bar`);

const startSample = Math.floor(2.0 * wav.sampleRate);
const endSample = Math.floor(5.5 * wav.sampleRate);

for (let i = startSample; i + windowSize <= endSample; i += hopSize) {
    let sumSq = 0;
    for (let j = 0; j < windowSize; j++) sumSq += wav.samples[i + j] ** 2;
    const rms = Math.sqrt(sumSq / windowSize);
    const time = i / wav.sampleRate;
    const frame = Math.round(time * fps);
    const bar = '#'.repeat(Math.floor(rms * 200));
    console.log(`${time.toFixed(3)}   ${String(frame).padStart(4)}   ${rms.toFixed(6)}   ${bar}`);
}