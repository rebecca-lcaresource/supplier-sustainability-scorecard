// Performance-band pill. Always a solid black container (brand Pattern A).
// Acid Lime text is reserved for the top band only, so lime stays meaningful
// and always sits on #000000 — one of the max-two lime uses per page.
export default function BandPill({ band, size = 'md' }) {
  if (!band) return null
  const isTop = band.name === 'Leading'
  const pad = size === 'lg' ? '8px 20px' : '5px 14px'
  const fs = size === 'lg' ? 15 : 11
  return (
    <span
      className="inline-block bg-ink"
      style={{ padding: pad }}
    >
      <span
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 500,
          fontSize: fs,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isTop ? 'var(--tc-lime)' : 'var(--tc-chalk)',
        }}
      >
        {band.name}
      </span>
    </span>
  )
}
