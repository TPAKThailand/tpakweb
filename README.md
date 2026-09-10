# TPAK Knowledge Hub

A working Thai redesign with the original TPAK logo and blue/orange palette, a prominent search, an accessible knowledge collection, and an interactive national data explorer.

## Routes

- `/` and `/th`: search, national data preview, knowledge cards.
- `/knowledge`: 89 searchable resources with topic/format filters, pagination and native article navigation.
- `/article/[id]`: 86 complete imported entries, with illustrations, authors, dates, attachment links and related reading.
- `/data`: native physical-activity and sedentary-behavior dashboards, plus survey exploration by year, gender, age, urban/rural area and province. Chart/table views, year comparison and CSV export.
- `/about`: original vision, four missions, background, goals, identity assets and contact details.
- `/people`: 27 staff members, source photographs, published contact addresses and group filtering. Also accessible through the About tabs.

## Content and provenance

Imported on 9 September 2026 from https://tpak.or.th/th/concept/articles/all/all/all . The source heading says 89 articles, but its public listing endpoint returns 86 unique entries, including with all displayed filters enabled and a page size of 200. All 86 returned entries are included in full. The other three cannot be identified from that listing; no content is invented to fill the discrepancy. Three research/publication resources retained from the initial collection bring this site's total to 89 resources. This is not a claim to have recovered 89 complete source articles.

The dashboards requested at https://tpak.or.th/th/iframe/15 and /14 are overview graphics linking to /2. Data was read from the public report underlying /2 and stored locally: 52 PA summary rows, 48 sedentary summary rows (each expanded into total/male/female), and 5,948 aggregate survey groups. Only group dimensions, counts, duration sums and denominators were imported; no respondent identifiers or individual records were queried. All dashboard calculations run locally, without Power BI scripts, embeds, accounts or runtime APIs.

Data covers 2555–2567. The latest national PA value is 68.9%. Sedentary values use the source's hours.minutes notation, verified against its downloadable poster: 14.03 means 14 hours 3 minutes, not 14.03 decimal hours. Chart values and CSV are normalized to minutes. The missing sedentary year 2564 is preserved as missing. Historical rows with no activity-mode duration report no data, not zero. Source summary values remain separate from survey percentages. Averages use total duration divided by its own non-null denominator rather than averaging subgroup averages. Independent source queries of yearly totals are included as test fixtures.

Staff and institutional content come from https://tpak.or.th/th/personal and https://tpak.or.th/th/about-us . Full article HTML is allowlist-sanitized; scripts, inline styles and interactive form code are excluded, while download button labels/links and illustrations are retained. Images are optimized and self-hosted. TPAK retains its source attribution. Branding follows the public logo and palette, since a separate CI manual was not supplied.

This snapshot does not update automatically and does not modify tpak.or.th. Other media, news, calendar and assessment services retain links to their original locations. Existing accounts, a CMS editing interface and DNS cutover are outside this iteration.

## Development and checks

`npm install`, then `npm run dev` for a local server and `npm run build` for the deployable site in `dist/`. Tests: `node --experimental-strip-types --test tests/search.test.mjs tests/dashboard.test.mjs`.

Fonts are self-hosted Noto Sans Thai and Manrope, licensed under SIL Open Font License. Source font distributions: https://github.com/notofonts/thai and https://github.com/sharanda/manrope .

## Build and deployment

The site is a Vite single-page app built from the `app/` sources, with no server runtime, so GitHub Pages can host it as static files.

- `index.html` + `src/main.tsx` are the entry point; `src/App.tsx` maps URLs to the pages under `app/`.
- `src/router.tsx` is a small history-based router. `app/site-link.tsx` handles in-app links and keeps modifier-clicks, new tabs and keyboard navigation native.
- `src/shims/` supplies `next/image`, `next/link` and `next/navigation` so the imported page code runs unchanged; `vite.config.ts` aliases those imports.
- Every path is prefixed with the deploy base (`/tpakweb/` on GitHub Pages, overridable with the `BASE_PATH` environment variable). `src/base.ts` re-bases asset paths, links and the stored article HTML at runtime.
- `scripts/split-article-bodies.mjs` writes one JSON file per article so a reader downloads only the article they opened, instead of all 2.7 MB.
- `scripts/prerender.mjs` writes an `index.html` for every route with that page's title and description, plus `404.html` and `.nojekyll`. GitHub Pages has no rewrite rules, so without this a deep link such as `/knowledge` would not resolve.

`.github/workflows/deploy.yml` runs this build on every push to `main` and publishes `dist/`. Repository settings → Pages → Source must be set to **GitHub Actions**.
