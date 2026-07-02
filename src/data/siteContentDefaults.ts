import { storeConfig, storeTrustPoints } from './store'

export type PromoType = 'percent' | 'free-shipping'

export interface PromoCode {
  code: string
  type: PromoType
  value?: number
  message: string
}

export interface ActivityDeal {
  label: string
  title: string
  description: string
}

export interface SiteStoreConfig {
  name: string
  tagline: string
  market: string
  currency: string
  freeShippingThreshold: number
  processingDays: string
  deliveryDays: string
  supportEmail: string
}

export interface SiteHomepageContent {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  primaryCta: string
  secondaryCta: string
  promoSectionTitle: string
  promoSectionSubtitle: string
  activityDeals: ActivityDeal[]
}

export interface SiteContent {
  version: number
  updatedAt: string
  store: SiteStoreConfig
  trustPoints: string[]
  homepage: SiteHomepageContent
  promos: PromoCode[]
}

const defaultActivityDeals: ActivityDeal[] = [
  {
    label: '满额免邮',
    title: `满 $${storeConfig.freeShippingThreshold} 免标准运费`,
    description: '旅行收纳、宠物清洁、夏日降温好物可一起凑单。',
  },
  {
    label: '夏日热卖',
    title: 'Cooling 系列限时主推',
    description: '毛巾、挂脖风扇、冰丝毯覆盖通勤、健身和户外场景。',
  },
  {
    label: '新客优惠',
    title: '优惠码 SUMMER10',
    description: '首单享 10% off，适合从 TikTok 或 Instagram 首次进站用户。',
  },
]

export const defaultSiteContent: SiteContent = {
  version: 1,
  updatedAt: '2026-07-02T00:00:00.000Z',
  store: { ...storeConfig },
  trustPoints: [...storeTrustPoints],
  homepage: {
    heroBadge: '新客码 SUMMER10 · 首单 9 折',
    heroTitle: '淘酥酥 · 跨境好物直邮美国',
    heroSubtitle: storeConfig.tagline,
    primaryCta: '立即选购',
    secondaryCta: '查看热卖款',
    promoSectionTitle: '夏日跨境好物节',
    promoSectionSubtitle: '凑单免邮、夏日热卖与新客优惠集中展示，帮助用户更快找到当前促销。',
    activityDeals: defaultActivityDeals,
  },
  promos: [
    { code: 'SUMMER10', type: 'percent', value: 10, message: '10% off applied' },
    { code: 'FREESHIP', type: 'free-shipping', message: 'Free standard shipping applied' },
  ],
}

export function mergeSiteContent(partial: unknown): SiteContent {
  if (!partial || typeof partial !== 'object') {
    return { ...defaultSiteContent }
  }

  const source = partial as Partial<SiteContent>
  return {
    version: source.version ?? defaultSiteContent.version,
    updatedAt: source.updatedAt ?? defaultSiteContent.updatedAt,
    store: { ...defaultSiteContent.store, ...source.store },
    trustPoints: source.trustPoints?.length ? source.trustPoints : defaultSiteContent.trustPoints,
    homepage: {
      ...defaultSiteContent.homepage,
      ...source.homepage,
      activityDeals: source.homepage?.activityDeals?.length
        ? source.homepage.activityDeals
        : defaultSiteContent.homepage.activityDeals,
    },
    promos: source.promos?.length ? source.promos : defaultSiteContent.promos,
  }
}
