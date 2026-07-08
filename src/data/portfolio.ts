export interface PortfolioSummary {
  positioning: string
  targetRole: string
  targetMarket: string
  budget: string
  timeline: string
  launchHypothesis: string
  capabilities: string[]
  platforms: string[]
}

export interface CaseStudySection {
  id: string
  eyebrow: string
  title: string
  summary: string
  proofPoints: string[]
}

export interface ExecutionTimelineItem {
  period: string
  focus: string
  output: string
}

export interface WireframeOption {
  id: string
  title: string
  recommended: boolean
  description: string
  sections: string[]
}

export interface PortfolioVisual {
  title: string
  caption: string
  imageUrl: string
  alt: string
}

export interface PortfolioAttachment {
  id: string
  title: string
  description: string
  href: string
  format: string
}

export const portfolioSummary: PortfolioSummary = {
  positioning: '淘酥酥跨境生活方式品牌 · 多平台运营助理作品集（练习项目）',
  targetRole: '跨境电商运营助理（多平台）',
  targetMarket: 'United States + Southeast Asia',
  budget: 'RMB 10,000-30,000（模拟项目预算）',
  timeline: '4-8 weeks',
  launchHypothesis:
    '协助团队把同一批轻物流生活方式 SKU 在 TikTok Shop、Shopee、Temu 完成上架、跟数、回评，验证我能否在主管定方向后快速落地日常运营交付。',
  capabilities: ['Listing 上架', '日报周报', '库存跟进', '评论处理', '活动协助', '数据整理'],
  platforms: ['TikTok Shop', 'Shopee', 'Temu', 'Lazada'],
}

export const caseStudySections: CaseStudySection[] = [
  {
    id: 'overview',
    eyebrow: 'Project Brief',
    title: '协助多平台日常运营，而不是单打独立站策略',
    summary:
      '本作品集以淘酥酥 30 SKU 生活方式店铺为练习场景，展示运营助理如何把同一批商品在多平台上架、跟踪数据、处理评论，并输出标准化 SOP 与报表模板。所有业务数据均为模拟，用于求职展示。',
    proofPoints: [
      '目标岗位：跨境电商运营助理（TikTok Shop / Shopee / Temu / Lazada）',
      '核心交付：Listing 包、日报周报、评论回复 SOP、运营看板',
      '在线 Demo + 可下载 Markdown/CSV 附件，招聘方可直接验证过程证据',
    ],
  },
  {
    id: 'multi-platform-listing',
    eyebrow: 'Case 1 · Listing',
    title: '同一 SKU 的三平台 Listing 上架包',
    summary:
      '以 Cooling Towel 4-Pack 和 Pet Hair Remover 为 hero SKU，分别输出 TikTok Shop、Shopee、Temu 的标题、卖点、类目选择与定价对照，并整理平台差异表。',
    proofPoints: [
      'TikTok Shop：短视频 hook + 9:16 封面 + 合规声明，标题 ≤ 80 字符',
      'Shopee：类目路径 + 变体 + 运费模板 + EN/当地语标题占位',
      'Temu：供货价 + 包装清单 + 质检图 + 尺寸重量字段',
      '附件：multi-platform-listing-guide.md 可下载',
    ],
  },
  {
    id: 'ops-reporting',
    eyebrow: 'Case 2 · Reporting',
    title: '日报周报模板与多平台运营看板',
    summary:
      '搭建运营日报/周报模板，跟踪各平台曝光、点击、加购、订单、退款指标，识别低库存 SKU 并提交补货建议；运营看板支持 TikTok / Shopee / Temu 分平台 Tab 切换（模拟数据）。',
    proofPoints: [
      '日报字段：日期、平台、曝光、点击、加购、订单、GMV、退款、异常备注',
      '周报摘要：各平台 GMV 对比、Top 3 SKU、低库存预警、待跟进事项',
      'SOP：新品上架 15 步 Checklist、订单异常处理、大促前 7 天准备',
      '附件：daily-weekly-ops-report-template.md 含 7 天填写示例',
    ],
  },
  {
    id: 'cs-review',
    eyebrow: 'Case 3 · Customer Service',
    title: '评论 inbox 分类与英文回复 SOP',
    summary:
      '整理 TikTok / 独立站评论 inbox，按物流慢、质量问题、尺寸不符、恶意差评分类，撰写英文回复样例，并建立 escalation 规则（自行处理 vs 上报主管）。',
    proofPoints: [
      '5 组英文差评 + 回复样例（含 escalation 判断）',
      '评论分类规则与 TikTok 评论区 FAQ（英文 3-5 条）',
      '在线 Demo：刚收到评论页可交互浏览',
      '附件：cs-review-response-sop.md 可下载',
    ],
  },
  {
    id: 'supplier-support',
    eyebrow: 'Supporting Work',
    title: '供应商资料整理与上架前校验',
    summary:
      '协助整理供应商询盘与样品验证表（MOQ、重量尺寸、包装、合规文件），完成 3 个 hero SKU 的上架前资料校验，降低因字段缺失导致的平台驳回风险。',
    proofPoints: [
      '每个重点 SKU 记录 3 家供应商报价与 packed weight/dimensions',
      '电池类 SKU 暂停上架直至 MSDS/UN38.3 等文件齐全',
      '复用 cross-border-mvp-supplier-validation.csv 字段标准',
    ],
  },
  {
    id: 'traffic-data-entry',
    eyebrow: 'Supporting Work',
    title: '流量测试数据录入与看板维护',
    summary:
      '参与 14 天 TikTok organic + 小预算 paid 测试的数据录入，维护可视化看板，协助主管判断创意与页面瓶颈。强调执行与记录，而非独立制定投放策略。',
    proofPoints: [
      '每日记录 spend、clicks、add-to-carts、checkouts、purchases',
      '低点击查 hook，低加购查页面/价格，低支付查运费/信任',
      '所有数据标注为模拟练习项目',
    ],
  },
  {
    id: 'demo-store',
    eyebrow: 'Live Demo',
    title: '淘酥酥商城 Demo + 运营中心',
    summary:
      'React 独立站 Demo 展示商品发现、购物车、结账与运营看板，证明我理解前台体验如何影响转化，也能在后台完成 Listing 维护与内容编辑。',
    proofPoints: [
      '商城：30 SKU、优惠码、跨境物流说明、订单追踪',
      '运营中心：库存、漏斗、渠道、合规检查（模拟数据）',
      '站点内容 CMS：促销文案、免邮门槛、信任点编辑',
    ],
  },
]

export const executionTimeline: ExecutionTimelineItem[] = [
  {
    period: 'Week 1',
    focus: 'Listing 资料整理',
    output: '完成 hero SKU 三平台 Listing 包与平台差异对照表。',
  },
  {
    period: 'Week 2',
    focus: '供应商字段校验',
    output: '填写 supplier-validation 表，确认重量尺寸与合规文件状态。',
  },
  {
    period: 'Week 3-4',
    focus: '上架与站点维护',
    output: '协助提交后台 Listing，维护商品页 FAQ 与站点促销文案。',
  },
  {
    period: 'Week 5-6',
    focus: '日报录入与评论处理',
    output: '每日录入各平台数据，处理评论 inbox 并按 SOP 回复。',
  },
  {
    period: 'Week 7-8',
    focus: '周报输出与复盘支持',
    output: '提交周报摘要，标注 Top SKU、低库存与待跟进事项供主管决策。',
  },
]

export const resumeBullets = [
  '协助完成美国市场生活方式品类 30 SKU 的多平台 Listing 资料整理，输出 TikTok Shop / Shopee / Temu 三平台标题、卖点、类目与定价对照表。',
  '搭建运营日报/周报模板，跟踪各平台曝光、点击、加购、订单、退款指标，识别低库存 SKU 并提交补货建议。',
  '整理供应商询盘与样品验证表（MOQ、重量尺寸、包装、合规文件），协助完成 3 个 hero SKU 的上架前资料校验。',
  '处理 TikTok / 独立站评论 inbox，按物流/质量/尺寸分类并撰写英文回复，建立差评 escalation 规则。',
  '参与 14 天流量测试数据录入与可视化看板维护，协助主管判断创意与页面瓶颈。',
]

export const interviewScripts = {
  sixtySeconds:
    '我做了一个淘酥酥跨境生活方式品牌的运营助理作品集。核心不是搭网站，而是展示我能不能协助团队把同一批 SKU 在多平台上架、跟数、回评。案例一：我把 cooling towel 和 pet hair remover 两个 SKU 分别做了 TikTok Shop、Shopee、Temu 的 Listing 包，包括标题、卖点、类目选择和定价逻辑，并做了平台差异对照表。案例二：我搭建了日报周报模板和运营看板，每天跟踪各平台 GMV、订单、退款和低库存，周报里会标 Top SKU 和待跟进事项。案例三：我整理了评论 inbox 的英文回复 SOP，按物流、质量、尺寸分类，并写了 5 组差评回复样例。在线 Demo 可以点开看商城和运营看板，附件可以下载 CSV 和 SOP。我的优势是细节执行和数据整理，能在主管定方向后快速落地。',
  threeMinutes:
    '这个作品集的目标是证明我能胜任跨境电商运营助理的多平台日常执行。我先以淘酥酥 30 个生活方式 SKU 为练习场景，因为这类产品轻物流、适合短视频演示，也便于做多平台 Listing 对照。第一个案例是多平台上架：同一款 cooling towel 在 TikTok Shop 要突出 9:16 视频 hook 和合规声明，Shopee 要填类目路径和运费模板，Temu 要报供货价和包装清单，我把这些差异整理成对照表。第二个案例是日报周报：我每天记录各平台曝光、点击、加购、订单和退款，周报汇总 GMV 对比、Top SKU 和低库存预警，并列出待跟进事项给主管。第三个案例是客服：我把评论按物流、质量、尺寸分类，写了英文回复模板，并标注哪些情况需要 escalation。所有数据都是模拟练习项目，但 SOP 和模板是我自己搭的。在线 Demo 有商城和运营看板，附件可以下载验证过程。',
  deepDiveQuestions: [
    'TikTok Shop 和 Shopee 上架有什么区别？TikTok 偏短视频内容和 9:16 封面，Shopee 偏类目路径、变体、运费模板和图文详情，字段和物流模式都不同。',
    '日报/周报你发给主管看什么？GMV、订单量、退款率、Top SKU、低库存预警和当天异常事项，周报再加各平台对比和待跟进清单。',
    '遇到英文差评你怎么回？先分类（物流/质量/尺寸/恶意），选对应模板回复，涉及退款或产品质量问题 escalation 给主管。',
    '库存低了你怎么处理？查安全库存线 → 核对供应商交期 → 通知主管 → 必要时调低前台库存或暂停投放。',
    '大促前你要做什么？活动报名、库存确认、Listing 标题/主图检查、优惠券设置、运费模板核对。',
    '同一产品三个平台价格为什么不同？平台佣金、物流成本、竞品定价和活动策略不同，Temu 还要考虑供货价与前台价差。',
    '你怎么整理供应商给的资料？用 CSV 标准化 MOQ、packed weight、dimensions、合规文件状态，缺字段不上架。',
    '没经验的部分你怎么补？诚实说明是模拟练习项目，强调 SOP、模板和对照表是自己搭建的执行能力证明。',
  ],
}

export const portfolioVisuals: PortfolioVisual[] = [
  {
    title: '多平台 Listing 对照',
    caption: '同一 hero SKU 在 TikTok Shop、Shopee、Temu 的标题、类目与定价差异一目了然。',
    imageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    alt: 'Multi-platform ecommerce listing comparison workspace',
  },
  {
    title: '宠物清洁前后对比',
    caption: 'Pet hair remover 适合 sofa before/after 素材，是 TikTok 与 Shopee Listing 的强证明内容。',
    imageUrl:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    alt: 'Pet hair remover before and after sofa cleaning demo',
  },
  {
    title: '日报周报数据录入',
    caption: '用标准化表格跟踪各平台 GMV、订单、退款，助理岗最核心的日常交付之一。',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    alt: 'Ecommerce operations daily report dashboard',
  },
  {
    title: '评论 inbox 处理',
    caption: '按物流/质量/尺寸分类英文差评，展示跨境客服执行能力与 escalation 判断。',
    imageUrl:
      'https://images.unsplash.com/photo-1577563908411-5077b917dc10?auto=format&fit=crop&w=900&q=80',
    alt: 'Customer review response workflow for cross-border store',
  },
]

export const wireframeOptions: WireframeOption[] = [
  {
    id: 'assistant-portfolio',
    title: '运营助理作品集型',
    recommended: true,
    description:
      '首页先讲岗位定位与平台栈，三大案例按 Listing → 日报周报 → 客服回复展开，最适合多平台运营助理投递。',
    sections: [
      '岗位定位与平台栈',
      '案例 1：多平台 Listing 上架',
      '案例 2：日报周报与运营看板',
      '案例 3：评论 inbox 与英文回复',
      '附件下载区',
      '商城 Demo 入口',
      '简历 bullet 与面试话术',
    ],
  },
  {
    id: 'storefront-first',
    title: '商城展示优先型',
    recommended: false,
    description: '先展示购物流程，运营逻辑放后面，视觉直接但助理执行能力容易被弱化。',
    sections: ['首页视觉', '商品列表', '购物车', '结账流程', '运营说明'],
  },
  {
    id: 'spreadsheet-first',
    title: '表格交付优先型',
    recommended: false,
    description: '适合纯数据岗，突出 CSV/Excel，但缺少前台体验与 Listing 展示。',
    sections: ['日报模板', '周报示例', '供应商表', 'Listing 对照', '附件下载'],
  },
]

export const portfolioAttachments: PortfolioAttachment[] = [
  {
    id: 'listing-guide',
    title: '多平台 Listing 上架指南',
    description: 'Cooling Towel + Pet Hair Remover 三平台 Listing 样稿与差异对照表',
    href: '/portfolio/multi-platform-listing-guide.md',
    format: 'Markdown',
  },
  {
    id: 'ops-report',
    title: '日报/周报模板与示例',
    description: '日/周报模板 + 7 天模拟数据填写示例 + 上架/大促 SOP',
    href: '/portfolio/daily-weekly-ops-report-template.md',
    format: 'Markdown',
  },
  {
    id: 'cs-sop',
    title: '评论回复 SOP',
    description: '评论分类规则 + 5 组英文差评回复 + TikTok FAQ',
    href: '/portfolio/cs-review-response-sop.md',
    format: 'Markdown',
  },
  {
    id: 'traffic-csv',
    title: '流量测试追踪表',
    description: '14 天流量测试 CSV 模板（含字段说明）',
    href: '/portfolio/cross-border-mvp-traffic-tracker.csv',
    format: 'CSV',
  },
  {
    id: 'one-pager',
    title: '作品集一页纸摘要',
    description: '投递简历附件用：岗位定位、三大案例、Demo 链接、技能标签',
    href: '/portfolio/portfolio-one-pager.html',
    format: 'HTML/PDF',
  },
  {
    id: 'one-pager-md',
    title: '一页纸 Markdown 版',
    description: '同上内容，Markdown 格式便于编辑',
    href: '/portfolio/portfolio-one-pager.md',
    format: 'Markdown',
  },
]
