import wave
import speech_recognition as sr
import os

candidates = [
    (12.8, 15.2, "Part A: Llevamos nuestro servicio completo"),
    (15.2, 18.5, "Part B: para que vos solo te preocupes...")
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
            
            fn = f"temp_cand_split_{i}.wav"
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
