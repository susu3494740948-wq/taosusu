import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { getProductGalleryPhotoUrls, getProductPhotoUrl } from '../data/productPhotos'

describe('productPhotos', () => {
  it('uses real pexels photos for every product image key', () => {
    for (const product of products) {
      const main = getProductPhotoUrl(product.image)
      const gallery = getProductGalleryPhotoUrls(product.image)

      expect(main).toContain('images.pexels.com')
      expect(gallery).toHaveLength(2)
      expect(gallery.every((url) => url.includes('images.pexels.com'))).toBe(true)
    }
  })
})
