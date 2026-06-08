/**
 * Generate word-by-word timings for Beat 2 using syllable-based estimation.
 *
 * Since we know the transcript and total frames (99), we estimate
 * timing proportionally by syllable count.
 *
 * Usage: node scripts/generate_beat2_words.js
 */
const fs = require('fs');

const FPS = 30;
const TOTAL_FRAMES = 99; // from constants.ts SCENE_FRAMES.beat2

// Known transcript for beat 2 (from the scene's visual text + VO)
const TRANSCRIPT = 'Cápsulas premium variadas Variedad de cápsulas premium';
const WORDS = TRANSCRIPT.split(' ');

function countSyllables(word) {
    const clean = word.replace(/[¿?¡!,.]/g, '');
    const vowels = clean.match(/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]+/g);
    return vowels ? vowels.length : 1;
}

const wordSyllables = WORDS.map(w => ({ word: w, syllables: countSyllables(w) }));
const totalSyllables = wordSyllables.reduce((sum, w) => sum + w.syllables, 0);

console.log('Word syllable breakdown:');
wordSyllables.forEach(w => console.log(`  ${w.word}: ${w.syllables} syllable(s)`));
console.log(`Total syllables: ${totalSyllables}`);
console.log(`Total frames: ${TOTAL_FRAMES}\n`);

// Frames per syllable
const framesPerSyllable = TOTAL_FRAMES / totalSyllables;

// Calculate start/end frames for each word
let currentFrame = 0;
const wordTimings = WORDS.map((word, i) => {
    const sylCount = wordSyllables[i].syllables;
    const wordDuration = Math.round(sylCount * framesPerSyllable);
    const startFrame = currentFrame;
    currentFrame += wordDuration;
    const endFrame = Math.min(currentFrame, TOTAL_FRAMES);
    return { text: word, startFrame, endFrame };
});

// Ensure last word ends exactly at TOTAL_FRAMES
if (wordTimings.length > 0) {
    wordTimings[wordTimings.length - 1].endFrame = TOTAL_FRAMES;
}

// Add 2-frame overlap for smooth transitions between words
const wordTimingsWithOverlap = wordTimings.map((t, i) => ({
    text: t.text,
    startFrame: t.startFrame,
    endFrame: i < wordTimings.length - 1
        ? Math.min(t.endFrame + 2, wordTimings[i + 1].startFrame + 1)
        : t.endFrame,
}));

console.log('='.repeat(70));
console.log('BEAT2_WORDS array for TypeScript:');
console.log('='.repeat(70));
console.log('export const BEAT2_WORDS: Array<{ text: string; startFrame: number; endFrame: number }> = [');
wordTimingsWithOverlap.forEach((w, i) => {
    const comma = i < wordTimingsWithOverlap.length - 1 ? ',' : ',';
    console.log(`  { text: '${w.text}', startFrame: ${w.startFrame}, endFrame: ${w.endFrame} },`);
});
console.log('];');

// Pretty print timeline
console.log('\n--- Timeline (30fps) ---');
wordTimingsWithOverlap.forEach(w => {
    const startSec = (w.startFrame / FPS).toFixed(2);
    const endSec = (w.endFrame / FPS).toFixed(2);
    const bar = '█'.repeat(Math.max(1, Math.round((w.endFrame - w.startFrame) / 2)));
    console.log(`  ${startSec.padStart(6)}s-${endSec.padStart(6)}s [${bar}] ${w.text}`);
});