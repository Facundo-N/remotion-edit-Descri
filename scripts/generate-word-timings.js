/**
 * Generate word-by-word timings for the hook scene audio.
 * Uses syllable-based duration estimation since ffmpeg isn't available.
 *
 * Usage: node scripts/generate-word-timings.js
 */

const FPS = 30;
const TOTAL_FRAMES = 113;

const TRANSCRIPT = "¿Sabés qué incluye nuestro servicio de cafetería para empresas?";

// Syllable count approximation for Spanish words
function countSyllables(word) {
    // Clean word from punctuation
    const clean = word.replace(/[¿?¡!,.]/g, '');
    // Count vowel groups as syllables
    const vowels = clean.match(/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]+/g);
    return vowels ? vowels.length : 1;
}

const words = TRANSCRIPT.replace(/[¿?]/g, '').split(' ');
const wordSyllables = words.map(w => ({ word: w, syllables: countSyllables(w) }));
const totalSyllables = wordSyllables.reduce((sum, w) => sum + w.syllables, 0);

console.log('Word syllable breakdown:');
wordSyllables.forEach(w => console.log(`  ${w.word}: ${w.syllables} syllable(s)`));
console.log(`Total syllables: ${totalSyllables}`);
console.log(`Total frames: ${TOTAL_FRAMES}`);

// Frames per syllable
const framesPerSyllable = TOTAL_FRAMES / totalSyllables;

// Calculate start/end frames for each word
let currentFrame = 0;
const wordTimings = words.map((word, i) => {
    const sylCount = wordSyllables[i].syllables;
    const wordDuration = Math.round(sylCount * framesPerSyllable);
    const startFrame = currentFrame;
    currentFrame += wordDuration;
    const endFrame = Math.min(currentFrame, TOTAL_FRAMES);
    return { word, startFrame, endFrame };
});

// Ensure last word ends exactly at TOTAL_FRAMES
if (wordTimings.length > 0) {
    wordTimings[wordTimings.length - 1].endFrame = TOTAL_FRAMES;
}

// Add overlap for smooth transitions (fade in/out)
// Each word overlaps with the next by ~2 frames
const wordTimingsWithOverlap = wordTimings.map((t, i) => ({
    text: t.word,
    startFrame: t.startFrame,
    endFrame: i < wordTimings.length - 1 ? t.endFrame : t.endFrame,
}));

console.log('\n\n=== TypeScript output ===\n');
console.log(`const HOOK_WORDS: Array<{text: string; startFrame: number; endFrame: number}> = [`);
wordTimingsWithOverlap.forEach((w, i) => {
    const comma = i < wordTimingsWithOverlap.length - 1 ? ',' : ',';
    console.log(`  { text: '${w.text}', startFrame: ${w.startFrame}, endFrame: ${w.endFrame} },`);
});
console.log('];');