import { useMemo, useState } from 'react'
import {
  recentReviews,
  reviewInboxSummary,
  reviewSourceLabels,
  reviewStatusLabels,
} from '../data/recentReviews'
import { storeConfig } from '../data/store'
import { filterReviews, formatReviewTime, type ReviewFilter } from '../lib/reviewInbox'
import { theme } from '../lib/themeClasses'

const filterTabs: { id: ReviewFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待回复' },
  { id: 'flagged', label: '需关注' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'negative', label: '差评' },
]

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800',
  replied: 'bg-emerald-100 text-emerald-800',
  flagged: 'bg-red-100 text-red-800',
}

const sentimentStyles = {
  positive: 'text-emerald-700',
  neutral: 'text-stone-600',
  negative: 'text-red-700',
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating} 星`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

export function RecentReviewsPage({ onViewProduct }: { onViewProduct: (productId: string) => void }) {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all')

  const filteredReviews = useMemo(
    () =>
      [...filterReviews(recentReviews, activeFilter)].sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
      ),
    [activeFilter],
  )

  return (
    <main className={theme.pageMain}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Review Inbox</p>
        <h2 className={theme.pageTitle}>{storeConfig.name} · 刚收到评论</h2>
        <p className={theme.pageSubtitle}>
          汇总站内评价、TikTok 评论、邮件与社媒私信，优先处理待回复与高意向购买询问。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm opacity-80">
          <span className="rounded-full bg-white/10 px-4 py-2">周期：{reviewInboxSummary.period}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">客服：{storeConfig.supportEmail}</span>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
        {[
          ['新评论', String(reviewInboxSummary.total)],
          ['待回复', String(reviewInboxSummary.pending)],
          ['需关注', String(reviewInboxSummary.flagged)],
          ['平均评分', String(reviewInboxSummary.averageRating)],
          ['TikTok 待跟进', String(reviewInboxSummary.tiktokLeads)],
        ].map(([label, value]) => (
          <div key={label} className={`rounded-3xl p-4 sm:p-5 ${theme.surface} ${theme.border} border`}>
            <p className={`text-xs font-bold uppercase tracking-[0.15em] sm:text-sm ${theme.muted}`}>{label}</p>
            <p className={`mt-2 text-xl font-black sm:mt-3 sm:text-2xl ${theme.heading}`}>{value}</p>
          </div>
        ))}
      </section>

      <section className={`mt-6 rounded-[2rem] p-5 sm:mt-8 sm:p-6 ${theme.surface} ${theme.border} border`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.muted}`}>Inbox</p>
            <h3 className={`mt-2 text-xl font-black sm:text-2xl ${theme.heading}`}>评论列表</h3>
          </div>
          <p className={`text-sm ${theme.muted}`}>共 {filteredReviews.length} 条</p>
        </div>

        <div className="home-scroll-row mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition sm:shrink ${
                activeFilter === tab.id ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredReviews.map((review) => (
            <article key={review.id} className={`rounded-2xl p-5 sm:p-6 ${theme.surfaceMuted}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-black ${theme.heading}`}>{review.author}</p>
                    <Stars rating={review.rating} />
                    <span className={`text-xs font-bold ${sentimentStyles[review.sentiment]}`}>
                      {review.sentiment === 'positive' ? '好评' : review.sentiment === 'negative' ? '差评' : '中性'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewProduct(review.productId)}
                    className={`mt-1 text-sm font-bold ${theme.accentText} hover:underline`}
                  >
                    {review.productName} · 查看商品详情
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className={`rounded-full px-3 py-1 ${theme.surface}`}>
                    {reviewSourceLabels[review.source]}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${statusStyles[review.status]}`}>
                    {reviewStatusLabels[review.status]}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${theme.surface} ${theme.muted}`}>
                    {formatReviewTime(review.receivedAt)}
                  </span>
                </div>
              </div>

              <p className={`mt-4 leading-7 ${theme.heading}`}>{review.content}</p>

              {review.reply ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
                  <p className="font-bold">已回复</p>
                  <p className="mt-1">{review.reply}</p>
                </div>
              ) : null}

              {review.opsNote ? (
                <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  <p className="font-bold">运营备注</p>
                  <p className="mt-1">{review.opsNote}</p>
                </div>
              ) : null}

              {review.status === 'pending' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className={`rounded-full px-4 py-2 text-sm font-bold ${theme.primaryBtn}`}>
                    撰写回复
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border}`}
                  >
                    标记已处理
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
        <div className={`rounded-[2rem] p-5 sm:p-6 ${theme.surface} ${theme.border} border`}>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.muted}`}>Playbook</p>
          <h3 className={`mt-2 text-xl font-black sm:text-2xl ${theme.heading}`}>回复优先级</h3>
          <ul className={`mt-5 space-y-3 text-sm leading-6 ${theme.muted}`}>
            <li className={`rounded-2xl px-4 py-3 ${theme.surfaceMuted}`}>
              TikTok「哪里买 / link?」→ 24 小时内回复独立站链接并记录 UTM
            </li>
            <li className={`rounded-2xl px-4 py-3 ${theme.surfaceMuted}`}>
              物流 / 退换货邮件 → 先确认订单号，再同步 tracking 或政策链接
            </li>
            <li className={`rounded-2xl px-4 py-3 ${theme.surfaceMuted}`}>
              差评与 flagged → 升级至商品页 FAQ 或批次排查，勿只私信安抚
            </li>
          </ul>
        </div>

        <div className={`rounded-[2rem] p-5 sm:p-6 ${theme.surface} ${theme.border} border`}>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.muted}`}>Sources</p>
          <h3 className={`mt-2 text-xl font-black sm:text-2xl ${theme.heading}`}>渠道分布</h3>
          <div className="mt-5 space-y-3">
            {(['tiktok', 'site', 'email', 'instagram'] as const).map((source) => {
              const count = recentReviews.filter((review) => review.source === source).length
              return (
                <div
                  key={source}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 ${theme.surfaceMuted}`}
                >
                  <p className={`text-sm ${theme.muted}`}>{reviewSourceLabels[source]}</p>
                  <p className={`font-black ${theme.heading}`}>{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
