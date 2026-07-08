import { useSuppliers } from '../context/SuppliersContext.jsx'

function Field({ label, children, hint }) {
  return (
    <label className="block mb-5">
      <span className="tc-label" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: 'var(--tc-stone)' }}>
          {hint}
        </span>
      )}
    </label>
  )
}

export default function Intake() {
  const { draft, updateDraft, commitDraft, goToForm, goToScorecard } = useSuppliers()

  if (!draft) return null

  const canContinue =
    draft.legalName.trim() && draft.country.trim() && draft.ecovadis !== ''

  const handleContinue = () => {
    if (!canContinue) return
    if (draft.ecovadis === 'yes') {
      const id = commitDraft()
      goToScorecard(id)
    } else {
      goToForm()
    }
  }

  return (
    <div>
      <h1 className="tc-h1" style={{ marginBottom: 8 }}>
        Supplier intake
      </h1>
      <p className="tc-body" style={{ maxWidth: 640, marginBottom: 32, color: 'var(--tc-ink)' }}>
        Start a new supplier and route by EcoVadis status. A valid EcoVadis
        scorecard bypasses sections S2–S7.
      </p>

      <div className="tc-card-elevated" style={{ maxWidth: 720 }}>
        <div className="tc-h3" style={{ marginBottom: 20 }}>
          Identity
        </div>

        <Field label="Registered legal name">
          <input
            className="tc-input"
            value={draft.legalName}
            onChange={(e) => updateDraft({ legalName: e.target.value })}
            placeholder="e.g. Meridian Advanced Materials GmbH"
          />
        </Field>

        <Field label="Registered country">
          <input
            className="tc-input"
            value={draft.country}
            onChange={(e) => updateDraft({ country: e.target.value })}
            placeholder="e.g. Germany"
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Primary contact — name">
            <input
              className="tc-input"
              value={draft.contactName}
              onChange={(e) => updateDraft({ contactName: e.target.value })}
            />
          </Field>
          <Field label="Contact — title">
            <input
              className="tc-input"
              value={draft.contactTitle}
              onChange={(e) => updateDraft({ contactTitle: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Contact — email">
          <input
            className="tc-input"
            type="email"
            value={draft.contactEmail}
            onChange={(e) => updateDraft({ contactEmail: e.target.value })}
          />
        </Field>

        <hr className="tc-divider" style={{ margin: '8px 0 24px' }} />

        <div className="tc-h3" style={{ marginBottom: 20 }}>
          EcoVadis gate
        </div>

        <Field
          label="Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)?"
        >
          <select
            className="tc-input"
            value={draft.ecovadis}
            onChange={(e) => updateDraft({ ecovadis: e.target.value })}
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>

        {draft.ecovadis === 'yes' && (
          <Field
            label="EcoVadis scorecard link"
            hint="Optional — the supplier will be recorded as EcoVadis-Verified and S2–S7 skipped."
          >
            <input
              className="tc-input"
              value={draft.ecovadisLink}
              onChange={(e) => updateDraft({ ecovadisLink: e.target.value })}
              placeholder="https://…"
            />
          </Field>
        )}

        <div className="flex items-center" style={{ gap: 12, marginTop: 8 }}>
          <button
            className="tc-btn-primary"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {draft.ecovadis === 'yes' ? 'Record & view scorecard' : 'Continue to assessment'}
          </button>
          {!canContinue && (
            <span style={{ fontSize: 12, color: 'var(--tc-stone)' }}>
              Legal name, country, and the EcoVadis answer are required.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
