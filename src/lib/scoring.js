// Deterministic scoring engine (product-spec.md Section 9).
//
// Answer shapes (keyed by question id in supplier.answers):
//   dropdown / flag : 'yes' | 'no' | ''
//   quant           : { value: string, detail: string }
//   open            : { text: string, level: number|null, note: string }

import {
  SECTIONS,
  SECTION_WEIGHTS,
  MATURITY_ANCHORS,
  bandFor,
} from './config.js'
import { QUESTIONS, isQuestionActive } from './questions.js'

const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== ''

// Score a single question against the supplier's answers.
// Returns a rich result used by both the UI and the exports.
export function scoreQuestion(q, answers) {
  const answer = answers?.[q.id]

  if (q.type === 'flag') {
    const raised = answer === 'yes'
    return {
      id: q.id,
      type: 'flag',
      counted: false,
      flag: raised ? q.flag : null,
      flagReason: raised ? q.flagReason : null,
      answerLabel: answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : '—',
      score: null,
      rationale: raised
        ? `${q.flag} flag raised — not scored`
        : 'No flag — not scored',
    }
  }

  const active = isQuestionActive(q, answers)
  if (!active) {
    return {
      id: q.id,
      type: q.type,
      counted: false,
      na: true,
      score: null,
      answerLabel: 'N/A',
      rationale: 'N/A — trigger condition not met; excluded from the section average',
    }
  }

  if (q.type === 'dropdown') {
    const yes = answer === 'yes'
    return {
      id: q.id,
      type: 'dropdown',
      counted: true,
      score: yes ? 4 : 0,
      answerLabel: yes ? 'Yes' : answer === 'no' ? 'No' : '—',
      rationale: yes
        ? `Yes — ${q.subject} in place → 4`
        : `No — no ${q.subject} on record → 0`,
    }
  }

  if (q.type === 'quant') {
    const value = answer?.value
    const detail = answer?.detail
    const hasVal = hasValue(value)
    const hasDet = hasValue(detail)
    let score
    let rationale
    if (q.requiresDetail) {
      if (hasVal && hasDet) {
        score = 4
        rationale = `Value + ${q.detailLabel.toLowerCase()} provided → 4 (full disclosure)`
      } else if (hasVal) {
        score = 2
        rationale = `Value provided, ${q.detailLabel.toLowerCase()} missing → 2 (partial disclosure)`
      } else {
        score = 0
        rationale = 'Not disclosed → 0'
      }
    } else {
      if (hasVal) {
        score = 4
        rationale = 'Value provided → 4'
      } else {
        score = 0
        rationale = 'Not disclosed → 0'
      }
    }
    return {
      id: q.id,
      type: 'quant',
      counted: true,
      score,
      answerLabel: hasVal
        ? [value, hasDet ? detail : null].filter(Boolean).join(' · ')
        : '—',
      rationale,
    }
  }

  // open-ended
  const level = answer?.level
  const assigned = level !== null && level !== undefined
  const anchor = MATURITY_ANCHORS.find((a) => a.level === (assigned ? level : 0))
  const note = answer?.note?.trim()
  return {
    id: q.id,
    type: 'open',
    counted: true,
    unscored: !assigned,
    score: assigned ? level : 0,
    answerLabel: answer?.text?.trim() ? answer.text.trim() : '—',
    rationale: assigned
      ? `Level ${level} — ${anchor.text}${note ? ` · Reviewer note: ${note}` : ''}`
      : 'Unscored — no maturity level assigned; treated as 0',
  }
}

// Score a whole supplier. EcoVadis-Verified suppliers get no composite.
export function scoreSupplier(supplier) {
  if (supplier.ecovadis === 'yes') {
    return {
      ecovadisVerified: true,
      composite: null,
      band: null,
      sections: [],
      flags: [],
      questionResults: {},
      unscoredCount: 0,
    }
  }

  const answers = supplier.answers || {}
  const questionResults = {}
  const flags = []

  for (const q of QUESTIONS) {
    const r = scoreQuestion(q, answers)
    questionResults[q.id] = r
    if (r.flag) flags.push({ name: r.flag, reason: r.flagReason })
  }

  const sections = SECTIONS.map((s) => {
    const secQuestions = QUESTIONS.filter((q) => q.section === s.key)
    const counted = secQuestions
      .map((q) => questionResults[q.id])
      .filter((r) => r.counted)
    const scores = counted.map((r) => r.score)
    const mean = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0
    const pct = Math.round((mean / 4) * 100)
    return {
      key: s.key,
      label: s.label,
      short: s.short,
      pct,
      weight: SECTION_WEIGHTS[s.key],
      scoredCount: scores.length,
    }
  })

  const composite = Math.round(
    sections.reduce((sum, s) => sum + s.pct * s.weight, 0),
  )
  const band = bandFor(composite)

  const unscoredCount = Object.values(questionResults).filter(
    (r) => r.unscored,
  ).length

  return {
    ecovadisVerified: false,
    composite,
    band,
    sections,
    flags,
    questionResults,
    unscoredCount,
  }
}

// Count questions still awaiting an open-ended maturity level, for the
// "N questions unscored" notice on the assessment form.
export function countUnscored(supplier) {
  if (supplier.ecovadis === 'yes') return 0
  const answers = supplier.answers || {}
  return QUESTIONS.filter((q) => q.type === 'open' && isQuestionActive(q, answers))
    .filter((q) => {
      const level = answers?.[q.id]?.level
      return level === null || level === undefined
    }).length
}
