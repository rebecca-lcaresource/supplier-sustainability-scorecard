import { SECTIONS } from '../lib/config.js'
import { QUESTIONS_BY_SECTION } from '../lib/questions.js'

function scoreCell(r) {
  if (!r) return '—'
  if (r.type === 'flag') return r.flag ? 'FLAG' : '—'
  if (r.na) return 'N/A'
  if (r.unscored) return '0*'
  return String(r.score)
}

// Per-question breakdown grouped by section (ESRS ref, question, answer,
// score 0–4/N/A, rationale). Unscored open-ended questions are marked.
export default function QuestionBreakdown({ result }) {
  const anyUnscored = Object.values(result.questionResults).some((r) => r.unscored)
  return (
    <div>
      {SECTIONS.map((sec) => {
        const section = result.sections.find((s) => s.key === sec.key)
        const questions = QUESTIONS_BY_SECTION[sec.key]
        return (
          <div key={sec.key} className="mb-8">
            <div className="flex items-baseline justify-between mb-2">
              <div className="tc-h3">
                {sec.short} · {sec.label}
              </div>
              {section && (
                <div className="tc-mono" style={{ fontSize: 13 }}>
                  {section.pct}%
                </div>
              )}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table
                className="w-full"
                style={{ borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}
              >
                <thead>
                  <tr>
                    {['ESRS', 'Question', 'Answer', 'Score', 'Rationale'].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--tc-stone)',
                          padding: '8px 10px',
                          textAlign: i === 3 ? 'center' : 'left',
                          borderBottom: '0.5px solid var(--tc-stone)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => {
                    const r = result.questionResults[q.id]
                    return (
                      <tr key={q.id}>
                        <td style={cellStyle}>
                          <span className="tc-mono" style={{ fontSize: 12 }}>{q.esrs}</span>
                        </td>
                        <td style={cellStyle}>{q.text}</td>
                        <td style={{ ...cellStyle, color: 'var(--tc-stone)' }}>
                          {r?.answerLabel || '—'}
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <span className="tc-mono">{scoreCell(r)}</span>
                        </td>
                        <td style={{ ...cellStyle, fontWeight: 300 }}>{r?.rationale}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
      {anyUnscored && (
        <p className="tc-label" style={{ color: 'var(--tc-ink)' }}>
          * Unscored — no maturity level was assigned; the question was treated as 0.
        </p>
      )}
    </div>
  )
}

const cellStyle = {
  padding: '8px 10px',
  color: 'var(--tc-ink)',
  fontWeight: 300,
  borderBottom: '0.5px solid var(--tc-border)',
  verticalAlign: 'top',
}
