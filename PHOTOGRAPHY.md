# innoledge.com — photography brief

The 2026 redesign is built around real photography. This file lists the photo
slots the design expects, how to produce the files, and what has to be recorded
about each image before it goes live.

## Why this exists

Every image inherited from the old WordPress site is too small to use in the new
layout — the largest is 768 px and most are 250–432 px:

| File | Pixels | Where it was used |
| --- | --- | --- |
| `2022/07/*-edited-768x76*.jpg` (6 service tiles) | 768 × 768 | service cards |
| `2022/08/animal_health.jpg` | 432 × 279 | Agro-Food sector card |
| `2022/08/healthcare.jpg` | 310 × 350 | Health sector card |
| `2022/09/innoledge-family.jpg` | 280 × 184 | company block |
| `2022/08/cosmetics.jpg` | 250 × 166 | Cosmetics sector card |

A hero image needs ~1800 px. Anything smaller is upscaled by the browser and
looks soft, which is why the hero currently uses a typographic treatment rather
than a photograph.

## Slots the design expects

`tools/photography/build-photos.py --list` is the authoritative list. Each slot
is referenced by a stable base name, so **replacing a photo never means editing
HTML** — rebuild the derivatives under the same slot name and the pages pick
them up.

| Slot | Aspect | Widths emitted | Subject |
| --- | --- | --- | --- |
| `hero-asia` | 4:3 | 1800 / 1200 / 800 | Homepage hero. Victoria Harbour or a modern Asian business district, ideally at dusk. Needs calm space on one side so the headline can breathe. |
| `company-team` | 3:2 | 1400 / 900 / 600 | Company block. The Innoledge team or the Hong Kong office district. Replaces `innoledge-family.jpg`. |
| `sector-health` | 3:2 | 1200 / 800 / 500 | Health sector card. Pharmacy, laboratory or hospital setting. |
| `sector-cosmetics` | 3:2 | 1200 / 800 / 500 | Cosmetics sector card. Premium skincare, clean flat-lay or product-in-use. |
| `sector-agrofood` | 3:2 | 1200 / 800 / 500 | Agro-Food & Animal Health card. Fresh produce, food ingredients, or a racehorse. |

Source files should be at least as wide as the largest width in the row. The
build script warns when a source is too small rather than silently upscaling.

## Producing the files

```sh
pip install Pillow

# one slot at a time
python3 tools/photography/build-photos.py hero-asia ~/Downloads/victoria-harbour.jpg

# or drop sources named <slot>.jpg into a folder and do the lot
python3 tools/photography/build-photos.py --all ~/Downloads/innoledge-photos/
```

The script centre-crops to the slot's aspect ratio (biased slightly to the upper
half, which suits both skylines and faces), then writes WebP **and** JPEG at each
width into `wp-content/uploads/2026/09/photography/`. It reports the weight of
every file and flags anything over the 250 KB budget. `--dry-run` reports
without writing.

Derivatives are cached for a year by `vercel.json`, so always change the photo by
rebuilding the slot rather than by editing a path.

## Two good sources of photography

1. **Innoledge's own photographs** — preferred. Real photos of the team, the
   Hong Kong / Beijing / Shanghai / Tokyo offices, and the products Innoledge
   distributes are more credible than stock, and carry no licence questions.
   Anything from a recent phone is comfortably large enough.
2. **Free-licence stock** — Unsplash or Pexels both allow commercial use without
   attribution. Search terms that suit the brief: *Victoria Harbour dusk*,
   *Hong Kong skyline*, *Central Hong Kong business district*, *pharmacy
   laboratory*, *skincare flat lay*, *fresh produce market*.

## Record this before go-live

Fill a row in per photo. Stock libraries can change or withdraw a file, so the
source URL matters even when attribution is not required.

| Slot | Source URL | Photographer | Licence | Downloaded |
| --- | --- | --- | --- | --- |
| `hero-asia` | | | | |
| `company-team` | | | | |
| `sector-health` | | | | |
| `sector-cosmetics` | | | | |
| `sector-agrofood` | | | | |

Avoid anything with a recognisable person as the main subject unless there is a
model release, and avoid visible third-party branding or product packaging
Innoledge does not represent.
