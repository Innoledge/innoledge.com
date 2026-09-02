# innoledge.com — maintenance notes (static site)

This site is a static HTML export of the former WordPress site, served by GitHub Pages
(`.github/workflows/github-pages.yml`, deploys on push to the `work` branch). It can also be
deployed unchanged to Vercel (`vercel.json` is included).

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
4. **Contact forms** post to FormSubmit (`https://formsubmit.co/info@innoledge.com`). The first submission triggers a
   one-time activation e-mail to info@innoledge.com which must be confirmed. No reCAPTCHA is needed (honeypot field).
   To change the destination address, edit the `action` attribute of the forms on `contact-us/`, `fr/contactez-nous/`
   and the three Rafaelo® pages.
5. Submit `https://innoledge.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
6. Traditional Chinese copy (`zh/`) should be proof-read by a native reviewer before publication.

## SEO / GEO
* Every page has an absolute canonical URL, `hreflang` alternates (en / fr / zh-Hant-HK / x-default), a unique
  title and meta description, Organization + WebSite JSON-LD (homepages) and MedicalWebPage / MedicalProcedure /
  FAQPage / Organization / ContactPoint JSON-LD on the Rafaelo® pages.
* `sitemap.xml`, `robots.txt`, `llms.txt` and `404.html` are at the site root.
* The old `index.html@p=NN.html` WordPress duplicates are now `noindex` redirect stubs to the clean URLs.
