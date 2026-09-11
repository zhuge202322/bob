import type { Locale } from '@/lib/i18n'

type Localized = Record<Locale, string>
type PageContent = {
  eyebrow: Localized
  title: Localized
  intro: Localized
  heroImage: string
  sections: Array<{ title: Localized; body: Localized; image?: string; bullets?: Record<Locale, string[]> }>
  steps?: Array<{ title: Localized; body: Localized }>
  stats?: Array<{ value: string; label: Localized }>
  proof?: { heading: Localized; intro: Localized; items: Array<{ title: Localized; body: Localized }> }
}

const t = (en: string, zh: string, ru: string): Localized => ({ en, zh, ru })

export const pageContent: Record<string, PageContent> = {
  solutions: {
    eyebrow: t('SUPPLY SOLUTIONS', '采购服务', 'РЕШЕНИЯ ПО СНАБЖЕНИЮ'),
    title: t('A sourcing desk built around how research teams actually buy.', '围绕科研团队真实采购流程设计的寻源服务。', 'Отдел снабжения, созданный под реальные закупки исследовательских команд.'),
    intro: t('From one hard-to-find CAT No. to a multi-brand programme, we coordinate specifications, documents and delivery in one accountable workflow.', '从一个难找的 CAT No. 到多品牌项目，我们在一个明确负责的流程中协调规格、文件与交付。', 'От одной труднодоступной позиции до мультибрендовой программы — спецификации, документы и доставка в одном процессе.'),
    heroImage: '/manuals/consumables/00-i8346f2024cc5ff366f1ccf18ae4951df1.jpg',
    stats: [{ value: '01', label: t('One accountable procurement desk', '一个负责到底的采购窗口', 'Один ответственный закупочный контакт') }, { value: '03', label: t('Temperature lanes', '三档温区', 'Три температурных режима') }, { value: '15–25', label: t('Reference days to major Russian cities; stock, documents, customs and route may change timing', '俄罗斯主要城市参考天数；库存、文件、清关与路线可能影响周期', 'Ориентир в днях до крупных городов России; наличие, документы, таможня и маршрут влияют на срок') }],
    sections: [
      { title: t('Consolidated procurement', '集中采购', 'Консолидированные закупки'), body: t('Unify fragmented laboratory lists into one review, one commercial conversation and a coordinated shipment plan.', '将分散的实验室采购清单合并为一次审核、一个商务窗口和一套交付计划。', 'Объединяем разрозненные списки в одну проверку, один коммерческий диалог и единый план поставки.'), image: '/manuals/consumables/01-i6baca1811ac6bd491da75573b642d8da1.jpg', bullets: { en: ['Multi-brand list review', 'Unified quotation brief', 'Coordinated documents'], zh: ['多品牌清单审核', '统一报价需求', '文件协同准备'], ru: ['Проверка мультибрендового списка', 'Единый запрос на расчёт', 'Координация документов'] } },
      { title: t('Specified sourcing', '指定型号寻源', 'Поиск по спецификации'), body: t('Share a brand, CAT No. or complete specification. We return a practical sourcing response within about three business days with timing, documents and next actions.', '提交品牌、CAT No. 或完整规格，约 3 个工作日内反馈可执行的货期、文件和下一步安排。', 'Отправьте бренд, CAT No. или полную спецификацию — примерно за три рабочих дня мы вернём срок, документы и следующие шаги.'), image: '/manuals/reagents/01-i1b96fe9d9ba6c8e3c6060a90b02365bb1.jpg', bullets: { en: ['Brand and catalogue matching', 'Availability confirmation', 'Research-use documentation'], zh: ['品牌与目录号匹配', '货期确认', '科研用途文件'], ru: ['Сопоставление бренда и каталожного номера', 'Подтверждение срока', 'Документы для исследований'] } },
      { title: t('Alternative selection', '替代选型', 'Подбор альтернативы'), body: t('When a product is discontinued, constrained or overpriced, we compare options against the requirement before any substitution is proposed.', '当产品停产、断供或成本过高时，我们先按需求比较方案，再提出替代建议。', 'Если позиция снята с производства, недоступна или слишком дорога, мы сначала сравниваем варианты с требованиями.'), image: '/products/protein-biochemistry.jpg' },
      { title: t('Distributor programme', '经销商合作', 'Программа для дистрибьюторов'), body: t('Regional partners can begin with trial orders, then discuss order-specific tiered quotations, product-level MOQ, a dedicated coordination contact, drop-shipment support and available technical materials. Credit terms and territorial arrangements require separate written confirmation.', '区域经销商可从试采开始，再按具体订单确认阶梯报价、产品级 MOQ、专属协调窗口、代发货支持及可提供的技术资料。账期和区域安排须另行书面确认。', 'Региональные партнёры могут начать с пробного заказа, затем согласовать ступенчатый расчёт по заказу, MOQ для каждой позиции, выделенный контакт, дропшиппинг и доступные технические материалы. Отсрочка и территориальные условия требуют отдельного письменного подтверждения.'), image: '/products/cold-chain.jpg' }
    ],
    steps: [
      { title: t('Submit the requirement', '提交需求', 'Отправьте требования'), body: t('Provide the brand, CAT No., specification, quantity, destination and required date.', '提供品牌、CAT No.、规格、数量、目的地和期望日期。', 'Укажите бренд, CAT No., спецификацию, количество, пункт назначения и желаемую дату.') },
      { title: t('Technical review', '需求核对', 'Техническая проверка'), body: t('We align product identity, pack size, intended research use and temperature requirement.', '核对产品身份、包装规格、科研用途和温区要求。', 'Сверяем позицию, фасовку, исследовательское применение и температурный режим.') },
      { title: t('Quotation confirmation', '报价确认', 'Подтверждение расчёта'), body: t('Availability, reference lead time, documents and commercial scope are confirmed before acceptance.', '接受订单前确认货期、参考交付周期、文件和商务范围。', 'До принятия заказа подтверждаются наличие, ориентировочный срок, документы и коммерческий объём.') },
      { title: t('Procurement execution', '采购执行', 'Исполнение закупки'), body: t('The agreed item and source route are followed with exceptions communicated through one contact.', '按确认的产品和来源路径执行，异常由同一窗口及时沟通。', 'Согласованная позиция и маршрут ведутся одним контактом с уведомлением об отклонениях.') },
      { title: t('Document preparation', '文件准备', 'Подготовка документов'), body: t('Available COA, TDS, SDS, batch and export documents are matched to the order.', '将可提供的 COA、TDS、SDS、批次及出口文件与订单对应。', 'Доступные COA, TDS, SDS, данные партии и экспортные документы сопоставляются с заказом.') },
      { title: t('Packing and dispatch', '包装与发运', 'Упаковка и отправка'), body: t('Packaging and handover are arranged for ambient 15–25°C, refrigerated 2–8°C or frozen -20°C handling.', '按常温 15–25°C、冷藏 2–8°C 或冷冻 -20°C 要求安排包装与交接。', 'Упаковка и передача организуются для 15–25°C, 2–8°C или -20°C.') },
      { title: t('Delivery confirmation', '交付确认', 'Подтверждение доставки'), body: t('The receiving team checks package condition, item identity and required storage transfer.', '收货团队核对包装状态、产品身份并及时转入规定储存条件。', 'Получатель проверяет упаковку, позицию и переносит товар в требуемое хранение.') }
    ],
    proof: {
      heading: t('Choose the route that fits your operating model.', '选择适合您运营模式的合作路径。', 'Выберите модель, которая подходит вашей работе.'),
      intro: t('ZEHOLYN BIOTECH supports both one-off specification checks and repeat procurement programmes with the same documented workflow.', 'ZEHOLYN BIOTECH 同时支持单次型号核验和长期重复采购，并沿用同一套可记录流程。', 'ZEHOLYN BIOTECH поддерживает разовые проверки и регулярные закупочные программы в едином документированном процессе.'),
      items: [
        { title: t('Research institutions', '科研院所', 'Научные учреждения'), body: t('Consolidate fragmented lists, align technical documents and plan delivery around project milestones.', '合并分散清单，统一技术文件，并围绕项目节点安排交付。', 'Объединяем списки, согласуем документы и планируем поставку по этапам проекта.') },
        { title: t('Biopharma & diagnostics', '生物医药与检测', 'Биофарма и диагностика'), body: t('Match exact catalogue numbers, temperature lanes and batch-level evidence before release.', '发货前核对准确目录号、温区和批次级证据。', 'До отгрузки сверяем каталожные номера, температурный режим и данные партии.') },
        { title: t('Regional distributors', '区域经销商', 'Региональные дистрибьюторы'), body: t('Use trial orders, tiered pricing and drop-shipment coordination to expand coverage without heavy inventory.', '通过试采、阶梯价格和代发货协同扩展覆盖，降低库存压力。', 'Пробные заказы, ступенчатые цены и дропшиппинг помогают расширять покрытие без избыточного запаса.') }
      ]
    }
  },
  quality: {
    eyebrow: t('QUALITY & COMPLIANCE', '质量与合规', 'КАЧЕСТВО И СООТВЕТСТВИЕ'),
    title: t('Evidence you can use before the shipment leaves.', '在货物发出前就能核验的质量证据。', 'Подтверждения, доступные до отправки груза.'),
    intro: t('Our sourcing workflow keeps source, batch documentation, temperature handling and handover records visible at the points where procurement decisions are made.', '在采购决策的关键节点，让来源、批次文件、温控处理和交接记录保持可见。', 'На ключевых этапах закупки видны источник, документы партии, температурный режим и записи передачи.'),
    heroImage: '/manuals/reagents/06-i0a7b18fe87214813670dd8da8e95443e1.jpg',
    stats: [{ value: 'COA', label: t('Batch certificate availability where provided by source', '按来源可提供批次证书', 'Сертификат партии при наличии у источника') }, { value: 'TDS', label: t('Technical data aligned to the requested item', '与指定产品对应的技术文件', 'Технические данные по запрошенной позиции') }, { value: 'SDS', label: t('Safety documentation prepared for handover', '交付时配套安全文件', 'Паспорт безопасности для передачи') }],
    sections: [
      { title: t('Source and identity review', '来源与身份审核', 'Проверка источника и позиции'), body: t('Before quotation, we compare the supplier route, brand, CAT No., pack size and declared storage requirement. Available source and batch evidence is recorded without implying manufacturer authorization where none has been confirmed.', '报价前核对供应路径、品牌、CAT No.、包装规格和标示储存要求，并记录可获得的来源与批次证据；未经确认时不暗示厂商授权关系。', 'До расчёта сверяются маршрут поставщика, бренд, CAT No., фасовка и условия хранения. Доступные сведения об источнике и партии фиксируются без заявления об авторизации производителя, если она не подтверждена.'), image: '/products/quality-control.jpg' },
      { title: t('Item-matched document pack', '逐项匹配的文件包', 'Пакет документов по позиции'), body: t('Available COA, TDS, SDS, batch, sterility or nuclease-free statements are checked against the exact item. Document type and delivery timing are confirmed before dispatch because availability varies by product and source.', '将可提供的 COA、TDS、SDS、批次、无菌或无酶声明与具体产品逐项核对。由于文件随产品和来源而异，发运前确认文件类型和提供时间。', 'Доступные COA, TDS, SDS, сведения о партии, стерильности или отсутствии нуклеаз сверяются с точной позицией. Тип и срок предоставления подтверждаются до отправки.'), image: '/products/molecular-biology.jpg', bullets: { en: ['COA and batch data where available', 'TDS and declared specifications', 'SDS and handling guidance', 'Product-specific statements where applicable'], zh: ['按可用性提供 COA 与批次资料', 'TDS 与标示规格', 'SDS 与操作安全说明', '适用时提供产品专项声明'], ru: ['COA и партия при наличии', 'TDS и заявленные характеристики', 'SDS и правила обращения', 'Заявления по продукту при применимости'] } },
      { title: t('Three temperature lanes', '三档温区处理', 'Три температурных режима'), body: t('Ambient 15–25°C items use protective packing appropriate to transit; refrigerated 2–8°C items use qualified coolant and insulated packaging; frozen -20°C items use a frozen configuration selected for route duration. Labels, dispatch time and receiving handover are aligned to the manufacturer requirement.', '常温 15–25°C 产品采用适合运输的防护包装；冷藏 2–8°C 产品采用保温包装与适配冷媒；冷冻 -20°C 产品根据路线时长选择冷冻包装方案。标签、发运时间和收货交接均按厂商要求对齐。', 'Для 15–25°C применяется защитная транспортная упаковка; для 2–8°C — термоизоляция и подходящий хладагент; для -20°C — замороженная конфигурация с учётом маршрута. Маркировка, время отправки и передача согласуются с требованиями производителя.'), image: '/products/cold-chain.jpg', bullets: { en: ['15–25°C ambient protection', '2–8°C insulated refrigerated lane', '-20°C frozen lane', 'Receiving and storage-transfer check'], zh: ['15–25°C 常温防护', '2–8°C 保温冷藏通道', '-20°C 冷冻通道', '收货与转储检查'], ru: ['Защита 15–25°C', 'Охлаждение 2–8°C', 'Замороженный режим -20°C', 'Проверка приёмки и хранения'] } },
      { title: t('Exception and delivery control', '异常与交付控制', 'Контроль отклонений и доставки'), body: t('At packing and receipt, item identity, exterior condition, CAT No., batch and expiry are checked where shown. Damage, temperature concern or document mismatch is isolated, recorded and reviewed before use; the appropriate remedy is then agreed under the order terms and available evidence.', '包装与收货环节在有标示时核对产品身份、外观、CAT No.、批次和有效期。遇到破损、温度疑虑或文件不符时先隔离、记录并在使用前复核，再依据订单条款和现有证据确认处理方案。', 'При упаковке и приёмке проверяются позиция, внешний вид, CAT No., партия и срок годности, если они указаны. Повреждение, температурное отклонение или несоответствие документов изолируется и фиксируется до использования; решение согласуется по условиям заказа и доступным данным.'), image: '/products/lab-consumables.jpg' }
    ],
    steps: [
      { title: t('Source review', '来源审核', 'Проверка источника'), body: t('Brand, channel and item identity are checked.', '核对品牌、渠道与产品身份。', 'Проверяем бренд, канал и идентичность позиции.') },
      { title: t('Quality alignment', '质量对齐', 'Согласование качества'), body: t('Documents and temperature requirements are matched.', '匹配文件和温区要求。', 'Сверяем документы и температурные требования.') },
      { title: t('Handover record', '交接记录', 'Запись передачи'), body: t('Packaging, delivery and receiving checks are documented.', '记录包装、交付和收货检查。', 'Фиксируем упаковку, доставку и приёмку.') }
    ],
    proof: {
      heading: t('A controlled handover, not a single document.', '受控交接，而不只是单一文件。', 'Контролируемая передача, а не один документ.'),
      intro: t('Quality evidence is assembled around the actual product, source and temperature requirement so your receiving team can review the same record.', '质量证据围绕具体产品、来源和温区要求整理，让收货团队面对同一份记录。', 'Доказательства качества собираются по продукту, источнику и температурному режиму, чтобы приёмка работала с одной записью.'),
      items: [
        { title: t('Identity & source', '身份与来源', 'Идентичность и источник'), body: t('Brand, CAT No., source channel, pack size and batch references are matched to the request.', '将品牌、CAT No.、来源渠道、包装规格和批次信息与需求匹配。', 'Бренд, CAT No., канал, фасовка и партия сопоставляются с запросом.') },
        { title: t('Condition & temperature', '状态与温区', 'Состояние и температура'), body: t('Ambient, 2–8°C or -20°C handling is selected from the manufacturer requirement and recorded through handover.', '依据厂商要求选择常温、2–8°C 或 -20°C，并在交接中记录。', 'Режим Ambient, 2–8°C или -20°C выбирается по требованиям производителя и фиксируется при передаче.') },
        { title: t('Import & receiving', '进口与收货', 'Импорт и приёмка'), body: t('Export files, customs coordination and receiving checks are treated as one route with early exception handling.', '将出口文件、清关协调和收货检查作为一条路径，异常提前沟通。', 'Экспортные документы, таможня и приёмка ведутся как один маршрут с ранним сообщением об отклонениях.') }
      ]
    }
  },
  resources: {
    eyebrow: t('RESOURCE CENTRE', '资源中心', 'РЕСУРСНЫЙ ЦЕНТР'),
    title: t('Practical references for better laboratory procurement.', '帮助实验室做出更好采购决策的实用资料。', 'Практические материалы для точных закупок лаборатории.'),
    intro: t('Use our guides to prepare a clearer purchase list, choose a temperature lane and understand the files that travel with research products.', '使用采购指南准备清晰清单、选择温区，并了解科研产品随附文件。', 'Используйте руководства, чтобы подготовить список, выбрать температурный режим и понять комплект документов.'),
    heroImage: '/manuals/reagents/00-i758290f093508846081afea3db2597471.jpg',
    sections: [
      { title: t('Procurement guides', '采购指南', 'Руководства по закупкам'), body: t('How to include brand, CAT No., pack size, quantity and delivery city so the sourcing desk can answer quickly.', '如何提交品牌、CAT No.、包装规格、数量和交付城市，让寻源团队快速回复。', 'Как указать бренд, CAT No., фасовку, количество и город доставки для быстрого ответа.'), image: '/products/molecular-biology.jpg' },
      { title: t('Storage & shipping', '储存与运输', 'Хранение и доставка'), body: t('A practical checklist for ambient, refrigerated and frozen shipments, from dispatch documents to receipt inspection.', '覆盖常温、冷藏和冷冻运输的实用清单，从发运文件到收货检查。', 'Чек-лист для обычных, охлаждённых и замороженных отправлений: от документов до приёмки.'), image: '/products/cold-chain.jpg' },
      { title: t('Quality documents', '质量文件', 'Документы качества'), body: t('Understand the role of COA, TDS, SDS and sterility or nuclease-free statements in a research purchase.', '理解 COA、TDS、SDS 以及无菌、无酶声明在科研采购中的作用。', 'Разберитесь в назначении COA, TDS, SDS и заявлений о стерильности или отсутствии нуклеаз.'), image: '/products/quality-control.jpg' },
      { title: t('FAQ and request templates', 'FAQ 与询盘模板', 'FAQ и шаблоны запросов'), body: t('Start with a structured RFQ when the requirement is specific, multi-brand or time-sensitive.', '当需求具体、多品牌或有时间要求时，直接使用结构化询盘。', 'Для точных, мультибрендовых или срочных требований используйте структурированный запрос.'), image: '/products/lab-consumables.jpg' }
    ],
    proof: {
      heading: t('A resource centre built around the real buying cycle.', '围绕真实采购周期构建的资源中心。', 'Ресурсный центр для реального цикла закупки.'),
      intro: t('Move from specification to receiving with checklists and reference documents that can be shared internally.', '用可内部共享的清单和参考文件，从规格确认走到收货验收。', 'Переходите от спецификации к приёмке с помощью чек-листов и материалов для внутреннего использования.'),
      items: [
        { title: t('Before the request', '提交需求前', 'До запроса'), body: t('Prepare brand, CAT No., pack size, quantity, temperature and delivery city.', '准备品牌、CAT No.、包装、数量、温区和交付城市。', 'Подготовьте бренд, CAT No., фасовку, количество, температуру и город.') },
        { title: t('Before dispatch', '发货前', 'До отгрузки'), body: t('Confirm source, available documents, packaging lane and expected lead time.', '确认来源、可提供文件、包装温区和预计周期。', 'Подтвердите источник, документы, упаковку и срок поставки.') },
        { title: t('At receipt', '收货时', 'При приёмке'), body: t('Record package condition, temperature evidence and storage transfer before use.', '记录包装状态、温度证据并及时转入规定存储条件。', 'Зафиксируйте состояние, температурные данные и перенос в нужное хранение.') }
      ]
    }
  },
  about: {
    eyebrow: t('ABOUT ZEHOLYN BIOTECH', '关于 ZEHOLYN BIOTECH', 'О ZEHOLYN BIOTECH'),
    title: t('ZEHOLYN BIOTECH: an independent cross-border life-science supply provider.', '深圳泽鸿衍生生物科技有限公司：独立的跨境生命科学供应服务商。', 'ZEHOLYN BIOTECH: независимый поставщик решений для трансграничных закупок life science.'),
    intro: t('深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) independently coordinates procurement channels across the Americas, Europe, Asia-Pacific and China with documented delivery routes for customers across Russia.', '深圳泽鸿衍生生物科技有限公司（ZEHOLYN BIOTECH）独立协调美洲、欧洲、亚太和中国的采购渠道，为俄罗斯客户提供有记录的交付路径。', '深圳泽鸿衍生生物科技有限公司 (ZEHOLYN BIOTECH) независимо координирует закупочные каналы Америки, Европы, АТР и Китая и документированные маршруты поставки в Россию.'),
    heroImage: '/manuals/consumables/00-i8346f2024cc5ff366f1ccf18ae4951df1.jpg',
    stats: [{ value: '16', label: t('Core reagent and consumable categories', '核心试剂与耗材品类', 'Основных категорий реагентов и расходников') }, { value: '4', label: t('Source regions represented in the catalogue', '目录覆盖的供应区域', 'Региона поставок в каталоге') }, { value: 'RU', label: t('Primary delivery market', '主要交付市场', 'Основной рынок поставки') }],
    sections: [
      { title: t('Serving research and industry', '服务科研与产业客户', 'Для исследований и индустрии'), body: t('Our supply scope supports research institutes, universities, biopharmaceutical companies, clinical testing laboratories and industrial R&D teams.', '供应范围面向科研院所、高校实验室、生物医药企业、临床检验机构和工业研发团队。', 'Поставки предназначены для НИИ, университетов, биофармацевтических компаний, клинико-диагностических лабораторий и промышленных R&D-команд.'), image: '/manuals/consumables/02-i1491b2048528bd9a975745e5221802a01.jpg' },
      { title: t('Procurement reach across four source regions', '覆盖四大来源区域的采购能力', 'Закупки в четырёх регионах'), body: t('Our independent procurement scope includes products from Thermo Fisher, Bio-Rad, Roche, Merck, Sartorius, TaKaRa, FUJIFILM Wako, Vazyme, NEST and other specialist brands listed in the catalogues. Brand references describe sourcing scope, not agency or authorization.', '独立采购范围涵盖 Thermo Fisher、Bio-Rad、Roche、Merck、Sartorius、TaKaRa、FUJIFILM Wako、Vazyme、NEST 及目录所列专业品牌。品牌名称仅用于说明寻源范围，不代表代理或授权关系。', 'Независимый ассортимент закупок включает продукцию Thermo Fisher, Bio-Rad, Roche, Merck, Sartorius, TaKaRa, FUJIFILM Wako, Vazyme, NEST и других брендов каталога. Упоминание бренда обозначает возможность поиска, а не агентство или авторизацию.'), image: '/manuals/reagents/03-ib48b72e09e4ad533a282e11c172de7461.jpg' },
      { title: t('Research use only', '仅限科研用途', 'Только для исследовательских целей'), body: t('Products listed through this site are intended for research use. Final suitability, specifications and contract terms are confirmed before supply.', '网站展示产品仅供科研用途，最终适用性、规格和合同条款在供货前确认。', 'Продукты предназначены для исследований. Пригодность, спецификация и условия договора подтверждаются до поставки.'), image: '/products/microscopy.jpg' }
    ],
    proof: {
      heading: t('Built for accountable cross-border supply.', '为可负责的跨境供应而建。', 'Создано для ответственных трансграничных поставок.'),
      intro: t('Our role is to make a complex international purchase understandable: what is available, from where, under which condition and with which documents.', '我们的职责是把复杂的国际采购讲清楚：有什么、来自哪里、按什么条件交付、配套哪些文件。', 'Наша задача — сделать международную закупку понятной: что доступно, откуда, в каком режиме и с какими документами.'),
      items: [
        { title: t('Four source regions', '四大供应区域', 'Четыре региона поставок'), body: t('Americas, Europe, Asia-Pacific and China channels are represented across the two product manuals.', '两本手册覆盖美洲、欧洲、亚太和中国供应渠道。', 'Два каталога охватывают каналы Америки, Европы, АТР и Китая.') },
        { title: t('Two product lines', '两条产品线', 'Два направления'), body: t('Research reagents and laboratory consumables are managed in one procurement conversation.', '科研试剂与实验室耗材纳入同一个采购窗口。', 'Реагенты и лабораторные расходники ведутся в одном закупочном контакте.') },
        { title: t('One accountable desk', '一个负责到底的窗口', 'Один ответственный контакт'), body: t('Selection, sourcing, quotation, documents and delivery coordination stay connected from first message to handover.', '从首次沟通到交接，选型、寻源、报价、文件和交付保持连贯。', 'Подбор, поиск, расчёт, документы и доставка связаны от первого сообщения до передачи.') }
      ]
    }
  },
  contact: {
    eyebrow: t('CONTACT THE SOURCING DESK', '联系采购团队', 'СВЯЗАТЬСЯ С ОТДЕЛОМ СНАБЖЕНИЯ'),
    title: t('Bring us the exact item, the full list or the problem behind it.', '无论是具体型号、完整清单还是采购难题，都可以交给我们。', 'Передайте нам конкретную позицию, полный список или задачу закупки.'),
    intro: t('Use WhatsApp or VK for a quick conversation, or send a structured RFQ when your team needs a documented response.', '需要快速沟通时使用 WhatsApp 或 VK；需要正式记录时提交结构化询盘。', 'Для быстрого диалога используйте WhatsApp или VK, а для документированного ответа — структурированный запрос.'),
    heroImage: '/manuals/consumables/07-id57679c2fc7a2fdc06c838c71df9a7aa1.jpg',
    sections: [
      { title: t('WhatsApp · fastest route', 'WhatsApp · 快速通道', 'WhatsApp · быстрый канал'), body: t('Send a short message with your company, product name, brand or CAT No. and delivery city.', '发送公司、产品名称、品牌或 CAT No. 以及交付城市。', 'Отправьте компанию, продукт, бренд или CAT No. и город доставки.') },
      { title: t('VK · local social channel', 'VK · 本地社媒渠道', 'VK · локальный социальный канал'), body: t('Use VK when your team prefers a Russian-language social channel for the first conversation.', '如果团队更习惯俄语社交渠道，可通过 VK 开始沟通。', 'Используйте VK, если вашей команде удобнее начать диалог в русскоязычном канале.') },
      { title: t('Structured RFQ · complete brief', '结构化询盘 · 完整需求', 'Структурированный запрос · полный бриф'), body: t('Attach a purchase list and include quantity, temperature lane, desired date and notes for a complete review.', '可附采购清单，并填写数量、温区、期望日期和补充说明。', 'Приложите список закупки и укажите количество, температуру, дату и примечания.') }
    ],
    proof: {
      heading: t('Three practical ways to start a conversation.', '三种清晰的沟通方式。', 'Три понятных способа начать диалог.'),
      intro: t('Choose the channel based on urgency and the amount of detail your team already has prepared.', '根据紧急程度和团队已准备的信息量选择沟通方式。', 'Выберите канал по срочности и объёму подготовленной информации.'),
      items: [
        { title: t('Fast check', '快速核验', 'Быстрая проверка'), body: t('WhatsApp for a product name, brand or CAT No. that needs a quick route check.', '适合用 WhatsApp 提交产品名称、品牌或 CAT No. 做快速核验。', 'WhatsApp подходит для быстрой проверки продукта, бренда или CAT No.') },
        { title: t('Russian-language chat', '俄语沟通', 'Диалог на русском'), body: t('VK for a local social conversation before the formal quotation step.', '在正式报价前，通过 VK 进行本地化社媒沟通。', 'VK удобен для локального диалога до этапа официального расчёта.') },
        { title: t('Complete RFQ', '完整询盘', 'Полный запрос'), body: t('Use the structured form when several brands, cold-chain items or attachments are involved.', '涉及多品牌、冷链产品或附件时，使用结构化询盘表单。', 'Используйте форму, если есть несколько брендов, холодовая цепь или вложения.') }
      ]
    }
  },
  privacy: {
    eyebrow: t('PRIVACY', '隐私政策', 'КОНФИДЕНЦИАЛЬНОСТЬ'),
    title: t('A clear policy for business enquiries.', '关于企业询盘的清晰说明。', 'Понятная политика обработки деловых запросов.'),
    intro: t('We collect only the information needed to respond to a sourcing request, coordinate delivery and maintain a reliable business record.', '我们只收集回复寻源需求、协调交付和维护业务记录所需的信息。', 'Мы собираем только данные, необходимые для ответа, координации поставки и деловой записи.'),
    heroImage: '/products/quality-control.jpg',
    sections: [
      { title: t('Purpose limitation', '用途限定', 'Ограничение цели'), body: t('RFQ details are used to evaluate products, obtain availability and prepare a commercial response. They are not sold or used for unrelated marketing.', '询盘信息用于评估产品、确认货期和准备商务回复，不出售，也不用于无关营销。', 'Данные запроса используются для оценки, подтверждения сроков и подготовки ответа, но не продаются и не применяются для стороннего маркетинга.') },
      { title: t('Access control', '访问控制', 'Контроль доступа'), body: t('Only authorised members of the sourcing and operations team can access submitted business information and private attachments.', '只有授权的寻源和运营人员可以访问企业信息和私有附件。', 'Доступ к данным и вложениям имеют только уполномоченные сотрудники снабжения и операций.') },
      { title: t('Retention and contact', '保存与联系', 'Хранение и контакт'), body: t('Records are retained for as long as needed to manage the enquiry and related commercial obligations. Contact the sourcing desk for correction or deletion requests.', '数据在处理询盘和相关商务义务所需期间保存。如需更正或删除，请联系采购团队。', 'Записи хранятся столько, сколько необходимо для запроса и связанных обязательств. Для исправления или удаления обратитесь в отдел снабжения.') }
    ]
  },
  terms: {
    eyebrow: t('TERMS OF USE', '使用条款', 'УСЛОВИЯ ИСПОЛЬЗОВАНИЯ'),
    title: t('Use the catalogue as a procurement starting point.', '将目录作为采购沟通的起点。', 'Используйте каталог как отправную точку закупки.'),
    intro: t('Product availability, specifications, prices, lead times and service terms are confirmed for the final request and contract.', '产品货期、规格、价格、交付周期和服务条款以最终询盘和合同确认为准。', 'Наличие, спецификации, цены, сроки и условия подтверждаются по окончательному запросу и договору.'),
    heroImage: '/products/lab-consumables.jpg',
    sections: [
      { title: t('Research use only', '仅限科研用途', 'Только для исследований'), body: t('Products shown on this site are intended for research use and are not presented as clinical diagnostic or therapeutic products.', '网站展示产品仅供科研用途，不作为临床诊断或治疗产品。', 'Продукты предназначены для исследований и не заявляются как клинические или терапевтические.') },
      { title: t('No unsupported promises', '不作未经验证的承诺', 'Без неподтверждённых обещаний'), body: t('Brand names are shown to indicate sourcing capability. Performance, certification, stock and delivery are confirmed item by item.', '品牌名称用于表示供应能力，性能、认证、库存和交付逐项确认。', 'Бренды показывают возможности поиска. Характеристики, сертификаты, остатки и доставка подтверждаются по каждой позиции.') },
      { title: t('Final contract governs', '最终合同优先', 'Приоритет договора'), body: t('The final procurement contract controls the agreed specification, quantity, documents, delivery and commercial terms.', '最终采购合同约定规格、数量、文件、交付和商务条款。', 'Окончательный договор определяет спецификацию, количество, документы, доставку и коммерческие условия.') }
    ]
  },
  legal: {
    eyebrow: t('LEGAL STATEMENT', '法律声明', 'ПРАВОВОЕ ЗАЯВЛЕНИЕ'),
    title: t('Clear boundaries for research procurement.', '明确科研采购信息与服务边界。', 'Чёткие границы информации и услуг для исследований.'),
    intro: t('This statement explains how product information, third-party brands, research-use restrictions and cross-border compliance apply to this website and each request.', '本声明说明网站和每项询盘中的产品信息、第三方品牌、科研用途限制及跨境合规责任。', 'Здесь разъясняется применение данных о продуктах, сторонних брендов, ограничений исследовательского использования и трансграничного соответствия.'),
    heroImage: '/products/quality-control.jpg',
    sections: [
      { title: t('Company identity', '公司主体', 'Компания'), body: t('This website is operated by 深圳泽鸿衍生生物科技有限公司 under the English brand name ZEHOLYN BIOTECH. Business identity, product scope and commercial terms are confirmed in the final quotation and contract.', '本网站由深圳泽鸿衍生生物科技有限公司运营，英文品牌名称为 ZEHOLYN BIOTECH。业务主体、产品范围和商务条款以最终报价与合同为准。', 'Сайт управляется 深圳泽鸿衍生生物科技有限公司 под англоязычным брендом ZEHOLYN BIOTECH. Сторона сделки, ассортимент и коммерческие условия определяются окончательным предложением и договором.') },
      { title: t('Independent procurement and trademarks', '独立采购与商标', 'Независимые закупки и товарные знаки'), body: t('ZEHOLYN BIOTECH is an independent procurement and supply provider. References to third-party brands, product names and trademarks identify requested or sourceable products only. They remain the property of their respective owners and do not imply agency, authorization, endorsement or partnership unless separately confirmed in writing.', 'ZEHOLYN BIOTECH 是独立采购与供应服务商。第三方品牌、产品名称和商标仅用于识别客户所需或可寻源产品，相关权利归各自权利人所有；除非另有书面确认，不代表代理、授权、认可或合作关系。', 'ZEHOLYN BIOTECH действует как независимый поставщик. Ссылки на сторонние бренды, названия и товарные знаки служат только для идентификации запрошенных или доступных для поиска продуктов, принадлежат их владельцам и не означают агентство, авторизацию, одобрение или партнёрство без отдельного письменного подтверждения.') },
      { title: t('Research Use Only', '仅供科研使用', 'Только для исследовательского использования'), body: t('Products presented or supplied through this website are intended for laboratory research use unless the final manufacturer documentation expressly states otherwise. They are not offered for human diagnosis, treatment, clinical use, food use or direct administration to humans or animals.', '除非最终厂商文件另有明确说明，通过本网站展示或供应的产品仅供科研使用，限于实验室研究，不用于人体诊断、治疗、临床用途、食品用途，亦不得直接用于人或动物。', 'Продукты предназначены только для исследовательского использования и лабораторных исследований, если итоговая документация производителя прямо не указывает иное. Они не предлагаются для диагностики, лечения, клинического или пищевого применения и прямого введения человеку или животному.') },
      { title: t('Product information and availability', '产品信息与可供性', 'Информация и наличие'), body: t('Catalogue text and images are procurement references compiled from available source materials. Specifications, packaging, storage, batch, documents, price, availability and lead time must be reconfirmed for the exact CAT No. before order acceptance. Manufacturer documentation and the final contract govern where information differs.', '目录文字和图片依据现有来源资料整理，仅作采购参考。规格、包装、储存、批次、文件、价格、库存及周期须在接受订单前按具体 CAT No. 重新确认；如信息不一致，以厂商文件和最终合同为准。', 'Текст и изображения каталога являются справочной информацией, собранной из доступных материалов. Характеристики, упаковка, хранение, партия, документы, цена, наличие и срок подтверждаются по точному CAT No. до принятия заказа. При расхождении приоритет имеют документы производителя и окончательный договор.') },
      { title: t('Import, export and destination compliance', '进出口与目的地合规', 'Импорт, экспорт и соответствие в стране назначения'), body: t('Supply is subject to applicable export controls, customs requirements, transport restrictions and destination-country rules. The parties must confirm consignee eligibility, permits, declarations and intended use before shipment. A catalogue listing is not a guarantee that an item can lawfully be exported, imported or delivered to every destination.', '供货受适用的出口管制、海关要求、运输限制及目的地法规约束。发运前，双方须确认收货资质、许可、申报和预期用途。产品在目录中展示不代表其可合法出口、进口或交付至所有目的地。', 'Поставка регулируется экспортным контролем, таможенными требованиями, транспортными ограничениями и правилами страны назначения. До отправки стороны подтверждают право получателя, разрешения, декларации и назначение. Наличие позиции в каталоге не гарантирует законность экспорта, импорта или доставки в любую страну.') },
      { title: t('Limitation and contact', '责任边界与联系', 'Ограничение и контакт'), body: t('Website information does not replace manufacturer instructions, professional laboratory assessment or a signed supply contract. For corrections, rights questions or compliance concerns, contact the business email shown on the Contact page before relying on the information.', '网站信息不能替代厂商说明书、专业实验室评估或已签署的供货合同。如需更正信息、咨询权利或反馈合规问题，请在依赖相关信息前通过 Contact 页面所列商务邮箱联系。', 'Информация сайта не заменяет инструкции производителя, профессиональную лабораторную оценку или подписанный договор. Для исправлений, вопросов о правах или соответствии обратитесь по деловому адресу на странице контактов до использования информации.') }
    ]
  }
}

export function getPageContent(kind: string) {
  return pageContent[kind] || pageContent.about
}
