import subprocess

segments = [
    # (start, end, fade_in, fade_out, dest)
    ("4.510", "5.730", 0.05, 0.05, "public/audio_scene_2.mp3"),
    ("5.770", "7.410", 0.05, 0.05, "public/audio_scene_3_1.mp3"),
    ("7.515", "10.175", 0.05, 0.05, "public/audio_scene_3_2.mp3"),
    ("10.440", "12.585", 0.05, 0.05, "public/audio_scene_4_1.mp3"),
    ("13.065", "14.560", 0.05, 0.05, "public/audio_scene_4_2.mp3"),
    ("14.610", "18.450", 0.05, 0.05, "public/audio_scene_5.mp3"),
    ("19.040", "23.110", 0.05, 0.15, "public/audio_scene_6.mp3")
]

for start_str, end_str, fade_in, fade_out, dest in segments:
    start = float(start_str)
    end = float(end_str)
    duration = end - start
    
    # Audio filters using relative timestamps (0-based)
    filters = []
    if fade_in > 0:
        filters.append(f"afade=t=in:st=0:d={fade_in:.2f}")
    if fade_out > 0:
        fade_out_start = duration - fade_out
        filters.append(f"afade=t=out:st={fade_out_start:.2f}:d={fade_out:.2f}")
        
    filter_str = ",".join(filters)
    
    # Placing -ss and -to before -i resets input timestamps to 0, which is extremely robust
    cmd = [
        "ffmpeg", "-y",
        "-ss", start_str,
        "-to", end_str,
        "-i", "AUD-20260519-WA0115.m4a",
    ]
    if filter_str:
        cmd.extend(["-af", filter_str])
        
    cmd.extend([
        "-c:a", "libmp3lame",
        "-q:a", "2",
        dest
    ])
    
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)
print("All audio segments successfully sliced with relative fades!")
