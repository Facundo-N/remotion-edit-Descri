import wave
import numpy as np

# Load wav
with wave.open('scratch/dracula_mono.wav', 'rb') as w:
    params = w.getparams()
    nchannels, sampwidth, framerate, nframes = params[:4]
    data = w.readframes(nframes)
    sig = np.frombuffer(data, dtype=np.int16)

# Normalize signal
sig = sig.astype(np.float32) / 32768.0

# Calculate short-time energy (RMS) in windows of 20ms
win_size = int(0.02 * framerate) # 320 samples
hop_size = int(0.01 * framerate) # 160 samples (10ms steps)

energies = []
times = []
for i in range(0, len(sig) - win_size, hop_size):
    window = sig[i:i+win_size]
    rms = np.sqrt(np.mean(window**2))
    energies.append(rms)
    times.append(i / framerate)

energies = np.array(energies)
times = np.array(times)

# Calculate energy derivative / novelty curve
novelty = np.diff(energies)
novelty = np.clip(novelty, 0, None) # Keep only positive increases

# Find peaks in novelty curve
peaks = []
threshold = np.mean(novelty) + 1.2 * np.std(novelty)
min_peak_distance = int(0.42 * (framerate / hop_size)) # at least 420ms between beats

last_peak_idx = -min_peak_distance
for idx in range(len(novelty)):
    val = novelty[idx]
    if val > threshold:
        # Check if local maximum
        is_max = True
        start_check = max(0, idx - 5)
        end_check = min(len(novelty), idx + 6)
        for check_idx in range(start_check, end_check):
            if novelty[check_idx] > val:
                is_max = False
                break
        if is_max and (idx - last_peak_idx) >= min_peak_distance:
            peaks.append(idx)
            last_peak_idx = idx

print("Detected beats (in seconds from 9s mark):")
for p in peaks:
    sec = times[p]
    frame = int(sec * 30)
    print(f"Time: {sec:.3f}s | VideoFrame: {frame}")
