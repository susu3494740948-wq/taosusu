import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { getProductMedia } from './productMedia'

describe('getProductMedia', () => {
  it('builds main, gallery, size, and optional video slides for each product', () => {
    for (const product of products) {
      const slides = getProductMedia(product)

      expect(slides[0]?.type).toBe('main')
      expect(slides.some((slide) => slide.type === 'gallery')).toBe(true)
      expect(slides.some((slide) => slide.type === 'size')).toBe(true)
    }
  })

  it('includes a demo video for featured summer products', () => {
    const slides = getProductMedia(products[0])

    expect(slides.some((slide) => slide.type === 'video')).toBe(true)
  })
})
