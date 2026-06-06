import speech_recognition as sr

r = sr.Recognizer()
with sr.AudioFile("temp.wav") as source:
    audio = r.record(source)
try:
    text = r.recognize_google(audio, language="es-AR")
    print("Full Transcript:")
    print(text)
except Exception as e:
    print("Failed to transcribe:", e)
