# Eight — an interface atlas

Eight interactive style tiles made with plain HTML, CSS, and JavaScript. The collection explores general UI and visual character, with the same component inventory and illustration subjects across eight interpretations:

1. Frutiger Aero
2. Unix / BBS
3. Classic Macintosh / System 7
4. Swiss International Typographic Style
5. 1970s Technical Manual
6. DIY Photocopy Zine
7. Y2K Futurism
8. Art Nouveau

## Browse

The gallery lives at `index.html`. Each full specimen has a shareable URL, such as `specimen.html?style=aero`. Use the selector or previous/next arrows to move between styles.

Every specimen includes an original globe/computer/fern illustration, five copyable colors, typography, navigation, buttons and states, a form, a range slider, checkbox, switch, radio buttons, tabs, a searchable collection, a data table, progress, feedback messages, disclosures, and a real modal dialog.

Controls work: change the illustration's saturation, reveal drawing guides, turn gentle motion on, adjust component spacing, filter/select objects, save a favorite for the current visit, replay progress, or open and dismiss a dialog. Demo choices stay in the current page; nothing is submitted to a server. Motion is off initially and respects reduced-motion preferences.

## Run locally

No installation or build step is required. Open `index.html` directly, or run:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. Color copying requires a browser clipboard API in a secure context (HTTPS or localhost); other contexts show the color value as a fallback.

## Files

- `index.html`: collection and introductory content.
- `specimen.html`: shared specimen entry point.
- `script.js`: eight style descriptions, sample markup, and interactions.
- `styles.css`: shared UI anatomy, eight individual visual treatments, responsive rules, reduced motion, and print rules.
- `art.js`: original inline SVG illustrations, with unique gradient/pattern identifiers for every instance.
- `assets/`: local fonts, their SIL Open Font License files, paper texture, and favicon.

No runtime libraries, external font services, remote images, tracking, or build tools are needed. All illustration artwork is editable vector markup. Each style has its own `.theme-*` rules.

## Deploy

The original `.github/workflows/static.yml` is preserved. Pushes to `master` deploy the repository root to GitHub Pages using GitHub Actions.

Live gallery: <https://jacobrdaniels.github.io/>

## Verification

Checked all eight specimens at 320, 768, and 1440 CSS pixels for horizontal overflow and clipped headings/control groups. Exercised dialog open/Escape close, search and empty results, object selection, tabs, favorites, form choices, guides, motion, and density in every theme. Also checked arrow-key tab navigation, slider keyboard input, clipboard feedback, and progress completion. These are browser checks, not a claim of exhaustive accessibility or cross-browser certification.
