# PROGRESS — Supplier Sustainability Scorecard

> Claude Code: read this file at the start of every session, before touching anything. Update it at every save point. Replace content — do not append. History lives in git.

**Session:** 0 — build not started
**Last updated:** 8 July 2026 — by Project Governor, pre-build
**Live URL:** none yet [Rule: fill in after the first successful deploy]

## Current state
Nothing built. Repo contains CLAUDE.md, PROGRESS.md, product-spec.md, the-corporate-brand.skill (brand skill — installed in session 1).
[Rule: this section describes what exists and works right now — never what is planned. Completed checklist items get absorbed here in compressed form.]

## Last session
None — the first build session has not happened yet.
[Rule: 3–5 lines maximum. Replace each session — what was built, changed, or fixed.]

## Remaining work
- [ ] First Session Setup: create docs/, move product-spec.md in, install the the-corporate-brand brand skill, commit (see CLAUDE.md Session Protocol)
- [ ] Build the scoring engine + rubric config: the six-section question map, 0–4 per-question scoring by answer type, N/A exclusion, section and weighted-composite roll-up, bands, and per-score rationale (spec Section 9) — weights and thresholds in one config object
- [ ] Build Supplier Intake (S1) — identity fields + EcoVadis gate; Yes routes to EcoVadis-Verified, No proceeds to the form
- [ ] Build Assessment Form (S2–S7) — per-type controls, conditional questions, open-ended anchor selectors, running unscored count
- [ ] Build Supplier Scorecard — composite, band, section bars, flags, per-question breakdown with rationale and scoring key
- [ ] Build Leaderboard — scored suppliers ranked by composite; EcoVadis-Verified grouped separately; refresh-clears warning
- [ ] Wire Export: client-side PDF (single-supplier scorecard) and CSV (leaderboard)
- [ ] Add three sample suppliers (one EcoVadis-Verified, one strong scorer, one PFAS-flagged) for demo with no real data
- [ ] Local test pass — full walkthrough of every view before deploying
- [ ] Acceptance criteria pass — verify every criterion in spec Section "Acceptance Criteria" (18 items) before deploy
- [ ] Deploy to Netlify — auto-deploys on push to main (no environment variables required)
[Rule: completed items leave this list and are absorbed into Current state. This list only shrinks.]

## Build decisions
None yet.
[Rule: one line per decision made during the build that is not in the spec — field formats, naming choices, library picks. Future sessions depend on these to stay consistent.]

## Known issues
- Netlify MCP assumed not active — deployment is via GitHub auto-deploy. If MCP is active at build time, deploy via MCP instead. [confirm at build]
- Open-ended maturity-level anchor wording is provisional (starting text in spec Section 9) — confirm final wording before first deployment.
- Section weights start equal (1/6 each); confirm or set custom weights before first deployment. [refinable]
[Rule: bugs, edge cases, and deferred fixes. One line each. Remove when resolved.]

## Notes for next session
None.
[Rule: the builder writes here between sessions. Claude Code reads these aloud at session start, acts on them, then clears this section.]
