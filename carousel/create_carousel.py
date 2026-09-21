from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
FONT = Path(r"C:\Windows\Fonts\malgunbd.ttf")

ITEMS = [
    ("01", "사전녹음 AR 축가", Path(r"C:\Users\User\AppData\Local\Temp\codex-clipboard-a2ac4d6d-3f18-4a0e-8141-dddcf44d98e6.png"), 0.52),
    ("02", "식전 / 축가 영상", ROOT / "assets/img/film-types/music-video-film.webp", 0.50),
    ("03", "프로포즈 / 답프로포즈", ROOT / "assets/img/film-types/recording-making-female.webp", 0.59),
]

W = H = 800
PHOTO_H = 600


def cover(image, size, center_x=0.5):
    image = image.convert("RGB")
    target_ratio = size[0] / size[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        crop_w = round(image.height * target_ratio)
        left = round((image.width - crop_w) * center_x)
        left = max(0, min(left, image.width - crop_w))
        image = image.crop((left, 0, left + crop_w, image.height))
    else:
        crop_h = round(image.width / target_ratio)
        top = max(0, (image.height - crop_h) // 2)
        image = image.crop((0, top, image.width, top + crop_h))
    return image.resize(size, Image.Resampling.LANCZOS)


def silver_text(canvas, title):
    draw = ImageDraw.Draw(canvas)
    size = 63
    while size > 42:
        font = ImageFont.truetype(str(FONT), size)
        box = draw.textbbox((0, 0), title, font=font)
        if box[2] <= 710:
            break
        size -= 1
    box = draw.textbbox((0, 0), title, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    x = (W - tw) // 2
    y = PHOTO_H + (H - PHOTO_H - th) // 2 - box[1]
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).text((x, y), title, font=font, fill=255)
    grad = Image.new("RGB", (W, H))
    gd = ImageDraw.Draw(grad)
    top, bottom = (62, 69, 80), (161, 171, 184)
    for yy in range(PHOTO_H, H):
        t = (yy - PHOTO_H) / (H - PHOTO_H - 1)
        color = tuple(round(top[i] * (1-t) + bottom[i] * t) for i in range(3))
        gd.line((0, yy, W, yy), fill=color)
    canvas.paste(grad, (0, 0), mask)


for number, title, source, center_x in ITEMS:
    photo = cover(Image.open(source), (W, PHOTO_H), center_x)
    photo = ImageEnhance.Brightness(photo).enhance(1.04)
    photo = ImageEnhance.Contrast(photo).enhance(0.98)
    canvas = Image.new("RGB", (W, H), "#F7F8F9")
    canvas.paste(photo, (0, 0))
    ImageDraw.Draw(canvas).rectangle((0, PHOTO_H, W, PHOTO_H + 2), fill="#D3D7DC")
    silver_text(canvas, title)
    output = OUT / f"wistia-carousel-{number}-silver.png"
    canvas.save(output, optimize=True)
    print(f"{output} | {canvas.size} | {output.stat().st_size} bytes")
