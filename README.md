# portfolio-site
Portfolio website for Mary Cris Tapic

A one-page site in plain HTML and CSS, with a small amount of JavaScript for switching sections, the Cebu clock and the case study slide viewer. Each section has its own address: `index.html#services`, `#case-studies`, `#how-i-work`, `#about`, `#contact`.

## Files

- `index.html`: all page content
- `styles.css`: colors, fonts and layout
- `script.js`: section views (one link address per section), Cebu clock and slide viewer
- `images/headshot-160.webp`, `images/headshot-600.webp`, `images/headshot-1200.webp`: resized copies of `headshot.png`
- `images/og-image.jpg`: share preview image (from `headshot.png`)
- `images/case-studies/`: one image per page of each case study PDF

## Links used on the site

- Every "Book a call" button opens https://calendly.com/yourva-marycris/discovery-call in a new tab (4 places in `index.html`).
- Email: yourva.marycris@gmail.com (Contact page).
- Share preview image: `images/og-image.jpg`. Once the site has its web address, change the `og:image` line in `index.html` to the full address of that image (for example `https://example.com/images/og-image.jpg`), because most apps only read a full address there.

## Preview

Double-click `index.html` to open it in your browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating a case study

If a deck changes, export each page as an image named like `images/case-studies/storm-operations-01.webp`, and update the slide count for that deck at the top of the viewer section in `script.js`.
