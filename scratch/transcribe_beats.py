import speech_recognition as sr
import wave
import contextlib
import struct
import math

def read_wav_energy(filepath, window_ms=20, hop_ms=5):
    with contextlib.closing(wave.open(filepath, 'r')) as f:
        num_channels = f.getnchannels()
        sample_width = f.getsampwidth()
        sample_rate = f.getframerate()
        num_frames = f.getnframes()
        duration = num_frames / float(sample_rate)
        
        # Read frames
        raw_data = f.readframes(num_frames)
        
    # Parse 16-bit mono or stereo samples
    fmt = f"{num_frames * num_channels}h"
    samples_raw = struct.unpack(fmt, raw_data)
    
    # Convert to mono float samples
    samples = []
    if num_channels == 1:
        for val in samples_raw:
            samples.append(val / 32768.0)
    else:
        for i in range(0, len(samples_raw), num_channels):
            avg = sum(samples_raw[i:i+num_channels]) / float(num_channels)
            samples.append(avg / 32768.0)
            
    window_size = int(window_ms * sample_rate / 1000)
    hop_size = int(hop_ms * sample_rate / 1000)
    
    rms_values = []
    times = []
    
    for i in range(0, len(samples) - window_size, hop_size):
        window = samples[i : i + window_size]
        sum_sq = sum(val * val for val in window)
        rms = math.sqrt(sum_sq / len(window))
        rms_values.append(rms)
        times.append(i / float(sample_rate))
        
    mean = sum(rms_values) / len(rms_values)
    variance = sum((val - mean) ** 2 for val in rms_values) / len(rms_values)
    std = math.sqrt(variance)
    threshold = max(0.005, mean + 0.15 * std)
    
    is_speech = [val > threshold for val in rms_values]
    regions = []
    in_speech = False
    start = 0.0
    
    for i in range(len(is_speech)):
        if is_speech[i] and not in_speech:
            start = times[i]
            in_speech = True
        elif not is_speech[i] and in_speech:
            if times[i] - start > 0.1:
                regions.append((start, times[i]))
            in_speech = False
            
    if in_speech:
        regions.append((start, times[-1]))
        
    # Merge regions with small gaps (< 250ms)
    merged = []
    if regions:
        merged.append(regions[0])
        for r in regions[1:]:
            gap = r[0] - merged[-1][1]
            if gap < 0.25:
                merged[-1] = (merged[-1][0], r[1])
            else:
                merged.append(r)
                
    return merged, duration

def transcribe_regions(filepath, regions):
    recognizer = sr.Recognizer()
    results = []
    
    for idx, (start, end) in enumerate(regions):
        with sr.AudioFile(filepath) as source:
            audio_data = recognizer.record(source, offset=start, duration=(end - start))
            
        try:
            text = recognizer.recognize_google(audio_data, language="es-AR")
            print(f"Segment {idx} [{start:.2f}s - {end:.2f}s] (frames {int(start*30)} - {int(end*30)}): {text}")
            results.append((start, end, text))
        except sr.UnknownValueError:
            print(f"Segment {idx} [{start:.2f}s - {end:.2f}s] (frames {int(start*30)} - {int(end*30)}): (Unintelligible)")
        except sr.RequestError as e:
            print(f"Google API Error: {e}")
            
    return results

if __name__ == '__main__':
    WAV_PATH = 'public/beats_vo.wav'
    print(f"Analyzing {WAV_PATH}...")
    regions, duration = read_wav_energy(WAV_PATH)
    print(f"Total duration: {duration:.2f}s")
    print(f"Detected {len(regions)} non-silent regions. Transcribing...")
    transcribe_regions(WAV_PATH, regions)
