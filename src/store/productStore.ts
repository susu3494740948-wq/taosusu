import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchCloudProductsResult, syncProductsToGitHub } from '../lib/cloudCatalog'
import { usePreferencesStore } from './preferencesStore'
import type { Product } from '../types'

interface ProductState {
  customProducts: Product[]
  cloudLoaded: boolean
  cloudSyncError: string | null
  setCustomProducts: (products: Product[]) => void
  loadFromCloud: () => Promise<void>
  addProduct: (product: Product) => Promise<void>
  removeProduct: (productId: string) => Promise<void>
}

function sortProducts(products: Product[]): Product[] {
  return [...products]
}

async function pushToCloud(products: Product[]): Promise<string | null> {
  const token = usePreferencesStore.getState().githubSyncToken
  if (!token.trim()) return null

  try {
    await syncProductsToGitHub(products, token)
    return null
  } catch {
    return '云端同步失败，请检查 GitHub Token 是否正确。'
  }
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      customProducts: [],
      cloudLoaded: false,
      cloudSyncError: null,

      setCustomProducts: (products) => set({ customProducts: sortProducts(products) }),

      loadFromCloud: async () => {
        const result = await fetchCloudProductsResult()
        if (result.ok) {
          set({
            customProducts: sortProducts(result.products),
            cloudLoaded: true,
            cloudSyncError: null,
          })
          return
        }
        set({ cloudLoaded: true })
      },

      addProduct: async (product) => {
        const customProducts = sortProducts([
          product,
          ...get().customProducts.filter((item) => item.id !== product.id),
        ])
        set({ customProducts })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
      },

      removeProduct: async (productId) => {
        const customProducts = get().customProducts.filter((product) => product.id !== productId)
        set({ customProducts })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
      },
    }),
    {
      name: 'taosusu-custom-products',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function selectCustomProducts(state: ProductState): Product[] {
  return state.customProducts
}
