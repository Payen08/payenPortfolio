#!/usr/bin/env python3
"""Create sharp WebP copies without overwriting portfolio originals.

Default strategy:
- PNG/UI artwork -> lossless WebP (pixel-perfect text and lines)
- JPEG/photos    -> high-quality lossy WebP
- GIF            -> skipped unless --include-gif is supplied; converted losslessly by default
- dimensions     -> never changed unless --max-width is supplied

Examples:
  python3 convert_webp.py public/work
  python3 convert_webp.py public/work --include-gif
  python3 convert_webp.py public/portfolio --photo-quality 94
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps, ImageSequence


STATIC_EXTENSIONS = {".png", ".jpg", ".jpeg"}
ANIMATED_EXTENSIONS = {".gif"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert portfolio images to sharp WebP copies in a separate folder."
    )
    parser.add_argument("source", type=Path, help="Image file or folder to convert")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output folder (default: <source-name>-webp beside the source)",
    )
    parser.add_argument(
        "--photo-quality",
        type=int,
        default=94,
        choices=range(80, 101),
        metavar="80-100",
        help="Quality for JPEG/photos and animated GIFs (default: 94)",
    )
    parser.add_argument(
        "--lossy-png",
        action="store_true",
        help="Use high-quality lossy compression for PNG instead of pixel-perfect lossless mode",
    )
    parser.add_argument(
        "--max-width",
        type=int,
        default=None,
        help="Optionally shrink images wider than this value; omitted by default to preserve resolution",
    )
    parser.add_argument(
        "--include-gif",
        action="store_true",
        help="Convert animated GIFs to animated WebP",
    )
    parser.add_argument(
        "--lossy-animation",
        action="store_true",
        help="Use photo-quality lossy compression for animation instead of lossless frames",
    )
    parser.add_argument("--overwrite", action="store_true", help="Replace existing WebP outputs")
    return parser.parse_args()


def iter_sources(source: Path, include_gif: bool) -> Iterable[Path]:
    extensions = STATIC_EXTENSIONS | (ANIMATED_EXTENSIONS if include_gif else set())
    if source.is_file():
        if source.suffix.lower() not in extensions:
            raise ValueError(f"Unsupported input: {source}")
        yield source
        return

    for path in sorted(source.rglob("*")):
        if path.is_file() and path.suffix.lower() in extensions:
            yield path


def resized(frame: Image.Image, max_width: int | None) -> Image.Image:
    frame = ImageOps.exif_transpose(frame)
    if not max_width or frame.width <= max_width:
        return frame.copy()
    height = round(frame.height * max_width / frame.width)
    return frame.resize((max_width, height), Image.Resampling.LANCZOS)


def webp_frame(frame: Image.Image) -> Image.Image:
    if frame.mode in {"RGB", "RGBA"}:
        return frame
    return frame.convert("RGBA" if "transparency" in frame.info else "RGB")


def convert_static(
    source: Path,
    destination: Path,
    photo_quality: int,
    lossy_png: bool,
    max_width: int | None,
) -> None:
    with Image.open(source) as image:
        frame = webp_frame(resized(image, max_width))
        is_png = source.suffix.lower() == ".png"
        lossless = is_png and not lossy_png
        save_options = {
            "format": "WEBP",
            "method": 6,
            "lossless": lossless,
            "quality": 100 if lossless else photo_quality,
            "exact": True,
        }
        if image.info.get("icc_profile"):
            save_options["icc_profile"] = image.info["icc_profile"]
        frame.save(destination, **save_options)


def convert_animation(
    source: Path,
    destination: Path,
    photo_quality: int,
    max_width: int | None,
    lossy_animation: bool,
) -> None:
    with Image.open(source) as image:
        frames = [webp_frame(resized(frame, max_width)) for frame in ImageSequence.Iterator(image)]
        durations = [frame.info.get("duration", image.info.get("duration", 100)) for frame in ImageSequence.Iterator(image)]
        frames[0].save(
            destination,
            format="WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=image.info.get("loop", 0),
            lossless=not lossy_animation,
            quality=photo_quality if lossy_animation else 100,
            # Method 4 keeps batch conversion practical for long animations;
            # static UI artwork still uses the maximum-effort method 6 above.
            method=4,
            exact=True,
        )


def main() -> None:
    args = parse_args()
    source = args.source.resolve()
    if not source.exists():
        raise SystemExit(f"Source does not exist: {source}")

    output_root = args.output.resolve() if args.output else source.with_name(f"{source.name}-webp")
    output_root.mkdir(parents=True, exist_ok=True)
    files = list(iter_sources(source, args.include_gif))

    if not files:
        raise SystemExit("No supported images found.")

    converted = 0
    original_bytes = 0
    output_bytes = 0

    for input_path in files:
        relative = Path(input_path.name) if source.is_file() else input_path.relative_to(source)
        destination = (output_root / relative).with_suffix(".webp")
        destination.parent.mkdir(parents=True, exist_ok=True)

        if destination.exists() and not args.overwrite:
            print(f"skip    {relative} (output exists)")
            continue

        if input_path.suffix.lower() == ".gif":
            convert_animation(input_path, destination, args.photo_quality, args.max_width, args.lossy_animation)
            mode = "animated q" + str(args.photo_quality) if args.lossy_animation else "animated lossless"
        else:
            convert_static(input_path, destination, args.photo_quality, args.lossy_png, args.max_width)
            mode = "lossless" if input_path.suffix.lower() == ".png" and not args.lossy_png else f"q{args.photo_quality}"

        before = input_path.stat().st_size
        after = destination.stat().st_size
        original_bytes += before
        output_bytes += after
        converted += 1
        print(f"convert {relative} -> {destination.relative_to(output_root)} [{mode}] {before / 1024:.0f} KB -> {after / 1024:.0f} KB")

    if converted:
        change = abs(1 - output_bytes / original_bytes) * 100
        comparison = "smaller" if output_bytes <= original_bytes else "larger"
        print(f"\nDone: {converted} files, {original_bytes / 1024 / 1024:.1f} MB -> {output_bytes / 1024 / 1024:.1f} MB ({change:.1f}% {comparison})")
        print(f"Output: {output_root}")


if __name__ == "__main__":
    main()
