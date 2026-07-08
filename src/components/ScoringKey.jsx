import { MATURITY_ANCHORS } from '../lib/config.js'

// Compact scoring key so the scorecard explains itself as supplier feedback.
export default function ScoringKey() {
  return (
    <div className="tc-card-elevated">
      <div className="tc-h3 mb-4">Scoring key</div>

      <div className="tc-label mb-2">Score scale (0–4)</div>
      <ul className="mb-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {MATURITY_ANCHORS.map((a) => (
          <li key={a.level} className="flex gap-3 py-1" style={{ fontSize: 14 }}>
            <span className="tc-mono" style={{ width: 16, flexShrink: 0 }}>{a.level}</span>
            <span>{a.text}</span>
          </li>
        ))}
      </ul>

      <div className="tc-label mb-2">How each answer type scores</div>
      <ul className="mb-5" style={{ paddingLeft: 18, margin: 0, fontSize: 14 }}>
        <li>Dropdown (maturity): Yes = 4, No = 0.</li>
        <li>Quantitative: value + required detail = 4, value only = 2, blank = 0; where no supporting detail is required, value = 4, blank = 0.</li>
        <li>Open-ended: reviewer-assigned 0–4 from the maturity anchors above.</li>
        <li>Risk dropdowns (PFAS, water stress, protected area) raise flags and are never scored.</li>
        <li>Conditional questions marked N/A are excluded from the section average — never scored 0.</li>
      </ul>

      <div className="tc-label mb-2">Performance bands (composite %)</div>
      <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14 }}>
        <li>Leading ≥ 80 · Established 60–79 · Developing 40–59 · At Risk &lt; 40</li>
      </ul>

      <div className="tc-label mb-2 mt-4">Roll-up</div>
      <p style={{ fontSize: 14, margin: 0 }}>
        Section % = mean of that section's scored questions ÷ 4 × 100. Composite %
        = weighted mean of the six sections (equal weight, 1/6 each). Risk flags
        never change the composite.
      </p>
    </div>
  )
}
