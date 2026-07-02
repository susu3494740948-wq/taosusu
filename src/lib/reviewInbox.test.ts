import { describe, expect, it } from 'vitest'
import { recentReviews } from '../data/recentReviews'
import { filterReviews, formatReviewTime } from '../lib/reviewInbox'

describe('reviewInbox', () => {
  it('filters reviews by status and source', () => {
    expect(filterReviews(recentReviews, 'pending').every((r) => r.status === 'pending')).toBe(true)
    expect(filterReviews(recentReviews, 'tiktok').every((r) => r.source === 'tiktok')).toBe(true)
  })

  it('formats relative review time', () => {
    expect(formatReviewTime('2026-06-29T08:00:00Z')).toBe('昨天')
  })
})
