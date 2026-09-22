from pathlib import Path
from PIL import Image


WORKSPACE = Path(r"D:\Prototype CAS\EDIT MASTER MASAL")
OUT = WORKSPACE / "generated" / "support-assets"
OUT.mkdir(parents=True, exist_ok=True)


def save_webp(source: str, name: str, width: int, quality: int) -> tuple[int, tuple[int, int]]:
    image = Image.open(source).convert("RGBA")
    height = round(image.height * width / image.width)
    image = image.resize((width, height), Image.Resampling.LANCZOS)
    target = OUT / name
    image.save(target, "WEBP", quality=quality, method=6)
    return target.stat().st_size, image.size


sources = {
    "levels": r"C:\Users\KOKO98\Downloads\Picture1.png",
    "poster": r"C:\Users\KOKO98\AppData\Local\Temp\codex-clipboard-f180bd78-39e3-442a-9b52-a966ebb02e6d.png",
}

for label, widths in {
    "levels": [960, 840, 720, 640],
    "poster": [720, 640, 560, 500],
}.items():
    for width in widths:
        for quality in [70, 60, 50, 40, 32, 25]:
            size, dimensions = save_webp(
                sources[label], f"{label}-{width}-q{quality}.webp", width, quality
            )
            print(label, width, quality, dimensions, size)
