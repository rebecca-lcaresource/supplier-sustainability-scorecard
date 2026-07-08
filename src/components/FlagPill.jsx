// Risk-flag pill. Hairline-bordered tag in Ink — no colour fill (risk flags
// are informational and must never read as brand accent). Never affects score.
export default function FlagPill({ label }) {
  return (
    <span
      className="inline-flex items-center"
      style={{
        border: '0.5px solid var(--tc-ink)',
        padding: '4px 10px',
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--tc-ink)',
        background: 'var(--tc-white)',
      }}
    >
      {label}
    </span>
  )
}
