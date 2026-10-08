# Jacob Daniels — personal website

A static personal website inspired by the original Macintosh: an icon directory, monochrome document windows, and a real portrait. Built with HTML, CSS, and a small amount of JavaScript. No build step or runtime dependencies.

## Pages and content

- `index.html`: welcome and portrait.
- `about.html`: background, personal story, and internships at Safran and Attollo Engineering.
- `projects.html`: SkyWater Pump Interface capstone, followed by Portfolio Analyzer, Build4Good John Street Pokerbot, Skutor, and ResNet / CIFAR-10.
- `contact.html`: click-to-reveal email and a note pointing to the social links in the sidebar.
- `styles.css`: shared Macintosh layout, responsive styles, and print styles.
- `script.js`: email reveal, optional location, footer year, and back-to-top behavior.

Edit the page HTML directly to replace the placeholder text and images. LinkedIn links are in each page's HTML. The Contact page reveals the email only after a button click; `PROFILE.emailEncoded` in `script.js` holds a Base64-encoded address. This deters basic email harvesters but is not encryption or bot verification: sophisticated scrapers can decode it. The button supports keyboard activation and moves focus to the revealed email link. Without JavaScript, Contact directs visitors to LinkedIn. Set the optional `PROFILE.location` when ready. The core navigation works without JavaScript.

The portrait is the supplied original in `assets/jacob-portrait.jpg`. Fonts and artwork are local. Sysfont by Alina Sava (SIL OFL 1.1) provides the Chicago-style interface lettering; Geneva 9.2 by Techstar01, based on Kelsey Higham's Geneva recreations (Creative Commons Attribution Share Alike 3.0), provides the pixel Geneva body text. Both supplied font files are unmodified. Attribution, source links, and license records are available in `attributions.txt` and `assets/fonts/`. The original Sysfont and Geneva 9.2 licenses and readmes are preserved exactly as supplied. Geneva 9.2 uses a 16-unit pixel grid: body text and labels default to 32px. The small `pixel-text.js` enhancement chooses the nearest whole physical-pixel size using the display pixel ratio and nudges text origins onto that grid. It responds to viewport and resolution changes, font loading, and page reflow. Text remains selectable, browser zoom remains available, and printing and JavaScript-disabled browsing retain the static default. Text sizes and line wrapping change in steps during zoom; browser rounding and smoothing can still soften edges.

Experience logos use the supplied originals in `assets/safran-logo.png` and `assets/attollo-logo.webp`. The SVG view boxes in `about.html` crop them to their symbols while preserving the original artwork and colors.

## Local preview

Open `index.html` directly, or serve this directory:

```sh
python -m http.server 8765
```

Then visit `http://localhost:8765/index.html`.

## Reference material

The previous eight-style gallery is preserved in `style-atlas/index.html`. The standalone Classic Macintosh reference remains outside this repository in the parent project's `classic-macintosh-reference` folder.

## Deployment

The existing `.github/workflows/static.yml` deploys the repository root to GitHub Pages when `master` is pushed. Use the explicit `index.html` URL if a browser has cached the former custom-domain redirect.
