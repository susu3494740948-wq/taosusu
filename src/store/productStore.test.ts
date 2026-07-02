import { describe, expect, it, beforeEach } from 'vitest'
import { useProductStore } from './productStore'
import type { Product } from '../types'

const sampleProduct: Product = {
  id: 'demo-upload-1',
  name: 'Demo Upload Product',
  category: 'Summer Comfort',
  price: 19.99,
  rating: 5,
  reviewCount: 0,
  stock: 5,
  badge: 'New Arrival',
  image: 'custom',
  tags: ['demo'],
  benefits: ['Benefit one'],
  description: 'Demo description',
  details: ['Detail one'],
  shippingNote: 'Processing 2-5 business days.',
}

describe('productStore', () => {
  beforeEach(() => {
    useProductStore.setState({ customProducts: [] })
  })

  it('adds and removes custom products', () => {
    useProductStore.getState().addProduct(sampleProduct)
    expect(useProductStore.getState().customProducts).toHaveLength(1)

    useProductStore.getState().removeProduct(sampleProduct.id)
    expect(useProductStore.getState().customProducts).toHaveLength(0)
  })
})
