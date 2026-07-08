import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchCloudProductsResult, syncProductsToGitHub } from '../lib/cloudCatalog'
import { useCartStore } from './cartStore'
import { usePreferencesStore } from './preferencesStore'
import type { Product } from '../types'

interface ProductState {
  customProducts: Product[]
  delistedProductIds: string[]
  cloudLoaded: boolean
  cloudSyncError: string | null
  setCustomProducts: (products: Product[]) => void
  loadFromCloud: () => Promise<void>
  addProduct: (product: Product) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  importProducts: (products: Product[]) => Promise<{ imported: number }>
  removeProduct: (productId: string) => Promise<void>
  delistProduct: (productId: string) => void
  relistProduct: (productId: string) => void
  isDelisted: (productId: string) => boolean
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
      delistedProductIds: [],
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
        const delistedProductIds = get().delistedProductIds.filter((id) => id !== product.id)
        set({ customProducts, delistedProductIds })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
      },

      updateProduct: async (product) => {
        const customProducts = sortProducts(
          get().customProducts.map((item) => (item.id === product.id ? product : item)),
        )
        const delistedProductIds = get().delistedProductIds.filter((id) => id !== product.id)
        set({ customProducts, delistedProductIds })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
      },

      importProducts: async (products) => {
        const byId = new Map(get().customProducts.map((item) => [item.id, item]))
        products.forEach((product) => byId.set(product.id, product))
        const customProducts = sortProducts([...byId.values()])
        const importedIds = new Set(products.map((product) => product.id))
        const delistedProductIds = get().delistedProductIds.filter((id) => !importedIds.has(id))
        set({ customProducts, delistedProductIds })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
        return { imported: products.length }
      },

      removeProduct: async (productId) => {
        const customProducts = get().customProducts.filter((product) => product.id !== productId)
        const delistedProductIds = get().delistedProductIds.filter((id) => id !== productId)
        set({ customProducts, delistedProductIds })
        const syncError = await pushToCloud(customProducts)
        set({ cloudSyncError: syncError })
      },

      delistProduct: (productId) => {
        if (get().delistedProductIds.includes(productId)) return
        set({ delistedProductIds: [...get().delistedProductIds, productId] })
        useCartStore.getState().removeItem(productId)
      },

      relistProduct: (productId) => {
        set({
          delistedProductIds: get().delistedProductIds.filter((id) => id !== productId),
        })
      },

      isDelisted: (productId) => get().delistedProductIds.includes(productId),
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
