import wave
import speech_recognition as sr
import os

def check_segment():
    r = sr.Recognizer()
    with wave.open("temp.wav", "rb") as infile:
        nchannels, sampwidth, framerate, nframes, comptype, compname = infile.getparams()
        # check 3.4s to 4.7s
        start, end = 3.3, 4.7
        start_frame = int(start * framerate)
        end_frame = int(end * framerate)
        infile.setpos(start_frame)
        data = infile.readframes(end_frame - start_frame)
        
        with wave.open("temp_check.wav", "wb") as outfile:
            outfile.setparams((nchannels, sampwidth, framerate, end_frame - start_frame, comptype, compname))
            outfile.writeframes(data)
            
    with sr.AudioFile("temp_check.wav") as source:
        audio = r.record(source)
    try:
        text = r.recognize_google(audio, language="es-AR")
        print("Transcript 3.3s - 4.7s:", text)
    except Exception as e:
        print("Error:", e)
    
    try:
        os.remove("temp_check.wav")
    except:
        pass

if __name__ == "__main__":
    check_segment()
