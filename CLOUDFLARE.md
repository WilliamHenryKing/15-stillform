# STILLFORM on Cloudflare Free

Prepared locally on 27 September 2026 for **Workers Static Assets**, using `https://15-stillform.<account-subdomain>.workers.dev`. The account subdomain is unknown; this is a URL pattern, not a live link. No domain purchase, remote Git repository or server is needed. Nothing has been published.

Wrangler **4.141.0** is pinned locally. The configuration contains static assets only, enables the free address and disables version preview URLs. Runtime code has no Cloudflare dependency. Static requests are free and unlimited under the current [Cloudflare pricing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/). Optional paid products and future backends are outside this setup.

## Local preparation

Run from this project folder. Stop an existing Cloudflare preview before preparing a new package; the staging helper checks its port before replacing files.

```powershell
bun install --frozen-lockfile
bun run cloudflare:prepare
bun run cloudflare:verify
bun run cloudflare:preview
```

`prepare` runs types, lint, domain tests and a production build, stages public output in `output/cloudflare/site/`, writes a SHA256 receipt, then runs a **non-uploading** Wrangler dry run. The Vite manifest is excluded. `_headers` is configuration, not a public asset. `verify` requires a clean checkout at the prepared commit and unchanged configuration, Wrangler version and staged bytes. A candidate prepared while editing works locally but fails the publication check until committed and prepared again.

Cloudflare local preview: http://127.0.0.1:4725/; inspector 9325. It serves the staged package; stop with Ctrl+C. Ordinary Vite dev/preview remain 4525/4625. Hashed JS/CSS have immutable browser caching; the homepage revalidates. Missing paths/assets return 404. Fragment navigation needs no SPA fallback.

## Account setup and later publication

The read-only account check reported `loggedIn: false`. Sign in when ready:

```powershell
bun run cloudflare:login
bun run cloudflare:whoami
```

Login opens Cloudflare's browser consent flow; keep credentials there. Create a Free account if needed, select the intended account, and choose its available `workers.dev` subdomain in Workers & Pages. Check that `15-stillform` is unused or belongs to this project. With multiple accounts, select the intended one explicitly, using `CLOUDFLARE_ACCOUNT_ID` if necessary. No API tokens belong in this repository.

After publication is requested:

```powershell
bun run cloudflare:deploy
```

**This command publishes publicly.** It verifies the prepared package first and does not rebuild. Save the returned live URL, deployment/version ID and receipt. Confirm the Free plan and avoid optional paid services. Test the live root, JS/CSS, missing-file responses, photographs, gallery/zoom, local brief, mobile navigation and motion preferences. Local checks do not reserve the name or prove live delivery.

For updates, commit, prepare, inspect and deploy again. Retain the previous package and deployment/version ID; use Cloudflare's deployment rollback if needed and repeat the hosted smoke check. Collection-level preparation records contain the first package's archive path and hash.

## Verification

Five domain tests / 21 assertions, strict types, Biome and production build pass. Wrangler dry run passes without authentication or upload. `tools/browser/cloudflare.txt` runs **22 named local-runtime checks** covering prerendering, headers, assets, five real 404 cases, five local photographs, gallery/zoom interactions, keyboard closing, fragment reload, mobile layout and reduced motion. No browser errors observed. Sampled captures are in `output/playwright/`; user visual acceptance and live hosting remain unverified.

Repeat the hosting smoke after starting the Cloudflare preview:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=cf-stillform open http://127.0.0.1:4725/ --browser=chrome
npx --yes --package @playwright/cli playwright-cli -s=cf-stillform --raw run-code --filename=tools/browser/cloudflare.txt
```

See root `HOSTING-PLAN.md` and `docs/hosting/CLOUDFLARE-READY.md` for the collection rollout. References: [Wrangler dry runs](https://developers.cloudflare.com/workers/wrangler/commands/workers/), [static headers](https://developers.cloudflare.com/workers/static-assets/headers/), [free addresses](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).
