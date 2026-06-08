"""
Transcribe audio word-by-word by detecting silence gaps and mapping
to the known transcript text. Outputs Remotion-compatible TypeScript array.

Usage:
    py scripts/transcribe_words.py
"""

from pydub import AudioSegment
from pydub.silence import detect_nonsilent
import json
import os

# ── Configuration ──────────────────────────────────────────────────────────
AUDIO_PATH = 'public/hook_vo.mp3'
FPS = 30  # Remotion project frame rate
MIN_SILENCE_LEN = 80  # ms — minimum silence to consider a word boundary
SILENCE_THRESH = -45  # dBFS — silence threshold
TRANSCRIPT = "Sabés qué incluye nuestro servicio de cafetería para empresas"
TOTAL_FRAMES = 113  # From constants.ts

def seconds_to_frames(seconds: float) -> int:
    return round(seconds * FPS)

def main():
    if not os.path.exists(AUDIO_PATH):
        print(f"Error: {AUDIO_PATH} not found")
        return

    # Load audio
    audio = AudioSegment.from_mp3(AUDIO_PATH)
    duration_sec = len(audio) / 1000.0
    print(f"Audio duration: {duration_sec:.2f}s ({seconds_to_frames(duration_sec)} frames)")

    # Detect non-silent segments (word regions)
    nonsilent_ranges = detect_nonsilent(
        audio,
        min_silence_len=MIN_SILENCE_LEN,
        silence_thresh=SILENCE_THRESH,
        seek_step=10
    )

    # Convert to word boundaries using the detected speech segments
    words = TRANSCRIPT.split()
    word_count = len(words)

    if len(nonsilent_ranges) == 0:
        print("No speech detected! Using fallback: divide audio evenly by word count.")
        # Fallback: divide total duration evenly among words
        sec_per_word = duration_sec / word_count
        words_data = []
        for i, word in enumerate(words):
            start_sec = i * sec_per_word
            end_sec = start_sec + sec_per_word * 0.85  # 85% overlap for smooth transitions
            words_data.append({
                'text': word,
                'startFrame': seconds_to_frames(start_sec),
                'endFrame': seconds_to_frames(end_sec),
            })
    else:
        print(f"Detected {len(nonsilent_ranges)} speech segments")
        # Map speech segments to words
        # Calculate total speech duration
        total_speech_ms = sum(end - start for start, end in nonsilent_ranges)

        # Build cumulative word timing from speech segments
        words_data = []
        words_per_segment = max(1, word_count // len(nonsilent_ranges))
        word_idx = 0

        for seg_idx, (seg_start_ms, seg_end_ms) in enumerate(nonsilent_ranges):
            seg_duration_ms = seg_end_ms - seg_start_ms
            # How many words in this segment
            if seg_idx == len(nonsilent_ranges) - 1:
                # Last segment — assign remaining words
                words_in_seg = word_count - word_idx
            else:
                words_in_seg = max(1, round(word_count * seg_duration_ms / total_speech_ms))

            ms_per_word = seg_duration_ms / words_in_seg if words_in_seg > 0 else seg_duration_ms

            for w in range(words_in_seg):
                if word_idx >= word_count:
                    break
                word_start_ms = seg_start_ms + w * ms_per_word
                word_end_ms = word_start_ms + ms_per_word * 1.0
                # Clamp to segment boundaries
                word_end_ms = min(word_end_ms, seg_end_ms)

                words_data.append({
                    'text': words[word_idx],
                    'startFrame': seconds_to_frames(word_start_ms / 1000.0),
                    'endFrame': seconds_to_frames(word_end_ms / 1000.0),
                })
                word_idx += 1

    # Fix: ensure last word ends at total frames
    if words_data:
        words_data[-1]['endFrame'] = TOTAL_FRAMES

    # Print the TypeScript array
    print("\n" + "=" * 60)
    print("HOOK_WORDS array for TypeScript:")
    print("=" * 60)
    print(f"const HOOK_WORDS: Array<{{text: string; startFrame: number; endFrame: number}}> = [")
    for w in words_data:
        comma = "," if w != words_data[-1] else ","  # add comma always
        print(f"  {{ text: '{w['text']}', startFrame: {w['startFrame']}, endFrame: {w['endFrame']} }},{comma}")
    print("];")

    # Also print a JSON version
    print("\n\nJSON:")
    print(json.dumps(words_data, indent=2))

if __name__ == '__main__':
    main()