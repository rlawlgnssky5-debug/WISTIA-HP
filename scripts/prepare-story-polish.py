"""Format/size optimization for generated website art; no content editing."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
output = root / 'assets/img/story-polish'
output.mkdir(parents=True, exist_ok=True)
generated = Path('C:/Users/User/.codex/generated_images/01a07ed4-903d-7e31-a6e7-30b0140927d4')
for source, name, width in [
    ('exec-cb549fc7-dfbd-4085-a175-a68bc1f0e05b.png', 'film-expert-v1.webp', 1600),
    ('exec-7327fa93-d4e4-46b3-a165-ffa2aa700883.png', 'filming-v1.webp', 1280),
]:
    image = Image.open(generated / source).convert('RGB')
    image.thumbnail((width, width), Image.Resampling.LANCZOS)
    image.save(output / name, 'WEBP', quality=92, method=6)
    print(name, image.size, (output / name).stat().st_size)
