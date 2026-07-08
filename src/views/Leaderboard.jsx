import { useMemo } from 'react'
import { useSuppliers } from '../context/SuppliersContext.jsx'
import { scoreSupplier } from '../lib/scoring.js'
import { exportLeaderboardCSV } from '../lib/export.js'
import { SECTIONS } from '../lib/config.js'
import BandPill from '../components/BandPill.jsx'

const th = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--tc-stone)',
  padding: '10px 10px',
  textAlign: 'left',
  borderBottom: '0.5px solid var(--tc-stone)',
  whiteSpace: 'nowrap',
}
const td = {
  padding: '12px 10px',
  borderBottom: '0.5px solid var(--tc-border)',
  fontSize: 14,
  verticalAlign: 'middle',
}

export default function Leaderboard() {
  const { suppliers, startNewSupplier, goToScorecard } = useSuppliers()

  const { scored, verified } = useMemo(() => {
    const scored = []
    const verified = []
    for (const s of suppliers) {
      const r = scoreSupplier(s)
      ;(r.ecovadisVerified ? verified : scored).push({ s, r })
    }
    scored.sort((a, b) => b.r.composite - a.r.composite)
    return { scored, verified }
  }, [suppliers])

  const empty = suppliers.length === 0

  return (
    <div>
      <div className="flex items-start justify-between" style={{ gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <h1 className="tc-h1" style={{ marginBottom: 6 }}>
            Leaderboard
          </h1>
          <p className="tc-body" style={{ color: 'var(--tc-stone)', maxWidth: 560 }}>
            Suppliers scored this session, ranked by composite. EcoVadis-Verified
            suppliers are grouped separately and not numerically ranked.
          </p>
        </div>
        <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button
            className="tc-btn-secondary"
            onClick={() => exportLeaderboardCSV(suppliers)}
            disabled={empty}
          >
            Export CSV
          </button>
          <button className="tc-btn-primary" onClick={startNewSupplier}>
            Add supplier
          </button>
        </div>
      </div>

      <p className="tc-label" style={{ color: 'var(--tc-ink)', marginBottom: 28 }}>
        Session only — a refresh clears every supplier. Export before you leave.
      </p>

      {empty ? (
        <div className="tc-card-elevated">
          <p className="tc-body">
            No suppliers yet. Add one to score it against the 2026 rubric.
          </p>
          <button className="tc-btn-primary" onClick={startNewSupplier}>
            Add supplier
          </button>
        </div>
      ) : (
        <>
          <div className="tc-card-elevated" style={{ marginBottom: 24, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: 40 }}>#</th>
                  <th style={th}>Supplier</th>
                  <th style={{ ...th, textAlign: 'right' }}>Composite</th>
                  <th style={th}>Band</th>
                  {SECTIONS.map((s) => (
                    <th key={s.key} style={{ ...th, textAlign: 'right' }} title={s.label}>
                      {s.short}
                    </th>
                  ))}
                  <th style={th}>Flags</th>
                </tr>
              </thead>
              <tbody>
                {scored.map(({ s, r }, i) => (
                  <tr key={s.id}>
                    <td style={{ ...td, fontFamily: '"JetBrains Mono", monospace' }}>{i + 1}</td>
                    <td style={td}>
                      <button
                        onClick={() => goToScorecard(s.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontSize: 14,
                          fontWeight: 400,
                          color: 'var(--tc-ink)',
                          textAlign: 'left',
                        }}
                      >
                        {s.legalName}
                      </button>
                      <div style={{ fontSize: 12, color: 'var(--tc-stone)' }}>{s.country}</div>
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: 16 }}>
                      {r.composite}%
                    </td>
                    <td style={td}>
                      <BandPill band={r.band} />
                    </td>
                    {SECTIONS.map((sec) => (
                      <td
                        key={sec.key}
                        style={{ ...td, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', color: 'var(--tc-stone)' }}
                      >
                        {r.sections.find((x) => x.key === sec.key).pct}
                      </td>
                    ))}
                    <td style={td}>
                      {r.flags.length ? (
                        <span style={{ fontSize: 12 }}>
                          {r.flags.map((f) => f.name).join(', ')}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--tc-stone)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {verified.length > 0 && (
            <div className="tc-card">
              <div className="tc-h3" style={{ marginBottom: 4 }}>
                EcoVadis-Verified
              </div>
              <p style={{ fontSize: 13, color: 'var(--tc-stone)', marginBottom: 16 }}>
                Not numerically ranked — verified by an external EcoVadis scorecard.
              </p>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
                <tbody>
                  {verified.map(({ s }) => (
                    <tr key={s.id}>
                      <td style={{ ...td, borderColor: 'var(--tc-border)' }}>
                        <button
                          onClick={() => goToScorecard(s.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: 14,
                            color: 'var(--tc-ink)',
                          }}
                        >
                          {s.legalName}
                        </button>
                      </td>
                      <td style={{ ...td, color: 'var(--tc-stone)' }}>{s.country}</td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            border: '0.5px solid var(--tc-ink)',
                            padding: '4px 10px',
                          }}
                        >
                          EcoVadis-Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
