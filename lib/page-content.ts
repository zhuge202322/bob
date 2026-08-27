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
    stats: [{ value: '01', label: t('One accountable procurement desk', '一个负责到底的采购窗口', 'Один ответственный закупочный контакт') }, { value: '03', label: t('Temperature lanes', '三档温区', 'Три температурных режима') }, { value: '15–25', label: t('Reference delivery days to major Russian cities', '俄罗斯主要城市参考交付周期（天）', 'Ориентир доставки в крупные города России, дней') }],
    sections: [
      { title: t('Consolidated procurement', '集中采购', 'Консолидированные закупки'), body: t('Unify fragmented laboratory lists into one review, one commercial conversation and a coordinated shipment plan.', '将分散的实验室采购清单合并为一次审核、一个商务窗口和一套交付计划。', 'Объединяем разрозненные списки в одну проверку, один коммерческий диалог и единый план поставки.'), image: '/manuals/consumables/01-i6baca1811ac6bd491da75573b642d8da1.jpg', bullets: { en: ['Multi-brand list review', 'Unified quotation brief', 'Coordinated documents'], zh: ['多品牌清单审核', '统一报价需求', '文件协同准备'], ru: ['Проверка мультибрендового списка', 'Единый запрос на расчёт', 'Координация документов'] } },
      { title: t('Specified sourcing', '指定型号寻源', 'Поиск по спецификации'), body: t('Share a brand, CAT No. or complete specification. We return a practical sourcing response within about three business days with timing, documents and next actions.', '提交品牌、CAT No. 或完整规格，约 3 个工作日内反馈可执行的货期、文件和下一步安排。', 'Отправьте бренд, CAT No. или полную спецификацию — примерно за три рабочих дня мы вернём срок, документы и следующие шаги.'), image: '/manuals/reagents/01-i1b96fe9d9ba6c8e3c6060a90b02365bb1.jpg', bullets: { en: ['Brand and catalogue matching', 'Availability confirmation', 'Research-use documentation'], zh: ['品牌与目录号匹配', '货期确认', '科研用途文件'], ru: ['Сопоставление бренда и каталожного номера', 'Подтверждение срока', 'Документы для исследований'] } },
      { title: t('Alternative selection', '替代选型', 'Подбор альтернативы'), body: t('When a product is discontinued, constrained or overpriced, we compare options against the requirement before any substitution is proposed.', '当产品停产、断供或成本过高时，我们先按需求比较方案，再提出替代建议。', 'Если позиция снята с производства, недоступна или слишком дорога, мы сначала сравниваем варианты с требованиями.'), image: '/products/protein-biochemistry.jpg' },
      { title: t('Distributor programme', '经销商合作', 'Программа для дистрибьюторов'), body: t('Support regional partners with trial orders, tiered supply, drop shipment coordination and technical materials.', '为区域经销商提供试采、阶梯供货、代发货协同和技术资料支持。', 'Поддерживаем региональных партнёров пробными заказами, ступенчатыми поставками, дропшиппингом и материалами.'), image: '/products/cold-chain.jpg' }
    ],
    steps: [
      { title: t('Send the requirement', '提交需求', 'Отправьте требования'), body: t('Brand, CAT No., specification or purchase list.', '品牌、CAT No.、规格或采购清单。', 'Бренд, CAT No., спецификация или список закупки.') },
      { title: t('Clarify the route', '确认路径', 'Уточняем маршрут'), body: t('We confirm source, documents, temperature lane and delivery city.', '确认来源、文件、温区和交付城市。', 'Подтверждаем источник, документы, температуру и город доставки.') },
      { title: t('Receive a documented response', '获得有文件记录的回复', 'Получите документированный ответ'), body: t('Timing, options and next actions are returned through one contact.', '通过一个联系人返回货期、方案和下一步。', 'Сроки, варианты и следующие действия возвращаются одним контактом.') }
    ],
    proof: {
      heading: t('Choose the route that fits your operating model.', '选择适合您运营模式的合作路径。', 'Выберите модель, которая подходит вашей работе.'),
      intro: t('Hocore supports both one-off specification checks and repeat procurement programmes with the same documented workflow.', 'Hocore 同时支持单次型号核验和长期重复采购，并沿用同一套可记录流程。', 'Hocore поддерживает разовые проверки и регулярные закупочные программы в едином документированном процессе.'),
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
      { title: t('Source traceability', '来源溯源', 'Прослеживаемость источника'), body: t('We work from original-source and authorised distribution channels where available, then record the relevant brand, batch and document references for the order.', '优先从原厂或授权分销渠道寻源，并记录订单对应的品牌、批次和文件信息。', 'Используем каналы производителя и авторизованной дистрибуции, фиксируя бренд, партию и документы заказа.'), image: '/products/quality-control.jpg' },
      { title: t('Document pack', '文件包', 'Пакет документов'), body: t('COA, TDS, SDS and product statements are checked against the requested product and temperature requirement before dispatch.', '发货前按产品和温区核对 COA、TDS、SDS 及产品声明。', 'До отправки COA, TDS, SDS и заявления по продукту сверяются с позицией и температурным режимом.'), image: '/products/molecular-biology.jpg', bullets: { en: ['COA / batch information', 'TDS / specifications', 'SDS / handling guidance'], zh: ['COA / 批次信息', 'TDS / 产品规格', 'SDS / 操作与安全说明'], ru: ['COA / данные партии', 'TDS / спецификация', 'SDS / правила обращения'] } },
      { title: t('Temperature-aware handling', '温控处理', 'Температурный контроль'), body: t('Ambient, 2–8°C and -20°C lanes are selected with packaging and handover steps matched to the item requirement.', '根据产品要求选择常温、2–8°C 和 -20°C 温区，并匹配包装和交接步骤。', 'Режим Ambient, 2–8°C или -20°C выбирается по продукту, упаковка и передача согласуются заранее.'), image: '/products/cold-chain.jpg' },
      { title: t('Customs and delivery', '清关与交付', 'Таможня и доставка'), body: t('Export documentation, customs coordination and final-city delivery are treated as one route, with exceptions communicated early.', '将出口文件、清关协调和城市末端交付作为一条路径管理，异常及时沟通。', 'Экспортные документы, таможня и доставка до города рассматриваются как один маршрут, об исключениях сообщаем заранее.'), image: '/products/lab-consumables.jpg' }
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
    eyebrow: t('ABOUT HOCORE', '关于 Hocore', 'О HOCORE'),
    title: t('Shenzhen Hocore Biotech: a cross-border life science supply partner.', '深圳泽鸿衍生物科技：跨境生命科学供应伙伴。', 'Shenzhen Hocore Biotech: партнёр по трансграничным поставкам life science.'),
    intro: t('Shenzhen Hocore Biotech Co., Ltd. connects brands and supply channels across the Americas, Europe, Asia-Pacific and China with documented delivery routes for customers across Russia.', '深圳泽鸿衍生物科技有限公司连接美洲、欧洲、亚太和中国的品牌与供应渠道，为俄罗斯客户提供有文件记录的交付路径。', 'Shenzhen Hocore Biotech Co., Ltd. объединяет бренды и каналы Америки, Европы, Азиатско-Тихоокеанского региона и Китая с документированными маршрутами доставки по России.'),
    heroImage: '/manuals/consumables/00-i8346f2024cc5ff366f1ccf18ae4951df1.jpg',
    stats: [{ value: '16', label: t('Core reagent and consumable categories', '核心试剂与耗材品类', 'Основных категорий реагентов и расходников') }, { value: '4', label: t('Source regions represented in the catalogue', '目录覆盖的供应区域', 'Региона поставок в каталоге') }, { value: 'RU', label: t('Primary delivery market', '主要交付市场', 'Основной рынок поставки') }],
    sections: [
      { title: t('Serving research and industry', '服务科研与产业客户', 'Для исследований и индустрии'), body: t('Our supply scope supports research institutes, universities, biopharmaceutical companies, clinical testing laboratories and industrial R&D teams.', '供应范围面向科研院所、高校实验室、生物医药企业、临床检验机构和工业研发团队。', 'Поставки предназначены для НИИ, университетов, биофармацевтических компаний, клинико-диагностических лабораторий и промышленных R&D-команд.'), image: '/manuals/consumables/02-i1491b2048528bd9a975745e5221802a01.jpg' },
      { title: t('One network across four source regions', '四大来源区域的供应网络', 'Сеть поставок из четырёх регионов'), body: t('Representative supply coverage includes Thermo Fisher, Bio-Rad, Roche, Merck, Sartorius, TaKaRa, FUJIFILM Wako, Vazyme, NEST and other specialist brands listed in our manuals.', '代表性供应网络包括 Thermo Fisher、Bio-Rad、Roche、Merck、Sartorius、TaKaRa、FUJIFILM Wako、Vazyme、NEST 及手册所列专业品牌。', 'Сеть включает Thermo Fisher, Bio-Rad, Roche, Merck, Sartorius, TaKaRa, FUJIFILM Wako, Vazyme, NEST и другие бренды из каталогов.'), image: '/manuals/reagents/03-ib48b72e09e4ad533a282e11c172de7461.jpg' },
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
  }
}

export function getPageContent(kind: string) {
  return pageContent[kind] || pageContent.about
}
