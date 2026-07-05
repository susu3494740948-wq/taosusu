import { describe, expect, it } from 'vitest'
import { mergeCloudSiteSettings, toCloudPreferences } from './cloudPreferences'
import { defaultPreferences } from '../store/preferencesStore'

describe('cloudPreferences', () => {
  it('excludes github token from cloud payload', () => {
    const payload = toCloudPreferences({
      ...defaultPreferences,
      githubSyncToken: 'secret-token',
      theme: 'dark',
    })
    expect(payload.theme).toBe('dark')
    expect('githubSyncToken' in payload).toBe(false)
  })

  it('merges cloud settings while keeping local token', () => {
    const merged = mergeCloudSiteSettings(
      {
        version: 1,
        updatedAt: '2026-07-05T00:00:00.000Z',
        preferences: { theme: 'dark', storeTheme: 'ocean' },
      },
      'local-token',
    )
    expect(merged?.theme).toBe('dark')
    expect(merged?.storeTheme).toBe('ocean')
    expect(merged?.githubSyncToken).toBe('local-token')
  })
})
