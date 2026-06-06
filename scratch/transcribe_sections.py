import speech_recognition as sr
import os
import wave

r = sr.Recognizer()
time_ranges = [
    (0.0, 1.85, "Scene 1.1"),
    (1.85, 3.80, "Scene 1.2"),
    (3.80, 4.40, "Silence/Gap"),
    (4.40, 6.00, "Scene 2"),
    (6.00, 7.50, "Scene 3.1"),
    (7.50, 10.30, "Scene 3.2"),
    (10.30, 12.70, "Scene 4.1"),
    (12.70, 14.60, "Scene 4.2"),
    (14.60, 19.00, "Scene 5"),
    (19.00, 23.36, "Scene 6")
]

if not os.path.exists("temp.wav"):
    os.system("ffmpeg -y -i AUD-20260519-WA0115.m4a temp.wav > NUL 2>&1")

for start, end, label in time_ranges:
    # Slice temporary wav using ffmpeg with -ss before -i for relative timing
    os.system(f"ffmpeg -y -ss {start} -to {end} -i temp.wav temp_slice.wav > NUL 2>&1")
    try:
        with sr.AudioFile("temp_slice.wav") as source:
            audio = r.record(source)
        text = r.recognize_google(audio, language="es-AR")
        print(f"{label} ({start:.2f}s - {end:.2f}s): \"{text}\"")
    except Exception as e:
        print(f"{label} ({start:.2f}s - {end:.2f}s): [Failed/Silent]")

try:
    os.remove("temp_slice.wav")
except:
    pass
