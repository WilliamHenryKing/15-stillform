# STILLFORM

Project 15: an architecture and interiors portfolio concept, completed locally on 27 September 2026. Monumental typography, licensed architectural photography, GSAP text and image reveals, native scrolling and a useful project-brief journey. No Three.js.

## Run

From this folder, `bun install --frozen-lockfile --ignore-scripts`, then `bun run dev` at http://127.0.0.1:4525/. For the production preview, `bun run build` then `bun run preview` at http://127.0.0.1:4625/. Ports are strict and loopback only. `bun run check` runs TypeScript, Biome, five domain tests and the static-prerendered production build.

## Explore

- Filter four fictional design studies; open a study, change its crop, move with arrows and close with Escape.
- Explore texture, light and form in the interactive material index, then follow a DrawSVG architectural plan and moving daylight through the process section.
- Browse gallery thumbnails, zoom into real detail and use the persistent header/reading rule to move through the page.
- Choose a project type, scale, timing and one to three priorities, with visible completion feedback. Review, edit and download a local text brief. No data is submitted or stored remotely.
- Use the mobile menu, keyboard focus path, footer motion switch and photo credits. OS reduced motion is respected.

The practice and studies are fictional. The real photographs are credited and the site does not claim authorship of the buildings. See [CREDITS.md](CREDITS.md) and [assets.manifest.json](assets.manifest.json).

## Evidence and scope

[DESIGN.md](DESIGN.md), [visual verification](docs/visual/VERIFICATION.md) and [self-scorecard](docs/visual/SCORECARD.md) record the design, checks and limitations. Repeatable Playwright CLI snippets are under `tools/browser/`; captures and results are under `docs/visual/captures/review-2026-09-27/`. The source/asset build hashes are in `docs/visual/build-receipt.json`.

Local implementation and solo review are complete; independent review, physical-device performance and William's visual acceptance are unclaimed. Nothing is deployed. This repository is independent of the other fourteen projects. Keep its `.repositories/15-stillform` anchor in place.

The second deep refinement pass is recorded in `docs/visual/captures/refinement-2026-09-27/`. First-delivery evidence remains intact.
