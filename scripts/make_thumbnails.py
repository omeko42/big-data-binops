from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    output_dir = Path(sys.argv[1])
    output_dir.mkdir(parents=True, exist_ok=True)
    for source_name in sys.argv[2:]:
        source = Path(source_name)
        with Image.open(source) as image:
            image.thumbnail((1280, 720), Image.Resampling.LANCZOS)
            target = output_dir / f"{source.stem}.jpg"
            image.convert("RGB").save(target, quality=82, optimize=True)


if __name__ == "__main__":
    main()
