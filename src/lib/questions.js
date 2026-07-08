// The full Global Supplier Sustainability Assessment 2026 question map
// (product-spec.md Section 9). This is the fixed rubric.
//
// Question types:
//   'quant'    — quantitative disclosure. requiresDetail marks questions where a
//                supporting detail is required (value+detail=4 / value=2 / blank=0);
//                otherwise value=4 / blank=0.
//   'dropdown' — Yes/No maturity. Yes=4 / No=0.
//   'flag'     — Yes/No risk dropdown. NOT scored, never in the section mean.
//                Yes raises the named risk flag.
//   'open'     — reviewer-assigned maturity 0–4 from anchor descriptions.
//                `conditionalOn` marks a question that is N/A (excluded from the
//                section mean) unless its trigger flag answers Yes.

export const QUESTIONS = [
  // ---- S2 Climate ----
  {
    id: 'c1',
    section: 'climate',
    esrs: 'E1-4',
    type: 'quant',
    text: 'Scope 1 emissions (tCO₂e) with verification method',
    subject: 'Scope 1 emissions',
    requiresDetail: true,
    valueLabel: 'Scope 1 (tCO₂e)',
    detailLabel: 'Verification method',
  },
  {
    id: 'c2',
    section: 'climate',
    esrs: 'E1-4',
    type: 'quant',
    text: 'Scope 2 market-based emissions (tCO₂e)',
    subject: 'Scope 2 emissions',
    requiresDetail: false,
    valueLabel: 'Scope 2 market-based (tCO₂e)',
  },
  {
    id: 'c3',
    section: 'climate',
    esrs: 'E1-4',
    type: 'quant',
    text: 'Scope 3 emissions (tCO₂e) with categories covered',
    subject: 'Scope 3 emissions',
    requiresDetail: true,
    valueLabel: 'Scope 3 (tCO₂e)',
    detailLabel: 'Categories covered',
  },
  {
    id: 'c4',
    section: 'climate',
    esrs: 'E1-3',
    type: 'dropdown',
    text: 'SBTi-validated emissions reduction target in place?',
    subject: 'SBTi-validated target',
  },
  {
    id: 'c5',
    section: 'climate',
    esrs: 'E1-2',
    type: 'open',
    text: 'Top-3 decarbonisation projects',
  },
  {
    id: 'c6',
    section: 'climate',
    esrs: 'E1-2',
    type: 'open',
    text: 'Barriers to a 50% emissions cut by 2030',
  },

  // ---- S3 Pollution ----
  {
    id: 'p1',
    section: 'pollution',
    esrs: 'E2-3',
    type: 'quant',
    text: 'SVHC / REACH substances of concern (weight, kg)',
    subject: 'SVHC / REACH weight',
    requiresDetail: false,
    valueLabel: 'SVHC / REACH (kg)',
  },
  {
    id: 'p2',
    section: 'pollution',
    esrs: 'E2-3',
    type: 'flag',
    text: 'PFAS present in products or processes?',
    flag: 'PFAS',
    flagReason: 'Supplier reported PFAS in products/processes (S3)',
  },
  {
    id: 'p3',
    section: 'pollution',
    esrs: 'E2-3',
    type: 'open',
    text: 'PFAS substitution roadmap',
    conditionalOn: { questionId: 'p2', value: 'yes' },
  },
  {
    id: 'p4',
    section: 'pollution',
    esrs: 'E2-2',
    type: 'open',
    text: 'Wastewater treatment approach',
  },

  // ---- S4 Water ----
  {
    id: 'w1',
    section: 'water',
    esrs: 'E3-1',
    type: 'quant',
    text: 'Water withdrawal (m³) with source breakdown',
    subject: 'Water withdrawal',
    requiresDetail: true,
    valueLabel: 'Water withdrawal (m³)',
    detailLabel: 'Source breakdown',
  },
  {
    id: 'w2',
    section: 'water',
    esrs: 'E3-1',
    type: 'flag',
    text: 'Operations in a high-water-stress region?',
    flag: 'Water Stress',
    flagReason: 'Supplier operates in a high-water-stress region (S4)',
  },
  {
    id: 'w3',
    section: 'water',
    esrs: 'E3-2',
    type: 'open',
    text: 'Water-saving measures / intensity trend',
  },
  {
    id: 'w4',
    section: 'water',
    esrs: 'E3-2',
    type: 'open',
    text: 'Drought contingency plan',
    conditionalOn: { questionId: 'w2', value: 'yes' },
  },

  // ---- S5 Circular Economy ----
  {
    id: 'ce1',
    section: 'circular',
    esrs: 'E5-2',
    type: 'quant',
    text: 'Total waste (t) with breakdown',
    subject: 'Total waste',
    requiresDetail: true,
    valueLabel: 'Total waste (t)',
    detailLabel: 'Waste breakdown',
  },
  {
    id: 'ce2',
    section: 'circular',
    esrs: 'E5-4',
    type: 'quant',
    text: 'Post-consumer recycled (PCR) content (%)',
    subject: 'PCR content',
    requiresDetail: false,
    valueLabel: 'PCR content (%)',
  },
  {
    id: 'ce3',
    section: 'circular',
    esrs: 'E5-3',
    type: 'open',
    text: 'Circularity designed into components',
  },
  {
    id: 'ce4',
    section: 'circular',
    esrs: 'E5-2',
    type: 'open',
    text: 'Zero-waste-to-landfill strategy',
  },

  // ---- S6 Biodiversity ----
  {
    id: 'b1',
    section: 'biodiversity',
    esrs: 'E4-2',
    type: 'flag',
    text: 'Site in or adjacent to a protected area?',
    flag: 'Biodiversity-Sensitive Site',
    flagReason: 'Supplier site is in/adjacent to a protected area (S6)',
  },
  {
    id: 'b2',
    section: 'biodiversity',
    esrs: 'E4-3',
    type: 'open',
    text: 'Biodiversity initiatives',
  },
  {
    id: 'b3',
    section: 'biodiversity',
    esrs: 'E4-5',
    type: 'open',
    text: 'Biodiversity impact assessment (TNFD-aligned)',
  },

  // ---- S7 Social / Labour / Governance ----
  {
    id: 's1',
    section: 'social',
    esrs: 'S2-1',
    type: 'dropdown',
    text: 'Human Rights & Labour policy (UNGP-aligned)?',
    subject: 'Human Rights & Labour policy',
  },
  {
    id: 's2',
    section: 'social',
    esrs: 'S2-2',
    type: 'dropdown',
    text: 'Human-rights due diligence in the last 24 months?',
    subject: 'human-rights due diligence',
  },
  {
    id: 's3',
    section: 'social',
    esrs: 'S2-4',
    type: 'open',
    text: 'Grievance mechanism and case counts',
  },
  {
    id: 's4',
    section: 'social',
    esrs: 'G1-1',
    type: 'dropdown',
    text: 'Conflict-minerals policy (3TG, OECD-aligned)?',
    subject: 'conflict-minerals policy',
  },
  {
    id: 's5',
    section: 'social',
    esrs: 'G1-2',
    type: 'open',
    text: 'Supplier code of conduct and audit programme',
  },
]

export const QUESTIONS_BY_SECTION = QUESTIONS.reduce((acc, q) => {
  ;(acc[q.section] ||= []).push(q)
  return acc
}, {})

export function getQuestion(id) {
  return QUESTIONS.find((q) => q.id === id)
}

// Is a conditional question active (i.e. its trigger flag = Yes)?
// Returns true for non-conditional questions.
export function isQuestionActive(q, answers) {
  if (!q.conditionalOn) return true
  const trigger = answers?.[q.conditionalOn.questionId]
  return trigger === q.conditionalOn.value
}
