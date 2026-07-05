import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { accentToThemeMap, type StoreTheme as ThemeId } from '../data/storeThemes'
import type { ShippingMethod } from '../types'
import {
  fetchCloudPreferences,
  flushPreferencesCloudSync,
  schedulePreferencesCloudSync,
  setSkipPreferencesCloudSync,
} from '../lib/cloudPreferencesSync'

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
  cloudLoaded: boolean
  cloudSyncError: string | null
  cloudSyncing: boolean
  updatePreferences: (partial: Partial<StorePreferences>) => void
  resetPreferences: () => void
  loadFromCloud: () => Promise<void>
  syncToCloudNow: () => Promise<void>
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

function applyCloudSyncResult(
  set: (partial: Partial<PreferencesState>) => void,
  syncError: string | null,
) {
  set({ cloudSyncing: false, cloudSyncError: syncError })
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      ...defaultPreferences,
      cloudLoaded: false,
      cloudSyncError: null,
      cloudSyncing: false,

      updatePreferences: (partial) => {
        set((state) => ({ ...state, ...partial, cloudSyncError: null, cloudSyncing: true }))

        const completeSync = (syncError: string | null) => {
          applyCloudSyncResult(set, syncError)
        }

        if (Object.prototype.hasOwnProperty.call(partial, 'githubSyncToken')) {
          void flushPreferencesCloudSync(() => get()).then(completeSync)
          return
        }

        schedulePreferencesCloudSync(() => get(), completeSync)
      },

      resetPreferences: () => {
        const token = get().githubSyncToken
        set({ ...defaultPreferences, githubSyncToken: token, cloudSyncError: null, cloudSyncing: true })
        void flushPreferencesCloudSync(() => get()).then((syncError) => {
          applyCloudSyncResult(set, syncError)
        })
      },

      loadFromCloud: async () => {
        const localToken = get().githubSyncToken
        const cloudPreferences = await fetchCloudPreferences(localToken)
        if (cloudPreferences) {
          setSkipPreferencesCloudSync(true)
          set({
            ...get(),
            ...cloudPreferences,
            githubSyncToken: localToken,
            cloudLoaded: true,
            cloudSyncError: null,
          })
          setSkipPreferencesCloudSync(false)
          return
        }
        set({ cloudLoaded: true })
      },

      syncToCloudNow: async () => {
        set({ cloudSyncing: true })
        const syncError = await flushPreferencesCloudSync(() => get())
        applyCloudSyncResult(set, syncError)
      },
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
