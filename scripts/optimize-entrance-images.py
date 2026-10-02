"""Resize generated originals for option thumbnails without changing their content."""
from pathlib import Path
from PIL import Image

folder = Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'song-options'
for role in ('bride', 'groom'):
    source = folder / f'{role}-entrance-v1.png'
    target = folder / f'{role}-entrance-v1.webp'
    with Image.open(source) as image:
        image = image.convert('RGB')
        image.thumbnail((640, 360), Image.Resampling.LANCZOS)
        image.save(target, format='WEBP', quality=84, method=6)
    print(f'{target.name}: {target.stat().st_size} bytes')
