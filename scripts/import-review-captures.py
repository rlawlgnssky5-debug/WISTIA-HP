"""Lossless format conversion only; preserve provided pixels and redactions."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
source_root = Path('C:/Users/User/AppData/Local/Temp')
sources = [
    'codex-clipboard-03c76827-721f-43d9-bd96-15d9265779ed.png',
    'codex-clipboard-c5bd79f1-a121-4129-98bf-721624d17572.png',
    'codex-clipboard-90083078-0333-4838-bd67-3cdf40f1c653.png',
    'codex-clipboard-d4b78a7e-8050-4a26-bb92-ecfd2e313d45.png',
    'codex-clipboard-32ec25bd-817a-4a27-ae56-b7073f589f05.png',
]
for number, source in enumerate(sources, 12):
    image = Image.open(source_root / source)
    target = root / f'assets/img/reviews/review-{number:02d}.webp'
    image.save(target, 'WEBP', lossless=True, method=6)
    decoded = Image.open(target)
    assert image.convert('RGBA').tobytes() == decoded.convert('RGBA').tobytes()
    print(target.name, image.size, target.stat().st_size, 'pixel-identical')
