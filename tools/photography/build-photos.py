#!/usr/bin/env python3
"""Build responsive web derivatives for the innoledge.com photography slots.

The site references each photo by a stable base name (see PHOTOGRAPHY.md); this
script turns one high-resolution source file into the WebP + JPEG derivatives
those references expect, so swapping a photo never means editing HTML.

    pip install Pillow
    python3 tools/photography/build-photos.py hero-asia ~/Downloads/victoria-harbour.jpg
    python3 tools/photography/build-photos.py --all sources/

Building a slot also activates it: the pages carry the slot's <picture> markup
inside a `<!--PHOTO:slot ... PHOTO-->` comment, which is uncommented once the
files it points at exist. --deactivate puts it back.

Run with --list to see every slot the site expects.
"""
from __future__ import annotations

import argparse
import re
from fractions import Fraction
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
    # Portrait: the hero displays the photo as a tall anchor beside the copy, and
    # Hong Kong's skyline reads well vertically. A landscape source is fine — it
    # gets centre-cropped — but a portrait or square one keeps more of the frame.
    "hero-asia":      {"aspect": 3 / 4,  "widths": (1400, 1000, 700), "jpeg": 82, "webp": 78},
    "company-team":   {"aspect": 3 / 2,  "widths": (1400, 900, 600),  "jpeg": 82, "webp": 78},
    "sector-health":  {"aspect": 3 / 2,  "widths": (1200, 800, 500),  "jpeg": 80, "webp": 76},
    "sector-cosmetics": {"aspect": 3 / 2, "widths": (1200, 800, 500), "jpeg": 80, "webp": 76},
    "sector-agrofood":  {"aspect": 3 / 2, "widths": (1200, 800, 500), "jpeg": 80, "webp": 76},
}

MAX_KB = 250  # budget per derivative, from the handoff brief


# --- activating a slot in the HTML ------------------------------------------
# A slot ships inert: its <picture> markup sits inside a comment so the pages
# never reference a file that does not exist yet. Building the derivatives
# uncomments it, which is why the markup is a plain sibling in the hero grid —
# the CSS uses :has() to spot it, so nothing has to be restructured here.

INERT_RE = re.compile(
    r"[ \t]*<!--PHOTO:(?P<slot>[a-z0-9-]+)\b.*?\n"
    r"(?P<markup>[ \t]*<figure.*?</figure>)\n"
    r"[ \t]*PHOTO-->[ \t]*\n",
    re.DOTALL,
)
ACTIVE_RE = re.compile(
    r"[ \t]*<!--PHOTO-ON:(?P<slot>[a-z0-9-]+)-->[ \t]*\n"
    r"(?P<markup>[ \t]*<figure.*?</figure>)\n"
    r"[ \t]*<!--PHOTO-OFF:(?P=slot)-->[ \t]*\n",
    re.DOTALL,
)

INERT_NOTE = (
    "  <!--PHOTO:{slot}  Inert until the derivatives exist. Build them with\n"
    "      python3 tools/photography/build-photos.py {slot} <source.jpg>\n"
    "      which also uncomments this block. See PHOTOGRAPHY.md.\n"
)

# Social preview images point at the logo until a hero photograph exists.
OG_LOGO = "https://innoledge.com/wp-content/uploads/2022/07/innoledge-logo.png"
OG_HERO = "https://innoledge.com/wp-content/uploads/2026/09/photography/hero-asia-1000.jpg"


def _html_files() -> list[Path]:
    """Every page that could carry a photo marker, newest layout files only."""
    return [p for p in sorted(REPO_ROOT.rglob("*.html"))
            if "@p=" not in p.name and "node_modules" not in p.parts]


def set_active(slot: str, active: bool) -> list[Path]:
    """Uncomment (or re-comment) `slot`'s markup wherever it appears."""
    pattern = INERT_RE if active else ACTIVE_RE
    touched: list[Path] = []

    for path in _html_files():
        text = path.read_text(encoding="utf-8")
        if f"PHOTO:{slot}" not in text and f"PHOTO-ON:{slot}" not in text:
            continue

        def swap(m: "re.Match[str]") -> str:
            if m.group("slot") != slot:
                return m.group(0)
            markup = m.group("markup")
            if active:
                return f"  <!--PHOTO-ON:{slot}-->\n{markup}\n  <!--PHOTO-OFF:{slot}-->\n"
            return INERT_NOTE.format(slot=slot) + markup + "\n  PHOTO-->\n"

        updated = pattern.sub(swap, text)

        # The hero doubles as the social preview image.
        if slot == "hero-asia":
            frm, to = (OG_LOGO, OG_HERO) if active else (OG_HERO, OG_LOGO)
            if "inno-hero" in updated:
                updated = updated.replace(frm, to)

        if updated != text:
            path.write_text(updated, encoding="utf-8")
            touched.append(path)

    return touched


def report_activation(slot: str, touched: list[Path]) -> None:
    """Say what happened, and be explicit when a slot has no markup wired yet."""
    for path in touched:
        print(f"  activated in {path.relative_to(REPO_ROOT)}")
    if not touched:
        print(f"  ! the derivatives are built, but no page carries a "
              f"`<!--PHOTO:{slot}` block yet, so nothing references them.\n"
              f"    Only hero-asia is wired so far; see PHOTOGRAPHY.md.", file=sys.stderr)


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
    parser.add_argument("--deactivate", metavar="SLOT",
                        help="put SLOT's markup back inside its comment and stop referencing it")
    args = parser.parse_args()

    if args.deactivate:
        if args.deactivate not in SLOTS:
            parser.error(f"unknown slot {args.deactivate!r}; --list shows the valid ones")
        touched = set_active(args.deactivate, False)
        for path in touched:
            print(f"  deactivated in {path.relative_to(REPO_ROOT)}")
        if not touched:
            print(f"  {args.deactivate} was not active in any page")
        return 0

    if args.list:
        print(f"{'slot':<20} {'aspect':<10} widths")
        for slot, spec in SLOTS.items():
            ratio = Fraction(spec["aspect"]).limit_denominator(20)
            label = f"{ratio.numerator}:{ratio.denominator}"
            orient = "portrait" if spec["aspect"] < 1 else "landscape"
            print(f"{slot:<20} {label + ' ' + orient:<10} {', '.join(str(w) for w in spec['widths'])}")
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
            if not args.dry_run:
                report_activation(slot, set_active(slot, True))
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
    if not args.dry_run:
        report_activation(args.slot, set_active(args.slot, True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
