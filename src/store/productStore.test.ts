import { beforeEach, describe, expect, it, vi } from 'vitest'
import { products as baseProducts } from '../data/products'
import { useCartStore } from './cartStore'
import { useProductStore } from './productStore'
import type { Product } from '../types'

vi.mock('../lib/cloudCatalog', () => ({
  fetchCloudProductsResult: vi.fn(async () => ({ ok: false, products: null })),
  syncProductsToGitHub: vi.fn(async () => undefined),
}))

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
    useProductStore.setState({ customProducts: [], delistedProductIds: [], cloudLoaded: false, cloudSyncError: null })
    useCartStore.setState({ items: [], discountCode: '', shippingMethod: 'standard' })
  })

  it('adds and removes custom products', async () => {
    await useProductStore.getState().addProduct(sampleProduct)
    expect(useProductStore.getState().customProducts).toHaveLength(1)

    await useProductStore.getState().updateProduct({ ...sampleProduct, price: 21.99 })
    expect(useProductStore.getState().customProducts[0]?.price).toBe(21.99)

    await useProductStore.getState().removeProduct(sampleProduct.id)
    expect(useProductStore.getState().customProducts).toHaveLength(0)
  })

  it('delists and relists products while removing them from the cart', () => {
    useCartStore.getState().addItem(sampleProduct, 1)
    useProductStore.setState({ customProducts: [sampleProduct] })

    useProductStore.getState().delistProduct(sampleProduct.id)
    expect(useProductStore.getState().delistedProductIds).toContain(sampleProduct.id)
    expect(useCartStore.getState().items).toHaveLength(0)

    useProductStore.getState().relistProduct(sampleProduct.id)
    expect(useProductStore.getState().delistedProductIds).not.toContain(sampleProduct.id)
  })

  it('delists base catalog products without deleting source data', () => {
    const baseId = baseProducts[0]?.id ?? ''
    useProductStore.getState().delistProduct(baseId)
    expect(useProductStore.getState().isDelisted(baseId)).toBe(true)
    expect(useProductStore.getState().customProducts).toHaveLength(0)
  })

  it('imports products in batch and replaces same sku', async () => {
    const first = { ...sampleProduct, id: 'TTS-IMPORT-1', name: 'Import One' }
    const second = { ...sampleProduct, id: 'TTS-IMPORT-2', name: 'Import Two' }
    await useProductStore.getState().importProducts([first, second])
    expect(useProductStore.getState().customProducts).toHaveLength(2)

    const updatedFirst = { ...first, price: 24.99 }
    await useProductStore.getState().importProducts([updatedFirst])
    expect(useProductStore.getState().customProducts.find((item) => item.id === 'TTS-IMPORT-1')?.price).toBe(24.99)
  })
})
