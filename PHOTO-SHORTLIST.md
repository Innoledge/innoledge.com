# Photo shortlist — what to download

Companion to `PHOTOGRAPHY.md`, which describes the slots. This file is the
shopping list: what to search, how to choose, and what to name the file.

Both Unsplash and Pexels licence their photos for commercial use with no
attribution required. The search links below are pre-filtered by orientation —
**the hero is portrait, everything else is landscape**, so getting that wrong
means the crop throws away most of the frame.

> A note on how precise this can be: I can't open image sites from this session
> (the egress policy blocks them), so these are searches plus selection criteria
> rather than links to individual photos. Naming specific photo IDs I couldn't
> open would have sent you to the wrong images. Pick the frame that best fits the
> criteria — they're written tightly enough that most candidates will be wrong
> for an obvious reason.

## The runbook

1. Download one photo per slot at the **largest size offered** ("Original" on
   Unsplash, "Original" on Pexels).
2. Save them into one folder, named exactly: `hero-asia.jpg`, `company-team.jpg`,
   `sector-health.jpg`, `sector-cosmetics.jpg`, `sector-agrofood.jpg`.
3. Build and activate everything in one go:
   ```sh
   pip install Pillow
   python3 tools/photography/build-photos.py --all ~/Downloads/innoledge-photos/
   ```
   The **hero** is fully wired: its markup is uncommented on the EN, FR and ZH
   homepages and it becomes the social preview image too. The other four slots
   build their derivatives but their markup is not in the pages yet — the script
   says so when that happens. Send me the photos (or just say they're on the
   branch) and I'll wire those four in; the sector crops and art direction are
   better decided with the actual images in hand than guessed in advance.
4. Fill in the licence table at the bottom of `PHOTOGRAPHY.md`.
5. Commit and push — the Vercel preview redeploys on its own.

You don't have to do all five. Any slot you skip stays as it is today, so the
hero alone is a perfectly good first pass — and it's the one that changes the
page most.

---

## 1. `hero-asia` — **portrait**, 3:4

The one that carries the page. It sits as a tall panel to the right of the
headline, roughly 415 × 550 on a laptop.

> **This slot is now filled**, from a 2553 × 2560 original recovered from the
> repo's own history (advisers at a meeting table — see `PHOTOGRAPHY.md`). So this
> is an upgrade rather than a gap: a real Hong Kong photograph would say something
> the current one doesn't, which is *where* Innoledge works. Worth doing, but no
> longer urgent.

- Unsplash: [hong kong skyline](https://unsplash.com/s/photos/hong-kong-skyline?orientation=portrait) ·
  [victoria harbour](https://unsplash.com/s/photos/victoria-harbour?orientation=portrait) ·
  [hong kong night](https://unsplash.com/s/photos/hong-kong-night?orientation=portrait)
- Pexels: [hong kong skyline](https://www.pexels.com/search/hong%20kong%20skyline/?orientation=portrait) ·
  [hong kong city](https://www.pexels.com/search/hong%20kong%20city/?orientation=portrait)

**Choose one where:** the towers of Central or the ICC are clearly the subject and
read as Hong Kong at a glance; it's dusk or blue hour, with lit windows against a
still-coloured sky (this is what makes the shot look expensive, and the deep blue
sits well against the cream band and orange headline); the composition is vertical
by nature — a dense wall of towers, not a wide panorama someone cropped.

**Skip anything with:** daytime haze or flat grey sky; a tourist foreground
(railings, selfie crowds, junk boats front and centre); a tilted horizon;
large legible advertising hoardings; heavy HDR or purple-orange over-grading.

## 2. `company-team` — landscape, 3:2

Replaces the 280 px family photo in the "Innoledge International Ltd" block.

**A real photograph of the Innoledge team or one of the four offices beats any
stock image here** and needs no licence record — anything off a recent phone is
big enough. Use stock only as a stopgap:

- Unsplash: [business meeting](https://unsplash.com/s/photos/business-meeting?orientation=landscape) ·
  [hong kong central](https://unsplash.com/s/photos/hong-kong-central?orientation=landscape)
- Pexels: [business team meeting](https://www.pexels.com/search/business%20team%20meeting/?orientation=landscape)

**Choose one where:** people are working or talking rather than posing at the
camera; the group is visibly multicultural, which is the actual claim the
paragraph beside it makes; the room looks like a real office. If nothing
convincing turns up, take the Hong Kong office-district option instead — a
credible street-level view of Central beats an unconvincing boardroom.

**Skip anything with:** a ring of people applauding, exaggerated smiles,
handshake-over-a-desk clichés, or a visible whiteboard covered in fake charts.

## 3. `sector-health` — landscape, 3:2

Card under "Where we focus". Medicines, medical devices, supplements, hospital
products.

- Unsplash: [pharmacy](https://unsplash.com/s/photos/pharmacy?orientation=landscape) ·
  [laboratory research](https://unsplash.com/s/photos/laboratory-research?orientation=landscape)
- Pexels: [pharmacy](https://www.pexels.com/search/pharmacy/?orientation=landscape) ·
  [laboratory](https://www.pexels.com/search/laboratory/?orientation=landscape)

**Choose one where:** it reads as professional pharmaceutical or laboratory work —
clean bench, ordered shelving, gloved hands at an instrument. Cool clinical whites
and blues are fine and give the three cards useful variety.

**Skip anything with:** needles entering skin, blood, or anything that looks
clinical in a distressing way; legible drug brand names or packaging Innoledge
does not represent; a stethoscope arranged decoratively on a desk.

## 4. `sector-cosmetics` — landscape, 3:2

Skin care, whitening, anti-ageing, colour cosmetics, fragrance, baby care.

- Unsplash: [skincare](https://unsplash.com/s/photos/skincare?orientation=landscape) ·
  [cosmetics flat lay](https://unsplash.com/s/photos/cosmetics-flat-lay?orientation=landscape)
- Pexels: [skincare products](https://www.pexels.com/search/skincare%20products/?orientation=landscape)

**Choose one where:** it looks like premium retail — unbranded or subtly branded
glass bottles, soft directional light, generous empty space. Warm neutrals,
cream and stone tones will sit naturally next to the brand orange.

**Skip anything with:** a recognisable competitor's packaging; heavy pink or
lilac styling; a face as the main subject (that needs a model release).

## 5. `sector-agrofood` — landscape, 3:2

Food ingredients, natural products, feed supplements, racehorse nutrition.

- Unsplash: [fresh produce market](https://unsplash.com/s/photos/fresh-produce-market?orientation=landscape) ·
  [grains ingredients](https://unsplash.com/s/photos/grains-ingredients?orientation=landscape) ·
  [racehorse](https://unsplash.com/s/photos/racehorse?orientation=landscape)
- Pexels: [food ingredients](https://www.pexels.com/search/food%20ingredients/?orientation=landscape)

**Choose one where:** the subject is raw ingredients or produce in good condition —
grains, pulses, herbs, fresh fruit and vegetables. The racehorse option works too
and nods to the Amino Eclipse and Arthro Guard partnerships, but only if the horse
is clearly the subject and the shot doesn't look like a betting advert.

**Skip anything with:** raw meat or fish; a plated restaurant dish (this is
ingredients and supplements, not catering); wilted or bruised produce.

---

## One thing to keep an eye on across all five

They appear on the same page, so they should look like they were commissioned
together. Once built, look at the homepage as a whole: if one photo is markedly
cooler, darker or more saturated than the rest it will stand out as borrowed. The
dusk hero is deliberately the exception — it's the only one that should feel dark.
