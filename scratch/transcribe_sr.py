import speech_recognition as sr

def transcribe():
    r = sr.Recognizer()
    with sr.AudioFile("temp.wav") as source:
        audio = r.record(source)
    try:
        text = r.recognize_google(audio, language="es-AR")
        print("Transcript:", text)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    transcribe()
