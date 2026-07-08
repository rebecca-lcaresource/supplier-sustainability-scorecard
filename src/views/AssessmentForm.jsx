import { useSuppliers } from '../context/SuppliersContext.jsx'
import { SECTIONS, MATURITY_ANCHORS } from '../lib/config.js'
import { QUESTIONS_BY_SECTION, isQuestionActive } from '../lib/questions.js'
import { countUnscored } from '../lib/scoring.js'

function QuestionShell({ q, children }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '0.5px solid var(--tc-border)' }}>
      <div className="flex items-baseline" style={{ gap: 10, marginBottom: 10 }}>
        <span className="tc-mono" style={{ fontSize: 12, color: 'var(--tc-stone)' }}>
          {q.esrs}
        </span>
        <span style={{ fontSize: 15, fontWeight: 400 }}>{q.text}</span>
      </div>
      {children}
    </div>
  )
}

function MaturitySelector({ value, onChange }) {
  const level = value?.level
  return (
    <div>
      <div className="tc-label" style={{ marginBottom: 6 }}>
        Supplier answer
      </div>
      <textarea
        className="tc-input"
        rows={2}
        value={value?.text || ''}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="Paste the supplier's answer…"
        style={{ marginBottom: 12, resize: 'vertical' }}
      />
      <div className="tc-label" style={{ marginBottom: 6 }}>
        Maturity level (reviewer-assigned)
      </div>
      <div className="flex" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {MATURITY_ANCHORS.map((a) => {
          const active = level === a.level
          return (
            <button
              key={a.level}
              onClick={() => onChange({ ...value, level: active ? null : a.level })}
              style={{
                width: 40,
                height: 40,
                border: active ? '0.5px solid var(--tc-ink)' : '0.5px solid var(--tc-stone)',
                background: active ? 'var(--tc-ink)' : 'var(--tc-white)',
                color: active ? 'var(--tc-chalk)' : 'var(--tc-ink)',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 15,
                cursor: 'pointer',
              }}
              aria-pressed={active}
            >
              {a.level}
            </button>
          )
        })}
      </div>
      <div style={{ fontSize: 13, color: level == null ? 'var(--tc-stone)' : 'var(--tc-ink)', minHeight: 20 }}>
        {level == null
          ? 'No level assigned — this question is currently unscored (treated as 0).'
          : `Level ${level} — ${MATURITY_ANCHORS.find((a) => a.level === level).text}`}
      </div>
      <input
        className="tc-input"
        value={value?.note || ''}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
        placeholder="Optional reviewer note (added to the rationale)"
        style={{ marginTop: 10 }}
      />
    </div>
  )
}

function QuestionControl({ q, value, onChange }) {
  if (q.type === 'quant') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: q.requiresDetail ? '1fr 1fr' : '1fr', gap: 16 }}>
        <label>
          <span className="tc-label" style={{ display: 'block', marginBottom: 6 }}>
            {q.valueLabel}
          </span>
          <input
            className="tc-input"
            value={value?.value || ''}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
            placeholder="Value"
          />
        </label>
        {q.requiresDetail && (
          <label>
            <span className="tc-label" style={{ display: 'block', marginBottom: 6 }}>
              {q.detailLabel} (required for full disclosure)
            </span>
            <input
              className="tc-input"
              value={value?.detail || ''}
              onChange={(e) => onChange({ ...value, detail: e.target.value })}
              placeholder="Supporting detail"
            />
          </label>
        )}
      </div>
    )
  }

  if (q.type === 'dropdown') {
    return (
      <select
        className="tc-input"
        style={{ maxWidth: 220 }}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    )
  }

  if (q.type === 'flag') {
    return (
      <div>
        <select
          className="tc-input"
          style={{ maxWidth: 220 }}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <div style={{ fontSize: 12, color: 'var(--tc-stone)', marginTop: 6 }}>
          Risk flag — not scored. “Yes” raises the {q.flag} flag; it never changes the composite.
        </div>
      </div>
    )
  }

  // open
  return <MaturitySelector value={value} onChange={onChange} />
}

export default function AssessmentForm() {
  const { draft, updateDraftAnswer, commitDraft, goToScorecard } = useSuppliers()
  if (!draft) return null

  const unscored = countUnscored(draft)

  const handleFinish = () => {
    const id = commitDraft()
    goToScorecard(id)
  }

  return (
    <div>
      <h1 className="tc-h1" style={{ marginBottom: 8 }}>
        Assessment
      </h1>
      <p className="tc-body" style={{ maxWidth: 640, marginBottom: 8, color: 'var(--tc-ink)' }}>
        {draft.legalName || 'New supplier'} — score the six sections against the
        2026 rubric. Conditional questions appear only when their trigger applies.
      </p>

      {SECTIONS.map((sec) => {
        const questions = QUESTIONS_BY_SECTION[sec.key]
        return (
          <section key={sec.key} className="tc-card-elevated" style={{ marginBottom: 24 }}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: 4 }}>
              <div className="tc-h3">
                {sec.short} · {sec.label}
              </div>
            </div>
            {questions.map((q) => {
              const active = isQuestionActive(q, draft.answers)
              if (!active) {
                return (
                  <QuestionShell key={q.id} q={q}>
                    <div style={{ fontSize: 13, color: 'var(--tc-stone)' }}>
                      N/A — shown only when its trigger is “Yes”. Excluded from the
                      section average (not scored 0).
                    </div>
                  </QuestionShell>
                )
              }
              return (
                <QuestionShell key={q.id} q={q}>
                  <QuestionControl
                    q={q}
                    value={draft.answers[q.id]}
                    onChange={(v) => updateDraftAnswer(q.id, v)}
                  />
                </QuestionShell>
              )
            })}
          </section>
        )
      })}

      <div
        className="tc-card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
      >
        <div>
          <div className="tc-label" style={{ marginBottom: 2 }}>
            Before you finish
          </div>
          <div style={{ fontSize: 15 }}>
            {unscored === 0 ? (
              'All open-ended questions have a maturity level.'
            ) : (
              <>
                <strong style={{ fontWeight: 500 }}>{unscored}</strong>{' '}
                {unscored === 1 ? 'question is' : 'questions are'} unscored — they
                will be treated as 0 and marked on the scorecard.
              </>
            )}
          </div>
        </div>
        <button className="tc-btn-primary" onClick={handleFinish}>
          Compute scorecard
        </button>
      </div>
    </div>
  )
}
