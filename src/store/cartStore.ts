import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem, Product, ShippingMethod } from '../types'

interface CartState {
  items: CartItem[]
  discountCode: string
  shippingMethod: ShippingMethod
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setDiscountCode: (code: string) => void
  setShippingMethod: (method: ShippingMethod) => void
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(0, Math.min(quantity, stock))
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      discountCode: '',
      shippingMethod: 'standard',

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)
          if (!existing) {
            const nextQuantity = clampQuantity(quantity, product.stock)
            return nextQuantity > 0
              ? { items: [...state.items, { product, quantity: nextQuantity }] }
              : state
          }

          return {
            items: state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: clampQuantity(item.quantity + quantity, item.product.stock),
                  }
                : item,
            ),
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: clampQuantity(quantity, item.product.stock) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),

      clearCart: () => set({ items: [], discountCode: '', shippingMethod: 'standard' }),

      setDiscountCode: (code) => set({ discountCode: code.trim().toUpperCase() }),

      setShippingMethod: (method) => set({ shippingMethod: method }),
    }),
    {
      name: 'taosusu-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function selectCartCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0)
}
