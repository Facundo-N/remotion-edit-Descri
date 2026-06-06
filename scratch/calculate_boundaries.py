import soundfile as sf
import numpy as np

data, sr = sf.read("temp.wav")
# Convert to mono if stereo
if len(data.shape) > 1:
    data = data[:, 0]

# We will print the RMS values for each gap to let us see the boundaries.
def analyze_gap(start_t, end_t, label):
    start_idx = int(start_t * sr)
    end_idx = int(end_t * sr)
    sub = data[start_idx:end_idx]
    
    # 5ms steps
    step = int(0.005 * sr)
    rms_list = []
    for i in range(0, len(sub) - step, step):
        t = start_t + (i / sr)
        w = sub[i:i+step]
        rms = np.sqrt(np.mean(w**2))
        rms_list.append((t, rms))
        
    # Let's find the exact point where speech ends and starts.
    # Speech threshold: 0.01
    # We scan from start_t to end_t.
    # Let's find the first time t where RMS is < 0.01 and stays < 0.01 for at least 80ms
    # And then the first time after that where RMS is > 0.01 and stays > 0.01.
    speech_ended = None
    speech_started = None
    
    # Scan for end of speech
    for idx, (t, rms) in enumerate(rms_list):
        # Look ahead 80ms (16 steps)
        if t < (end_t - 0.080):
            lookahead = [r for _, r in rms_list[idx:idx+16]]
            if all(r < 0.008 for r in lookahead) and speech_ended is None:
                speech_ended = t
                
    # Scan for start of speech (after speech_ended)
    if speech_ended is not None:
        for idx, (t, rms) in enumerate(rms_list):
            if t > speech_ended:
                # Look ahead 40ms (8 steps)
                if t < (end_t - 0.040):
                    lookahead = [r for _, r in rms_list[idx:idx+8]]
                    if all(r > 0.012 for r in lookahead) and speech_started is None:
                        speech_started = t
                        break
                        
    print(f"{label}:")
    print(f"  Speech ends around: {speech_ended:.3f}s" if speech_ended else "  Speech ends: Not Found")
    print(f"  Speech starts around: {speech_started:.3f}s" if speech_started else "  Speech starts: Not Found")

analyze_gap(1.5, 2.2, "Mayo (End of 1.1) / Tu evento (Start of 1.2)")
analyze_gap(3.4, 4.7, "Café (End of 1.2) / En cada (Start of 2)")
analyze_gap(5.5, 6.4, "Patria (End of 2) / En cada (Start of 3.1)")
analyze_gap(7.1, 7.8, "Equipo (End of 3.1) / En cada (Start of 3.2)")
analyze_gap(9.8, 10.6, "Recordar (End of 3.2) / Aroma (Start of 4.1)")
analyze_gap(12.2, 13.2, "Presente (End of 4.1) / Llevamos (Start of 4.2)")
analyze_gap(14.0, 14.8, "Completo (End of 4.2) / Para que (Start of 5)")
analyze_gap(18.0, 19.2, "Gente (End of 5) / Quedan (Start of 6)")
