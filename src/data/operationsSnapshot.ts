export const trafficFunnel = {
  period: '最近 14 天测试',
  impressions: 48200,
  clicks: 2140,
  ctr: 4.4,
  pageViews: 1680,
  addToCarts: 96,
  addToCartRate: 5.7,
  checkouts: 41,
  checkoutRate: 42.7,
  purchases: 18,
  purchaseRate: 43.9,
  adSpend: 620,
  revenue: 412.82,
  averageOrderValue: 22.93,
  estimatedMargin: 28.4,
}

export const channelPerformance = [
  { channel: 'TikTok Organic', spend: 0, clicks: 980, purchases: 7, revenue: 149.93 },
  { channel: 'TikTok Paid', spend: 280, clicks: 620, purchases: 6, revenue: 137.94 },
  { channel: 'Meta Paid', spend: 340, clicks: 540, purchases: 5, revenue: 124.95 },
]

export const heroSkuSignals = [
  {
    sku: 'Cooling Towel 4-Pack',
    signal: '高点击 + 稳定加购',
    decision: 'Continue',
    note: '可作为夏季 hero SKU 继续扩创意',
  },
  {
    sku: 'Pet Hair Remover',
    signal: '评论问购买链接多',
    decision: 'Continue',
    note: '强化 before/after 素材与 FAQ',
  },
  {
    sku: 'Heatless Curl Set',
    signal: '加购一般，页面停留长',
    decision: 'Pivot',
    note: '优化主图、使用教程和预期管理',
  },
  {
    sku: 'Compression Packing Cubes',
    signal: '点击少但客单更高',
    decision: 'Test',
    note: '继续小预算测试 carry-on 创意',
  },
]

export const weeklyActions = [
  '核对低库存 SKU 是否需要补货或暂停投放',
  '更新商品页 FAQ，回应 shipping / sizing / use case 评论',
  '为 hero SKU 新增 2 条 TikTok 创意并记录 UTM',
  '检查 PayPal、像素、测试订单是否正常',
  '记录 spend、add-to-cart、checkout、purchase 到 tracker',
]

export const complianceChecks = [
  { item: '商品文案避免医疗/夸大承诺', status: 'pass' as const },
  { item: '物流时效与政策页一致', status: 'pass' as const },
  { item: '电池类 SKU 合规文件', status: 'watch' as const },
  { item: '易碎品包装与破损售后规则', status: 'watch' as const },
  { item: '虚假评论/库存稀缺', status: 'pass' as const },
]

export const decisionReview = {
  status: 'Pivot' as const,
  headline: '有流量信号，但需先修转化瓶颈再放大预算',
  reasons: [
    'Cooling towel 与 pet hair remover 已出现初步购买和加购信号',
    '整体 add-to-cart rate 仍低于稳定放量阈值，需优先修页面与 offer',
    '供应链与物流风险可控，暂不建议全店停投',
  ],
  nextSteps: [
    '优先优化 hero SKU 商品页与 shipping clarity',
    '仅对 winning creative 维持小预算测试',
    '暂停表现弱且无加购信号的 SKU 扩量',
  ],
}
