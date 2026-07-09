---
name: add-assessment-question
description: >
  How to add, change, or remove a question in the Supplier Sustainability
  Scorecard assessment rubric while keeping scoring consistent. Use whenever the
  task involves the six-section question map, a new or edited ESRS question, a
  dropdown / quantitative / open-ended / risk-flag question, section or composite
  scoring, conditional (N/A) questions, or editing src/lib/questions.js. Read this
  before touching the rubric so section averages, flags, weights, and the exports
  stay correct.
---

# Adding an assessment question — keep scoring consistent

## The one thing to understand first

The scoring engine is **data-driven**. Every view and calculation iterates the
`QUESTIONS` array in `src/lib/questions.js`:

- `src/lib/scoring.js` scores each question by its `type`.
- `src/views/AssessmentForm.jsx` renders the right control by `type`.
- `src/views/Scorecard.jsx` + `src/components/QuestionBreakdown.jsx` show it.
- `src/lib/export.js` puts it in the PDF and (via section scores) the CSV.
- `src/context/SuppliersContext.jsx` seeds a blank answer for it.

**Consequence:** to add a question to an *existing* section using an *existing*
type, you edit **one file** — `src/lib/questions.js`. Do **not** add per-question
logic anywhere else; if you find yourself special-casing an `id` in `scoring.js`
or a view, stop — the design is that questions are pure data.

## Step 1 — add the question object to `QUESTIONS`

Append an object to the array, grouped under its section's comment block. Use a
unique `id` (convention: section letter + next number, e.g. the next Climate
question is `c7`). Fields depend on `type`:

| `type` | Required fields | Scores | Rationale source |
|--------|-----------------|--------|------------------|
| `dropdown` | `id, section, esrs, type, text, subject` | Yes=4 / No=0 | deterministic from `subject` |
| `quant` (no detail) | `…, requiresDetail: false, valueLabel` | value=4 / blank=0 | deterministic |
| `quant` (needs detail) | `…, requiresDetail: true, valueLabel, detailLabel` | value+detail=4 / value=2 / blank=0 | deterministic |
| `open` | `id, section, esrs, type, text` | reviewer 0–4 (unset → 0, marked "unscored") | selected maturity anchor text |
| `flag` | `…, flag, flagReason` | **not scored** | raises the named risk flag only |
| conditional `open` | add `conditionalOn: { questionId, value }` | scored 0–4 **only when active**; otherwise N/A | anchor text |

- `section` must be one of: `climate`, `pollution`, `water`, `circular`,
  `biodiversity`, `social` (see `SECTIONS` in `src/lib/config.js`).
- `esrs` is the ESRS reference string shown in the breakdown (e.g. `E1-4`).
- `subject` is only for `dropdown` — it fills the rationale
  ("No — no `<subject>` on record → 0"). Keep it a lowercase noun phrase.
- Open-ended questions share the global `MATURITY_ANCHORS` (config.js) — do not
  invent per-question anchors.

## Step 2 — respect the invariants (these are hard rules)

Breaking any of these silently corrupts scores:

1. **Risk flags are never scored.** Only PFAS, water stress, and protected-area
   proximity are `flag` type, and they never enter a section mean. Never make a
   scored question that also raises a flag, and never add a fourth flag without a
   spec change.
2. **Conditional questions are N/A, not zero.** A `conditionalOn` question is
   excluded from its section average when its trigger isn't met — it is never
   scored 0. The engine handles this via `isQuestionActive`; just set
   `conditionalOn` correctly (trigger `questionId` + the `value`, usually `'yes'`).
3. **Every section keeps at least one non-conditional scored question** so no
   section can be entirely N/A.
4. **Section weights must sum to 1.** Adding a question to an existing section
   does *not* change weights (a section % is the mean of its scored questions, so
   weights are untouched). Only adding/removing a **section** touches
   `SECTION_WEIGHTS`, and `validateWeights()` throws on load if they don't sum to 1.

## Step 3 — update the three sample suppliers

`src/lib/sampleData.js` has three preloaded suppliers. A new question they don't
answer will score **0** (dropdown/quant blank) or **unscored → 0** (open),
lowering that section's mean and the composite for the two scored samples. To keep
the demo realistic, add an answer for the new `id` to each scored sample
(the EcoVadis-Verified sample has `answers: {}` and is not scored — leave it):

- `dropdown`/`flag`: `'yes'` or `'no'`
- `quant`: `quant('value', 'detail')` (helper in the file)
- `open`: `open('answer text', level)` where level is 0–4

## Step 4 — verify

- `npm run build` must pass.
- Sanity-check scores against expectation, e.g.:
  ```
  node --input-type=module -e "import {scoreSupplier} from './src/lib/scoring.js'; import {freshSampleSuppliers} from './src/lib/sampleData.js'; for (const s of freshSampleSuppliers()) console.log(s.legalName, scoreSupplier(s).composite, (scoreSupplier(s).sections||[]).map(x=>x.short+':'+x.pct).join(' '))"
  ```
- Drive the app (see the `run` / `verify` skills): the new question should appear
  in the form with the right control, in the scorecard breakdown with a rationale,
  and in the PDF/CSV — all automatically.

## Adding a whole new section (the harder case)

1. Add it to `SECTIONS` (key, label, `S#` short) in `config.js`.
2. Add it to `SECTION_WEIGHTS` and **rebalance every weight so they still sum to
   1** — otherwise the app throws on load.
3. Add at least one non-conditional scored question for it (Step 1).
4. The leaderboard's `S#` columns and the section-bar rows pick it up
   automatically.

## Governance — this rubric is spec-owned

The question map is the fixed **Global Supplier Sustainability Assessment 2026**
rubric, defined in `docs/product-spec.md` Section 9 (spec v1.0). A genuine rubric
change is a spec change, not just a code change:

- If you are **implementing something already in Section 9**, no spec edit is
  needed.
- If you are **actually changing the rubric**, update the Section 9 question table,
  bump the spec version, and update the "Spec version governed" line in
  `CLAUDE.md` — then follow the Session Protocol (re-run the Project Governor).
  Do not quietly diverge the code from the spec.
