# Jacob’s personal homepage

A static personal site built with HTML, CSS, and a small JavaScript file. No package installation or build step required.

## Preview locally

From this directory, run:

```sh
python -m http.server 8000
```

Visit http://localhost:8000. You can also open `index.html` directly for a quick preview.

## Make it yours

- Edit `index.html` to update the intro, bio, projects, and links.
- Add images to `assets/` and give each informative image descriptive alt text.
- Edit the colors and component rules in `styles.css` to adjust the appearance.
- Replace the “More to come” block with project cards as you add highlights.
- Keep asset links relative so the site works locally and on GitHub Pages.

The blue orb and landscape are CSS artwork. The layout adapts to narrow screens and includes keyboard focus styles, a skip link, and reduced-motion support.

## Publish

The workflow in `.github/workflows/static.yml` deploys the repository on pushes to `master`. In the repository’s Settings → Pages, set the source to **GitHub Actions**.

Live URL: https://jacobrdaniels.github.io/
