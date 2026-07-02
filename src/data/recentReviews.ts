export type ReviewSource = 'site' | 'tiktok' | 'email' | 'instagram'
export type ReviewStatus = 'pending' | 'replied' | 'flagged'
export type ReviewSentiment = 'positive' | 'neutral' | 'negative'

export interface RecentReview {
  id: string
  productId: string
  productName: string
  author: string
  rating: number
  content: string
  source: ReviewSource
  status: ReviewStatus
  sentiment: ReviewSentiment
  receivedAt: string
  reply?: string
  opsNote?: string
}

export const reviewSourceLabels: Record<ReviewSource, string> = {
  site: '站内评价',
  tiktok: 'TikTok 评论',
  email: '客服邮件',
  instagram: 'Instagram DM',
}

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: '待回复',
  replied: '已回复',
  flagged: '需关注',
}

export const recentReviews: RecentReview[] = [
  {
    id: 'rv-001',
    productId: 'cooling-towel-kit',
    productName: 'Cooling Towel 4-Pack',
    author: 'Jess M.',
    rating: 5,
    content: 'Used this at Disney in July — actually stayed cool for hours. Where can I buy the 8-pack?',
    source: 'tiktok',
    status: 'pending',
    sentiment: 'positive',
    receivedAt: '2026-06-30T14:22:00Z',
    opsNote: '高意向购买评论，可引导独立站链接并记录 UTM',
  },
  {
    id: 'rv-002',
    productId: 'pet-hair-remover',
    productName: 'Pet Hair Remover',
    author: 'Alex R.',
    rating: 4,
    content: 'Works great on couch fabric. Shipping took about 10 days to Texas — acceptable but wish tracking updated faster.',
    source: 'site',
    status: 'replied',
    sentiment: 'neutral',
    receivedAt: '2026-06-30T09:10:00Z',
    reply: 'Thanks Alex! We are improving tracking emails this week. Glad the roller worked on your couch.',
  },
  {
    id: 'rv-003',
    productId: 'heatless-curl-set',
    productName: 'Heatless Curl Set',
    author: 'Mia K.',
    rating: 3,
    content: 'Curls were loose after one night. Maybe I need a tutorial? Also confused about satin vs silk version.',
    source: 'email',
    status: 'pending',
    sentiment: 'negative',
    receivedAt: '2026-06-29T18:45:00Z',
    opsNote: 'Pivot SKU —补 FAQ 与 overnight 教程视频',
  },
  {
    id: 'rv-004',
    productId: 'compression-packing-cubes',
    productName: 'Packing Cubes Set',
    author: 'Chris L.',
    rating: 5,
    content: 'Fit carry-on perfectly. Bought after your TikTok — code still worked!',
    source: 'site',
    status: 'replied',
    sentiment: 'positive',
    receivedAt: '2026-06-29T11:30:00Z',
    reply: 'Awesome to hear Chris — safe travels!',
  },
  {
    id: 'rv-005',
    productId: 'cooling-towel-kit',
    productName: 'Cooling Towel 4-Pack',
    author: 'Jordan P.',
    rating: 2,
    content: 'Towel smelled chemical out of the bag. Returned.',
    source: 'email',
    status: 'flagged',
    sentiment: 'negative',
    receivedAt: '2026-06-28T22:08:00Z',
    opsNote: '核对批次与包装说明，评估是否需在商品页加「首次使用前清洗」提示',
  },
  {
    id: 'rv-006',
    productId: 'portable-neck-fan',
    productName: 'Bladeless Neck Fan',
    author: 'Sam T.',
    rating: 5,
    content: 'Battery lasts my whole shift. Link?',
    source: 'tiktok',
    status: 'pending',
    sentiment: 'positive',
    receivedAt: '2026-06-28T16:55:00Z',
  },
  {
    id: 'rv-007',
    productId: 'collapsible-water-bottle',
    productName: 'Collapsible Water Bottle',
    author: 'Priya N.',
    rating: 4,
    content: 'Love the collapsible design. Cap seals tight — good for travel days.',
    source: 'instagram',
    status: 'replied',
    sentiment: 'positive',
    receivedAt: '2026-06-27T20:12:00Z',
    reply: 'Thank you Priya! Tag us if you share your travel setup.',
  },
  {
    id: 'rv-008',
    productId: 'resistance-bands-set',
    productName: 'Resistance Bands 5-Pack',
    author: 'Taylor W.',
    rating: 4,
    content: 'Does it ship to Canada? Saw your ad but checkout only showed US.',
    source: 'tiktok',
    status: 'pending',
    sentiment: 'neutral',
    receivedAt: '2026-06-27T08:40:00Z',
    opsNote: '跨境 FAQ — 明确当前仅美国配送或 waitlist',
  },
]

export const reviewInboxSummary = {
  period: '最近 7 天',
  total: recentReviews.length,
  pending: recentReviews.filter((r) => r.status === 'pending').length,
  flagged: recentReviews.filter((r) => r.status === 'flagged').length,
  averageRating: Number(
    (recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length).toFixed(1),
  ),
  tiktokLeads: recentReviews.filter((r) => r.source === 'tiktok' && r.status === 'pending').length,
}
