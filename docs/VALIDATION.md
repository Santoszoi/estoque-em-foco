# Validation report · 19 October 2026

These are actual local results, not a promise of production readiness.

## Environment

- Node.js 24.19.0, npm 11.9.0.
- React / React DOM 19.3.1.
- TypeScript 7.0.2; Vite 8.3.4.
- Playwright 1.64.1; axe integration 4.14.0.
- Headless Chromium 153.0.8010.0, executable provided through CHROMIUM_PATH.
- Default Playwright Chromium download failed with invalid archive data. A Chromium executable from the @sparticuz/chromium npm package was extracted locally for verification. It is not shipped in the project. Install Playwright's browser normally on your own machine.

## Results

| Check | Actual result |
| --- | --- |
| Node unit tests | 10 passed, 0 failed |
| Browser tests | 6 passed, 0 failed |
| TypeScript check and Vite production build | Passed |
| Axe scan, selected wcag2a / wcag2aa / wcag21aa tags | No violations in initial, filtered and empty states |
| Page width at 390 px and 320 px | No page-level horizontal overflow |
| Production dependency audit (`npm audit --omit=dev`) | 0 known advisories at execution |
| GitHub Actions | Workflow prepared; not run remotely |

The audit excludes development dependencies and is not a security guarantee. No claim of WCAG conformance is made.

## Covered behavior

Unit tests check zero stock, equality to minimum, above-minimum status, normalization, all-term matching, SKU matching, AND combinations, empty combinations, whitespace search, ascending-stock sorting, preservation of input order, integer-cent totals, and empty summaries.

Browser tests check the visible result count and filtered amount, all controls after reset, focus return to search, keyboard Tab/Shift+Tab and arrow keys in selects, ordering, the minimum-stock boundary, reset after reload, three axe-scanned states and narrow layouts with a focusable scrollable table.

A concrete combined scenario selected Bebidas + Estoque baixo + CAFE and produced one item: Café gelado 250 ml, 4 units, one item needing attention, R$35.60 in stock sales value.

Initial inventory summary observed in the running UI: 12 products, 159 units, 6 attention items, R$795.89 in stock sales value. These numbers describe only the fictional fixtures and are not business outcomes.

## Corrections during verification

The first build exposed a missing Vite CSS module declaration. Adding vite-env.d.ts resolved it. The first browser run passed 5 of 6 tests: the keyboard test incorrectly used Enter after arrow selection on a native select in this Linux browser. Removing the extra Enter and checking the actual Tab/arrow flow resulted in 6 of 6 passes. No claim is made that all operating systems expose identical native select behavior.

## Media

Four screenshots were captured from the running production preview. The silent MP4 is approximately 12 seconds of actual scripted browser interaction, converted to H.264 Baseline / yuv420p with faststart and a silent AAC track. Full decoding with FFmpeg completed without errors. Playback on a physical iPhone or through LinkedIn has not been tested.

## Still pending

Manual NVDA/VoiceOver review, real mobile devices, Firefox, Safari, Windows-specific keyboard behavior, high contrast, actual browser zoom and review with users of assistive technology. The current live count can announce frequently while typing; verify that experience manually.

No API, database or server synchronization exists. There is no persistence, pagination, authentication or stock movement. Negative or fractional quantities from external data are outside the validated fixture contract. Runtime API input validation is future work.
