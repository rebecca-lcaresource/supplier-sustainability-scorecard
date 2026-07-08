// Six section scores as a labelled bar row. Ink fill on a Chalk track,
// hairline border, square corners — no colour coding (brand restraint).
export default function SectionBars({ sections }) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((s) => (
        <div key={s.key} className="flex items-center gap-4">
          <div className="tc-label" style={{ width: 190, flexShrink: 0, color: 'var(--tc-ink)' }}>
            {s.label}
          </div>
          <div
            className="flex-1"
            style={{ height: 18, background: 'var(--tc-chalk)', border: '0.5px solid var(--tc-border)' }}
          >
            <div
              style={{ width: `${s.pct}%`, height: '100%', background: 'var(--tc-ink)' }}
            />
          </div>
          <div
            className="tc-mono"
            style={{ width: 52, textAlign: 'right', flexShrink: 0 }}
          >
            {s.pct}%
          </div>
        </div>
      ))}
    </div>
  )
}
