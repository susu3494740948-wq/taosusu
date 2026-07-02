import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  defaultSiteContent,
  mergeSiteContent,
  type SiteContent,
} from '../data/siteContentDefaults'
import { fetchCloudJson, syncJsonToGitHub } from '../lib/cloudSync'
import { usePreferencesStore } from './preferencesStore'

const siteContentPath = 'public/data/site-content.json'

interface SiteContentState {
  content: SiteContent
  cloudLoaded: boolean
  cloudSyncError: string | null
  loadFromCloud: () => Promise<void>
  saveContent: (content: SiteContent) => Promise<void>
}

async function pushSiteContentToCloud(content: SiteContent): Promise<string | null> {
  const token = usePreferencesStore.getState().githubSyncToken
  if (!token.trim()) return null

  try {
    await syncJsonToGitHub(
      siteContentPath,
      content,
      token,
      'Sync site content from taosusu storefront',
    )
    return null
  } catch {
    return '站点内容同步失败，请检查 GitHub Token 是否正确。'
  }
}

export const useSiteContentStore = create<SiteContentState>()(
  persist(
    (set) => ({
      content: defaultSiteContent,
      cloudLoaded: false,
      cloudSyncError: null,

      loadFromCloud: async () => {
        const result = await fetchCloudJson<unknown>(siteContentPath)
        if (result.ok) {
          set({
            content: mergeSiteContent(result.data),
            cloudLoaded: true,
            cloudSyncError: null,
          })
          return
        }
        set({ cloudLoaded: true })
      },

      saveContent: async (nextContent) => {
        const content = {
          ...nextContent,
          updatedAt: new Date().toISOString(),
        }
        set({ content })
        const syncError = await pushSiteContentToCloud(content)
        set({ cloudSyncError: syncError })
      },
    }),
    {
      name: 'taosusu-site-content',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<SiteContentState>),
        content: mergeSiteContent((persistedState as Partial<SiteContentState>)?.content ?? null),
      }),
    },
  ),
)

export function selectStoreConfig(state: SiteContentState) {
  return state.content.store
}

export function selectHomepageContent(state: SiteContentState) {
  return state.content.homepage
}

export function selectPromoCodes(state: SiteContentState) {
  return state.content.promos
}

export function selectTrustPoints(state: SiteContentState) {
  return state.content.trustPoints
}
