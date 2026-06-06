import subprocess
import os
import json

audio_mapping = [
    ("En cada celebracion patria 01.mp4", "public/audio_scene_2.mp3"),
    ("En cada reunion de equipo.mp4", "public/audio_scene_3_1.mp3"),
    ("En cada momento que valga la pena recordar.mp4", "public/audio_scene_3_2.mp3"),
    ("Aroma a cafe esta presente.mp4", "public/audio_scene_4_1.mp3"),
    ("llevamos nuestro servicio completo.mp4", "public/audio_scene_4_2.mp3"),
    ("PARA QUE VOS SOLO TE PREOCUPES DISFRUTAR CON TU GE.mp4", "public/audio_scene_5.mp3"),
    ("quedan pocos cupos para el 25 reserva ahora.mp4", "public/audio_scene_6.mp3")
]

src_dir = "f:\\audios"

for src_name, dest_path in audio_mapping:
    src_path = os.path.join(src_dir, src_name)
    
    # Run ffmpeg to convert to mp3 directly without any filters
    cmd = [
        "ffmpeg", "-y",
        "-i", src_path,
        "-c:a", "libmp3lame",
        "-q:a", "2",
        dest_path
    ]
    print(f"Converting: {src_name} -> {dest_path}")
    subprocess.run(cmd, check=True)
    
    # Run ffprobe to get duration
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        dest_path
    ]
    duration_str = subprocess.check_output(probe_cmd).decode('utf-8').strip()
    duration = float(duration_str)
    frames = round(duration * 30)
    print(f"  Duration: {duration:.3f}s ({frames} frames)")
