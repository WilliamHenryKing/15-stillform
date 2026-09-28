<p align="center"><img src="docs/readme/banner.svg" alt="STILLFORM: material studies, a study gallery and a brief you can edit and keep." width="100%"></p>

<p align="center">
  <a href="https://15-stillform.williamking.workers.dev"><img alt="Visit the live site" src="https://img.shields.io/badge/Visit_live_site-%E2%86%97-c9b79c?style=for-the-badge&labelColor=191816"></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-c9b79c?style=for-the-badge&logo=typescript&logoColor=191816&labelColor=191816">
  <img alt="React" src="https://img.shields.io/badge/React-c9b79c?style=for-the-badge&logo=react&logoColor=191816&labelColor=191816">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-c9b79c?style=for-the-badge&logo=greensock&logoColor=191816&labelColor=191816">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-c9b79c?style=for-the-badge&logo=tailwindcss&logoColor=191816&labelColor=191816">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-c9b79c?style=for-the-badge&logo=vite&logoColor=191816&labelColor=191816">
  <img alt="Bun" src="https://img.shields.io/badge/Bun-c9b79c?style=for-the-badge&logo=bun&logoColor=191816&labelColor=191816">
</p>

**A fictional architecture and interiors practice.** Monumental typography, licensed architectural photography, a filterable study gallery, an interactive material index and a project brief you can edit and download.

<p align="center"><img src="docs/readme/preview.gif" alt="Scrolling from the hero into the studies and gallery" width="800"></p>

## What you can do

- **Filter four design studies**, open one, change its crop, move with the arrow keys and close with Escape.
- **Explore texture, light and form** in the interactive material index.
- **Follow a drawn plan** and moving daylight through the process section.
- **Browse the gallery**, with thumbnails and working image zoom.
- **Write a brief:** choose a project type, scale, timing and priorities, then review, edit and download it as text. Nothing is submitted or stored remotely.

## What's inside

- **GSAP text and image reveals** with SplitText, Flip filters and DrawSVG plans, over native scrolling.
- **A persistent header** with a reading rule, mobile menu, keyboard focus path and a motion switch.
- **Readable before JavaScript loads**, with OS reduced motion respected and zero axe violations in the final review.
- **Honest credits:** every photograph is licensed and credited, and the site does not claim authorship of the buildings.

## Screenshots

| Desktop | Phone |
| --- | --- |
| <img src="docs/readme/desktop.png" alt="STILLFORM's hero on desktop" width="560"> | <img src="docs/readme/phone.png" alt="STILLFORM on a phone" width="220"> |

## Built with

React, GSAP (SplitText, Flip, DrawSVG, ScrollTrigger), Tailwind CSS with Lightning CSS, TypeScript, Vite and Bun. No Three.js.

## Run it locally

```sh
bun install --frozen-lockfile --ignore-scripts
bun run dev      # http://127.0.0.1:4525/
bun run check    # TypeScript, Biome, domain tests and the prerendered build
bun run preview  # http://127.0.0.1:4625/ after bun run build
```

Design and verification: [DESIGN.md](DESIGN.md), [docs/visual/VERIFICATION.md](docs/visual/VERIFICATION.md), [docs/visual/SCORECARD.md](docs/visual/SCORECARD.md) and the working history in [docs/PROJECT-NOTES.md](docs/PROJECT-NOTES.md).

## Credits

Photographs are credited with their source, licence and processing in [CREDITS.md](CREDITS.md) and [assets.manifest.json](assets.manifest.json). The practice and its studies are fictional.

---

<p align="center"><sub>Part of William King's portfolio collection.</sub></p>
