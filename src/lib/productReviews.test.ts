import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { getProductReviewSummary, getProductReviews } from './productReviews'

describe('productReviews', () => {
  it('returns reviews for a product sorted by newest first', () => {
    const reviews = getProductReviews('cooling-towel-kit')

    expect(reviews.length).toBeGreaterThan(0)
    expect(reviews[0]?.author).toBe('Jess M.')
  })

  it('builds a review summary from product page reviews', () => {
    const product = products[0]
    const reviews = getProductReviews(product.id)
    const summary = getProductReviewSummary(product, reviews)

    expect(summary.reviewCount).toBe(reviews.length)
    expect(summary.averageRating).toBeGreaterThan(0)
    expect(summary.distribution).toHaveLength(5)
  })
})
