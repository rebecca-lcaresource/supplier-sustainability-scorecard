import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { freshSampleSuppliers } from '../lib/sampleData.js'
import { QUESTIONS } from '../lib/questions.js'

// Session-only state. Everything lives here for the session and clears on
// refresh — no localStorage, no server, no persistence (Tier 1 / D2).

const SuppliersContext = createContext(null)

let idSeq = 0
const newId = () => `supplier-${Date.now()}-${++idSeq}`

function blankDraft() {
  // Seed empty answer shapes so controlled inputs never flip uncontrolled.
  const answers = {}
  for (const q of QUESTIONS) {
    if (q.type === 'quant') answers[q.id] = { value: '', detail: '' }
    else if (q.type === 'open') answers[q.id] = { text: '', level: null, note: '' }
    else answers[q.id] = '' // dropdown / flag
  }
  return {
    id: newId(),
    legalName: '',
    country: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    ecovadis: '',
    ecovadisLink: '',
    answers,
  }
}

export function SuppliersProvider({ children }) {
  const [suppliers, setSuppliers] = useState(() => freshSampleSuppliers())
  const [view, setView] = useState('leaderboard') // intake | form | scorecard | leaderboard
  const [currentId, setCurrentId] = useState(null)
  const [draft, setDraft] = useState(null)

  const startNewSupplier = useCallback(() => {
    setDraft(blankDraft())
    setView('intake')
  }, [])

  const updateDraft = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...patch }))
  }, [])

  const updateDraftAnswer = useCallback((questionId, value) => {
    setDraft((d) => ({ ...d, answers: { ...d.answers, [questionId]: value } }))
  }, [])

  const commitDraft = useCallback(() => {
    let committedId = null
    setDraft((d) => {
      if (!d) return d
      committedId = d.id
      setSuppliers((list) => {
        const exists = list.some((s) => s.id === d.id)
        return exists
          ? list.map((s) => (s.id === d.id ? d : s))
          : [...list, d]
      })
      return d
    })
    if (committedId) setCurrentId(committedId)
    return committedId
  }, [])

  const goToScorecard = useCallback((id) => {
    setCurrentId(id)
    setView('scorecard')
  }, [])

  const goToLeaderboard = useCallback(() => setView('leaderboard'), [])
  const goToForm = useCallback(() => setView('form'), [])

  const currentSupplier = useMemo(
    () => suppliers.find((s) => s.id === currentId) || null,
    [suppliers, currentId],
  )

  const value = {
    suppliers,
    view,
    draft,
    currentSupplier,
    startNewSupplier,
    updateDraft,
    updateDraftAnswer,
    commitDraft,
    goToScorecard,
    goToLeaderboard,
    goToForm,
    setView,
  }

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliers() {
  const ctx = useContext(SuppliersContext)
  if (!ctx) throw new Error('useSuppliers must be used within SuppliersProvider')
  return ctx
}
