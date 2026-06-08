import numpy
import speech_recognition as sr
from pydub import AudioSegment

sound = AudioSegment.from_mp3('public/beats_vo.mp3')

print('numpy:', numpy.__version__)
print('SpeechRecognition:', sr.__version__)
print('pydub: OK,', len(sound), 'ms de audio cargado')
print()
print('Todas las librerias de audio funcionan correctamente con Python 3.12')
