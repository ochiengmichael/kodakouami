from PIL import Image, ImageOps
import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'KOUDAKfavicon.png')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'favicons')
SIZES = [16, 32, 48, 180, 192, 512]

os.makedirs(OUT_DIR, exist_ok=True)

if not os.path.exists(SRC):
    print('Source file not found:', SRC)
    raise SystemExit(1)

im = Image.open(SRC).convert('RGBA')
# Keep only the orange logo mark and make the background transparent.
pixels = im.load()
for y in range(im.height):
    for x in range(im.width):
        red, green, blue, alpha = pixels[x, y]
        if red < 150 or green > 140 or blue > 110:
            pixels[x, y] = (red, green, blue, 0)

# Crop transparent margins so the mark remains readable at small sizes.
bounds = im.getbbox()
if bounds:
    im = im.crop(bounds)

# Ensure high-res source by resizing up if needed
max_needed = max(SIZES)
if max(im.size) < max_needed:
    im = im.resize((max_needed, max_needed), Image.LANCZOS)

for size in SIZES:
    resized = ImageOps.fit(im, (size, size), method=Image.Resampling.LANCZOS)
    out = resized
    # Save as favicons/favicon-{size}x{size}.png
    filename = f'favicon-{size}x{size}.png'
    out_path = os.path.join(OUT_DIR, filename)
    out.save(out_path, optimize=True)
    print('Wrote', out_path)

# Additionally write apple-touch-icon (180x180) and specific names
# Copy generated files to conventional names
import shutil
shutil.copyfile(os.path.join(OUT_DIR, 'favicon-180x180.png'), os.path.join(OUT_DIR, 'apple-touch-icon-180x180.png'))
shutil.copyfile(os.path.join(OUT_DIR, 'favicon-192x192.png'), os.path.join(OUT_DIR, 'favicon-192x192.png'))
shutil.copyfile(os.path.join(OUT_DIR, 'favicon-512x512.png'), os.path.join(OUT_DIR, 'favicon-512x512.png'))
print('Copied standard names to', OUT_DIR)
