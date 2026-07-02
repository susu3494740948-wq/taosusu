export type StoreTheme = 'classic' | 'ocean' | 'sunset' | 'rose' | 'forest' | 'midnight'

export interface StoreThemeMeta {
  id: StoreTheme
  name: string
  description: string
  swatches: [string, string, string]
}

export const storeThemes: StoreThemeMeta[] = [
  {
    id: 'classic',
    name: '经典石棕',
    description: '淘酥酥默认风格，石色底 + 翡翠强调，适合日常跨境商城。',
    swatches: ['#1c1917', '#059669', '#fafaf9'],
  },
  {
    id: 'ocean',
    name: '海洋清风',
    description: '天蓝与浅灰，清爽适合夏日降温与旅行品类。',
    swatches: ['#0c4a6e', '#0284c7', '#f0f9ff'],
  },
  {
    id: 'sunset',
    name: '落日市集',
    description: '琥珀暖色，突出限时活动与促销氛围。',
    swatches: ['#78350f', '#d97706', '#fffbeb'],
  },
  {
    id: 'rose',
    name: '玫瑰精品',
    description: '柔和玫瑰粉，适合美妆与生活方式选品。',
    swatches: ['#881337', '#e11d48', '#fff1f2'],
  },
  {
    id: 'forest',
    name: '森林自然',
    description: '绿色系，强调环保、户外与宠物清洁场景。',
    swatches: ['#14532d', '#16a34a', '#f0fdf4'],
  },
  {
    id: 'midnight',
    name: '午夜紫夜',
    description: '深紫靛蓝，偏夜间浏览与高级感独立站。',
    swatches: ['#312e81', '#6366f1', '#eef2ff'],
  },
]

export function getStoreThemeMeta(id: StoreTheme): StoreThemeMeta {
  return storeThemes.find((theme) => theme.id === id) ?? storeThemes[0]
}

export const accentToThemeMap: Record<string, StoreTheme> = {
  emerald: 'classic',
  sky: 'ocean',
  amber: 'sunset',
  rose: 'rose',
}
