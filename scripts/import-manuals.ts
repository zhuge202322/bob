import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type CategorySeed = {
  name: string
  nameZh: string
  nameRu: string
  line: 'Reagents' | 'Consumables'
  description: string
  descriptionZh: string
  descriptionRu: string
  specifications: string
  brands: string
  temperature: string
  imageUrl: string
}

const reagentImages = Array.from({ length: 8 }, (_, index) => `/manuals/reagents/0${index + 1}-${[
  'i1b96fe9d9ba6c8e3c6060a90b02365bb1',
  'i7c7b137275919d7fffc81c0e39f5318e1',
  'ib48b72e09e4ad533a282e11c172de7461',
  'ic1299ceb7c4c8feb17e6e3c8e469492c1',
  'id498c1e266452c586f4d0d29ba05ae3c1',
  'i0a7b18fe87214813670dd8da8e95443e1',
  'i8a47786f004a51a8039e9921a084a2301',
  'i642b62d82de91b9ef8291ad826dba4a11'
][index]}.jpg`)
const consumableImages = Array.from({ length: 8 }, (_, index) => `/manuals/consumables/0${index + 1}-${[
  'i6baca1811ac6bd491da75573b642d8da1',
  'i1491b2048528bd9a975745e5221802a01',
  'ib58adaf19312d335a4288f73367eb9701',
  'ie4d8ab290605a4add3e551cd8cc594651',
  'i83e04d2813b19e48d948255730e20c6b1',
  'id98146026ee71ddf36b34f1b26f89ac71',
  'id57679c2fc7a2fdc06c838c71df9a7aa1',
  'ia28cce65388516f41dbe07ec80a5a09a1'
][index]}.jpg`)

const categories: CategorySeed[] = [
  ['Molecular Biology', '分子生物学试剂', 'Реагенты для молекулярной биологии', 'Reagents', 'PCR, qPCR, reverse transcription, enzymes, dNTPs and DNA/RNA markers for nucleic-acid workflows.', '覆盖 PCR、qPCR、逆转录、酶、dNTP 和 DNA/RNA Marker，服务核酸实验流程。', 'ПЦР, qPCR, обратная транскрипция, ферменты, dNTP и маркеры ДНК/РНК.', '20/50 μL reaction systems; enzymes 100/500/1000 U; dNTP 2.5/10 mM; markers 50/250 μL.', 'Americas: Thermo Fisher (Invitrogen), Bio-Rad, Promega, NEB, Agilent, KAPA Biosystems · Europe: Roche, Qiagen, Merck · Asia-Pacific: TaKaRa, TOYOBO, Nippon Gene · China: Vazyme, Yeasen, TIANGEN, CWBIO', 'AMBIENT / -20°C', reagentImages[0]],
  ['Cell Biology', '细胞生物学试剂', 'Реагенты для клеточной биологии', 'Reagents', 'Media, sera, PBS, dissociation, viability and transfection support for mammalian cell culture.', '覆盖培养基、血清、PBS、消化、细胞活性和转染支持。', 'Среды, сыворотки, PBS, диссоциация, жизнеспособность и трансфекция.', 'Media 500 mL/1 L; serum 50/500 mL; trypsin 100 mL; assay kits 48/96 tests.', 'Americas: Thermo Fisher (Gibco), Corning, BD Biosciences, Promega, R&D Systems · Europe: Sartorius, Lonza, Merck, Cytiva · Asia-Pacific: TaKaRa, FUJIFILM Wako · China: Vazyme, Yeasen, Solarbio, Beyotime', '2–8°C / -20°C', reagentImages[1]],
  ['Protein & Biochemistry', '蛋白质与生化试剂', 'Белки и биохимические реагенты', 'Reagents', 'Extraction, quantification, electrophoresis, western blot, ECL and ELISA reagents.', '覆盖蛋白提取、定量、电泳、Western blot、ECL 和 ELISA。', 'Экстракция, количественный анализ, электрофорез, western blot, ECL и ELISA.', 'Quantification kits 500/1000 tests; ECL 10/50 mL; ELISA 48/96 tests; protein markers 10/25 μL.', 'Americas: Thermo Fisher (Pierce), Bio-Rad, CST, Abcam, R&D Systems, Sigma-Aldrich, Promega · Europe: Merck Millipore, Cytiva, Roche · Asia-Pacific: FUJIFILM Wako, TaKaRa · China: Beyotime, Solarbio, GenScript, Yeasen, Sino Biological', '2–8°C / -20°C', reagentImages[2]],
  ['Immunology', '免疫学试剂', 'Иммунологические реагенты', 'Reagents', 'Primary and secondary antibodies plus flow cytometry, immunohistochemistry and ELISA reagents.', '提供一抗、二抗及流式、免疫组化、ELISA 试剂。', 'Первичные и вторичные антитела, реагенты для проточной цитометрии, ИГХ и ELISA.', 'Antibodies 100/500 μL/1 mL; ELISA 48/96 tests; cytokines 2/10/50 μg.', 'Americas: Thermo Fisher (eBioscience), BD Biosciences, BioLegend, R&D Systems, CST, Abcam, Santa Cruz · Europe: Miltenyi Biotec, Merck, Roche · Asia-Pacific: MBL, TaKaRa · China: Sino Biological, Novoprotein, Liankebio, MultiSciences', '2–8°C / -20°C', reagentImages[3]],
  ['Microbiology', '微生物培养与鉴定试剂', 'Реагенты для микробиологии', 'Reagents', 'Culture media, antibiotics, staining and identification reagents for bacterial and fungal workflows.', '覆盖培养基、抗生素、染色和微生物鉴定试剂。', 'Питательные среды, антибиотики, окрашивание и идентификация бактерий и грибов.', 'Media 250/500 g; antibiotics 1/5/25 g; staining solutions 100/500 mL; identification kits 20/50 tests.', 'Americas: Thermo Fisher, BD Biosciences, bioMérieux, Promega · Europe: Oxoid (Thermo), Merck, Sartorius · Asia-Pacific: TaKaRa, FUJIFILM Wako, Eiken Chemical · China: Hopebio, Huankai, Solarbio, Land Bridge', 'AMBIENT / 2–8°C', reagentImages[4]],
  ['Nucleic Acid Purification', '核酸与蛋白纯化试剂', 'Реагенты для очистки нуклеиновых кислот', 'Reagents', 'Extraction kits, magnetic beads, spin columns and concentration buffers for DNA, RNA and proteins.', '提供 DNA、RNA 和蛋白提取试剂盒、磁珠、纯化柱及浓缩缓冲液。', 'Наборы выделения ДНК/РНК и белков, магнитные частицы, колонки и буферы.', 'Extraction kits 50/100/250 tests; prepacked columns 1/5 mL; ultrafilters 0.5/4/15 mL, 3–100 kD.', 'Americas: Thermo Fisher, Qiagen, Promega, Zymo Research, MilliporeSigma · Europe: Cytiva, Sartorius, Roche, Macherey-Nagel · Asia-Pacific: TaKaRa, TOYOBO · China: TIANGEN, Vazyme, Yeasen, CWBIO, CommaBio', '2–8°C / -20°C', reagentImages[5]],
  ['Staining & Detection', '染色与显色试剂', 'Реагенты для окрашивания и детекции', 'Reagents', 'Fluorescent stains, substrates and chromogenic reagents for nucleic acids, proteins and cells.', '覆盖核酸、蛋白和细胞荧光染料、底物及显色试剂。', 'Флуоресцентные красители, субстраты и хромогенные реагенты для ДНК, белков и клеток.', 'Nucleic-acid stains 500 μL/1 mL; Coomassie 100/500 mL; DAPI 1 mg/mL; TMB substrate 100/500 mL.', 'Americas: Thermo Fisher (Invitrogen), Bio-Rad, Promega, Sigma-Aldrich · Europe: Merck Millipore, Roche, Sartorius · Asia-Pacific: TaKaRa, FUJIFILM Wako, DOJINDO · China: Beyotime, Solarbio, CWBIO, Yeasen', 'AMBIENT / 2–8°C', reagentImages[6]],
  ['Buffers & Solutions', '缓冲液与常用溶液', 'Буферы и лабораторные растворы', 'Reagents', 'Ready-to-use and concentrated buffers for routine molecular, protein and cell workflows.', '提供分子、蛋白和细胞实验常用即用型及浓缩缓冲液。', 'Готовые и концентрированные буферы для молекулярных, белковых и клеточных методик.', 'Ready-to-use 500 mL/1 L/5 L; 10× concentrate 500 mL/1 L; powders 250/500 g; pH 7.2–8.0 options.', 'Americas: Thermo Fisher, Corning, Sigma-Aldrich, Bio-Rad · Europe: Merck Millipore, Sartorius, Cytiva · Asia-Pacific: FUJIFILM Wako, TaKaRa, Nacalai Tesque · China: Solarbio, Beyotime, Vazyme, TIANGEN', 'AMBIENT / 2–8°C', reagentImages[7]],
  ['General Lab Consumables', '通用基础实验耗材', 'Общие лабораторные расходные материалы', 'Consumables', 'Pipette tips, centrifuge tubes, glassware, plastic vessels and sealing supplies.', '覆盖吸头、离心管、玻璃器具、塑料容器和封膜。', 'Наконечники, центрифужные пробирки, стекло, пластиковая посуда и плёнки.', '10 μL–10 mL tips; 0.5–500 mL centrifuge tubes; 5 mL–20 L glass and plastic storage vessels.', 'Americas: Corning, Axygen, Thermo Fisher (Nalgene/QSP), Kimble Chase · Europe: Eppendorf, Schott Duran, Brand, Sarstedt, Greiner Bio-One · Asia-Pacific: AS ONE, Nacalai Tesque, SIBATA, Sumitomo Bakelite · China: NEST, JET BIOFIL, Biosharp, Shuniu Glass, Tianbo Glass', 'AMBIENT', consumableImages[0]],
  ['Cell Culture Consumables', '细胞生物学专用耗材', 'Расходные материалы для клеточной культуры', 'Consumables', 'Dishes, flasks, plates, inserts and Transwell formats for 2D and 3D culture.', '覆盖培养皿、培养瓶、培养板、插入式小室和 Transwell。', 'Чашки, флаконы, планшеты, вставки и Transwell для 2D/3D культуры.', '35–150 mm dishes; T25–T225 flasks; 6–384-well plates; Transwell pore sizes 0.4/8 μm.', 'Americas: Thermo Fisher (Nunc), Corning (Falcon), MilliporeSigma, BD Biosciences · Europe: Greiner Bio-One, Sarstedt, TPP, Sartorius · Asia-Pacific: Sumitomo Bakelite, AS ONE, Iwaki · China: NEST, JET BIOFIL, WHB, SureBio, Duoning Bio', 'AMBIENT', consumableImages[1]],
  ['Molecular Biology Consumables', '分子生物学专用耗材', 'Расходные материалы для молекулярной биологии', 'Consumables', 'PCR tubes and plates, membranes and NGS-compatible consumables for nucleic-acid workflows.', '覆盖 PCR 管、PCR 板、膜及 NGS 配套耗材。', 'ПЦР-пробирки и планшеты, мембраны и расходники для NGS.', '0.2 mL single tubes and 8-strips; 96/384-well PCR plates; 0.22/0.45 μm positively charged nylon membranes.', 'Americas: Bio-Rad, Qiagen, Thermo Fisher Scientific, Zymo Research, MilliporeSigma · Europe: Roche, Sartorius · Asia-Pacific: TaKaRa, TOYOBO, Nippon Gene, FUJIFILM Wako · China: TIANGEN, Vazyme, NEST, Sapphire Bio, CWBIO', 'AMBIENT', consumableImages[2]],
  ['Protein & Biochemistry Consumables', '蛋白质与生物化学耗材', 'Расходные материалы для белков и биохимии', 'Consumables', 'Precast gels, transfer membranes, columns and ultrafiltration devices for protein workflows.', '覆盖预制胶、PVDF/NC 膜、纯化柱和超滤离心管。', 'Готовые гели, PVDF/NC-мембраны, колонки и устройства ультрафильтрации.', '8–15% and gradient precast gels; 0.22/0.45 μm transfer membranes; 3–100 kD MWCO filtration products.', 'Americas: MilliporeSigma, Bio-Rad, Thermo Fisher Pierce, Pall Corporation · Europe: Cytiva, Sartorius, Merck · Asia-Pacific: FUJIFILM Wako, TOYOBO, Advantec · China: Solarbio, Beyotime, GenScript, Biosharp', 'AMBIENT / 2–8°C', consumableImages[3]],
  ['Microbiology & Histopathology', '微生物与组织病理耗材', 'Расходные материалы для микробиологии и гистопатологии', 'Consumables', 'Cultureware, microscope slides, embedding cassettes and sectioning blades.', '覆盖培养皿、载玻片、包埋盒和切片刀片。', 'Чашки, предметные стёкла, кассеты и лезвия для микротомии.', '90/150 mm culture plates; positive-charge slides; paraffin embedding cassettes; sectioning blades.', 'Americas: BD Biosciences, Thermo Fisher Scientific, bioMérieux · Europe: Oxoid, Leica Biosystems, DAKO, Merck · Asia-Pacific: Sakura Finetek, Sysmex, AS ONE, Eiken Chemical · China: Huankai, CITOTEST, ZSGB-BIO, Hopebio', 'AMBIENT', consumableImages[4]],
  ['Filtration & Chromatography', '过滤纯化与色谱分析耗材', 'Расходные материалы для фильтрации и хроматографии', 'Consumables', 'Syringe filters, membranes, SPE cartridges, vials and HPLC/GC accessories.', '覆盖针头式过滤器、滤膜、SPE、小瓶及 HPLC/GC 配件。', 'Шприцевые фильтры, мембраны, SPE, виалы и аксессуары HPLC/GC.', '13/25/33 mm syringe filters; 0.22/0.45 μm membranes; 2 mL autosampler vials.', 'Americas: MilliporeSigma, Pall Corporation, Whatman, Agilent Technologies, Waters, Phenomenex · Europe: Restek, Sartorius, Merck · Asia-Pacific: Advantec, Shimadzu, Hitachi High-Tech, GL Sciences · China: CommaBio, Welch Materials, ANPEL, Dikma', 'AMBIENT', consumableImages[5]],
  ['Sample Storage', '样本采集与低温存储耗材', 'Расходные материалы для сбора и хранения образцов', 'Consumables', 'Collection tubes, swabs, cryovials, boxes and labels for low-temperature sample storage.', '覆盖采血管、采样拭子、冻存管、冻存盒和低温标签。', 'Пробирки для крови, тампоны, криовиалы, боксы и низкотемпературные этикетки.', 'EDTA/heparin/serum separator blood tubes; 1.8/2/5 mL internal- and external-thread cryovials.', 'Americas: BD Biosciences, Thermo Fisher Scientific · Europe: Sarstedt, Greiner Bio-One · Asia-Pacific: Terumo, AS ONE, Nipro · China: Improve Medical, NEST, SureBio, Gongdong Medical', '2–8°C / -20°C', consumableImages[6]],
  ['Safety & Animal Research', '安全防护与动物实验耗材', 'Средства безопасности и материалы для работы с животными', 'Consumables', 'PPE, sharps and biohazard supplies plus animal housing and procedure consumables.', '覆盖手套、防护服、口罩、锐器盒、生物垃圾袋及动物实验耗材。', 'Перчатки, защитная одежда, маски, контейнеры для острых предметов, биобезопасность и материалы для животных.', 'S/M/L/XL gloves; 1/3/5 L sharps containers; complete rodent housing and procedure consumables.', 'Americas: 3M, Kimberly-Clark, Ansell, Charles River · Europe: Honeywell, Tecniplast, B. Braun · Asia-Pacific: Showa Best, AS ONE · China: INTCO Medical, Zhende Medical, Fengshi Lab Animal Equipment, Huankai', 'AMBIENT', consumableImages[7]]
].map(([name, nameZh, nameRu, line, description, descriptionZh, descriptionRu, specifications, brands, temperature, imageUrl]) => ({ name, nameZh, nameRu, line, description, descriptionZh, descriptionRu, specifications, brands, temperature, imageUrl } as CategorySeed))

const productSeeds = [
  ['Molecular Biology', '2× Universal PCR Master Mix', 'Vazyme', 'P112-01', 'PCR/qPCR premix for routine amplification and screening.', 'Routine PCR, colony PCR and qPCR assay setup.', 'AMBIENT / -20°C', 0],
  ['Cell Biology', 'Fetal Bovine Serum, Premium', 'Gibco', '10099-141', 'Qualified serum for mammalian cell culture and expansion.', 'Cell culture supplementation, recovery and scale-up.', '2–8°C / -20°C', 1],
  ['Protein & Biochemistry', 'BCA Protein Assay Kit', 'Thermo Scientific', '23225', 'Colorimetric protein quantification kit for lysates and purified samples.', 'Protein concentration measurement before electrophoresis or assay normalization.', '2–8°C', 2],
  ['Immunology', 'Goat Anti-Rabbit IgG Secondary Antibody', 'Jackson ImmunoResearch', '111-035-144', 'Secondary antibody for immunoblotting, immunofluorescence and IHC workflows.', 'Signal detection in western blot, IHC and fluorescence microscopy.', '2–8°C', 3],
  ['Microbiology', 'LB Broth, Molecular Biology Grade', 'Solarbio', 'L8290', 'Ready-to-prepare bacterial culture medium for cloning workflows.', 'Routine cultivation and plasmid propagation.', 'AMBIENT', 4],
  ['Nucleic Acid Purification', 'Magnetic Beads for DNA Cleanup', 'BeaverBeads', 'BEAVERBEADS-01', 'Paramagnetic beads for DNA purification, cleanup and size selection.', 'PCR cleanup, library preparation and fragment selection.', '2–8°C', 5],
  ['Staining & Detection', 'DAPI Fluorescent Stain', 'Beyotime', 'C1002', 'Fluorescent nuclear stain for fixed-cell and microscopy workflows.', 'Nuclear counterstaining and fluorescence imaging.', '2–8°C', 6],
  ['Buffers & Solutions', '10× TBS Buffer', 'Yeasen', 'B541017', 'Concentrated Tris-buffered saline for immunoassay and protein workflows.', 'Wash, dilution and blocking buffer preparation.', 'AMBIENT', 7],
  ['General Lab Consumables', 'Low Retention Pipette Tips, 10 μL', 'Eppendorf', '0030073312', 'Low-retention sterile tips designed for accurate low-volume liquid handling.', 'PCR setup, reagent transfer and sensitive sample dispensing.', 'AMBIENT', 8],
  ['Cell Culture Consumables', 'T75 Tissue Culture Flask', 'Corning', '430641', 'Vent-cap tissue culture flask for adherent mammalian cell workflows.', 'Routine cell expansion and short-term culture.', 'AMBIENT', 9],
  ['Molecular Biology Consumables', '96-Well PCR Plate, Low Profile', 'Bio-Rad', 'MLL9601', 'Low-profile 96-well plate for PCR and qPCR instruments.', 'High-throughput amplification and screening.', 'AMBIENT', 10],
  ['Protein & Biochemistry Consumables', 'PVDF Transfer Membrane 0.22 μm', 'Merck', 'IPVH00010', 'PVDF membrane for high-sensitivity protein transfer and immunoblotting.', 'Western blot transfer and chemiluminescent detection.', 'AMBIENT', 11],
  ['Microbiology & Histopathology', 'Microscope Slides, Positive Charge', 'CITOTEST', '188105', 'Charged microscope slides for tissue section adhesion.', 'Histology, pathology and routine microscopy.', 'AMBIENT', 12],
  ['Filtration & Chromatography', 'Syringe Filter PES 0.22 μm', 'Sartorius', '16534', 'PES membrane syringe filter for aqueous sample clarification.', 'HPLC sample preparation and sterile filtration.', 'AMBIENT', 13],
  ['Sample Storage', 'Cryogenic Vial 2 mL, External Thread', 'NEST', '607001', 'External-thread cryovial for controlled low-temperature sample storage.', '−80°C storage, biobanking and sample transport.', '-20°C', 14],
  ['Safety & Animal Research', 'Nitrile Examination Gloves', 'Ansell', '92-600', 'Powder-free nitrile gloves for routine laboratory protection.', 'Sample handling, cleanroom support and biohazard work.', 'AMBIENT', 15]
] as const

const zhNames: Record<string, string> = {
  '2× Universal PCR Master Mix': '2× 通用 PCR 预混液', 'Fetal Bovine Serum, Premium': '优级胎牛血清', 'BCA Protein Assay Kit': 'BCA 蛋白定量试剂盒', 'Goat Anti-Rabbit IgG Secondary Antibody': '山羊抗兔 IgG 二抗', 'LB Broth, Molecular Biology Grade': '分子生物学级 LB 培养基', 'Magnetic Beads for DNA Cleanup': 'DNA 纯化磁珠', 'DAPI Fluorescent Stain': 'DAPI 荧光染色液', '10× TBS Buffer': '10× TBS 缓冲液', 'Low Retention Pipette Tips, 10 μL': '低吸附移液器吸头，10 μL', 'T75 Tissue Culture Flask': 'T75 细胞培养瓶', '96-Well PCR Plate, Low Profile': '96 孔低型 PCR 板', 'PVDF Transfer Membrane 0.22 μm': '0.22 μm PVDF 转印膜', 'Microscope Slides, Positive Charge': '正电荷载玻片', 'Syringe Filter PES 0.22 μm': 'PES 针头式过滤器 0.22 μm', 'Cryogenic Vial 2 mL, External Thread': '2 mL 外旋冻存管', 'Nitrile Examination Gloves': '丁腈检查手套'
}
const ruNames: Record<string, string> = {
  '2× Universal PCR Master Mix': 'Универсальная ПЦР-смесь 2×', 'Fetal Bovine Serum, Premium': 'Премиальная эмбриональная сыворотка КРС', 'BCA Protein Assay Kit': 'Набор для анализа белка BCA', 'Goat Anti-Rabbit IgG Secondary Antibody': 'Вторичное антитело козы к IgG кролика', 'LB Broth, Molecular Biology Grade': 'Бульон LB, молекулярно-биологический класс', 'Magnetic Beads for DNA Cleanup': 'Магнитные частицы для очистки ДНК', 'DAPI Fluorescent Stain': 'Флуоресцентный краситель DAPI', '10× TBS Buffer': 'Буфер TBS 10×', 'Low Retention Pipette Tips, 10 μL': 'Наконечники с низким удержанием, 10 мкл', 'T75 Tissue Culture Flask': 'Флакон для клеточной культуры T75', '96-Well PCR Plate, Low Profile': 'Низкопрофильный ПЦР-планшет на 96 лунок', 'PVDF Transfer Membrane 0.22 μm': 'PVDF-мембрана 0,22 мкм', 'Microscope Slides, Positive Charge': 'Предметные стёкла с положительным зарядом', 'Syringe Filter PES 0.22 μm': 'Шприцевой фильтр PES 0,22 мкм', 'Cryogenic Vial 2 mL, External Thread': 'Криовиала 2 мл с внешней резьбой', 'Nitrile Examination Gloves': 'Нитриловые смотровые перчатки'
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function main() {
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: { siteName: 'Zehongyan Biotech', siteNameZh: 'Zehongyan Biotech', siteNameRu: 'Zehongyan Biotech', logoUrl: '/manuals/company-logo.jpg', defaultLocale: 'en' }, create: { id: 1, siteName: 'Zehongyan Biotech', siteNameZh: 'Zehongyan Biotech', siteNameRu: 'Zehongyan Biotech', logoUrl: '/manuals/company-logo.jpg', defaultLocale: 'en' } })

  const categoryIds = new Map<string, number>()
  for (const [index, item] of categories.entries()) {
    const row = await prisma.productCategory.upsert({ where: { id: (await prisma.productCategory.findFirst({ where: { name: item.name }, select: { id: true } }))?.id ?? -index - 1 }, update: { ...item, slug: slugify(item.name), sortOrder: index + 1, status: 'PUBLISHED' }, create: { ...item, slug: slugify(item.name), sortOrder: index + 1, status: 'PUBLISHED' } })
    categoryIds.set(item.name, row.id)
  }

  await prisma.product.deleteMany({})
  for (const [index, [categoryName, name, brand, catNo, description, application, temperature, imageIndex]] of productSeeds.entries()) {
    const categoryId = categoryIds.get(categoryName)
    if (!categoryId) continue
    await prisma.product.create({ data: { name, nameZh: zhNames[name] || name, nameRu: ruNames[name] || name, slug: `${slugify(name)}-${index + 1}`, categoryId, brand, catNo, specification: description, description, descriptionZh: description, descriptionRu: description, application, temperature, imageUrl: categories.find((item) => item.name === categoryName)?.imageUrl || `/manuals/${imageIndex < 8 ? 'reagents' : 'consumables'}/01.jpg`, status: 'PUBLISHED' } })
  }

  await prisma.contact.deleteMany({})
  await prisma.contact.createMany({ data: [
    { type: 'Email', label: 'Business email', value: 'zehongyan2025@outlook.com', href: 'mailto:zehongyan2025@outlook.com', sortOrder: 1 },
    { type: 'Phone', label: 'Luo', value: '+86 185 7584 8378', href: 'tel:+861857548378', sortOrder: 2 },
    { type: 'Phone', label: 'Bob', value: '+86 130 1853 7275', href: 'tel:+8613018537275', sortOrder: 3 },
    { type: 'Address', label: 'Office', value: '5B36N, Building 210, Tairan Science Park, No. 113 Tairan 6th Road, Shatou Street, Futian District, Shenzhen, Guangdong, China', sortOrder: 4 },
    { type: 'Hours', label: 'Office hours', value: 'Mon–Fri 09:00–18:00 (UTC+8)', sortOrder: 5 }
  ] })

  await prisma.socialLink.deleteMany({})
  await prisma.socialLink.createMany({ data: [
    { platform: 'WhatsApp', url: 'https://wa.me/861857548378', sortOrder: 1 },
    { platform: 'VK', url: 'https://vk.com/', sortOrder: 2 }
  ] })

  await prisma.heroSlide.deleteMany({})
  await prisma.heroSlide.createMany({ data: [
    { kicker: 'GLOBAL LIFE SCIENCE SOURCING', kickerZh: '全球生命科学供应', kickerRu: 'ПОСТАВКИ LIFE SCIENCE', title: 'Research reagents and laboratory consumables, sourced with clarity', titleZh: '科研试剂与实验室耗材，清晰寻源，可靠交付', titleRu: 'Исследовательские реагенты и расходные материалы с понятным снабжением', body: 'From PCR reagents to cold-chain consumables, Hocore coordinates brands, documents and delivery for research teams across Russia.', bodyZh: '从 PCR 试剂到冷链耗材，Hocore 为俄罗斯科研团队协调品牌、文件与交付。', bodyRu: 'От ПЦР-реагентов до расходников холодовой цепи — координируем бренды, документы и доставку по России.', imageUrl: '/manuals/reagents/00-i758290f093508846081afea3db2597471.jpg', ctaLabel: 'Request a quote', ctaLabelZh: '提交询盘', ctaLabelRu: 'Запросить предложение', sortOrder: 1, status: 'PUBLISHED', publishedAt: new Date() },
    { kicker: 'TEMPERATURE-AWARE DELIVERY', kickerZh: '温控交付', kickerRu: 'ТЕМПЕРАТУРНАЯ ДОСТАВКА', title: 'Ambient, refrigerated and frozen routes with handover records', titleZh: '常温、冷藏与冷冻温区，交付记录清晰可查', titleRu: 'Маршруты Ambient, 2–8°C и -20°C с документированной передачей', body: 'Select the lane from the product requirement. We align packaging, temperature records and receiving documents before dispatch.', bodyZh: '根据产品要求选择温区，发货前对齐包装、温度记录和收货文件。', bodyRu: 'Режим выбирается по продукту; до отправки согласуются упаковка, температурные записи и документы приёмки.', imageUrl: '/manuals/consumables/00-i8346f2024cc5ff366f1ccf18ae4951df1.jpg', ctaLabel: 'View quality standards', ctaLabelZh: '查看质量标准', ctaLabelRu: 'К стандартам качества', ctaHref: '/quality', sortOrder: 2, status: 'PUBLISHED', publishedAt: new Date() },
    { kicker: 'SPECIFIED SOURCING', kickerZh: '指定型号寻源', kickerRu: 'ПОИСК ПО СПЕЦИФИКАЦИИ', title: 'Send a brand, CAT No. or purchase list and receive a documented route', titleZh: '提交品牌、CAT No. 或清单，获得有文件记录的供应方案', titleRu: 'Отправьте бренд, CAT No. или список и получите документированный план поставки', body: 'Specified sourcing responses include availability, timing, temperature lane and the quality documents available for the exact item.', bodyZh: '指定型号回复包含货期、温区和具体产品可提供的质量文件。', bodyRu: 'Ответ по позиции включает наличие, сроки, температурный режим и доступные документы качества.', imageUrl: '/manuals/reagents/01-i1b96fe9d9ba6c8e3c6060a90b02365bb1.jpg', ctaLabel: 'Start an RFQ', ctaLabelZh: '开始询盘', ctaLabelRu: 'Начать запрос', sortOrder: 3, status: 'PUBLISHED', publishedAt: new Date() }
  ] })

  console.log(`Imported ${categories.length} categories and ${productSeeds.length} representative products from the two Hocore manuals.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
