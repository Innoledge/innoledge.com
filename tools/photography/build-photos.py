#!/usr/bin/env python3
"""Build responsive web derivatives for the innoledge.com photography slots.

The site references each photo by a stable base name (see PHOTOGRAPHY.md); this
script turns one high-resolution source file into the WebP + JPEG derivatives
those references expect, so swapping a photo never means editing HTML.

    pip install Pillow
    python3 tools/photography/build-photos.py hero-asia ~/Downloads/victoria-harbour.jpg
    python3 tools/photography/build-photos.py --all sources/

Run with --list to see every slot the site expects.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover - dependency hint
    sys.exit("Pillow is required:  pip install Pillow")

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "wp-content" / "uploads" / "2026" / "09" / "photography"

# slot -> (aspect ratio w/h, widths to emit, JPEG quality, WebP quality)
# Widths are chosen from the CSS `sizes` attributes so the browser never has to
# upscale: the hero fills ~46vw on desktop and 100vw on phones.
SLOTS: dict[str, dict] = {
    "hero-asia":      {"aspect": 4 / 3,  "widths": (1800, 1200, 800), "jpeg": 82, "webp": 78},
    "company-team":   {"aspect": 3 / 2,  "widths": (1400, 900, 600),  "jpeg": 82, "webp": 78},
    "sector-health":  {"aspect": 3 / 2,  "widths": (1200, 800, 500),  "jpeg": 80, "webp": 76},
    "sector-cosmetics": {"aspect": 3 / 2, "widths": (1200, 800, 500), "jpeg": 80, "webp": 76},
    "sector-agrofood":  {"aspect": 3 / 2, "widths": (1200, 800, 500), "jpeg": 80, "webp": 76},
}

MAX_KB = 250  # budget per derivative, from the handoff brief


def build(slot: str, source: Path, *, dry_run: bool = False) -> list[Path]:
    spec = SLOTS[slot]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as raw:
        # Honour EXIF orientation, drop alpha, and work in sRGB.
        img = ImageOps.exif_transpose(raw)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        elif img.mode == "L":
            img = img.convert("RGB")

        widest = max(spec["widths"])
        if img.width < widest:
            print(
                f"  ! {source.name} is only {img.width}px wide; {slot} wants "
                f"{widest}px. Derivatives will be upscaled and look soft.",
                file=sys.stderr,
            )

        # Centre-crop to the slot's aspect ratio, then downscale once per width.
        target = ImageOps.fit(
            img,
            (widest, round(widest / spec["aspect"])),
            method=Image.LANCZOS,
            centering=(0.5, 0.4),  # favour the upper half: skylines and faces
        )

        written: list[Path] = []
        for width in spec["widths"]:
            height = round(width / spec["aspect"])
            frame = target.resize((width, height), Image.LANCZOS)
            for ext, params in (
                ("jpg", {"quality": spec["jpeg"], "optimize": True, "progressive": True}),
                ("webp", {"quality": spec["webp"], "method": 6}),
            ):
                dest = OUT_DIR / f"{slot}-{width}.{ext}"
                if dry_run:
                    print(f"  would write {dest.relative_to(REPO_ROOT)}")
                    continue
                frame.save(dest, **params)
                kb = dest.stat().st_size / 1024
                flag = "  <-- over budget" if kb > MAX_KB else ""
                print(f"  {dest.relative_to(REPO_ROOT)}  {width}x{height}  {kb:.0f} KB{flag}")
                written.append(dest)
        return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slot", nargs="?", help="slot name, e.g. hero-asia")
    parser.add_argument("source", nargs="?", type=Path, help="high-resolution source image")
    parser.add_argument("--all", type=Path, metavar="DIR",
                        help="build every slot from DIR/<slot>.<ext>")
    parser.add_argument("--list", action="store_true", help="list the slots the site expects")
    parser.add_argument("--dry-run", action="store_true", help="report without writing files")
    args = parser.parse_args()

    if args.list:
        print(f"{'slot':<20} {'aspect':<8} widths")
        for slot, spec in SLOTS.items():
            ratio = "4:3" if abs(spec["aspect"] - 4 / 3) < 1e-6 else "3:2"
            print(f"{slot:<20} {ratio:<8} {', '.join(str(w) for w in spec['widths'])}")
        return 0

    if args.all:
        missing = []
        for slot in SLOTS:
            found = next((p for ext in ("jpg", "jpeg", "png", "webp", "tif", "tiff")
                          for p in args.all.glob(f"{slot}.{ext}")), None)
            if not found:
                missing.append(slot)
                continue
            print(f"{slot}  <-  {found}")
            build(slot, found, dry_run=args.dry_run)
        if missing:
            print(f"\nNo source found for: {', '.join(missing)}", file=sys.stderr)
        return 0

    if not args.slot or not args.source:
        parser.error("give a slot and a source image, or use --all / --list")
    if args.slot not in SLOTS:
        parser.error(f"unknown slot {args.slot!r}; --list shows the valid ones")
    if not args.source.is_file():
        parser.error(f"no such file: {args.source}")

    print(f"{args.slot}  <-  {args.source}")
    build(args.slot, args.source, dry_run=args.dry_run)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
