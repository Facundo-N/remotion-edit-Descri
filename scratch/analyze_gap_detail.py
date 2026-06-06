import soundfile as sf
import numpy as np

data, sr = sf.read("temp.wav")
if len(data.shape) > 1:
    data = data[:, 0]

def print_detail(start_t, end_t, label):
    print(f"\n=== {label} ({start_t} - {end_t}) ===")
    start_idx = int(start_t * sr)
    end_idx = int(end_t * sr)
    sub = data[start_idx:end_idx]
    step = int(0.010 * sr)
    for i in range(0, len(sub) - step, step):
        t = start_t + (i / sr)
        w = sub[i:i+step]
        rms = np.sqrt(np.mean(w**2))
        bar = "#" * int(rms * 200)
        print(f"{t:.3f}s: {rms:.4f} {bar}")

print_detail(1.3, 1.8, "Mayo / Tu evento")
print_detail(5.4, 6.4, "Patria / En cada")
print_detail(14.0, 15.0, "Completo / Para que")
