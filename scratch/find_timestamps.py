import wave
import speech_recognition as sr
import os

# We will test candidate slices to find where each phrase starts and ends
candidates = [
    # (start, end, label)
    (0.2, 2.2, "Phrase 1: Este 25 de mayo"),
    (2.2, 4.4, "Phrase 2: tu evento merece el mejor cafe"),
    (4.4, 6.2, "Phrase 3: En cada celebracion patria"),
    (6.2, 7.8, "Phrase 4: en cada reunion de equipo"),
    (7.8, 10.3, "Phrase 5: en cada momento que vale la pena recordar"),
    (10.3, 12.6, "Phrase 6: Aroma a Cafe esta presente"),
    (12.6, 18.5, "Phrase 7: Llevamos nuestro servicio completo..."),
    (18.5, 23.2, "Phrase 8: Quedan pocos cupos...")
]

def check_slices():
    r = sr.Recognizer()
    with wave.open("temp.wav", "rb") as infile:
        nchannels, sampwidth, framerate, nframes, comptype, compname = infile.getparams()
        
        for i, (start, end, label) in enumerate(candidates):
            start_frame = int(start * framerate)
            end_frame = int(end * framerate)
            n_frames = end_frame - start_frame
            
            infile.setpos(start_frame)
            data = infile.readframes(n_frames)
            
            fn = f"temp_cand_{i}.wav"
            with wave.open(fn, "wb") as outfile:
                outfile.setparams((nchannels, sampwidth, framerate, n_frames, comptype, compname))
                outfile.writeframes(data)
                
            with sr.AudioFile(fn) as source:
                audio = r.record(source)
            try:
                text = r.recognize_google(audio, language="es-AR")
                print(f"{label} ({start}s - {end}s): {text}")
            except Exception as e:
                print(f"{label} ({start}s - {end}s): [Failed] {e}")
                
            try:
                os.remove(fn)
            except:
                pass

if __name__ == "__main__":
    check_slices()
