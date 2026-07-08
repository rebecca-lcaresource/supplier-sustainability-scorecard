// The Corporate primary mark: boxed "C" monogram + spaced wordmark.
export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center bg-ink"
        style={{ width: 36, height: 36 }}
        aria-hidden="true"
      >
        <span
          className="text-chalk"
          style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 20 }}
        >
          C
        </span>
      </div>
      {!compact && (
        <span
          className="text-ink"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 300,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: 15,
          }}
        >
          The Corporate
        </span>
      )}
    </div>
  )
}
