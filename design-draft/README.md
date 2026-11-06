# SnM Millwork website: design draft v2

Clickable design prototype for **SnM Millwork Manufacturing Inc.** (10 pages, locked v2 sitemap, Dark Luxury colours).
This is a design draft, not the production website.

## View it

Run the build (see the root README), then open `studio-a7k2/preview/Main.html` from a local web server, or visit the hidden studio link on the live site. Every page links to the others, and the videos, sliders,
galleries and quote form all work. Nothing needs installing.

The same draft lives on the design canvas: https://claude.ai/artifact/PuM7wTH1tV4uNhNARQnuNr (private until shared).

## Folders

| Folder | What it is |
|---|---|
| `canvas/` | Source files for the design canvas (`*.dc.html`, shared `snm.css`, `canvas.json`). Images are referenced as canvas uploads (`/_blob/...`), so these only render on the canvas. |
| `../studio-a7k2/preview/` | The same pages turned into plain HTML that runs in any browser, using `runtime.js` (generated, lives outside this folder). |
| `media/` | Logo, stock photos and videos used by the preview. |
| `tools/build.py` | Rebuilds the pages from `canvas/`: `python3 design-draft/tools/build.py design-draft/canvas studio-a7k2/preview ../../design-draft/media/` (run from the repo root). |

## Pages

| # | Page | File | Highlights |
|---|---|---|---|
| 01 | Home | `Main.html` | Full-screen hero video, full-width image slider, review slider |
| 02 | Commercial | `Commercial.html` | Moving client-logo strip, filterable gallery with full-screen viewer, review slider |
| 03 | Residential | `Residential.html` | Rooms, typical cost guide, filterable gallery with viewer, review slider |
| 04 | Services | `Services.html` | Overview of the four services |
| 05 | Epoxy & Resin | `Epoxy.html` | Resin video, wood and resin colour sampler, gallery, FAQ |
| 06 | Millwork & Cabinetry | `Millwork.html` | What we build, materials, FAQ |
| 07 | Design & Engineering | `Design.html` | Deliverables, drawing to install, FAQ |
| 08 | Interior Fit-Out | `FitOut.html` | Trades coordinated, process, FAQ |
| 09 | Get a Quote | `Quote.html` | 4-step form that adapts to business or home |
| 10 | About (footer link) | `About.html` | Story, founder, values, shop credentials |

## Placeholders

- All photos and videos are **free Pexels stock** for the draft only (see `MEDIA-CREDITS.md`). Replace with SnM's own work.
- Reviews marked "Sample" and anything in `[brackets]` (project names, prices, contact details, credentials) need SnM's real content.
- Client logos on the Commercial page are placeholders.
- The dark colour scheme departs from the SnM Brand Book (which asks for mostly Ivory and Sand); the client needs to approve it.
