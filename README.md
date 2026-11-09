# SnM Millwork Manufacturing Inc. website

"From Concept to Completion."

## How the live site is set up right now

| Address | What visitors see |
|---|---|
| `/` (redirects to `/design-draft/preview/Main.html`) and `/design-draft/preview/*` (the link sent to the client) | The **real website** (served from `studio-a7k2/preview/` by a rewrite in `vercel.json`). Published for client review on 2026-11-10 at the owner's request. |
| `/studio-a7k2/` | The same site at its original hidden address (not in search engines). |
| `/index.html`, `/404.html` | The old under-construction page (kept; used for 404s). |

- `vercel.json` rewrites `/design-draft/preview/*` to `/studio-a7k2/preview/*`, redirects `/` to the homepage, and still tells search engines not to index anything (draft).
- **To hide the site again from the client:** put back the rewrite `/design-draft/preview/:path*` -> `/index.html`, and remove the `/` redirect (see git history of `vercel.json`).

## Design theme

The site now uses the **Light Gallery** theme: white ground, charcoal text, one teal accent, heavy sans caps (Archivo) with one light serif word (Cormorant Garamond), Inter for text. Navigation: Home, Projects, Services, About, Get a Quote. A filterable **Projects** gallery (by industry and by service) replaces the separate Commercial and Residential galleries; those two pages remain linked from the footer and the homepage.

## Folders

- `design-draft/`: source of the design: `canvas/` (page source), `media/` (photos, videos, logo), `tools/build.py`, notes.
- `studio-a7k2/`: the built website (`preview/*.html`), generated from `design-draft/canvas`.
- `index.html`: the construction page.

## Rebuild the real site

```
python3 design-draft/tools/build.py design-draft/canvas studio-a7k2/preview ../../design-draft/media/
```

## Launch (when the owner says go)

1. Move the built pages from `studio-a7k2/preview/` to the site root (or point `/` at them), update the media paths.
2. Remove the `/design-draft/preview/:path*` rewrite and the `X-Robots-Tag` header from `vercel.json`.
3. Replace `404.html` with the site's own 404 page (`NotFound.html`).
4. Replace placeholder content and the demo showreel (see `design-draft/MEDIA-CREDITS.md`).

## Going back to the earlier dark version

The Dark Luxury draft is saved as git tag `dark-luxury-v1` and branch `archive/dark-luxury-v1`.
To restore it: `git checkout dark-luxury-v1 -- design-draft index.html vercel.json 404.html` (then rebuild/redeploy).
