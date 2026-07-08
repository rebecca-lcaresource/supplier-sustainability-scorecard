# Product Spec — Supplier Sustainability Scorecard

**Version:** 1.0
**Date:** 8 July 2026
**Author:** Rebecca LeBlanc
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** Supplier Sustainability Scorecard

**What it does:** An internal evaluation tool that scores a supplier's completed Global Supplier Sustainability Assessment 2026 against a fixed rubric, assigns a composite score, performance band, and risk flags, and ranks scored suppliers on a leaderboard. Reviewers enter one supplier's answers at a time; each scored supplier accumulates on the leaderboard for the session.

**Who uses it:** Rebecca LeBlanc and The Corporate's procurement and EHS sustainability reviewers — internal evaluators assessing Tier 1 suppliers. Suppliers themselves never use this tool.

**Why it exists:** The Supplier Engagement Portal collects supplier assessment responses, but there is no consistent, defensible way to score and compare them. This tool turns free-form assessment answers into a repeatable, anchored, ESRS-referenced score so reviewers can rank suppliers on the same axes and justify each result rather than relying on gut feel.

**Build status:** First build — no prior version. It is a standalone companion to the existing Supplier Engagement Portal (supplier-engagement-portal.netlify.app) and reuses the portal's assessment content and The Corporate brand, but it is its own page, repo, and deployment.

---

## Section 2 — Classification

### Data Model

**Decision:** D2

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. | Yes |
| D3 — Persisted | Data is written to a database and survives after the session ends. | No |

**Reason:** Reviewers key supplier answers in during a session to produce and export a scorecard; nothing needs to survive after the tab closes for this MVP. A persistent supplier roster is explicitly deferred to Phase 2.

**D3 is triggered if any of the following are true:**
- [ ] Data must be retrievable after the session ends
- [ ] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [ ] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

None checked — D2 confirmed.

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. | No |
| A3 — Authorization | Users must log in and have different roles. | No |

**Reason:** An internal evaluation tool shared by link among a small, trusted reviewer group. No login for the MVP; nothing is stored, so there is no per-user data to protect behind auth.

> **Promotion rule:** Not triggered — A1, so the data model is not promoted to D3.

---

### If Access Model is A2 — complete both questions

N/A — this tool is A1.

### If Access Model is A3 — define all roles

N/A — this tool is A1.

---

### Tier

**Tier:** 1

D2 + A1 → Tier 1. Netlify only, no database.

---

### Standalone or Stack

**This tool is:** Standalone — it does not share a database with any other tool. It is a companion to the Supplier Engagement Portal but has no shared backend (neither tool has a database).

---

## Section 3 — Arms

### AI API Arm

**Active:** No

> AI-assisted scoring of open-ended answers is explicitly deferred to Phase 2 (Section 12). All scoring in the MVP is deterministic or reviewer-assigned.

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | Both — PDF (single-supplier scorecard) and CSV (leaderboard) |
| What is exported | **PDF:** one supplier's full scorecard — supplier identity, EcoVadis status, composite score and band, the six section scores, all risk flags, the per-question breakdown with ESRS references, a plain-language rationale for each score, and a scoring key so the recipient can see why each answer scored as it did. **CSV:** the leaderboard — one row per scored supplier with composite score, band, each of the six section scores, and flag columns; EcoVadis-Verified suppliers included with a status marker and blank section scores. |
| PDF design intent | Single-supplier scorecard, A4 portrait, The Corporate brand per `the-corporate-brand.skill`. Header: boxed "C" monogram + "THE CORPORATE" wordmark, supplier legal name and country, assessment year (2026), date generated. Body top: composite score (large), performance band, and any risk-flag pills (PFAS / Water Stress / Biodiversity-Sensitive Site). Middle: the six section scores as a labelled bar row (Climate, Pollution, Water, Circular Economy, Biodiversity, Social/Labour/Governance) with each section's percentage. Lower: a per-question table grouped by section — columns for ESRS ref, question, answer type, score (0–4 or N/A), and a short rationale for that score (the rule applied or the maturity level met). A compact scoring key appears once (what 0–4 mean and how each answer type is scored) so the scorecard is self-explanatory as supplier feedback. Footer: confidentiality line written for internal use, page number. Acid Lime used at most twice and only on black (e.g. the band label pill), per the brand accent rule. Generated **client-side** — no server. |

### Email Arm

**Active:** No

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind — multiple views (intake, form, scorecard, leaderboard), interactive scoring, accumulating session state, and client-side PDF/CSV generation make this an interactive tool. |
| Deployment target | Netlify |
| Netlify MCP | Not active — deployment done manually through the Netlify dashboard (drag-and-drop of the `dist` build folder, or GitHub-connected build with build command `npm run build` and publish directory `dist`). See Open Questions — switch to MCP if the connector is active at build time. |

**GitHub — pre-build requirement:** The builder creates the GitHub repo before the first Claude Code session and uploads `product-spec.md`, `CLAUDE.md`, `PROGRESS.md`, and `the-corporate-brand.skill` to the repo root. Claude Code assumes the repo exists and pushes to main.

### CONDITIONAL: Supabase project

N/A — Tier 1, no database.

### CONDITIONAL: Stack

N/A — standalone tool.

---

## Section 5 — Data Architecture

N/A — Data Model is D2, not D3. No database, no tables. All supplier data lives in React state for the session and clears on refresh.

---

## Section 6 — Access and Permissions

N/A — Access Model is A1. No authentication, no roles, no RLS policies.

---

## Section 7 — GDPR

**GDPR outcome:** Not applicable — this is not a D3 tool. The assessment includes supplier contact details (name, title, email), but these are entered by an internal reviewer, held only in browser session state, and never written to any database or transmitted to any server. Nothing persists after the tab closes; there is no stored record to consent to or delete. The PDF/CSV exports are generated client-side and saved by the reviewer to their own systems, which fall under The Corporate's existing internal data-handling practices.

> If Phase 2 introduces persistence (a stored supplier roster), this section must be reopened — persisted supplier contact data would trigger the full GDPR framework.

---

## Section 8 — Screen and UI Structure

### 1. Supplier Intake (Section S1)

- **Purpose:** Start a new supplier and route them by EcoVadis status.
- **What is visible:** Fields for legal name + registered country and primary contact (name, title, email). A single dropdown: "Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)?" (Yes / No). A conditional field for the EcoVadis scorecard link, shown only when Yes is selected. Continue button.
- **User actions:** Enter identity, answer the EcoVadis gate, optionally paste the scorecard link.
- **What happens next:** If **Yes** → the supplier is recorded as "EcoVadis-Verified," S2–S7 are skipped, and the reviewer lands on that supplier's scorecard (status only, no six-axis score). If **No** → proceed to the Assessment Form.

### 2. Assessment Form (Sections S2–S7)

- **Purpose:** Capture and score the supplier's answers across the six scored sections.
- **What is visible:** The six sections in order (Climate, Pollution & PFAS, Water, Circular Economy & Waste, Biodiversity, Social/Labour & Governance), each showing its ESRS reference. Per question, the control matches the answer type: dropdowns (Yes/No) for dropdown questions; a number field plus any required supporting-detail field for quantitative questions; for open-ended questions, a text area to paste the supplier's answer **and** a maturity-level selector (0–4) showing the anchor description for each level. Conditional open-ended questions (PFAS roadmap; drought contingency) are shown only when their trigger dropdown is Yes, and are otherwise marked N/A. A running indicator of how many questions remain unscored.
- **User actions:** Select dropdown answers, enter quantitative values and supporting detail, paste open-ended answers and assign each a maturity level.
- **What happens next:** On finish, the tool computes the scorecard and moves to the Supplier Scorecard view.

### 3. Supplier Scorecard (result)

- **Purpose:** Show the full, defensible result for one supplier.
- **What is visible:** Supplier identity and EcoVadis status; composite score and performance band; risk-flag pills (PFAS / Water Stress / Biodiversity-Sensitive Site) where triggered; the six section scores as labelled bars with percentages; a per-question breakdown grouped by section (ESRS ref, question, answer, score 0–4 or N/A, and a short rationale for each score, with unscored questions clearly marked); and a scoring key explaining what each score level means and how each answer type is scored. Buttons: Export PDF, Add another supplier, View leaderboard. For EcoVadis-Verified suppliers this view shows the verified status and scorecard link instead of section scores.
- **User actions:** Review the breakdown, export the PDF, add another supplier, or go to the leaderboard.
- **What happens next:** "Add another supplier" returns to Supplier Intake with the current supplier retained in session state.

### 4. Leaderboard

- **Purpose:** Rank and compare all suppliers scored this session.
- **What is visible:** Scored suppliers ranked by composite score (highest first), each row showing name, composite, band, the six section scores, and flag markers. EcoVadis-Verified suppliers shown as a separate group below (status marker, no numeric rank). Buttons: Export CSV, Add another supplier, open any supplier's scorecard.
- **User actions:** Read the ranking, open a supplier's scorecard, export the leaderboard CSV, or add another supplier.
- **What happens next:** Session-only — a page refresh clears all suppliers (stated plainly in the UI so reviewers export before leaving).

---

## Section 9 — Logic and Calculations

**What is calculated or scored:** A per-supplier composite sustainability score (0–100%) with a performance band, six section sub-scores, and independent risk flags, from that supplier's assessment answers.

**Inputs:** The supplier's answers to the Global Supplier Sustainability Assessment 2026 — Section S1 (identity + EcoVadis gate, not scored) and Sections S2–S7 (scored). Answer types: Dropdown, Quantitative, Open-Ended, plus two Conditional open-ended questions.

**Formula or rules:**

**Routing — EcoVadis bypass (S1 Q3):**
- If Yes → supplier status = "EcoVadis-Verified." Capture identity (S1 Q1–Q2) and scorecard link (S1 Q4). Do **not** compute a six-axis score. Excluded from the numeric ranking; shown as a separate leaderboard group.
- If No → score S2–S7 as below.

**Per-question score (0–4 scale):**

- **Dropdown (maturity):** Yes = 4, No = 0.
- **Quantitative (disclosure completeness):** where a supporting detail is required, value + supporting detail = 4, value only = 2, blank = 0; where no supporting detail is required, value present = 4, blank = 0.
- **Open-Ended (reviewer-assigned maturity):** 0 = not addressed / blank · 1 = acknowledged only, no substance · 2 = some activity described, no targets or evidence · 3 = clear programme with targets or measured progress · 4 = robust, evidenced, externally validated / best-in-class.

**Full question map:**

| Section (weight) | Q | ESRS | Type | Scoring |
|---|---|---|---|---|
| **S2 Climate** (1/6) | Scope 1 tCO₂e + verification | E1-4 | Quantitative | value+verification=4 / value=2 / blank=0 |
| | Scope 2 market-based tCO₂e | E1-4 | Quantitative | value=4 / blank=0 |
| | Scope 3 tCO₂e + categories | E1-4 | Quantitative | value+categories=4 / value=2 / blank=0 |
| | SBTi-validated target? | E1-3 | Dropdown | Yes=4 / No=0 |
| | Top-3 decarbonisation projects | E1-2 | Open | reviewer 0–4 |
| | Barriers to 50% cut by 2030 | E1-2 | Open | reviewer 0–4 |
| **S3 Pollution** (1/6) | SVHC / REACH weight kg | E2-3 | Quantitative | value=4 / blank=0 |
| | PFAS present? | E2-3 | Dropdown | **FLAG — not scored.** Yes → PFAS flag |
| | PFAS substitution roadmap | E2-3 | Open (conditional) | reviewer 0–4; **N/A if PFAS=No → excluded** |
| | Wastewater treatment | E2-2 | Open | reviewer 0–4 |
| **S4 Water** (1/6) | Water withdrawal m³ + source | E3-1 | Quantitative | value+source=4 / value=2 / blank=0 |
| | High-water-stress region? | E3-1 | Dropdown | **FLAG — not scored.** Yes → Water Stress flag |
| | Water-saving / intensity trend | E3-2 | Open | reviewer 0–4 |
| | Drought contingency | E3-2 | Open (conditional) | reviewer 0–4; **N/A if water-stress=No → excluded** |
| **S5 Circular Economy** (1/6) | Total waste + breakdown | E5-2 | Quantitative | value+breakdown=4 / value=2 / blank=0 |
| | PCR content % | E5-4 | Quantitative | value=4 / blank=0 |
| | Circularity in components | E5-3 | Open | reviewer 0–4 |
| | Zero-waste-to-landfill strategy | E5-2 | Open | reviewer 0–4 |
| **S6 Biodiversity** (1/6) | Site in/adjacent protected area? | E4-2 | Dropdown | **FLAG — not scored.** Yes → Biodiversity-Sensitive Site flag |
| | Biodiversity initiatives | E4-3 | Open | reviewer 0–4 |
| | Biodiversity impact assessment (TNFD)? | E4-5 | Open | reviewer 0–4 |
| **S7 Social/Labour/Gov** (1/6) | Human Rights & Labour policy (UNGP)? | S2-1 | Dropdown | Yes=4 / No=0 |
| | HR due diligence in last 24mo? | S2-2 | Dropdown | Yes=4 / No=0 |
| | Grievance mechanism + counts | S2-4 | Open | reviewer 0–4 |
| | Conflict-minerals policy (3TG, OECD)? | G1-1 | Dropdown | Yes=4 / No=0 |
| | Supplier code of conduct + audits | G1-2 | Open | reviewer 0–4 |

**Roll-up:**
- **Section score %** = (mean of that section's *scored* questions, 0–4) ÷ 4 × 100. N/A questions and the three flag dropdowns are excluded from the mean — never counted as zero.
- **Composite %** = weighted mean of the six section percentages. Default weight = 1/6 (16.67%) each, held in a single named config object at the top of the scoring module so weights can be changed in one place. Weights must sum to 1.

**Performance band (on composite %):** Leading ≥ 80 · Established 60–79 · Developing 40–59 · At Risk < 40. Thresholds held in the same config object.

**Risk flags (independent of the composite):** raised and shown on the scorecard and leaderboard row, never altering the score — PFAS (S3 PFAS = Yes) · Water Stress (S4 stress region = Yes) · Biodiversity-Sensitive Site (S6 protected-area = Yes).

**Score rationale (shown to explain every result):** each scored question produces a short plain-language rationale, so the scorecard explains itself as supplier feedback:
- **Dropdown:** the answer and its consequence — e.g. "No — no SBTi-validated target on record → 0" / "Yes → 4".
- **Quantitative:** the disclosure state — e.g. "Value provided, verification method missing → 2 (partial disclosure)" / "Value + breakdown provided → 4" / "Not disclosed → 0".
- **Open-ended:** the selected maturity level and its anchor text — e.g. "Level 2 — activity described, no targets or evidence", plus any note the reviewer adds.
- **Risk flags:** a one-line reason — e.g. "PFAS flag: supplier reported PFAS in products/processes (S3)".
Dropdown and quantitative rationales are generated deterministically from the answer; open-ended rationales are the chosen anchor text. The tool also shows a scoring key (what 0–4 mean; how each answer type scores). Rationale and key appear on the Supplier Scorecard view and in the exported PDF.

**Output:** Per supplier — composite % + band + six section %s + risk flags + per-question breakdown with per-score rationale. Across suppliers — a ranked leaderboard (scored suppliers) plus a separate EcoVadis-Verified group.

**Edge cases:**
- **EcoVadis-Verified:** no composite computed; status only; excluded from numeric ranking.
- **Conditional question N/A:** PFAS roadmap and drought contingency are excluded from their section mean when their trigger dropdown is No — not scored as zero.
- **Unscored open-ended:** if a reviewer finishes without assigning a level, the question is treated as 0 **and** clearly marked "unscored" on the breakdown; the form shows a running "N questions unscored" notice before finishing so this is deliberate, not accidental.
- **Blank quantitative:** scored 0 (disclosure absent).
- **A section with every scored question blank:** section = 0% (each section always has at least one non-conditional scored question, so no section can be fully N/A).
- **Weights not summing to 1:** the config is validated on load; the build must not ship weights that don't sum to 1.

---

## Section 10 — Brand and Visual Direction

**Brand reference:** Brand skill file — `the-corporate-brand.skill`, uploaded flat to the repo root; Claude Code installs it to `.claude/skills/` in the first session and reads it before writing any UI or copy.

**Visual feel:** Professional and corporate — corporate minimalism, restraint over decoration. Palette: Ink #000000, Stone #B6B09F, Linen #EAE4D5, Chalk #F2F2F2, White #FFFFFF. Acid Lime #C8F135 is an accent only, used at most twice per page and only on black (per the brand accent rules) — e.g. the performance-band pill and one key callout. Typography and logo lockup per the brand skill. Brand voice: precise, direct, composed, authoritative — no exclamatory or casual copy.

**Reference or inspiration:** The Supplier Engagement Portal (supplier-engagement-portal.netlify.app) for family resemblance, and the ESG deal screener (esgpl.netlify.app) for the rubric → weighted composite → band scoring pattern.

---

## Section 11 — API and Credentials

No external services. No database, no AI API, no email service. PDF and CSV exports are generated entirely client-side in the browser. **No API keys or credentials of any kind are required for this tool.**

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| None | — | — | — |

**Credentials readiness:** None — no credential is needed before or during the build.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Persistent storage / supplier league table across sessions | Would make this D3 (requires Supabase). Not needed to validate the MVP; the session-only leaderboard proves the scoring and ranking first. |
| Benchmark / threshold scoring of quantitative metrics (e.g. reward lower emissions intensity or higher PCR%) | Requires The Corporate to define sector thresholds that do not yet exist. MVP scores quantitative answers on disclosure completeness only. |
| AI-assisted scoring of open-ended answers (Claude proposes a maturity level) | Adds an AI API arm, per-run cost, and token-cap management. Deterministic + reviewer-assigned scoring is more defensible for the MVP. |
| Supplier-facing access — suppliers logging in to or operating the tool directly | MVP is an internal evaluation tool only. Sharing the exported PDF scorecard as feedback is in scope; giving suppliers direct access to the tool is not. |
| Live pull of responses from the Supplier Engagement Portal | The portal has no API or shared backend. Answers are keyed in by the reviewer for now. |
| Login, user accounts, per-role permissions | A1 for the MVP; no per-user data to protect. |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Supplier Intake loads with identity fields and the EcoVadis gate | All S1 fields render; scorecard-link field appears only when EcoVadis = Yes | [ ] |
| 2 | EcoVadis = Yes routing | Supplier marked "EcoVadis-Verified," S2–S7 skipped, scorecard shows status + link, no composite | [ ] |
| 3 | Assessment Form renders all six sections with correct controls | Every question from the map appears with the right control; conditional open-ended questions appear only when their trigger is Yes | [ ] |
| 4 | Dropdown scoring | Maturity dropdowns score Yes=4/No=0; the three risk dropdowns raise flags and are excluded from scoring | [ ] |
| 5 | Quantitative scoring | value+required detail=4, value only=2, blank=0; questions with no required detail score value=4/blank=0 | [ ] |
| 6 | Open-ended scoring | Reviewer level 0–4 applies; unassigned questions marked "unscored" and the finish notice counts them | [ ] |
| 7 | N/A exclusion | A No on a conditional trigger excludes its open-ended question from the section mean (not scored 0) | [ ] |
| 8 | Section and composite roll-up | Section % = mean/4×100 over scored questions; composite = equal-weighted mean of six sections; weights come from one config object and sum to 1 | [ ] |
| 9 | Performance band | Composite maps to Leading/Established/Developing/At Risk at 80/60/40 thresholds | [ ] |
| 10 | Risk flags | PFAS, Water Stress, and Biodiversity-Sensitive Site flags show on scorecard and leaderboard when triggered; they never change the composite | [ ] |
| 11 | Leaderboard ranking | Scored suppliers ranked by composite high→low; EcoVadis-Verified grouped separately with no numeric rank | [ ] |
| 12 | Add another supplier | Previous suppliers retained in session state; refresh clears all (message shown) | [ ] |
| 13 | PDF export | Single-supplier scorecard PDF generated client-side, branded per spec, with per-question breakdown, ESRS refs, per-score rationale, and scoring key | [ ] |
| 14 | CSV export | Leaderboard CSV with composite, band, six section scores, and flag columns; EcoVadis suppliers included with status marker | [ ] |
| 15 | Sample data | Three sample suppliers pre-loaded (one EcoVadis-Verified, one strong scorer, one with a PFAS flag) demonstrating scoring, ranking, flags, and both exports | [ ] |
| 16 | Deployment | Live URL loads correctly on desktop and mobile | [ ] |
| 17 | Brand fidelity | Palette, typography, logo, and the Acid Lime 2×/black-only rule all honour `the-corporate-brand.skill` | [ ] |
| 18 | Score rationale | Every scored question shows a plain-language rationale on the scorecard and in the PDF; a scoring key is visible; open-ended rationales use the selected anchor text | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 1

### Pre-build steps

- [ ] Tool Architect skill — interview complete, this spec written and confirmed
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md produced from this spec
- [ ] GitHub repo created by the builder
- [ ] product-spec.md uploaded to the repo root
- [ ] CLAUDE.md uploaded to the repo root
- [ ] PROGRESS.md uploaded to the repo root
- [ ] the-corporate-brand.skill uploaded to the repo root
- [ ] Netlify connected to the GitHub repo (skip if Netlify MCP is active)
- [ ] No credentials required — nothing to prepare

### Tier 1 — build session

- [ ] Open Claude Code in the project folder (GitHub repo connected to Netlify)
- [ ] Claude Code runs First Session Setup: creates docs/, moves reference files, installs the brand skill
- [ ] Claude Code reads product-spec.md, CLAUDE.md, and PROGRESS.md
- [ ] Claude Code builds the tool
- [ ] Test locally before deploying
- [ ] **If Netlify MCP active:** Claude Code deploys automatically
- [ ] **If Netlify MCP not active:** push to main → Netlify builds (`npm run build`, publish `dist`) and deploys

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Is Netlify MCP active at build time, or is deployment manual through the dashboard? | Builder | No — resolve at build; spec defaults to manual |
| Final wording of the 0–4 maturity-level anchor descriptions shown to reviewers on open-ended questions (starting text is in Section 9). | Builder / Claude Code | No — can refine during build; defaults provided |
| Exact content of the three sample suppliers (names, answer values, chosen levels) to best demonstrate scoring, ranking, and flags. | Builder / Claude Code | No — Claude Code can generate realistic sample data; builder adjusts |
| Confirm the default equal section weights (1/6 each) are the right starting point, or set custom weights before build. | Builder | No — equal weights default; editable in one config object |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 8 July 2026 | Initial build. Pre-build refinement (same day, not yet built): per-score rationale and scoring key added to the Supplier Scorecard view and the PDF export, so the exported scorecard is explainable as supplier feedback. No classification change. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
