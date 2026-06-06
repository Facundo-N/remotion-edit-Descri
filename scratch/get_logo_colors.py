import os
from PIL import Image

logo_path = os.path.join("..", "logoAmarillo.png")
if not os.path.exists(logo_path):
    logo_path = "logoAmarillo.png"

if os.path.exists(logo_path):
    print(f"File found at {logo_path}")
    try:
        img = Image.open(logo_path)
        img = img.convert("RGBA")
        print("Image size:", img.size)
        colors = img.getcolors(maxcolors=10000000)
        
        # Sort colors by frequency, ignoring transparent ones
        non_transparent = [c for c in colors if c[1][3] > 0]
        non_transparent.sort(key=lambda x: x[0], reverse=True)
        
        print("\nTop colors:")
        for count, color in non_transparent[:20]:
            r, g, b, a = color
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            print(f"{hex_color} - rgba({r}, {g}, {b}, {a}) - count: {count}")
    except Exception as e:
        print("Error analyzing image:", e)
else:
    print("Logo file not found!")
