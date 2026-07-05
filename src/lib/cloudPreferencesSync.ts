import { fetchCloudJson, syncJsonToGitHub } from './cloudSync'
import {
  buildCloudSiteSettings,
  mergeCloudSiteSettings,
  siteSettingsPath,
} from './cloudPreferences'
import type { StorePreferences } from '../store/preferencesStore'

let syncTimer: ReturnType<typeof setTimeout> | null = null
let skipAutoSync = false

export function setSkipPreferencesCloudSync(skip: boolean) {
  skipAutoSync = skip
}

export async function fetchCloudPreferences(
  localToken: string,
): Promise<Partial<StorePreferences> | null> {
  const result = await fetchCloudJson<unknown>(siteSettingsPath)
  if (!result.ok) return null
  return mergeCloudSiteSettings(result.data, localToken)
}

export async function pushPreferencesToCloud(preferences: StorePreferences): Promise<string | null> {
  const token = preferences.githubSyncToken.trim()
  if (!token) return null

  try {
    await syncJsonToGitHub(
      siteSettingsPath,
      buildCloudSiteSettings(preferences),
      token,
      'Sync storefront settings from taosusu',
    )
    return null
  } catch {
    return '设置同步失败，请检查 GitHub Token 是否正确。'
  }
}

export function schedulePreferencesCloudSync(
  getPreferences: () => StorePreferences,
  onComplete: (syncError: string | null) => void,
) {
  if (skipAutoSync) return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    void pushPreferencesToCloud(getPreferences()).then(onComplete)
  }, 600)
}

export async function flushPreferencesCloudSync(
  getPreferences: () => StorePreferences,
): Promise<string | null> {
  if (syncTimer) {
    clearTimeout(syncTimer)
    syncTimer = null
  }
  return pushPreferencesToCloud(getPreferences())
}
