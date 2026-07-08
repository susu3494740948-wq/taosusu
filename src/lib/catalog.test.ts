import { describe, expect, it } from 'vitest'
import { products as baseProducts } from '../data/products'
import {
  getAllCatalogProducts,
  isProductDelisted,
  mergeCatalogProducts,
} from './catalog'
import type { Product } from '../types'

const customProduct: Product = {
  id: 'custom-1',
  name: 'Custom Product',
  category: 'Summer Comfort',
  price: 19.99,
  rating: 5,
  reviewCount: 0,
  stock: 10,
  image: 'custom',
  tags: ['custom'],
  benefits: ['Benefit'],
  description: 'Custom',
  details: ['Detail'],
  shippingNote: 'Ships in 7 days',
}

describe('catalog', () => {
  it('merges custom products ahead of base catalog without duplicates', () => {
    const all = getAllCatalogProducts([customProduct])
    expect(all[0]?.id).toBe('custom-1')
    expect(all.some((product) => product.id === baseProducts[0]?.id)).toBe(true)
    expect(all).toHaveLength(baseProducts.length + 1)
  })

  it('filters delisted products from the active storefront catalog', () => {
    const targetId = baseProducts[0]?.id ?? ''
    const active = mergeCatalogProducts([customProduct], [targetId, 'custom-1'])

    expect(active.some((product) => product.id === targetId)).toBe(false)
    expect(active.some((product) => product.id === 'custom-1')).toBe(false)
    expect(active.length).toBe(baseProducts.length + 1 - 2)
  })

  it('checks delisted status by product id', () => {
    expect(isProductDelisted('sku-a', ['sku-a', 'sku-b'])).toBe(true)
    expect(isProductDelisted('sku-c', ['sku-a', 'sku-b'])).toBe(false)
  })
})
