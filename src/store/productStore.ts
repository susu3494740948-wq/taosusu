import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '../types'

interface ProductState {
  customProducts: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      customProducts: [],

      addProduct: (product) =>
        set((state) => ({
          customProducts: [product, ...state.customProducts.filter((item) => item.id !== product.id)],
        })),

      removeProduct: (productId) =>
        set((state) => ({
          customProducts: state.customProducts.filter((product) => product.id !== productId),
        })),
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
