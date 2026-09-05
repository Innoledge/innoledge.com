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

The hero needs ~1400 px on its short edge. Anything smaller is upscaled by the
browser and looks soft.

The originals, however, were not gone — only removed. The WordPress media library
in the initial commit carried 2553–2560 px versions of the six service photos,
which commit `06f26ab` ("WordPress clean-up and performance pass") deleted. They
are still reachable in the object store, which is where the current hero comes
from:

```sh
# the hero source: wp-content/uploads/2022/07/Business-Consultancy-edited-scaled.jpg
git cat-file -p 529b29ce7a10d669bb4f3636e2577c39a0b494bd > hero-asia.jpg
python3 tools/photography/build-photos.py hero-asia hero-asia.jpg
```

That blob is not committed back — only its derivatives are, so the deploy stays
lean — but the SHA is stable, so the build is reproducible.

The other five originals are the cold blue "floating hologram" stock composites
and sit badly against the warm cream band; `Business-Consultancy` was the only
one with real people and real materials in frame. Their 768 px copies in the tree
are *not* too small for the service cards, which display at roughly 380 × 170, so
those cards are left alone rather than loaded with 2560 px files for no gain.

## Slots the design expects

`tools/photography/build-photos.py --list` is the authoritative list. Each slot
is referenced by a stable base name, so **replacing a photo never means editing
HTML** — rebuild the derivatives under the same slot name and the pages pick
them up.

| Slot | Aspect | Widths emitted | Subject |
| --- | --- | --- | --- |
| `hero-asia` | **3:4 portrait** | 1400 / 1000 / 700 | Homepage hero. **Currently filled** from a 2553 × 2560 original recovered from this repo's history (see below). Shown as a tall panel beside the headline, so a vertical composition keeps the most frame. |
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

Building a slot also **activates** it, where the markup exists. A page carries
the slot's `<picture>` inside a `<!--PHOTO:slot ... PHOTO-->` comment so the site
never points at a file that does not exist; the build uncomments it and, for
`hero-asia`, repoints `og:image` / `twitter:image` from the logo to the hero
photo. `--deactivate <slot>` reverses all of it.

**Only `hero-asia` carries that markup today.** The other four slots build their
derivatives correctly but nothing references them yet, and the script says so
rather than failing quietly. Wiring them is a small markup change per slot, best
made once the chosen photographs exist so the card crops can be judged against
them.

Derivatives are cached for a year by `vercel.json`, so always change the photo by
rebuilding the slot rather than by editing a path.

## Which photo to get

**`PHOTO-SHORTLIST.md` has the searches and the selection criteria, slot by
slot** — start there. In short, two good sources:

1. **Innoledge's own photographs** — preferred. Real photos of the team, the
   Hong Kong / Beijing / Shanghai / Tokyo offices, and the products Innoledge
   distributes are more credible than stock, and carry no licence questions.
   Anything from a recent phone is comfortably large enough.
2. **Free-licence stock** — Unsplash or Pexels both allow commercial use without
   attribution. `PHOTO-SHORTLIST.md` carries orientation-filtered searches for
   each slot along with what to choose and what to avoid.

## Record this before go-live

Fill a row in per photo. Stock libraries can change or withdraw a file, so the
source URL matters even when attribution is not required.

| Slot | Source URL | Photographer | Licence | Downloaded |
| --- | --- | --- | --- | --- |
| `hero-asia` | repo history, blob `529b29ce` (orig. `Business-Consultancy-edited-scaled.jpg`) | unknown — pre-existing site asset | **confirm** — see note | 2026-09-04 |
| `company-team` | | | | |
| `sector-health` | | | | |
| `sector-cosmetics` | | | | |
| `sector-agrofood` | | | | |

Avoid anything with a recognisable person as the main subject unless there is a
model release, and avoid visible third-party branding or product packaging
Innoledge does not represent.

**One thing to confirm about the current hero.** It came with the original
innoledge.com WordPress media library, so Innoledge was already publishing it —
but the underlying stock licence is not recorded anywhere in this repo. Worth
confirming it covers continued use before go-live. No faces are identifiable in
the crop, so there is no model-release question. A Victoria Harbour or Central
skyline photograph is still the stronger hero and remains the recommended
upgrade — `PHOTO-SHORTLIST.md` has the searches.
