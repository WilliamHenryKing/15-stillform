# STILLFORM verification — 27 September 2026

Local implementation and solo review complete. No deployment, independent approval or user acceptance is claimed. VELA was completed before STILLFORM creative production began.

## Second refinement pass

The material section is now a three-part interactive texture/light/form study, with illustrated swatches, moving image apertures, live descriptive copy and links to the matching gallery project. A new original drawing board uses DrawSVG for the architectural plan and scroll-linked daylight. A persistent navigation header and reading rule support the long page. The gallery adds thumbnail navigation, a more considered image/text entrance and automatic return to the new photograph on phone screens. The enquiry form reports completion of its four details.

New evidence is in `captures/refinement-2026-09-27/`: 30 passing regression assertions, 16 new-interaction assertions and four final zoom/gallery assertions. Zero browser errors; final axe scans are clear for the mobile page and desktop/study/brief/credits states. Five domain tests and 21 assertions remain passing; strict TypeScript, Biome and production/prerender builds pass. No-JavaScript content returns HTTP 200. All observed page images load locally.

The deep pass found a real gallery defect that the older class-name assertion missed: the entrance tween's transform overrode the CSS detail zoom. An outer reveal layer now owns the entrance transform, and the inner image owns the crop. `zoom-before.json` records an actual scale ratio of 1.0; `zoom-after.json` confirms 1.6 in both animated desktop and reduced-motion phone checks. It also confirms reset on study change and phone gallery scrolling. The original form-progress screenshot sampled unfinished heading/colour transitions; it is retained as `brief-progress-in-motion.png`. The settled sample and timing note are separate.

Current code is approximately 403 kB JavaScript / 39 kB CSS raw, 137 / 9 kB gzip. Photography is unchanged at 2,198,024 bytes. Exact emitted files and hashes are in the current build receipt; the first receipt is preserved alongside the original review captures. The first-pass figures below are historical.

## Evidence

`captures/baseline/` contains the first desktop and portrait opening renders. `captures/review-2026-09-27/` contains the final hero, ethos, work, filtered studies, detail dialog, materials, approach, enquiry, brief and closing states. `meta.json` records the 30 successful browser assertions and sampled intro transforms. `final-check.json` records the remaining accessibility scans, successful image loads and no-JavaScript response. `settled-wide.json` describes the corrected full-HD settling condition. `build-receipt.json` lists emitted bytes and SHA256 hashes.

Windows, installed Chrome 154 in headless Playwright, CSS DPR 1. Actual reviewed viewports: 1440×1000, 1920×1080, 768×1024, 390×844, 320×740 and 844×390. These are emulated viewports, not physical phones.

## Checks

- Strict TypeScript and Biome pass. Five domain tests / 21 assertions pass. Vite build and React static prerender pass.
- 30 browser assertions pass: accessible masthead, all four filter states, native study modal, detail crop, gallery wrapping/reset/keyboard control, Escape/focus return, scroll index, four empty-form errors, priority limit, selected brief values, actual text download, edit preservation, complete credits, manual and OS reduced motion, five overflow checks, mobile navigation, skip link and no browser errors.
- Axe WCAG 2 A/AA and 2.1 AA: zero violations in the final mobile page, desktop page, study dialog, brief dialog and credits dialog. Bounded automated checks do not constitute full accessibility certification.
- No-JavaScript HTTP 200 with a readable H1, all four studies and static page content. Interactive controls require JavaScript. All six in-page image elements loaded successfully from the local origin.
- Five WebP files total 2,198,024 bytes. The hero has 1400/2200px responsive alternatives; remaining imagery lazy-loads. No external runtime image/font services. Final code is about 394 kB JS / 33 kB CSS raw, about 134 / 8 kB gzip, excluding HTML and photographs. Exact raw figures are in the receipt.
- The downloaded text file was opened and checked: it contains A home / A complete space / Within a year plus the three selected priorities and the explicit unsent notice.

The first keyboard test ran before the prerendered page had been replaced by React, so the focused static node disappeared. The review now waits for startup and uses a fresh navigation; the actual skip-link path passes. One early full-HD screenshot caught the replayed entrance after the motion toggle; its sampled state is preserved and a settled capture is separately labelled. No app errors were concealed. The project-number contrast fix came from visual inspection, despite an otherwise clean automatic scan.

## Limits and recovery

Sampled stills and interactions were reviewed; uninterrupted playback, FPS, real assistive-technology use and physical phones were not measured. Form state is local and resets on reload. There is no backend or real enquiry submission. Original architecture authorship is never claimed. See the self-scorecard for remaining design limitations.

Repeat the CLI snippets under `tools/browser/` after a substantive change, using the assigned production preview. Axe's path in the snippets points to the currently installed external tool cache and may need rediscovery on another machine. Do not treat the 3D collection's GPU fixture counts as website evidence.
