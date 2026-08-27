export type Locale = 'en' | 'zh' | 'ru'
export type Category = { title: string; kind: 'Reagents' | 'Consumables'; detail: string; tags: string[]; tone: string }

export const categories: Category[] = [
  { title: 'Molecular Biology', kind: 'Reagents', detail: 'PCR, qPCR, enzymes, markers and nucleic acid workflows.', tags: ['PCR / qPCR', 'DNA / RNA', 'Enzymes'], tone: 'mint' },
  { title: 'Cell Biology', kind: 'Reagents', detail: 'Media, sera, dissociation, viability and transfection support.', tags: ['DMEM / RPMI', 'FBS', 'CCK-8'], tone: 'blue' },
  { title: 'Protein & Biochemistry', kind: 'Reagents', detail: 'Extraction, quantification, electrophoresis and western blot.', tags: ['BCA', 'ECL', 'ELISA'], tone: 'gold' },
  { title: 'Immunology', kind: 'Reagents', detail: 'Primary and secondary antibodies, flow and IHC reagents.', tags: ['Antibodies', 'Flow cytometry', 'IHC'], tone: 'rose' },
  { title: 'Microbiology', kind: 'Reagents', detail: 'Culture media, antibiotics, staining and identification.', tags: ['LB / SOB', 'Antibiotics', 'Mycoplasma'], tone: 'olive' },
  { title: 'Nucleic Acid Purification', kind: 'Reagents', detail: 'Extraction kits, magnetic beads, columns and buffers.', tags: ['DNA / RNA kits', 'Magnetic beads', 'Spin columns'], tone: 'slate' },
  { title: 'Staining & Detection', kind: 'Reagents', detail: 'Nucleic acid, protein and cell stains with substrates.', tags: ['GelRed', 'DAPI / PI', 'TMB / DAB'], tone: 'violet' },
  { title: 'Buffers & Solutions', kind: 'Reagents', detail: 'Ready-to-use and concentrated laboratory solutions.', tags: ['PBS', 'Tris-HCl', 'TAE / TBE'], tone: 'teal' },
  { title: 'General Lab Consumables', kind: 'Consumables', detail: 'Pipette tips, tubes, vessels and sealing supplies.', tags: ['10 μL–10 mL', '0.5–500 mL', 'Low-bind'], tone: 'mint' },
  { title: 'Cell Culture Consumables', kind: 'Consumables', detail: 'Dishes, flasks, plates, inserts and 3D culture formats.', tags: ['T25–T225', '6–384 well', 'Transwell'], tone: 'blue' },
  { title: 'Molecular Biology Consumables', kind: 'Consumables', detail: 'PCR plates, extraction plates, membranes and NGS supplies.', tags: ['0.2 mL', '96 / 384 well', '0.22 / 0.45 μm'], tone: 'gold' },
  { title: 'Protein & Biochemistry Consumables', kind: 'Consumables', detail: 'Precast gels, transfer membranes, columns and ultrafiltration.', tags: ['8–15% gels', 'PVDF / NC', '3–100 kD'], tone: 'rose' },
  { title: 'Microbiology & Histopathology', kind: 'Consumables', detail: 'Cultureware, slides, embedding cassettes and blades.', tags: ['90 / 150 mm', 'Positive charge', 'Sectioning'], tone: 'olive' },
  { title: 'Filtration & Chromatography', kind: 'Consumables', detail: 'Syringe filters, membranes, SPE and chromatography accessories.', tags: ['13 / 25 / 33 mm', '0.22 / 0.45 μm', '2 mL vials'], tone: 'slate' },
  { title: 'Sample Storage', kind: 'Consumables', detail: 'Collection tubes, cryovials, boxes and low-temperature labels.', tags: ['EDTA / heparin', '1.8 / 2 / 5 mL', 'Cryogenic'], tone: 'violet' },
  { title: 'Safety & Animal Research', kind: 'Consumables', detail: 'PPE, sharps, biohazard, animal housing and procedure supplies.', tags: ['S–XL', '1 / 3 / 5 L', 'Rodent care'], tone: 'teal' }
]

export const heroSlides = [
  { kicker: 'GLOBAL LIFE SCIENCE SOURCING', title: 'Reliable access to research reagents and lab consumables', text: 'Global brands. One procurement partner. Compliant delivery across Russia.', image: '/hero-lab.jpg' },
  { kicker: 'CONTROLLED DELIVERY', title: 'Temperature-aware logistics for every critical shipment', text: 'Ambient, 2–8°C and -20°C routes with traceable handover documentation.', image: '/hero-cold.jpg' },
  { kicker: 'A CLEARER PROCUREMENT PATH', title: 'From brand and CAT No. to a complete supply plan', text: 'Send a specification or purchase list. Our sourcing desk returns options, timing and documents.', image: '/hero-procurement.jpg' }
]

export const brandRegions = [
  { region: 'Americas', brands: 'Thermo Fisher · Bio-Rad · Promega · Corning · Agilent · BD', color: 'amber' },
  { region: 'Europe', brands: 'Roche · Merck · Sartorius · Eppendorf · Cytiva · Greiner', color: 'sky' },
  { region: 'Asia-Pacific', brands: 'TaKaRa · TOYOBO · FUJIFILM Wako · AS ONE · Shimadzu', color: 'green' },
  { region: 'China', brands: 'Vazyme · Yeasen · TIANGEN · Beyotime · NEST · SolarBio', color: 'coral' }
]
