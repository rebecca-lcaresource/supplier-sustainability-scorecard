# PROGRESS — Supplier Sustainability Scorecard

> Claude Code: read this file at the start of every session, before touching anything. Update it at every save point. Replace content — do not append. History lives in git.

**Session:** 1 — first build
**Last updated:** 8 July 2026
**Live URL:** https://supplier-scorecard.netlify.app/ — deployed via Netlify (GitHub-connected, auto-deploys from `main`).

## Current state
Full MVP built and verified locally (build passes; driven end-to-end in a headless browser — intake, form, scorecard, leaderboard, PDF and CSV export all work).

- **Stack:** React + Vite + Tailwind (custom brand components, no shadcn — see decisions). Fonts via Google Fonts CDN. `netlify.toml` present (build `npm run build`, publish `dist`, SPA redirect).
- **Scoring engine** (`src/lib/`): `config.js` holds section weights (equal, 1/6, validated to sum to 1 on load) + band thresholds + maturity anchors; `questions.js` is the full six-section rubric; `scoring.js` computes per-question score 0–4, section %, weighted composite %, band, flags, unscored count. EcoVadis bypass, N/A conditional exclusion, and flag-not-scored rules all implemented. Verified: strong scorer = 92% Leading, PFAS supplier = 32% At Risk (PFAS + Water Stress flags, 1 unscored), EcoVadis supplier = no composite.
- **Views** (`src/views/`): Intake (identity + EcoVadis gate + conditional link), AssessmentForm (all six sections, per-type controls, conditional questions, maturity selectors, live unscored count), Scorecard (composite/band/flags/section bars/per-question breakdown with rationale + scoring key), Leaderboard (ranked scored suppliers + separate EcoVadis group, refresh warning).
- **Exports** (`src/lib/export.js`): client-side PDF (branded single-supplier scorecard with per-question breakdown, ESRS refs, rationale, scoring key, confidentiality footer) and CSV (leaderboard with composite/band/six sections/flag columns; EcoVadis rows marked, blank scores). PDF embeds the real brand fonts (Playfair Display, DM Sans, JetBrains Mono).
- **Fonts:** self-hosted via `@fontsource` (no CDN at runtime — verified zero Google-font requests). Subsetted TTFs embedded in the PDF (`src/lib/pdfFonts.js`, base64, regenerable from `@fontsource` woff2 with fonttools).
- **Sample data:** three suppliers preloaded (Nordic Precision = EcoVadis-Verified, Meridian = Leading, Coastal Polymer = At Risk + PFAS/Water Stress flags + one unscored question).
- First Session Setup done: spec in `docs/`, brand skill in `.claude/skills/the-corporate-brand/SKILL.md`.

## Last session
Session 1: ran First Session Setup, then built the whole tool — scoring engine, four views, both exports, sample data, brand styling. Self-hosted the web fonts and embedded the brand fonts in the PDF. Verified every view and all three PDFs + the CSV in a headless browser (rendered a PDF to confirm the brand fonts display). Builder connected the repo to Netlify — live at supplier-scorecard.netlify.app. Fixed a mobile header overflow found during the responsive check (clean 320px→desktop); builder confirmed the live site looks good on a real phone. MVP complete.

## Remaining work
- [x] Deployed to Netlify (builder connected the repo); live at the URL above, auto-deploys from `main`.
- [x] Acceptance criteria 1–18 all verified. 16 confirmed live on a real phone by the builder (8 July); the rest verified on the production build in a headless browser.
- [ ] Optional refinements deferred (none blocking): confirm final maturity-anchor wording; adjust sample-supplier values if different demo numbers are wanted; optionally lazy-load the export module to shrink the initial bundle.

MVP is complete and live. Nothing outstanding is required — the items above are optional polish for a future session.
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
- Built on branch `claude/supplier-sustainability-scorecard-syd0vn`, not `main` — the session's git policy requires it. Deploy needs a merge to `main` (Netlify auto-deploys from `main`).
- No shadcn/ui: the brand (square corners, hairline borders, no shadows, specific type scale) is a thin custom layer over Tailwind. Simpler and gives exact brand control. Global `border-radius: 0` + Tailwind `borderRadius`/`boxShadow` core plugins disabled.
- View routing is in-memory React state (intake/form/scorecard/leaderboard), no react-router — keeps deps minimal and suits session-only state.
- PDF via jsPDF + jspdf-autotable, CSV via Blob — both fully client-side, no keys.
- Acid Lime used once per page: the band pill (lime text on black, top band only); flags use hairline Ink tags, not colour.
- Answer shapes: dropdown/flag = 'yes'|'no'|''; quant = {value, detail}; open = {text, level|null, note}. Unassigned open level → treated as 0 and marked "unscored".

## Known issues
- Main JS bundle is ~840 kB (jsPDF + html2canvas + embedded PDF fonts). Acceptable for an internal tool; could lazy-load the export module later. Fonts are subsetted (Latin + PDF symbols) so the PDF-font module is ~180 kB.
- jsPDF (browser build) rejects TrueType fonts unless the cmap is pruned to the Windows (3,1) format-4 subtable and saved as raw TTF (not woff2) — the font-gen script does both. Note this if regenerating `pdfFonts.js`.

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
