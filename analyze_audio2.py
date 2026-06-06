import speech_recognition as sr

def refine_phrase(filename):
    recognizer = sr.Recognizer()
    
    # We will step through the 5s to 9s window in 0.5s chunks with 0.4s overlap (i.e. step by 0.1s)
    chunk_size = 1.0
    
    # Let's search from 5.0 to 8.0 in steps of 0.1s
    for start in range(50, 80):
        start_time = start / 10.0
        try:
            with sr.AudioFile(filename) as source:
                audio_chunk = recognizer.record(source, offset=start_time, duration=chunk_size)
            text = recognizer.recognize_google(audio_chunk, language="es-AR")
            print(f"[{start_time:.1f}s - {start_time+chunk_size:.1f}s]: {text}")
        except sr.UnknownValueError:
            pass
        except sr.RequestError as e:
            pass

refine_phrase('temp.wav')
