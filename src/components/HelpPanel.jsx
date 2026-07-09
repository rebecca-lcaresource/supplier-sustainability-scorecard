import { useEffect } from 'react'

// Dismissible "Why & how to use" panel. Right-side drawer on desktop, full-width
// sheet on mobile. Opened from the header Help button; keeps the Leaderboard
// uncluttered. On-brand: hairline borders, square corners, no shadow.

function Step({ n, title, children }) {
  return (
    <li className="flex" style={{ gap: 14, marginBottom: 16 }}>
      <span
        className="tc-mono"
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          border: '0.5px solid var(--tc-ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
        }}
        aria-hidden="true"
      >
        {n}
      </span>
      <span style={{ fontSize: 14 }}>
        <strong style={{ fontWeight: 500 }}>{title}.</strong> {children}
      </span>
    </li>
  )
}

export default function HelpPanel({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Why and how to use this tool"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-[480px]"
        style={{
          background: 'var(--tc-white)',
          borderLeft: '0.5px solid var(--tc-border-strong)',
          height: '100%',
          overflowY: 'auto',
          padding: '32px',
        }}
      >
        <div className="flex items-start justify-between" style={{ gap: 16, marginBottom: 8 }}>
          <div className="tc-subhead">Supplier Sustainability Scorecard</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="tc-btn-secondary"
            style={{ padding: '6px 12px', lineHeight: 1 }}
          >
            Close
          </button>
        </div>

        <h2 className="tc-h2" style={{ marginBottom: 20 }}>
          Why &amp; how to use this tool
        </h2>

        <div className="tc-label" style={{ color: 'var(--tc-ink)', marginBottom: 8 }}>
          Why it exists
        </div>
        <p className="tc-body" style={{ marginBottom: 12 }}>
          This tool turns Global Supplier Sustainability Assessment 2026 answers
          into a repeatable, anchored score, so reviewers can rank suppliers on the
          same axes and justify each result rather than relying on gut feel.
        </p>
        <p className="tc-body" style={{ marginBottom: 12 }}>
          Use the ranking to prioritise suppliers by sustainability performance.
          The ranking is one input, not the whole decision — weigh pricing,
          location, lead time, and other commercial factors separately. The
          scorecard is most useful as a consideration when several vendors supply
          the same item.
        </p>
        <p style={{ fontSize: 13, color: 'var(--tc-stone)', marginBottom: 28 }}>
          Pricing, location, and similar factors are out of scope for scoring
          today — a future consideration, not something this tool rates.
        </p>

        <div className="tc-label" style={{ color: 'var(--tc-ink)', marginBottom: 12 }}>
          How to use it
        </div>
        <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
          <Step n={1} title="Add a supplier">
            Enter the supplier's identity and answer the EcoVadis gate. A valid
            EcoVadis scorecard marks the supplier verified and skips sections
            S2–S7.
          </Step>
          <Step n={2} title="Complete the assessment">
            Answer the six sections; each control matches the question type.
            Conditional questions appear only when their trigger applies, and a
            running count shows how many open-ended questions are still unscored.
          </Step>
          <Step n={3} title="Review the scorecard">
            See the composite score, performance band, risk flags, section scores,
            and a per-question breakdown with a plain-language rationale for every
            score.
          </Step>
          <Step n={4} title="Export">
            Generate a branded PDF for one supplier or a CSV of the whole
            leaderboard. Both are produced in your browser.
          </Step>
        </ol>

        <div
          className="tc-card"
          style={{ background: 'var(--tc-linen)', marginBottom: 20 }}
        >
          <div className="tc-label" style={{ color: 'var(--tc-ink)', marginBottom: 8 }}>
            How scoring works
          </div>
          <p style={{ fontSize: 13, margin: 0 }}>
            Each question scores 0–4. A section is the mean of its scored questions
            (÷ 4 × 100); the composite is the equal-weighted mean of the six
            sections, mapped to a band — Leading ≥ 80 · Established 60–79 ·
            Developing 40–59 · At Risk &lt; 40. Risk flags (PFAS, water stress,
            protected-area proximity) are recorded independently and never change
            the score. Every scorecard shows the full scoring key.
          </p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--tc-ink)', margin: 0 }}>
          <strong style={{ fontWeight: 500 }}>Session only.</strong> Everything you
          enter lives in this browser tab and clears on refresh — export before you
          leave. Nothing is stored or sent to a server.
        </p>
      </div>
    </div>
  )
}
