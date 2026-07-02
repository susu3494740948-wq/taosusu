import { useMemo, useState } from 'react'
import {
  recentReviews,
  reviewInboxSummary,
  reviewSourceLabels,
  reviewStatusLabels,
} from '../data/recentReviews'
import { storeConfig } from '../data/store'
import { filterReviews, formatReviewTime, type ReviewFilter } from '../lib/reviewInbox'

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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-stone-950 p-8 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Review Inbox</p>
        <h2 className="mt-3 text-4xl font-black">{storeConfig.name} · 刚收到评论</h2>
        <p className="mt-4 max-w-3xl leading-7 text-stone-300">
          汇总站内评价、TikTok 评论、邮件与社媒私信，优先处理待回复与高意向购买询问。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-300">
          <span className="rounded-full bg-white/10 px-4 py-2">周期：{reviewInboxSummary.period}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">客服：{storeConfig.supportEmail}</span>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['新评论', String(reviewInboxSummary.total)],
          ['待回复', String(reviewInboxSummary.pending)],
          ['需关注', String(reviewInboxSummary.flagged)],
          ['平均评分', String(reviewInboxSummary.averageRating)],
          ['TikTok 待跟进', String(reviewInboxSummary.tiktokLeads)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-black text-stone-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Inbox</p>
            <h3 className="mt-2 text-2xl font-black text-stone-950">评论列表</h3>
          </div>
          <p className="text-sm text-stone-500">共 {filteredReviews.length} 条</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeFilter === tab.id
                  ? 'bg-stone-950 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-stone-950">{review.author}</p>
                    <Stars rating={review.rating} />
                    <span className={`text-xs font-bold ${sentimentStyles[review.sentiment]}`}>
                      {review.sentiment === 'positive' ? '好评' : review.sentiment === 'negative' ? '差评' : '中性'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewProduct(review.productId)}
                    className="mt-1 text-sm font-bold text-sky-700 hover:underline"
                  >
                    {review.productName} · 查看商品详情
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-white px-3 py-1 text-stone-600">
                    {reviewSourceLabels[review.source]}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${statusStyles[review.status]}`}>
                    {reviewStatusLabels[review.status]}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-stone-500">
                    {formatReviewTime(review.receivedAt)}
                  </span>
                </div>
              </div>

              <p className="mt-4 leading-7 text-stone-800">{review.content}</p>

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
                  <button
                    type="button"
                    className="rounded-full bg-stone-950 px-4 py-2 text-sm font-bold text-white"
                  >
                    撰写回复
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700"
                  >
                    标记已处理
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Playbook</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">回复优先级</h3>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
            <li className="rounded-2xl bg-stone-100 px-4 py-3">
              TikTok「哪里买 / link?」→ 24 小时内回复独立站链接并记录 UTM
            </li>
            <li className="rounded-2xl bg-stone-100 px-4 py-3">
              物流 / 退换货邮件 → 先确认订单号，再同步 tracking 或政策链接
            </li>
            <li className="rounded-2xl bg-stone-100 px-4 py-3">
              差评与 flagged → 升级至商品页 FAQ 或批次排查，勿只私信安抚
            </li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Sources</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">渠道分布</h3>
          <div className="mt-5 space-y-3">
            {(['tiktok', 'site', 'email', 'instagram'] as const).map((source) => {
              const count = recentReviews.filter((review) => review.source === source).length
              return (
                <div
                  key={source}
                  className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3"
                >
                  <p className="text-sm text-stone-700">{reviewSourceLabels[source]}</p>
                  <p className="font-black text-stone-950">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
