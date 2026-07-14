# PROGRESS — Supplier Sustainability Scorecard

> Claude Code: read this file at the start of every session, before touching anything. Update it at every save point. Replace content — do not append. History lives in git.

**Session:** 2 — in progress
**Last updated:** 9 July 2026
**⚠️ DEPLOY STATE IS UNSETTLED — read before doing anything:**
- **GitHub Pages:** https://rebecca-lcaresource.github.io/supplier-sustainability-scorecard/ — the latest build WAS deployed here (workflow run #4 succeeded) and should still be serving it. BUT the `deploy-pages.yml` workflow was **removed on `main` by commit `c927a1c` ("Remove GitHub Pages workflow; deploy via Netlify only")** — not made by Claude. So there is **no longer any auto-deploy to Pages**; future pushes won't update this URL. (URL uses a lowercase "L": lcaresource.)
- **Netlify:** https://supplier-scorecard.netlify.app/ — deploys PAUSED (the "AI Resource" Free team is out of credits; support case open). Serving an old build.
- **Net result:** with the Pages workflow gone and Netlify frozen, there is currently **no working auto-deploy** for new changes. See Notes for next session — this needs a decision.

## Current state
Full MVP built and verified locally (build passes; driven end-to-end in a headless browser — intake, form, scorecard, leaderboard, PDF and CSV export all work).

- **Stack:** React + Vite + Tailwind (custom brand components, no shadcn — see decisions). Fonts self-hosted via `@fontsource` (no CDN at runtime). `netlify.toml` present (build `npm run build`, publish `dist`, SPA redirect).
- **Scoring engine** (`src/lib/`): `config.js` holds section weights (equal, 1/6, validated to sum to 1 on load) + band thresholds + maturity anchors; `questions.js` is the full six-section rubric; `scoring.js` computes per-question score 0–4, section %, weighted composite %, band, flags, unscored count. EcoVadis bypass, N/A conditional exclusion, and flag-not-scored rules all implemented. Verified: strong scorer = 92% Leading, PFAS supplier = 32% At Risk (PFAS + Water Stress flags, 1 unscored), EcoVadis supplier = no composite.
- **Views** (`src/views/`): Intake (identity + EcoVadis gate + conditional link), AssessmentForm (all six sections, per-type controls, conditional questions, maturity selectors, live unscored count), Scorecard (composite/band/flags/section bars/per-question breakdown with rationale + scoring key), Leaderboard (ranked scored suppliers + separate EcoVadis group, refresh warning).
- **Help panel** (`src/components/HelpPanel.jsx`): "Why & how to use this tool" — opened by an About button in the header, dismissible (right drawer desktop / full-width sheet mobile; closes via button, backdrop, or Escape). Covers why the tool exists (prioritise by ranking; other factors weighed separately; tie-breaker when multiple vendors supply one item), the add→assess→scorecard→export workflow, a one-line scoring explainer, and the session-only caveat. Kept consistent with the ScoringKey.
- **Exports** (`src/lib/export.js`): client-side PDF (branded single-supplier scorecard with per-question breakdown, ESRS refs, rationale, scoring key, confidentiality footer) and CSV (leaderboard with composite/band/six sections/flag columns; EcoVadis rows marked, blank scores). PDF embeds the real brand fonts (Playfair Display, DM Sans, JetBrains Mono).
- **Fonts:** self-hosted via `@fontsource` (no CDN at runtime — verified zero Google-font requests). Subsetted TTFs embedded in the PDF (`src/lib/pdfFonts.js`, base64, regenerable from `@fontsource` woff2 with fonttools).
- **Sample data:** three suppliers preloaded (Nordic Precision = EcoVadis-Verified, Meridian = Leading, Coastal Polymer = At Risk + PFAS/Water Stress flags + one unscored question).
- First Session Setup done: spec in `docs/`, brand skill in `.claude/skills/the-corporate-brand/SKILL.md`.
- **Deploy:** unsettled (see status header). GitHub Pages worked (run #4 deployed the latest build) but its workflow was removed on `main` by `c927a1c`; Netlify is frozen (out of credits). If GitHub Pages is wanted back, the removed `deploy-pages.yml` built with `--base=/supplier-sustainability-scorecard/` (project subpath) while the repo's default Vite base stays `/` for Netlify (root) — both can coexist; recover it from git history (it's at commit `9819c7b`).
- **Project skill** `add-assessment-question` (`.claude/skills/`): how to add/change a rubric question and keep scoring consistent.

## Last session
Session 2 (9 July): built the "Why & how to use" Help panel (header About button → dismissible drawer/sheet). Added a project skill `add-assessment-question` and demo-tested it live (added a Water question, scores shifted as predicted, then reverted). Netlify deploys froze (the "AI Resource" Free team ran out of credits; support case open), so set up **GitHub Pages** as a free alternative: added `deploy-pages.yml` (subpath base), builder enabled Pages, and the deploy went green (run #4) — the latest build reached the Pages URL. Afterwards an external commit on `main` (`c927a1c`, not by Claude) **removed the Pages workflow** ("deploy via Netlify only"). Left main as-is (did not revert someone else's change); corrected PROGRESS to reflect that neither host now auto-deploys and flagged the decision for next session.

Session 1: ran First Session Setup, then built the whole tool — scoring engine, four views, both exports, sample data, brand styling. Self-hosted the web fonts and embedded the brand fonts in the PDF. Verified every view and all three PDFs + the CSV in a headless browser. Builder connected the repo to Netlify (live). Fixed a mobile header overflow; builder confirmed the live site on a real phone. MVP complete.

## Remaining work
- [x] Deployed to Netlify (builder connected the repo); live at the URL above, auto-deploys from `main`.
- [x] Acceptance criteria 1–18 all verified. 16 confirmed live on a real phone by the builder (8 July); the rest verified on the production build in a headless browser.
- [ ] **DECIDE how to deploy (blocking for shipping new changes).** The Pages workflow was removed (`c927a1c`, "deploy via Netlify only") but Netlify is frozen — so nothing auto-deploys right now. Options: (a) wait for Netlify credits to reset / move the site to a team with credits, then let `main` auto-deploy; (b) restore `deploy-pages.yml` (recover from `9819c7b`) to keep the free GitHub Pages deploy; (c) another host. Confirm the builder's intent before acting.
- [ ] Optional refinements deferred (none blocking): confirm final maturity-anchor wording; adjust sample-supplier values if different demo numbers are wanted; optionally lazy-load the export module to shrink the initial bundle.

MVP code is complete (About panel, skill, all features on `main`). The remaining open item is purely the deploy pipeline, above.
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
- DEPLOY DECISION NEEDED. Someone removed the GitHub Pages workflow on `main` (`c927a1c`, "deploy via Netlify only"), but Netlify is still frozen (out of credits), so no host auto-deploys right now. The GitHub Pages URL still shows the last successful build. Ask the builder which path they want — wait for Netlify credits, restore the Pages workflow (recover `deploy-pages.yml` from commit `9819c7b`), or another host — before touching deploy config. Do not re-add the Pages workflow unilaterally; it was deliberately removed.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
