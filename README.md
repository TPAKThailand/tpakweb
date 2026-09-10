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

Navigation uses native document links. The initial deployed vinext client router cancelled anchor clicks and threw on prefetch/navigation, preventing the three main menus from opening; native links preserve browser, keyboard and new-tab behavior.

## Development and checks

Use the retained pnpm lockfile. `pnpm dev`, `pnpm build`, `pnpm exec tsc --noEmit`, `pnpm exec oxlint app`, and `node --experimental-strip-types --test tests/search.test.mjs tests/dashboard.test.mjs`.

The app is configured for Sites / Cloudflare Workers. Build output is `dist/server/index.js` and `dist/client`. The selected Site ID is retained in `.openai/hosting.json`. Fonts are self-hosted Noto Sans Thai and Manrope, licensed under SIL Open Font License. Source font distributions: https://github.com/notofonts/thai and https://github.com/sharanda/manrope .
