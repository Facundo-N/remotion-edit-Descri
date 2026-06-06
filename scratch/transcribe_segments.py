import wave
import speech_recognition as sr
import os

segments = [
    (0.291, 3.651, "Segment 1"),
    (4.513, 10.160, "Segment 2"),
    (10.443, 12.566, "Segment 3"),
    (13.064, 18.440, "Segment 4"),
    (19.016, 23.107, "Segment 5")
]

def slice_and_transcribe():
    r = sr.Recognizer()
    
    # open input wave file
    with wave.open("temp.wav", "rb") as infile:
        nchannels, sampwidth, framerate, nframes, comptype, compname = infile.getparams()
        
        for i, (start, end, label) in enumerate(segments):
            # calculate frame ranges
            start_frame = int(start * framerate)
            end_frame = int(end * framerate)
            n_frames_segment = end_frame - start_frame
            
            infile.setpos(start_frame)
            data = infile.readframes(n_frames_segment)
            
            out_filename = f"segment_{i+1}.wav"
            with wave.open(out_filename, "wb") as outfile:
                outfile.setparams((nchannels, sampwidth, framerate, n_frames_segment, comptype, compname))
                outfile.writeframes(data)
            
            # transcribe segment
            with sr.AudioFile(out_filename) as source:
                audio = r.record(source)
            try:
                text = r.recognize_google(audio, language="es-AR")
                print(f"{label} ({start}s - {end}s): {text}")
            except Exception as e:
                print(f"{label} ({start}s - {end}s): [Error or Silence] {e}")
                
            # clean up
            try:
                os.remove(out_filename)
            except:
                pass

if __name__ == "__main__":
    slice_and_transcribe()
