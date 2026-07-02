import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from './cartStore'
import type { Product } from '../types'

const product: Product = {
  id: 'cooling-towel-kit',
  name: 'Cooling Towel 4-Pack',
  category: 'Summer Comfort',
  price: 19.99,
  compareAtPrice: 29.99,
  rating: 4.8,
  reviewCount: 128,
  stock: 3,
  badge: 'Best Seller',
  image: 'cooling',
  tags: ['summer'],
  benefits: ['Reusable'],
  description: 'A compact cooling towel set.',
  details: ['4 towels'],
  shippingNote: 'Ships in 7-12 business days.',
}

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('adds products and increases quantity up to available stock', () => {
    const store = useCartStore.getState()

    store.addItem(product)
    store.addItem(product)
    store.addItem(product)
    store.addItem(product)

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('updates quantity and removes an item', () => {
    const store = useCartStore.getState()

    store.addItem(product)
    store.updateQuantity(product.id, 2)
    expect(useCartStore.getState().items[0].quantity).toBe(2)

    store.removeItem(product.id)
    expect(useCartStore.getState().items).toEqual([])
  })

  it('stores checkout preferences for the order flow', () => {
    const store = useCartStore.getState()

    store.setDiscountCode('WELCOME10')
    store.setShippingMethod('express')

    expect(useCartStore.getState().discountCode).toBe('WELCOME10')
    expect(useCartStore.getState().shippingMethod).toBe('express')
  })
})
