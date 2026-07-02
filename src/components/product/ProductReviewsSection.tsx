import {
  formatProductReviewDate,
  getProductReviewSummary,
  getProductReviews,
} from '../../lib/productReviews'
import { theme } from '../../lib/themeClasses'
import type { Product } from '../../types'

function Stars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const className = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <span className={`text-amber-500 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

interface ProductReviewsSectionProps {
  product: Product
}

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const reviews = getProductReviews(product.id)
  const summary = getProductReviewSummary(product, reviews)

  return (
    <section className={`mt-16 rounded-[2rem] p-6 sm:p-8 ${theme.surface}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.muted}`}>顾客评价</p>
          <h3 className={`mt-2 text-2xl font-black ${theme.heading}`}>买家怎么说</h3>
        </div>
        <p className={`text-sm ${theme.muted}`}>本页展示 {summary.reviewCount} 条文字评价</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className={`rounded-3xl p-6 ${theme.surfaceMuted}`}>
          <p className={`text-4xl font-black ${theme.heading}`}>{summary.averageRating}</p>
          <Stars rating={Math.round(summary.averageRating)} />
          <p className={`mt-2 text-sm ${theme.muted}`}>基于 {product.reviewCount} 条店铺评分</p>
          <div className="mt-6 space-y-2">
            {summary.distribution.map((row) => (
              <div key={row.stars} className="grid grid-cols-[36px_1fr_32px] items-center gap-2 text-xs">
                <span className="font-bold text-stone-600">{row.stars}★</span>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="text-right text-stone-500">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-8 text-center">
              <p className={`font-bold ${theme.heading}`}>暂无文字评价</p>
              <p className={`mt-2 text-sm ${theme.muted}`}>欢迎成为第一个分享 {product.name} 使用体验的人。</p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-stone-200 bg-stone-50 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-stone-950">{review.author}</p>
                    <Stars rating={review.rating} size="sm" />
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    <p>{formatProductReviewDate(review.createdAt)}</p>
                    {review.verified ? (
                      <p className="mt-1 font-bold text-emerald-700">已验证购买</p>
                    ) : null}
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-stone-950">{review.title}</h4>
                <p className="mt-2 leading-7 text-stone-700">{review.content}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
