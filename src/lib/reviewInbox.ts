import type { RecentReview, ReviewSentiment, ReviewSource, ReviewStatus } from '../data/recentReviews'

export type ReviewFilter = 'all' | ReviewStatus | ReviewSentiment | ReviewSource

export function filterReviews(reviews: RecentReview[], filter: ReviewFilter): RecentReview[] {
  if (filter === 'all') return reviews

  if (filter === 'pending' || filter === 'replied' || filter === 'flagged') {
    return reviews.filter((review) => review.status === filter)
  }

  if (filter === 'positive' || filter === 'neutral' || filter === 'negative') {
    return reviews.filter((review) => review.sentiment === filter)
  }

  return reviews.filter((review) => review.source === filter)
}

export function formatReviewTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date('2026-07-01T00:00:00Z')
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours} 小时前`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '昨天'
  return `${diffDays} 天前`
}
