import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { accentToThemeMap, type StoreTheme as ThemeId } from '../data/storeThemes'
import type { ShippingMethod } from '../types'

export type { ThemeId as StoreTheme }
export type ThemeMode = 'light' | 'dark' | 'system'
export type StoreLanguage = 'zh' | 'en' | 'bilingual'
export type FontSize = 'normal' | 'large'
export type ProductSort = 'featured' | 'price-low' | 'price-high' | 'rating' | 'reviews'
export type AddToCartBehavior = 'open-drawer' | 'stay-on-page'
export type PreferredPayment = 'paypal' | 'card' | 'apple-pay'
export type ShippingRegion = 'us-all' | 'us-west' | 'us-east'
export type CurrencyFormat = 'symbol' | 'code'

export interface StorePreferences {
  theme: ThemeMode
  storeTheme: ThemeId
  language: StoreLanguage
  fontSize: FontSize
  reducedMotion: boolean
  defaultShippingMethod: ShippingMethod
  shippingRegion: ShippingRegion
  currencyFormat: CurrencyFormat
  productSort: ProductSort
  addToCartBehavior: AddToCartBehavior
  preferredPayment: PreferredPayment
  savedPromoCode: string
  autoApplySavedPromo: boolean
  showCompareAtPrice: boolean
  compactCatalog: boolean
  showReviewStars: boolean
  showOutOfStock: boolean
  showLowStockBadge: boolean
  orderEmailUpdates: boolean
  marketingEmails: boolean
  smsShippingUpdates: boolean
  priceDropAlerts: boolean
  backInStockAlerts: boolean
  saveBrowsingHistory: boolean
  analyticsCookies: boolean
  personalizedRecommendations: boolean
  rememberCheckoutInfo: boolean
  githubSyncToken: string
}

interface PreferencesState extends StorePreferences {
  updatePreferences: (partial: Partial<StorePreferences>) => void
  resetPreferences: () => void
}

export const defaultPreferences: StorePreferences = {
  theme: 'light',
  storeTheme: 'classic',
  language: 'bilingual',
  fontSize: 'normal',
  reducedMotion: false,
  defaultShippingMethod: 'standard',
  shippingRegion: 'us-all',
  currencyFormat: 'symbol',
  productSort: 'featured',
  addToCartBehavior: 'open-drawer',
  preferredPayment: 'paypal',
  savedPromoCode: 'SUMMER10',
  autoApplySavedPromo: false,
  showCompareAtPrice: true,
  compactCatalog: false,
  showReviewStars: true,
  showOutOfStock: true,
  showLowStockBadge: true,
  orderEmailUpdates: true,
  marketingEmails: false,
  smsShippingUpdates: false,
  priceDropAlerts: true,
  backInStockAlerts: true,
  saveBrowsingHistory: true,
  analyticsCookies: false,
  personalizedRecommendations: true,
  rememberCheckoutInfo: true,
  githubSyncToken: '',
}

function normalizePersistedPreferences(persisted: Partial<StorePreferences> & { accentColor?: string }) {
  const next = { ...persisted }
  if (!next.storeTheme && persisted.accentColor) {
    next.storeTheme = accentToThemeMap[persisted.accentColor] ?? 'classic'
  }
  return next
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      updatePreferences: (partial) => set((state) => ({ ...state, ...partial })),

      resetPreferences: () => set({ ...defaultPreferences }),
    }),
    {
      name: 'taosusu-preferences',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...defaultPreferences,
        ...normalizePersistedPreferences(persistedState as Partial<StorePreferences> & { accentColor?: string }),
      }),
    },
  ),
)

export function selectTheme(state: PreferencesState): ThemeMode {
  return state.theme
}
