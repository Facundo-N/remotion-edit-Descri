import speech_recognition as sr
import os
import wave
import contextlib

def find_phrase(filename, target_phrase):
    recognizer = sr.Recognizer()
    
    with contextlib.closing(wave.open(filename, 'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
        
    print(f"Total duration: {duration}s")
    
    # We will step through the audio in 3-second chunks with 1.5-second overlap
    chunk_size = 3.0
    overlap = 1.5
    
    with sr.AudioFile(filename) as source:
        # read the entire audio
        audio_data = recognizer.record(source)
    
    start_time = 0.0
    results = []
    
    # speech_recognition can use Google's recognizer.
    # It might be better to split using AudioData.get_segment?
    # Actually, we can use the offset and duration args in record()
    
    for start in range(0, int(duration), int(chunk_size - overlap)):
        try:
            with sr.AudioFile(filename) as source:
                audio_chunk = recognizer.record(source, offset=start, duration=chunk_size)
            text = recognizer.recognize_google(audio_chunk, language="es-AR")
            print(f"[{start}s - {start+chunk_size}s]: {text}")
            if "reunión" in text.lower() or "equipo" in text.lower() or "cada" in text.lower():
                results.append((start, text))
        except sr.UnknownValueError:
            print(f"[{start}s - {start+chunk_size}s]: (Unintelligible)")
        except sr.RequestError as e:
            print("Google Speech Recognition error:", e)

find_phrase('temp.wav', 'en cada reunion de equipo')
