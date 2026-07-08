// Three sample suppliers so scoring, ranking, flags, and both exports work with
// no real data (product-spec.md — sample data requirement):
//   1. Nordic Precision — EcoVadis-Verified (bypasses S2–S7)
//   2. Meridian Advanced Materials — strong scorer, no flags → Leading
//   3. Coastal Polymer Industries — PFAS + Water Stress flags → At Risk

let seq = 0
const nextId = () => `sample-${++seq}`

const open = (text, level, note = '') => ({ text, level, note })
const quant = (value, detail = '') => ({ value, detail })

export const SAMPLE_SUPPLIERS = [
  {
    id: nextId(),
    isSample: true,
    legalName: 'Nordic Precision Components AB',
    country: 'Sweden',
    contactName: 'Astrid Lindqvist',
    contactTitle: 'Head of Sustainability',
    contactEmail: 'a.lindqvist@nordicprecision.se',
    ecovadis: 'yes',
    ecovadisLink: 'https://ecovadis.com/scorecard/nordic-precision-2026',
    answers: {},
  },
  {
    id: nextId(),
    isSample: true,
    legalName: 'Meridian Advanced Materials GmbH',
    country: 'Germany',
    contactName: 'Johannes Vogel',
    contactTitle: 'Director, EHS & ESG',
    contactEmail: 'j.vogel@meridian-materials.de',
    ecovadis: 'no',
    ecovadisLink: '',
    answers: {
      c1: quant('12,000', 'ISO 14064-1, third-party verified by DNV'),
      c2: quant('8,500'),
      c3: quant('210,000', 'Categories 1, 3, 4 and 11'),
      c4: 'yes',
      c5: open(
        'Site electrification, 100% renewable power PPA, and process-heat recovery — each with 2030 milestones.',
        4,
      ),
      c6: open(
        'Grid decarbonisation pace and supplier-tier data gaps identified; mitigation underway.',
        3,
      ),
      p1: quant('3.2'),
      p2: 'no',
      p4: open(
        'On-site treatment to permit limits, quarterly discharge monitoring reported publicly.',
        3,
      ),
      w1: quant('45,000', 'Municipal 70% / groundwater 30%'),
      w2: 'no',
      w3: open(
        'Closed-loop cooling cut intensity 22% over three years against a public baseline.',
        4,
      ),
      ce1: quant('1,200', 'Hazardous / non-hazardous split disclosed'),
      ce2: quant('35'),
      ce3: open(
        'Modular design for disassembly on two product lines; take-back pilot running.',
        3,
      ),
      ce4: open(
        'Zero-waste-to-landfill achieved at two of three sites, third certified for 2026.',
        4,
      ),
      b1: 'no',
      b2: open('Habitat restoration partnership at the primary manufacturing site.', 3),
      b3: open('TNFD-aligned assessment completed for direct operations.', 3),
      s1: 'yes',
      s2: 'yes',
      s3: open(
        'Independent grievance hotline; 4 cases raised, all resolved, counts published.',
        4,
      ),
      s4: 'yes',
      s5: open(
        'Supplier code of conduct with annual third-party audits and corrective-action tracking.',
        4,
      ),
    },
  },
  {
    id: nextId(),
    isSample: true,
    legalName: 'Coastal Polymer Industries Inc.',
    country: 'United States',
    contactName: 'Marcus Reyes',
    contactTitle: 'Operations Manager',
    contactEmail: 'm.reyes@coastalpolymer.com',
    ecovadis: 'no',
    ecovadisLink: '',
    answers: {
      c1: quant('45,000'),
      c2: quant(''),
      c3: quant(''),
      c4: 'no',
      c5: open('Some efficiency projects mentioned, no detail or targets.', 1),
      c6: open('Barriers acknowledged in general terms only.', 1),
      p1: quant('8.5'),
      p2: 'yes',
      p3: open('States an intent to review PFAS use; no roadmap or timeline yet.', 1),
      p4: open('Municipal discharge with periodic sampling; limited disclosure.', 2),
      w1: quant('90,000'),
      w2: 'yes',
      w3: open('Reports awareness of water use; some metering installed.', 2),
      w4: open('Mentions a contingency plan exists; no detail provided.', 1),
      ce1: quant('5,000'),
      ce2: quant(''),
      ce3: open('Recyclability referenced for one product family.', 1),
      ce4: open('Aspiration stated; no strategy or milestones.', 1),
      b1: 'no',
      b2: open('General statement of environmental care; no initiatives described.', 1),
      // b3 intentionally left with no maturity level — demonstrates "unscored".
      b3: open('No biodiversity impact assessment referenced.', null),
      s1: 'yes',
      s2: 'no',
      s3: open('A general complaints inbox exists; no case data reported.', 2),
      s4: 'no',
      s5: open('A code of conduct exists; no audit programme described.', 1),
    },
  },
]

// Fresh copies each session so edits never mutate the module constant.
export function freshSampleSuppliers() {
  return JSON.parse(JSON.stringify(SAMPLE_SUPPLIERS))
}
