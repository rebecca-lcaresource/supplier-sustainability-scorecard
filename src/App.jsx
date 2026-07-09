import { useState } from 'react'
import { useSuppliers } from './context/SuppliersContext.jsx'
import Logo from './components/Logo.jsx'
import HelpPanel from './components/HelpPanel.jsx'
import Intake from './views/Intake.jsx'
import AssessmentForm from './views/AssessmentForm.jsx'
import Scorecard from './views/Scorecard.jsx'
import Leaderboard from './views/Leaderboard.jsx'

export default function App() {
  const { view, suppliers, goToLeaderboard, startNewSupplier } = useSuppliers()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--tc-chalk)' }}>
      <header
        style={{ borderBottom: '0.5px solid var(--tc-border-strong)', background: 'var(--tc-chalk)' }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-3 flex-wrap max-w-page px-4 py-4 sm:px-10"
        >
          <button
            onClick={goToLeaderboard}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Supplier Sustainability Scorecard — home"
          >
            <Logo />
          </button>
          <nav className="flex items-center justify-end gap-3 flex-wrap">
            <button
              className="tc-btn-secondary"
              onClick={() => setHelpOpen(true)}
              aria-haspopup="dialog"
            >
              About
            </button>
            <button className="tc-btn-secondary" onClick={goToLeaderboard}>
              Leaderboard
              {suppliers.length > 0 && (
                <span style={{ marginLeft: 8, color: 'var(--tc-stone)' }}>
                  {suppliers.length}
                </span>
              )}
            </button>
            <button className="tc-btn-primary" onClick={startNewSupplier}>
              Add supplier
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-page px-4 pt-10 pb-24 sm:px-10">
        <div className="tc-subhead" style={{ marginBottom: 6 }}>
          Supplier Sustainability Scorecard
        </div>
        {view === 'intake' && <Intake />}
        {view === 'form' && <AssessmentForm />}
        {view === 'scorecard' && <Scorecard />}
        {view === 'leaderboard' && <Leaderboard />}
      </div>

      <footer style={{ borderTop: '0.5px solid var(--tc-border)' }}>
        <div
          className="mx-auto tc-label max-w-page px-4 py-4 sm:px-10"
          style={{ color: 'var(--tc-stone)' }}
        >
          The Corporate · Internal use only · Global Supplier Sustainability Assessment 2026
        </div>
      </footer>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
