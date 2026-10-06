# Jacob Daniels — personal website

A static personal website inspired by the original Macintosh: an icon directory, monochrome document windows, and a real portrait. Built with HTML, CSS, and a small amount of JavaScript. No build step or runtime dependencies.

## Pages and content

- `index.html`: welcome and portrait.
- `about.html`: background, personal story, and three experience placeholders.
- `projects.html`: a long project document, currently starting with the poker bot and ResNet / CIFAR-10 repositories.
- `contact.html`: contact details and GitHub.
- `styles.css`: shared Macintosh layout, responsive styles, and print styles.
- `script.js`: optional profile details and the footer year.

Edit the page HTML directly to replace the placeholder text and images. Set `email`, `linkedin`, and `location` in `PROFILE` at the top of `script.js` when ready. Until then, LinkedIn opens its placeholder on Contact and no email address is invented. The core navigation works without JavaScript.

The portrait is the supplied original in `assets/jacob-portrait.jpg`. Fonts and artwork are local; the Silkscreen license is included in `assets/fonts/`.

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
