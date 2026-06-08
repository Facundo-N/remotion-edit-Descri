"""
Extract Beat 2 audio segment from beats_vo.mp3
Beat 2: 4.79s to 8.07s (144 frames to 242 frames at 30fps)
"""
import os
from pydub import AudioSegment

AUDIO_PATH = 'public/beats_vo.mp3'
OUTPUT_PATH = 'public/audio_beat2.mp3'
START_SEC = 4.79
DURATION_SEC = 3.28  # 8.07 - 4.79

if not os.path.exists(AUDIO_PATH):
    print(f"Error: {AUDIO_PATH} not found")
    exit(1)

audio = AudioSegment.from_mp3(AUDIO_PATH)
start_ms = int(START_SEC * 1000)
end_ms = int((START_SEC + DURATION_SEC) * 1000)
segment = audio[start_ms:end_ms]
segment.export(OUTPUT_PATH, format='mp3', bitrate='192k')
print(f"Exported {OUTPUT_PATH}: {len(segment)/1000:.2f}s")
print(f"Start: {START_SEC}s, End: {START_SEC + DURATION_SEC}s")