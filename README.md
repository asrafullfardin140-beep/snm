# SnM Millwork Manufacturing Inc. website

"From Concept to Completion."

## How the live site is set up right now (work in progress)

| Address | What visitors see |
|---|---|
| `/` and `/design-draft/preview/*` (the link sent to the client) | The **under-construction page** (`index.html`), so the client doesn't see changes as we make them. |
| `/studio-a7k2/` | The **real work-in-progress website** (hidden link, not in search engines, share only with the owner). |

- `vercel.json` rewrites `/design-draft/preview/*` to the construction page and tells search engines not to index anything.
- `404.html` is a copy of the construction page, so any wrong address shows it too.

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
