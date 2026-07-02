import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import {
  getProductGalleryPhotoUrls,
  getProductPhotoUrl,
  heroImageUrl,
  productUsesLocalPhotos,
} from '../data/productPhotos'

describe('productPhotos', () => {
  it('uses bundled local photos for every product image key', () => {
    for (const product of products) {
      const main = getProductPhotoUrl(product.image)
      const gallery = getProductGalleryPhotoUrls(product.image)

      expect(main).toContain('/images/products/')
      expect(main.endsWith('.jpg')).toBe(true)
      expect(gallery).toHaveLength(2)
      expect(gallery.every((url) => url.includes('/images/products/'))).toBe(true)
      expect(productUsesLocalPhotos(product)).toBe(true)
    }
  })

  it('serves the homepage hero image locally', () => {
    expect(heroImageUrl).toContain('/images/hero.jpg')
  })
})
