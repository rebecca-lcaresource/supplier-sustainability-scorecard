# Supplier Sustainability Scorecard

Internal tool for The Corporate's procurement / EHS reviewers. Scores a
supplier's Global Supplier Sustainability Assessment 2026 answers against a
fixed rubric, assigns a composite score, performance band, and risk flags, and
ranks scored suppliers on a session leaderboard.

Tier 1 — everything runs in the browser. No backend, no database, no login.
All supplier data lives in React state for the session and clears on refresh.

## Develop

```bash
npm install
npm run dev
npm run build
```

## Deployment

GitHub → Netlify, auto-deploys from `main` (`npm run build`, publish `dist`).
No environment variables or credentials are required.

## Layout

- `src/lib/config.js` — section weights and band thresholds (one config object)
- `src/lib/questions.js` — the fixed six-section question map (rubric)
- `src/lib/scoring.js` — deterministic scoring engine
- `src/lib/sampleData.js` — three sample suppliers
- `src/lib/export.js` — client-side PDF (scorecard) and CSV (leaderboard)
- `src/views/` — Intake, AssessmentForm, Scorecard, Leaderboard

See `docs/product-spec.md` (Section 9) for the full scoring logic and
`.claude/skills/the-corporate-brand/SKILL.md` for the brand system.
