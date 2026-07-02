import { productReviews, type ProductReview } from '../data/productReviews'
import type { Product } from '../types'

export function getProductReviews(productId: string): ProductReview[] {
  return productReviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getProductReviewSummary(product: Product, reviews: ProductReview[]) {
  if (reviews.length === 0) {
    return {
      averageRating: product.rating,
      reviewCount: product.reviewCount,
      distribution: buildRatingDistribution(product.rating, product.reviewCount),
    }
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount: reviews.length,
    distribution: buildRatingDistributionFromReviews(reviews),
  }
}

function buildRatingDistributionFromReviews(reviews: ProductReview[]) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  for (const review of reviews) {
    const key = review.rating as keyof typeof counts
    if (counts[key] !== undefined) counts[key] += 1
  }

  return toDistributionPercentages(counts, reviews.length)
}

function buildRatingDistribution(averageRating: number, reviewCount: number) {
  const rounded = Math.round(averageRating)
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const visibleCount = Math.min(reviewCount, 5)

  for (let index = 0; index < visibleCount; index += 1) {
    const rating = Math.max(1, Math.min(5, rounded - (index % 2)))
    counts[rating as keyof typeof counts] += 1
  }

  return toDistributionPercentages(counts, visibleCount || 1)
}

function toDistributionPercentages(
  counts: Record<1 | 2 | 3 | 4 | 5, number>,
  total: number,
) {
  return ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: counts[stars],
    percent: total === 0 ? 0 : Math.round((counts[stars] / total) * 100),
  }))
}

export function formatProductReviewDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}
