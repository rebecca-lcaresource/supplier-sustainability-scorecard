import { useMemo } from 'react'
import { useSuppliers } from '../context/SuppliersContext.jsx'
import { scoreSupplier } from '../lib/scoring.js'
import { exportSupplierPDF } from '../lib/export.js'
import BandPill from '../components/BandPill.jsx'
import FlagPill from '../components/FlagPill.jsx'
import SectionBars from '../components/SectionBars.jsx'
import QuestionBreakdown from '../components/QuestionBreakdown.jsx'
import ScoringKey from '../components/ScoringKey.jsx'

export default function Scorecard() {
  const { currentSupplier, startNewSupplier, goToLeaderboard } = useSuppliers()
  const result = useMemo(
    () => (currentSupplier ? scoreSupplier(currentSupplier) : null),
    [currentSupplier],
  )

  if (!currentSupplier || !result) {
    return (
      <div className="tc-card-elevated">
        <p className="tc-body">No supplier selected.</p>
        <button className="tc-btn-primary" onClick={startNewSupplier}>
          Add a supplier
        </button>
      </div>
    )
  }

  const s = currentSupplier

  return (
    <div>
      <div className="flex items-start justify-between" style={{ gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <h1 className="tc-h1" style={{ marginBottom: 6 }}>
            {s.legalName}
          </h1>
          <div className="tc-body" style={{ color: 'var(--tc-stone)' }}>
            {s.country}
            {s.contactName ? ` · ${s.contactName}` : ''}
            {s.contactTitle ? `, ${s.contactTitle}` : ''}
            {s.contactEmail ? ` · ${s.contactEmail}` : ''}
          </div>
        </div>
        <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button className="tc-btn-secondary" onClick={() => exportSupplierPDF(s)}>
            Export PDF
          </button>
          <button className="tc-btn-secondary" onClick={startNewSupplier}>
            Add another supplier
          </button>
          <button className="tc-btn-primary" onClick={goToLeaderboard}>
            View leaderboard
          </button>
        </div>
      </div>

      <p className="tc-label" style={{ color: 'var(--tc-ink)', marginBottom: 28 }}>
        Session only — a refresh clears every supplier. Export before you leave.
      </p>

      {result.ecovadisVerified ? (
        <div className="tc-card" style={{ marginBottom: 32 }}>
          <div className="tc-h3" style={{ marginBottom: 12 }}>
            EcoVadis-Verified
          </div>
          <p className="tc-body" style={{ maxWidth: 640 }}>
            This supplier holds a valid EcoVadis Sustainability Scorecard. Sections
            S2–S7 are not scored and no composite is computed. Shown as a separate
            group on the leaderboard, not numerically ranked.
          </p>
          {s.ecovadisLink && (
            <p style={{ marginTop: 12 }}>
              <a href={s.ecovadisLink} target="_blank" rel="noreferrer">
                {s.ecovadisLink}
              </a>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="tc-card-elevated" style={{ marginBottom: 24 }}>
            <div
              className="flex items-end"
              style={{ gap: 28, flexWrap: 'wrap', marginBottom: 24 }}
            >
              <div>
                <div className="tc-label" style={{ marginBottom: 2 }}>
                  Composite score
                </div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 68, lineHeight: 1 }}>
                  {result.composite}%
                </div>
              </div>
              <div style={{ paddingBottom: 12 }}>
                <BandPill band={result.band} size="lg" />
              </div>
              <div style={{ paddingBottom: 10, flex: 1 }}>
                <div className="tc-label" style={{ marginBottom: 6 }}>
                  Risk flags
                </div>
                {result.flags.length ? (
                  <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                    {result.flags.map((f) => (
                      <FlagPill key={f.name} label={f.name} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--tc-stone)' }}>None</span>
                )}
              </div>
            </div>
            <hr className="tc-divider" style={{ margin: '4px 0 24px' }} />
            <div className="tc-label" style={{ marginBottom: 16 }}>
              Section scores
            </div>
            <SectionBars sections={result.sections} />
          </div>

          {result.unscoredCount > 0 && (
            <p style={{ fontSize: 13, color: 'var(--tc-ink)', marginBottom: 20 }}>
              {result.unscoredCount}{' '}
              {result.unscoredCount === 1 ? 'question was' : 'questions were'} left
              unscored and treated as 0 (marked in the breakdown).
            </p>
          )}

          <div className="tc-h2" style={{ marginBottom: 20 }}>
            Per-question breakdown
          </div>
          <div className="tc-card-elevated" style={{ marginBottom: 32 }}>
            <QuestionBreakdown result={result} />
          </div>

          <ScoringKey />
        </>
      )}
    </div>
  )
}
