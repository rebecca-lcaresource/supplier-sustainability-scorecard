# Supplier Sustainability Scorecard

## Identity
Internal tool that scores a supplier's Global Supplier Sustainability Assessment 2026 answers against a fixed rubric, assigns a composite score, band, and risk flags, and ranks scored suppliers on a session leaderboard. Used by The Corporate's procurement/EHS reviewers; shared by link, no login.
Tier: 1 — everything runs in the browser, no database, no login (D2+A1).
Spec version governed: v1.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone. Companion to the Supplier Engagement Portal but shares no backend with it.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line above, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If missing, recreate it with the structure below, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat it back to the builder, treat it as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. An ending session is a save point.

First Session Setup (session 1 only):
1. Create docs/ and move product-spec.md into it.
2. Install the brand skill: create .claude/skills/the-corporate-brand/ and place the provided brand file there as SKILL.md.
3. Announce what moved, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines), Remaining work (shrinking checklist), Build decisions, Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · shadcn/ui · Netlify
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is not active — the builder connects the repo and there are no environment variables to set (this tool needs none). Deployment is automatic on push to main.

## Arms
Export — browser only, no server function — PDF (single-supplier scorecard, branded per spec, with per-question breakdown, per-score rationale, and scoring key) and CSV (leaderboard).

## Hard Rules
- No backend, no database, no persistence. All supplier data lives in React state for the session only and clears on refresh. Never add localStorage, a database, or any server call — that would break the Tier 1 (D2) classification and must go back to the Tool Architect.
- No API keys or credentials. This tool needs none; PDF and CSV are generated entirely client-side. Never introduce a service that requires a key.
- Risk flags (PFAS, water stress, protected-area proximity) never change the composite score, and their three dropdowns are never scored as maturity. Violating this silently corrupts every score.

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (installed in First Session Setup). Invoke it for any UI or visual work.
Hard rules that hold even if the skill is not loaded:
- Background: Chalk #F2F2F2 page, Linen #EAE4D5 / White #FFFFFF surfaces — never Tailwind gray or white defaults; text is Ink #000000.
- Accent: Acid Lime #C8F135 only against #000000, max 2× per page — never on light surfaces, body text, nav, borders, or icons.
- Fonts: Playfair Display (display/headings), DM Sans (body + labels), JetBrains Mono (mono).
- Square corners: border-radius 0 throughout; no drop shadows; logo box solid black.

## Business Rules
- EcoVadis bypass: S1 Q3 = Yes → mark supplier "EcoVadis-Verified," skip S2–S7, no composite; show as a separate group on the leaderboard, not numerically ranked.
- Per-question score 0–4: maturity dropdowns Yes=4/No=0; quantitative by disclosure completeness (value + required detail=4, value only=2, blank=0; value=4/blank=0 where no supporting detail is required); open-ended reviewer-assigned 0–4 from the anchor descriptions.
- Conditional/N/A questions (PFAS roadmap; drought contingency, when their trigger dropdown is No) are excluded from the section average — never scored 0.
- Section % = mean of that section's scored questions ÷ 4 × 100. Composite % = weighted mean of the six sections; equal weights (1/6 each) by default. Weights and band thresholds live in one config object; weights must sum to 1.
- Bands on composite %: Leading ≥80 · Established 60–79 · Developing 40–59 · At Risk <40.
- Every scored question carries a plain-language rationale (dropdown/quantitative generated deterministically; open-ended = the selected anchor text). The Supplier Scorecard view and the exported PDF both show the rationale plus a scoring key.
- Session-only: a page refresh clears all suppliers — the UI must warn reviewers to export before leaving.
- Ship with three sample suppliers (one EcoVadis-Verified, one strong scorer, one PFAS-flagged) so scoring, ranking, flags, and both exports work with no real data.
- Full question map and exact scoring rules: docs/product-spec.md Section 9.

Out of scope — do not build:
- Persistent storage or a cross-session supplier league table (would make this D3)
- Benchmark/threshold scoring of quantitative metrics; AI-assisted scoring of open-ended answers
- Supplier-facing access — suppliers operating the tool directly (sharing the exported PDF as feedback is fine)
- Live pull of responses from the Supplier Engagement Portal; login, accounts, or per-role permissions

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full scoring logic (Section 9), UI sections, arm detail, acceptance criteria
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.
