# innoledge.com — maintenance notes (static site)

This site was converted from WordPress to plain static HTML. WordPress-only artifacts (feeds, REST API
dumps, comment forms, Ninja Forms, emoji/Polylang scripts) have been removed; the `wp-content` / `wp-includes`
folders now only hold the theme CSS/JS and images. Hosting target: Vercel (`vercel.json`, `api/contact.js`);
the GitHub Pages workflow (`.github/workflows/github-pages.yml`, branch `work`) still works for static pages only.

## Layout and styling
* All new design rules live in `wp-content/themes/astra-child/innoledge.css` (loaded after the theme CSS on every page).
* Homepages: `index.html` (EN), `fr/page-daccueil/index.html` (FR), `zh/homepage/index.html` (ZH, Traditional Chinese).
* Rafaelo® patient information: `rafaelo-hong-kong/`, `fr/rafaelo-hong-kong/`, `zh/rafaelo-hong-kong/`.

## Things to complete before going live
1. **F Care Systems / Rafaelo® logo** — `wp-content/uploads/2026/09/fcare-rafaelo-logo.svg` is an interim wordmark.
   Replace the file with the official logo supplied by F Care Systems (keep the same file name, or update the
   `src` on the homepages, sidebars, portfolio pages and Rafaelo® pages).
2. **Clinic enquiry phone number** — the Rafaelo® pages show "Clinic enquiry line — to be confirmed".
   Search for `rf-pending` in the three Rafaelo® pages and replace the block with the number once the clinic confirms.
3. **Medical reviewer line and review date** on the Rafaelo® pages (same `rf-pending` markers).
4. **Contact forms** post to the Vercel serverless function `api/contact.js`, which e-mails info@innoledge.com
   directly (no third-party form service). Set these environment variables in the Vercel project:
   `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS` (an Innoledge mailbox allowed to send), `MAIL_FROM`
   (e.g. website@innoledge.com) and optionally `MAIL_TO` (default info@innoledge.com). `RESEND_API_KEY` can be used
   instead of SMTP. A honeypot field replaces reCAPTCHA. The forms only work on Vercel (GitHub Pages has no functions).
5. **Photography** — every inherited image is 250–768 px and too small for the new layout. `PHOTOGRAPHY.md`
   lists the photo slots the design expects and `tools/photography/build-photos.py` builds the WebP/JPEG
   derivatives for them. The homepage hero uses a typographic treatment until a `hero-asia` photo exists.
6. Submit `https://innoledge.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
7. Traditional Chinese copy (`zh/`) should be proof-read by a native reviewer before publication.

## SEO / GEO
* Every page has an absolute canonical URL, `hreflang` alternates (en / fr / zh-Hant-HK / x-default), a unique
  title and meta description, Organization + WebSite JSON-LD (homepages) and MedicalWebPage / MedicalProcedure /
  FAQPage / Organization / ContactPoint JSON-LD on the Rafaelo® pages.
* `sitemap.xml`, `robots.txt`, `llms.txt` and `404.html` are at the site root.
* The old `index.html@p=NN.html` WordPress duplicates are now `noindex` redirect stubs to the clean URLs.
