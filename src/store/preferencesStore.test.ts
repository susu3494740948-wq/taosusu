import { describe, expect, it, beforeEach } from 'vitest'
import { defaultPreferences, usePreferencesStore } from './preferencesStore'

describe('preferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.getState().resetPreferences()
  })

  it('stores expanded theme and shopping preferences', () => {
    usePreferencesStore.getState().updatePreferences({
      theme: 'dark',
      language: 'zh',
      storeTheme: 'ocean',
      productSort: 'rating',
      addToCartBehavior: 'stay-on-page',
      marketingEmails: true,
    })

    const state = usePreferencesStore.getState()
    expect(state.theme).toBe('dark')
    expect(state.storeTheme).toBe('ocean')
    expect(state.productSort).toBe('rating')
    expect(state.addToCartBehavior).toBe('stay-on-page')
  })

  it('resets preferences to defaults', () => {
    usePreferencesStore.getState().updatePreferences({ theme: 'dark', compactCatalog: true })
    usePreferencesStore.getState().resetPreferences()

    expect(usePreferencesStore.getState().theme).toBe(defaultPreferences.theme)
    expect(usePreferencesStore.getState().compactCatalog).toBe(defaultPreferences.compactCatalog)
  })
})
