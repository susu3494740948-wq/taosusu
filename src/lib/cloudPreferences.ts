import { defaultPreferences, type StorePreferences } from '../store/preferencesStore'

export interface CloudSiteSettings {
  version: number
  updatedAt: string
  preferences: Omit<StorePreferences, 'githubSyncToken'>
}

export const siteSettingsPath = 'public/data/site-settings.json'

export function toCloudPreferences(preferences: StorePreferences): CloudSiteSettings['preferences'] {
  const { githubSyncToken: _token, ...rest } = preferences
  return rest
}

export function buildCloudSiteSettings(preferences: StorePreferences): CloudSiteSettings {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    preferences: toCloudPreferences(preferences),
  }
}

export function mergeCloudSiteSettings(
  payload: unknown,
  localToken: string,
): Partial<StorePreferences> | null {
  if (!payload || typeof payload !== 'object') return null

  const source = payload as Partial<CloudSiteSettings>
  const preferences = source.preferences
  if (!preferences || typeof preferences !== 'object') return null

  return {
    ...defaultPreferences,
    ...preferences,
    githubSyncToken: localToken,
  }
}
