const fs = require('fs');

const files = [
    'public/audio_scene_2.mp3',
    'public/audio_scene_1_1.mp3',
    'public/audio_scene_1_2.mp3',
    'public/beats_vo.mp3',
];

for (const f of files) {
    try {
        const stat = fs.statSync(f);
        console.log(`${f}: ${(stat.size / 1024).toFixed(1)} KB`);
    } catch (e) {
        console.log(`${f}: NOT FOUND`);
    }
}