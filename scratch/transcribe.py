import json
import urllib.request
import urllib.parse
import ssl
import sys

def transcribe_wav(filename):
    url = "https://www.google.com/speech-api/v1/recognize?client=chromium&lang=es-AR&maxresults=1"
    with open(filename, 'rb') as f:
        audio_data = f.read()
    
    headers = {
        'Content-Type': 'audio/l16; rate=16000'
    }
    
    context = ssl._create_unverified_context()
    req = urllib.request.Request(url, data=audio_data, headers=headers)
    try:
        with urllib.request.urlopen(req, context=context) as response:
            res_data = response.read().decode('utf-8')
            print(res_data)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    transcribe_wav("temp.wav")
