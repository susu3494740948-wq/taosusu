export interface PortfolioSummary {
  positioning: string
  targetRole: string
  targetMarket: string
  budget: string
  timeline: string
  launchHypothesis: string
  capabilities: string[]
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

export const portfolioSummary: PortfolioSummary = {
  positioning: '美国市场轻量生活方式产品独立站 MVP 验证项目',
  targetRole: '跨境电商 / 独立站运营',
  targetMarket: 'United States',
  budget: 'RMB 10,000-30,000',
  timeline: '4-8 weeks',
  launchHypothesis:
    '用低客单、轻物流、强视频演示的生活方式 SKU，验证至少一个产品是否能通过独立站和短视频流量转化为可盈利订单。',
  capabilities: ['选品判断', '供应商验证', '独立站搭建', '流量测试', '数据复盘', '风险控制'],
}

export const caseStudySections: CaseStudySection[] = [
  {
    id: 'overview',
    eyebrow: 'Project Brief',
    title: '低成本验证，而不是盲目铺货',
    summary:
      '项目以美国市场为目标，在 4-8 周内用 SaaS 独立站验证轻量生活方式产品的转化信号，核心目标是判断 SKU、页面和流量是否值得继续投入。',
    proofPoints: [
      '预算控制在 RMB 10,000-30,000',
      '目标是验证至少一个 SKU 是否能转化为可盈利订单',
      '优先选择 Shopify 或支持 PayPal、卡支付、像素追踪的跨境 SaaS',
    ],
  },
  {
    id: 'market-selection',
    eyebrow: 'Market And Category',
    title: '美国市场 + 可短视频演示的日用问题解决品',
    summary:
      '品类聚焦 summer comfort、home organization、travel readiness、pet cleaning，避免监管、医疗、儿童安全、侵权和履约经济性差的产品。',
    proofPoints: [
      '价格带集中在 USD 19.99-29.99，适合冲动购买测试',
      '商品必须能在 5-15 秒视频里展示前后对比或使用效果',
      '首店定位为 practical summer and home fixes，而不是泛生活方式品牌',
    ],
  },
  {
    id: 'sku-scorecard',
    eyebrow: 'SKU Scorecard',
    title: '用评分卡筛选 hero SKU 和风险 SKU',
    summary:
      '优先级从 cooling towel、pet hair remover、heatless curl set、packing cubes 开始，按视觉演示、毛利、履约、退货、合规风险评分。',
    proofPoints: [
      'Cooling towel 4-pack 作为夏季流量 hero SKU',
      'Pet hair remover 作为宠物清洁强前后对比 SKU',
      'USB-C neck fan 因电池合规文件未验证而暂停',
      'Clear acrylic organizer 因破损和体积重风险列为低优先级',
    ],
  },
  {
    id: 'supplier-validation',
    eyebrow: 'Supplier Validation',
    title: '先验证样品、包装、物流和文件，再谈补货',
    summary:
      '供应商沟通模板要求报价、MOQ、重量尺寸、包装照片、英文标签、合规文件和售后规则，把供应链风险前置到样品阶段。',
    proofPoints: [
      '每个重点 SKU 请求 3 家供应商报价',
      '要求 packed weight、packed dimensions、生产和补货周期',
      '电池电子品必须先提供 MSDS/SDS、UN38.3、battery specification 等文件',
    ],
  },
  {
    id: 'site-build',
    eyebrow: 'Store Build',
    title: '独立站围绕转化信任和合规文案搭建',
    summary:
      '页面结构覆盖首页、集合页、商品详情、支付、物流、退换货、FAQ、像素和测试订单，避免虚假评论、夸大承诺和不真实库存稀缺。',
    proofPoints: [
      '首页 5 秒内解释产品价值并导向 hero SKU',
      '商品页包含 how to use、what is included、shipping and returns、FAQ',
      '付费流量前必须验证 GA4、Meta Pixel、TikTok Pixel 和 purchase event',
    ],
  },
  {
    id: 'traffic-test',
    eyebrow: 'Traffic Test',
    title: '14 天只测试两个渠道，避免变量过多',
    summary:
      '首轮流量采用 TikTok organic + 小预算 Meta 或 TikTok paid ads，预算 USD 20-50/day，按创意、页面、offer、受众逐项判断瓶颈。',
    proofPoints: [
      '每天记录 spend、clicks、add-to-carts、checkouts、purchases、revenue、margin',
      '创意矩阵覆盖 cooling towel、pet hair remover、heatless curl set、packing cubes',
      '低点击看 hook 和受众，低加购看页面/价格/offer，低支付看信任/运费/支付',
    ],
  },
  {
    id: 'decision-review',
    eyebrow: 'Decision Review',
    title: '用 Go / Pivot / Stop 机制防止情绪化加预算',
    summary:
      '复盘阶段结合转化、贡献利润、供应商、物流、退款投诉和用户评论，决定继续、调整或停止，而不是因为站点已搭好就继续投钱。',
    proofPoints: [
      'Add-to-cart rate below 2% 后优先修页面、offer 或产品',
      'Checkout-start-to-purchase below 30% 时检查支付、运费、最终价格和信任',
      'Contribution margin below 25% before ad spend 时不扩大投放',
    ],
  },
]

export const executionTimeline: ExecutionTimelineItem[] = [
  {
    period: 'Week 1',
    focus: 'SKU priority and supplier outreach',
    output: '确认 SKU 优先级，联系供应商，开始记录报价和样品信息。',
  },
  {
    period: 'Week 2',
    focus: 'Sample and logistics validation',
    output: '评估样品质量、包装尺寸、物流成本和合规文件，选择 3 个 launch SKU。',
  },
  {
    period: 'Week 3-4',
    focus: 'SaaS store setup',
    output: '完成首页、商品页、政策页、支付、邮件模板、像素和测试订单。',
  },
  {
    period: 'Week 5-6',
    focus: 'Traffic and creative testing',
    output: '执行 TikTok organic + 小预算付费测试，记录每日漏斗数据和评论反馈。',
  },
  {
    period: 'Week 7-8',
    focus: 'Go / Pivot / Stop review',
    output: '根据转化、利润、供应链和售后风险输出下一步决策备忘录。',
  },
]

export const resumeBullets = [
  '规划 RMB 10,000-30,000 预算的美国独立站 MVP，拆解 4-8 周验证路径，覆盖选品、供应商、建站、投放和复盘。',
  '建立 6 个候选 SKU 评分卡，从视觉演示、毛利、履约、退货、合规风险维度筛选首批测试产品。',
  '设计供应商询盘和样品验证表，明确 MOQ、重量尺寸、包装、英文标签、合规文件和售后规则等关键字段。',
  '输出独立站页面 brief，覆盖首页、商品页、支付、物流政策、退换货、FAQ、像素和测试订单清单。',
  '制定 14 天 TikTok organic + 小预算 paid ads 测试节奏，并用 Go / Pivot / Stop 框架约束投放决策。',
]

export const interviewScripts = {
  sixtySeconds:
    '我做了一个面向跨境电商运营岗位的独立站 MVP 作品集，假设目标市场是美国，预算 RMB 10,000-30,000，周期 4-8 周。项目不是单纯搭页面，而是完整跑一遍运营闭环：先用评分卡筛选轻物流、强视频演示、低合规风险的 SKU，再用供应商表验证样品、包装、物流和文件，然后规划 Shopify/SaaS 独立站页面、支付、政策和像素，最后设计 TikTok organic 加小预算广告的 14 天测试节奏，并用 Go / Pivot / Stop 框架决定是否继续投入。',
  threeMinutes:
    '这个项目的目标是证明我能用运营视角拆解一个跨境独立站从 0 到 1 的验证过程。我先确定美国市场，因为它有成熟的 DTC 消费习惯和较清晰的广告测试路径；品类选择轻量生活方式产品，因为它们更适合短视频演示，也能降低物流和退货风险。选品阶段我建立了 SKU 优先级，cooling towel、pet hair remover、heatless curl set、packing cubes 是首轮候选，neck fan 因电池合规风险暂停，acrylic organizer 因破损和体积重风险降级。供应链阶段我设计了询盘模板和验证表，重点拿到重量尺寸、MOQ、生产周期、包装、英文标签、合规文件和售后承诺。建站阶段我把页面重点放在 5 秒内讲清价值、商品页演示、真实物流政策、支付信任和像素验证。投放阶段我限制首轮只跑 TikTok organic 和一个小预算付费渠道，避免变量过多；每天记录漏斗数据，根据点击、加购、结账、购买和评论判断问题。最后用 Go / Pivot / Stop 框架决定是否继续投入，避免因为已经花时间搭站就情绪化加预算。',
  deepDiveQuestions: [
    '为什么首轮不同时跑 Meta、TikTok、Google Shopping、SEO 和达人？因为 MVP 的核心是隔离变量，先确认产品和创意是否有基础信号。',
    '为什么暂停 neck fan？因为电池类产品涉及 MSDS/SDS、UN38.3、battery specification 和安全标识，文件不完整会放大物流和平台风险。',
    '如果有点击没加购怎么办？优先检查商品页主图/视频、价格、offer、shipping clarity、FAQ 和产品本身需求，而不是直接加预算。',
    '如果加购有但支付少怎么办？优先检查最终运费、支付方式、结账信任、政策可见性和折扣逻辑。',
  ],
}

export const portfolioVisuals: PortfolioVisual[] = [
  {
    title: '夏季 hero SKU 场景',
    caption: '用 cooling towel、户外包和夏季场景强化“5 秒内看懂用途”的商品展示。',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    alt: 'Cooling towels prepared for a summer outdoor kit',
  },
  {
    title: '宠物清洁前后对比',
    caption: 'Pet hair remover 适合用 sofa before/after、car seat cleanup 这类强证明素材展示。',
    imageUrl:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    alt: 'Pet hair remover before and after sofa cleaning demo',
  },
  {
    title: '旅行收纳内容角度',
    caption: 'Packing cubes 用 carry-on challenge 展示压缩前后对比，适合短视频和商品页素材。',
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
    alt: 'Travel packing cubes arranged for a carry-on challenge',
  },
  {
    title: '独立站运营看板感',
    caption: '用简洁的数据图和图片卡片模拟投放后复盘，让招聘方更快理解运营闭环。',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    alt: 'Ecommerce analytics dashboard for campaign review',
  },
]

export const wireframeOptions: WireframeOption[] = [
  {
    id: 'operations-case',
    title: '运营闭环案例型',
    recommended: true,
    description: '首页先讲求职定位，核心案例页按运营漏斗展开，最适合跨境电商/独立站运营投递。',
    sections: [
      '项目概览',
      '市场与品类选择',
      'SKU 评分与优先级',
      '供应商验证',
      '独立站搭建方案',
      '14 天流量测试计划',
      'Go / Pivot / Stop 决策',
      '简历与面试讲述',
    ],
  },
  {
    id: 'storefront-first',
    title: '独立站展示优先型',
    recommended: false,
    description: '先展示商城页面和购物流程，再补充运营逻辑，视觉直接但业务判断容易被弱化。',
    sections: ['首页视觉', '商品列表', '商品详情', '购物车', '结账流程', '运营说明'],
  },
  {
    id: 'research-report',
    title: '选品研究报告型',
    recommended: false,
    description: '更像选品岗位材料，突出市场和 SKU 分析，但对独立站运营的转化与投放能力展示较少。',
    sections: ['市场假设', '竞品参考', 'SKU 评分', '供应商验证', '风险清单', '下一步建议'],
  },
]
