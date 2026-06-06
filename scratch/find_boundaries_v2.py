import soundfile as sf
import numpy as np

# Load audio
data, sr = sf.read("temp.wav")
duration = len(data) / sr

# Find the exact start and end of speech for each segment.
# Let's inspect the transition regions:
# 1. Between "tu evento merece el mejor café" and "En cada celebración Patria"
# 2. Between "En cada celebración Patria" and "En cada reunión de equipo"
# 3. Between "En cada reunión de equipo" and "en cada momento..."
# 4. Between "en cada momento..." and "Aroma a Café está presente"
# 5. Between "Aroma a Café está presente" and "Llevamos nuestro servicio completo"
# 6. Between "Llevamos nuestro servicio completo" and "para que vos..."
# 7. Between "para que vos..." and "Quedan pocos cupos..."

# Let's define the search windows for these transitions:
transitions = [
    ("End of Scene 1.2 / Start of Scene 2", 3.4, 4.8),
    ("End of Scene 2 / Start of Scene 3.1", 5.6, 6.4),
    ("End of Scene 3.1 / Start of Scene 3.2", 7.2, 7.8),
    ("End of Scene 3.2 / Start of Scene 4.1", 10.0, 10.6),
    ("End of Scene 4.1 / Start of Scene 4.2", 12.3, 13.0),
    ("End of Scene 4.2 / Start of Scene 5", 14.2, 14.9),
    ("End of Scene 5 / Start of Scene 6", 18.0, 19.3)
]

for label, start_t, end_t in transitions:
    print(f"\n--- {label} ({start_t}s - {end_t}s) ---")
    start_idx = int(start_t * sr)
    end_idx = int(end_t * sr)
    sub_data = data[start_idx:end_idx]
    
    # Analyze in 10ms steps
    step = int(0.010 * sr)
    for i in range(0, len(sub_data) - step, step):
        t = start_t + (i / sr)
        w = sub_data[i:i+step]
        rms = np.sqrt(np.mean(w**2))
        bar = "#" * int(rms * 100)
        print(f"{t:.3f}s: {rms:.4f} {bar}")
