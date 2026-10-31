# portfolio-site
Portfolio website for Mary Cris Tapic

A one-page site in plain HTML and CSS, with a small amount of JavaScript for the phone menu and the case study slide viewer.

## Files

- `index.html`: all page content
- `styles.css`: colors, fonts and layout
- `script.js`: phone menu and slide viewer
- `images/headshot-160.webp`, `images/headshot-600.webp`: resized copies of `headshot.png`
- `images/case-studies/`: one image per page of each case study PDF

## Before publishing: replace the placeholders

Open `index.html` and search for:

- `YOUR-CALENDLY-LINK` (3 places): replace `https://calendly.com/YOUR-CALENDLY-LINK` with your Calendly link.
- `YOUR-EMAIL-ADDRESS` (1 place): replace `mailto:YOUR-EMAIL-ADDRESS` with `mailto:you@example.com`, and replace the visible text `[your email address]` with your address.

## Preview

Double-click `index.html` to open it in your browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating a case study

If a deck changes, export each page as an image named like `images/case-studies/storm-operations-01.webp`, and update the slide count for that deck at the top of the viewer section in `script.js`.
