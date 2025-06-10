# Innoledge.com2 - Modern Static Site

A modern, maintainable static version of innoledge.com with full multilingual support.

## Features

- 🌍 **Multilingual**: English, French, and Chinese versions
- 📱 **Responsive**: Mobile-first design approach
- ⚡ **Fast**: Optimized static files for quick loading
- 🔧 **Maintainable**: Modern development workflow
- 📝 **Forms**: Formspree integration for contact forms
- 🎨 **Visual Fidelity**: Exact visual match to original WordPress site

## Structure

```
innoledge.com2/
├── index.html              # English homepage
├── fr/                     # French version
├── zh/                     # Chinese version
├── en/                     # English pages (non-homepage)
├── assets/                 # CSS, JS, images
├── components/             # Reusable HTML components
├── data/                   # Content JSON files
└── templates/              # Build templates
```

## Development

### Setup
```bash
npm install
```

### Local Development
```bash
npm run dev
# Opens http://localhost:8000
```

### Content Extraction
```bash
npm run extract-content
```

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Languages

- **English**: `/` (homepage), `/en/` (other pages)
- **French**: `/fr/`
- **Chinese**: `/zh/`

## Content Management

Content is organized in JSON files in the `/data/` directory:
- `content-en.json` - English content
- `content-fr.json` - French content
- `content-zh.json` - Chinese content

## Forms

All contact forms use Formspree (https://formspree.io/f/myzedzbl) for static site compatibility.

## Deployment

This site is optimized for GitHub Pages deployment with automatic building via GitHub Actions.