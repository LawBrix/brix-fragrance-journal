# Brix’s Fragrance Journal

A personal perfume journal featuring 13 fragrances, product photos, review previews, accord summaries, note pyramids, an interactive 3D bottle, and summer/winter favorites.

## Run locally

No package installation or build step is required. From this folder, run:

```sh
python -m http.server 8000
```

Open http://localhost:8000 in your browser. Use an HTTP server rather than opening index.html directly, because the 3D renderer uses JavaScript modules.

## Publish with GitHub Pages

1. Upload these files to a GitHub repository, preserving the folder structure and keeping `index.html` at the repository root.
2. Open **Settings → Pages** in that repository.
3. Choose **Deploy from a branch**, select **main** and **/ (root)**, then save.
4. GitHub shows the live website link on the Pages settings page after deployment completes.

The `.nojekyll` file tells GitHub Pages to serve the site as static files. All site asset paths are relative, so the site works under a repository URL.

## Editing the collection

- `app.js`: fragrances, starter review text, and review interactions.
- `fragrance-data.js`: accords, top/middle/base notes, and source links.
- `photo-data.js`: product photo paths and source credits.
- `index.html`: page layout and seasonal favorites.
- `images/`: optimized product photographs.
- `perfume-3d.js`: the original interactive hero bottle.

Review edits made in the website are saved only in that browser’s local storage. They do not update this repository or sync across devices. Browser-saved reviews from the previous Sites address do not automatically transfer to the GitHub Pages address.

Product photos and product branding belong to their respective owners; source links are listed in `photo-credits.html`. Three.js is bundled locally under its MIT license in `vendor/THREE-LICENSE.txt`.
