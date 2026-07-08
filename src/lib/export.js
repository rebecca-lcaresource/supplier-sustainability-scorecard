// Client-side exports — no server. PDF (single-supplier scorecard) and CSV
// (leaderboard). PDF uses jsPDF + autotable, generated entirely in the browser.

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { SECTIONS } from './config.js'
import { QUESTIONS_BY_SECTION } from './questions.js'
import { scoreSupplier } from './scoring.js'
import { PDF_FONTS } from './pdfFonts.js'

// Brand font families registered in the PDF (see registerFonts).
const F_BODY = 'DMSans' // styles: 'light' (300) · 'normal' (400) · 'bold' (500)
const F_DISPLAY = 'Playfair' // style: 'bold' (700)
const F_MONO = 'JetBrainsMono' // style: 'normal' (400)

function registerFonts(doc) {
  for (const f of PDF_FONTS) {
    doc.addFileToVFS(f.vfs, f.data)
    doc.addFont(f.vfs, f.family, f.style)
  }
}

const FLAG_ORDER = ['PFAS', 'Water Stress', 'Biodiversity-Sensitive Site']

// Brand colours as RGB tuples for jsPDF.
const INK = [0, 0, 0]
const CHALK = [242, 242, 242]
const STONE = [182, 176, 159]
const LINEN = [234, 228, 213]
const LIME = [200, 241, 53]

function today() {
  const d = new Date()
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'long' })} ${d.getFullYear()}`
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function slug(s) {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()
}

// ---------------------------------------------------------------- CSV --------

function csvCell(v) {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportLeaderboardCSV(suppliers) {
  const scored = []
  const verified = []
  for (const s of suppliers) {
    const r = scoreSupplier(s)
    ;(r.ecovadisVerified ? verified : scored).push({ s, r })
  }
  scored.sort((a, b) => b.r.composite - a.r.composite)

  const header = [
    'Rank',
    'Supplier',
    'Country',
    'Status',
    'Composite %',
    'Band',
    ...SECTIONS.map((sec) => `${sec.label} %`),
    ...FLAG_ORDER,
  ]

  const rows = []
  scored.forEach(({ s, r }, i) => {
    const flagNames = r.flags.map((f) => f.name)
    rows.push([
      i + 1,
      s.legalName,
      s.country,
      'Scored',
      r.composite,
      r.band.name,
      ...SECTIONS.map((sec) => r.sections.find((x) => x.key === sec.key).pct),
      ...FLAG_ORDER.map((f) => (flagNames.includes(f) ? 'Yes' : '')),
    ])
  })
  verified.forEach(({ s }) => {
    rows.push([
      '—',
      s.legalName,
      s.country,
      'EcoVadis-Verified',
      '',
      '',
      ...SECTIONS.map(() => ''),
      ...FLAG_ORDER.map(() => ''),
    ])
  })

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n')
  download(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    `supplier-leaderboard-2026.csv`,
  )
}

// ---------------------------------------------------------------- PDF --------

const MARGIN = 48

function drawHeader(doc, supplier) {
  const pw = doc.internal.pageSize.getWidth()
  // Logo monogram box.
  doc.setFillColor(...INK)
  doc.rect(MARGIN, MARGIN, 26, 26, 'F')
  doc.setTextColor(...CHALK)
  doc.setFont(F_BODY, 'bold')
  doc.setFontSize(15)
  doc.text('C', MARGIN + 13, MARGIN + 18, { align: 'center' })
  // Wordmark — DM Sans Light, tracked.
  doc.setTextColor(...INK)
  doc.setFont(F_BODY, 'light')
  doc.setFontSize(12)
  doc.text('THE CORPORATE', MARGIN + 36, MARGIN + 17, { charSpace: 1.4 })
  // Right meta.
  doc.setFont(F_BODY, 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...STONE)
  doc.text('GLOBAL SUPPLIER SUSTAINABILITY ASSESSMENT 2026', pw - MARGIN, MARGIN + 8, {
    align: 'right',
  })
  doc.text(`Generated ${today()}`, pw - MARGIN, MARGIN + 20, { align: 'right' })
  // Divider.
  doc.setDrawColor(...STONE)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, MARGIN + 38, pw - MARGIN, MARGIN + 38)
}

function drawFooter(doc) {
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  doc.setDrawColor(...STONE)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, ph - 40, pw - MARGIN, ph - 40)
  doc.setFont(F_BODY, 'light')
  doc.setFontSize(7)
  doc.setTextColor(...STONE)
  doc.text(
    'CONFIDENTIAL — For internal use by The Corporate procurement / EHS reviewers only.',
    MARGIN,
    ph - 26,
  )
  const page = doc.internal.getNumberOfPages
    ? doc.internal.getCurrentPageInfo().pageNumber
    : 1
  doc.text(String(page), pw - MARGIN, ph - 26, { align: 'right' })
}

export function exportSupplierPDF(supplier) {
  const r = scoreSupplier(supplier)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  registerFonts(doc)
  const pw = doc.internal.pageSize.getWidth()
  const contentW = pw - MARGIN * 2

  drawHeader(doc, supplier)
  let y = MARGIN + 62

  // Supplier identity.
  doc.setFont(F_DISPLAY, 'bold')
  doc.setTextColor(...INK)
  doc.setFontSize(22)
  doc.text(supplier.legalName, MARGIN, y)
  y += 16
  doc.setFont(F_BODY, 'light')
  doc.setFontSize(10)
  doc.setTextColor(...STONE)
  doc.text(
    `${supplier.country}  ·  ${supplier.contactName || '—'}${supplier.contactTitle ? ', ' + supplier.contactTitle : ''}`,
    MARGIN,
    y,
  )
  y += 26

  if (r.ecovadisVerified) {
    // Status-only card.
    doc.setFillColor(...LINEN)
    doc.rect(MARGIN, y, contentW, 70, 'F')
    doc.setTextColor(...INK)
    doc.setFont(F_BODY, 'bold')
    doc.setFontSize(14)
    doc.text('EcoVadis-Verified', MARGIN + 16, y + 26)
    doc.setFont(F_BODY, 'light')
    doc.setFontSize(9)
    doc.setTextColor(...STONE)
    doc.text(
      'Holds a valid EcoVadis Sustainability Scorecard. Sections S2–S7 are not scored; no composite is computed.',
      MARGIN + 16,
      y + 44,
      { maxWidth: contentW - 32 },
    )
    if (supplier.ecovadisLink) {
      doc.setTextColor(...INK)
      doc.textWithLink(supplier.ecovadisLink, MARGIN + 16, y + 60, {
        url: supplier.ecovadisLink,
      })
    }
    drawFooter(doc)
    doc.save(`scorecard-${slug(supplier.legalName)}-2026.pdf`)
    return
  }

  // Composite + band + flags.
  doc.setFont(F_DISPLAY, 'bold')
  doc.setTextColor(...INK)
  doc.setFontSize(52)
  doc.text(`${r.composite}%`, MARGIN, y + 40)
  // Band pill (black rect; lime text for Leading else chalk).
  const pillX = MARGIN + 130
  const pillY = y + 12
  doc.setFillColor(...INK)
  const bandLabel = r.band.name.toUpperCase()
  doc.setFont(F_BODY, 'bold')
  doc.setFontSize(11)
  const bandW = doc.getTextWidth(bandLabel) + 24
  doc.rect(pillX, pillY, bandW, 24, 'F')
  doc.setTextColor(...(r.band.name === 'Leading' ? LIME : CHALK))
  doc.text(bandLabel, pillX + 12, pillY + 16, { charSpace: 1 })
  // Composite label.
  doc.setFont(F_BODY, 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...STONE)
  doc.text('COMPOSITE SCORE', MARGIN, y + 4, { charSpace: 1 })

  // Flag pills.
  let fx = pillX
  const fy = pillY + 34
  if (r.flags.length) {
    doc.setFont(F_BODY, 'normal')
    doc.setFontSize(8)
    r.flags.forEach((f) => {
      const label = f.name.toUpperCase()
      const w = doc.getTextWidth(label) + 16
      doc.setDrawColor(...INK)
      doc.setLineWidth(0.5)
      doc.rect(fx, fy, w, 18)
      doc.setTextColor(...INK)
      doc.text(label, fx + 8, fy + 12, { charSpace: 0.6 })
      fx += w + 8
    })
  } else {
    doc.setFont(F_BODY, 'light')
    doc.setFontSize(8)
    doc.setTextColor(...STONE)
    doc.text('No risk flags', pillX, fy + 12)
  }
  y += 78

  // Section bars.
  doc.setFont(F_BODY, 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...STONE)
  doc.text('SECTION SCORES', MARGIN, y, { charSpace: 1 })
  y += 12
  const barX = MARGIN + 150
  const barW = contentW - 150 - 44
  r.sections.forEach((s) => {
    doc.setTextColor(...INK)
    doc.setFont(F_BODY, 'light')
    doc.setFontSize(9)
    doc.text(s.label, MARGIN, y + 9)
    doc.setFillColor(...CHALK)
    doc.rect(barX, y, barW, 10, 'F')
    doc.setFillColor(...INK)
    doc.rect(barX, y, (barW * s.pct) / 100, 10, 'F')
    doc.setTextColor(...INK)
    doc.setFont(F_MONO, 'normal')
    doc.text(`${s.pct}%`, pw - MARGIN, y + 9, { align: 'right' })
    y += 18
  })
  y += 10

  // Per-question breakdown, one table per section.
  const body = []
  SECTIONS.forEach((sec) => {
    const section = r.sections.find((s) => s.key === sec.key)
    body.push([
      {
        content: `${sec.short} · ${sec.label} — ${section.pct}%`,
        colSpan: 5,
        styles: {
          fillColor: INK,
          textColor: CHALK,
          fontStyle: 'bold',
          fontSize: 9,
        },
      },
    ])
    QUESTIONS_BY_SECTION[sec.key].forEach((q) => {
      const qr = r.questionResults[q.id]
      let scoreTxt = '—'
      if (qr.type === 'flag') scoreTxt = qr.flag ? 'FLAG' : '—'
      else if (qr.na) scoreTxt = 'N/A'
      else if (qr.unscored) scoreTxt = '0*'
      else scoreTxt = String(qr.score)
      body.push([q.esrs, q.text, qr.answerLabel || '—', scoreTxt, qr.rationale])
    })
  })

  autoTable(doc, {
    startY: y,
    head: [['ESRS', 'Question', 'Answer', 'Score', 'Rationale']],
    body,
    margin: { left: MARGIN, right: MARGIN, top: MARGIN + 50, bottom: 52 },
    styles: {
      font: F_BODY,
      fontStyle: 'light',
      fontSize: 8,
      cellPadding: 4,
      textColor: INK,
      lineColor: STONE,
      lineWidth: 0.25,
      valign: 'top',
    },
    headStyles: {
      fillColor: LINEN,
      textColor: INK,
      fontStyle: 'normal',
      fontSize: 8,
    },
    columnStyles: {
      0: { font: F_MONO, fontStyle: 'normal', cellWidth: 42 },
      2: { cellWidth: 90, textColor: STONE },
      3: { font: F_MONO, fontStyle: 'normal', cellWidth: 34, halign: 'center' },
    },
    didDrawPage: () => {
      drawHeader(doc, supplier)
      drawFooter(doc)
    },
  })

  // Scoring key on its own final block.
  let keyY = doc.lastAutoTable.finalY + 20
  const ph = doc.internal.pageSize.getHeight()
  if (keyY > ph - 160) {
    doc.addPage()
    drawHeader(doc, supplier)
    drawFooter(doc)
    keyY = MARGIN + 60
  }
  doc.setFont(F_BODY, 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...INK)
  doc.text('Scoring key', MARGIN, keyY)
  keyY += 16
  doc.setFont(F_BODY, 'light')
  doc.setFontSize(8)
  const keyLines = [
    'Score scale — 0: not addressed · 1: acknowledged only · 2: some activity, no targets/evidence · 3: clear programme with targets · 4: robust, evidenced, externally validated.',
    'Dropdown (maturity): Yes = 4, No = 0.',
    'Quantitative: value + required detail = 4, value only = 2, blank = 0; where no detail is required, value = 4, blank = 0.',
    'Open-ended: reviewer-assigned 0–4 from the maturity anchors. Marked 0* where no level was assigned (treated as 0).',
    'Risk dropdowns (PFAS, water stress, protected area) raise flags and are never scored; flags never change the composite.',
    'Conditional questions marked N/A are excluded from the section average — never scored 0.',
    'Section % = mean of scored questions ÷ 4 × 100. Composite % = equal-weighted mean of the six sections (1/6 each).',
    'Bands: Leading ≥ 80 · Established 60–79 · Developing 40–59 · At Risk < 40.',
  ]
  keyLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, contentW)
    doc.setTextColor(...INK)
    doc.text(wrapped, MARGIN, keyY)
    keyY += wrapped.length * 10 + 2
  })

  doc.save(`scorecard-${slug(supplier.legalName)}-2026.pdf`)
}
