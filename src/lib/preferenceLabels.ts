import type { StorePreferences } from '../store/preferencesStore'

const themeLabels = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
} as const

const languageLabels = {
  bilingual: '中英混合',
  zh: '中文优先',
  en: 'English',
} as const

const accentLabels = {
  classic: '经典石棕',
  ocean: '海洋清风',
  sunset: '落日市集',
  rose: '玫瑰精品',
  forest: '森林自然',
  midnight: '午夜紫夜',
} as const

const sortLabels = {
  featured: '推荐排序',
  'price-low': '价格从低到高',
  'price-high': '价格从高到低',
  rating: '评分优先',
  reviews: '评论数优先',
} as const

export function buildPreferencesSummary(preferences: StorePreferences): string[] {
  return [
    `主题 ${themeLabels[preferences.theme]} · 店铺主题 ${accentLabels[preferences.storeTheme]} · 字号 ${preferences.fontSize === 'large' ? '较大' : '标准'}`,
    `语言 ${languageLabels[preferences.language]} · 货币 ${preferences.currencyFormat === 'symbol' ? '$ 符号' : 'USD 代码'}`,
    `物流 ${preferences.defaultShippingMethod === 'express' ? '加急' : '标准'} · 区域 ${preferences.shippingRegion === 'us-west' ? '美国西部' : preferences.shippingRegion === 'us-east' ? '美国东部' : '全美'}`,
    `排序 ${sortLabels[preferences.productSort]} · 加购 ${preferences.addToCartBehavior === 'open-drawer' ? '打开购物车' : '停留当前页'}`,
    `通知 订单${preferences.orderEmailUpdates ? '开' : '关'} · 营销${preferences.marketingEmails ? '开' : '关'} · 降价提醒${preferences.priceDropAlerts ? '开' : '关'}`,
    `隐私 浏览记录${preferences.saveBrowsingHistory ? '开' : '关'} · 个性化${preferences.personalizedRecommendations ? '开' : '关'}`,
  ]
}
