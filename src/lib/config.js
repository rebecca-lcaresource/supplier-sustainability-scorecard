// Scoring configuration — single source of truth for section weights and band
// thresholds (product-spec.md Section 9). Change weights or bands here only.

export const SECTIONS = [
  { key: 'climate', label: 'Climate', short: 'S2' },
  { key: 'pollution', label: 'Pollution', short: 'S3' },
  { key: 'water', label: 'Water', short: 'S4' },
  { key: 'circular', label: 'Circular Economy', short: 'S5' },
  { key: 'biodiversity', label: 'Biodiversity', short: 'S6' },
  { key: 'social', label: 'Social / Labour / Governance', short: 'S7' },
]

// Equal weights by default (1/6 each). Weights MUST sum to 1.
export const SECTION_WEIGHTS = {
  climate: 1 / 6,
  pollution: 1 / 6,
  water: 1 / 6,
  circular: 1 / 6,
  biodiversity: 1 / 6,
  social: 1 / 6,
}

// Performance bands on the composite %. Ordered high → low; first match wins.
export const BANDS = [
  { name: 'Leading', min: 80, tone: 'strong' },
  { name: 'Established', min: 60, tone: 'good' },
  { name: 'Developing', min: 40, tone: 'watch' },
  { name: 'At Risk', min: 0, tone: 'risk' },
]

// Maturity anchors for reviewer-assigned open-ended scoring (0–4).
export const MATURITY_ANCHORS = [
  { level: 0, text: 'Not addressed / blank' },
  { level: 1, text: 'Acknowledged only, no substance' },
  { level: 2, text: 'Some activity described, no targets or evidence' },
  { level: 3, text: 'Clear programme with targets or measured progress' },
  { level: 4, text: 'Robust, evidenced, externally validated / best-in-class' },
]

// Validate weights on load — the build must not ship weights that don't sum to 1.
export function validateWeights(weights = SECTION_WEIGHTS) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0)
  if (Math.abs(sum - 1) > 1e-6) {
    throw new Error(
      `Section weights must sum to 1 (got ${sum.toFixed(4)}). Fix SECTION_WEIGHTS in src/lib/config.js.`,
    )
  }
  return true
}

export function bandFor(compositePct) {
  return BANDS.find((b) => compositePct >= b.min) || BANDS[BANDS.length - 1]
}

// Fail fast at module load if the config is inconsistent.
validateWeights()
