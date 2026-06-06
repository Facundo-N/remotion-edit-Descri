import soundfile as sf
import numpy as np

data, sr = sf.read("temp.wav")

gaps = [
    ("Mayo / Tu evento (Scene 1.1 / 1.2)", 1.5, 2.2),
    ("Café / En cada (Scene 1.2 / 2)", 3.4, 4.7),
    ("Patria / En cada (Scene 2 / 3.1)", 5.6, 6.4),
    ("Equipo / En cada (Scene 3.1 / 3.2)", 7.1, 7.8),
    ("Recordar / Aroma (Scene 3.2 / 4.1)", 9.9, 10.6),
    ("Presente / Llevamos (Scene 4.1 / 4.2)", 12.2, 13.2),
    ("Completo / Para que (Scene 4.2 / 5)", 14.1, 14.8),
    ("Gente / Quedan (Scene 5 / 6)", 18.0, 19.2)
]

for label, start_t, end_t in gaps:
    print(f"\n=========================================\n{label}\n=========================================")
    start_idx = int(start_t * sr)
    end_idx = int(end_t * sr)
    sub_data = data[start_idx:end_idx]
    
    # 5ms step
    step = int(0.005 * sr)
    for i in range(0, len(sub_data) - step, step):
        t = start_t + (i / sr)
        w = sub_data[i:i+step]
        rms = np.sqrt(np.mean(w**2))
        bar = "#" * int(rms * 150)
        # Only print if RMS is close to transition or low
        print(f"{t:.3f}s: {rms:.4f} {bar}")
