import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { products } from '../data/products'
import {
  channelPerformance,
  complianceChecks,
  decisionReview,
  heroSkuSignals,
  trafficFunnel,
  weeklyActions,
} from '../data/operationsSnapshot'
import { storeConfig } from '../data/store'
import { formatCurrency } from '../lib/formatters'
import { buildOperationsSummary, getSkuOperationalStatus } from '../lib/operationsMetrics'
import { theme } from '../lib/themeClasses'

const funnelSteps = [
  { step: 'Impressions', value: trafficFunnel.impressions },
  { step: 'Clicks', value: trafficFunnel.clicks },
  { step: 'Page Views', value: trafficFunnel.pageViews },
  { step: 'Add To Cart', value: trafficFunnel.addToCarts },
  { step: 'Checkout', value: trafficFunnel.checkouts },
  { step: 'Purchase', value: trafficFunnel.purchases },
]

const statusStyles: Record<
  ReturnType<typeof getSkuOperationalStatus>,
  { label: string; className: string }
> = {
  healthy: { label: '库存充足', className: 'bg-emerald-100 text-emerald-800' },
  'low-stock': { label: '低库存', className: 'bg-amber-100 text-amber-800' },
  'out-of-stock': { label: '缺货', className: 'bg-red-100 text-red-800' },
}

const decisionStyles = {
  Continue: 'bg-emerald-100 text-emerald-800',
  Pivot: 'bg-amber-100 text-amber-800',
  Test: 'bg-sky-100 text-sky-800',
  Stop: 'bg-red-100 text-red-800',
}

interface AdminDashboardPageProps {
  onNavigateUpload: () => void
  onNavigateSiteContent: () => void
  onNavigateBlog: () => void
  onNavigateBlogView: () => void
  catalogCount: number
}

export function AdminDashboardPage({
  onNavigateUpload,
  onNavigateSiteContent,
  onNavigateBlog,
  onNavigateBlogView,
  catalogCount,
}: AdminDashboardPageProps) {
  const summary = buildOperationsSummary(products)
  const sortedProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount)

  return (
    <main className={theme.pageMain}>
      <section className={`${theme.pageHero} bg-stone-950 p-6 text-white sm:p-10`}>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Operations Center</p>
        <h2 className={`${theme.pageTitle} text-white`}>{storeConfig.name} 运营中心</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
          汇总商品库存、14 天流量测试、SKU 信号、合规检查与 Go / Pivot / Stop 决策，帮助你在放量前先看清瓶颈。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-300">
          <span className="rounded-full bg-white/10 px-4 py-2">市场：美国</span>
          <span className="rounded-full bg-white/10 px-4 py-2">在售 SKU：{catalogCount}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">测试周期：{trafficFunnel.period}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">客服：{storeConfig.supportEmail}</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onNavigateUpload}
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-stone-950 transition hover:bg-emerald-300"
          >
            商品上架 →
          </button>
          <button
            type="button"
            onClick={onNavigateSiteContent}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            编辑站点内容 →
          </button>
          <button
            type="button"
            onClick={onNavigateBlog}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            发布顾客博客 →
          </button>
          <button
            type="button"
            onClick={onNavigateBlogView}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            查看顾客博客 →
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['在售 SKU', String(summary.activeSkus)],
          ['库存总量', `${summary.totalStockUnits} 件`],
          ['库存货值', formatCurrency(summary.inventoryValue)],
          ['14天广告花费', formatCurrency(trafficFunnel.adSpend)],
          ['14天营收', formatCurrency(trafficFunnel.revenue)],
          ['平均客单价', formatCurrency(trafficFunnel.averageOrderValue)],
          ['低库存 SKU', String(summary.lowStockCount)],
          ['预估贡献率', `${trafficFunnel.estimatedMargin}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-black text-stone-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Traffic funnel</p>
              <h3 className="mt-2 text-2xl font-black text-stone-950">14 天转化漏斗</h3>
            </div>
            <p className="text-sm text-stone-500">CTR {trafficFunnel.ctr}% · ATC {trafficFunnel.addToCartRate}%</p>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelSteps} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="step" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid #e7e5e4', fontSize: 12 }}
                  formatter={(value) => [String(value), '数量']}
                />
                <Bar dataKey="value" fill="#1c1917" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Channels</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">渠道表现</h3>
          <div className="mt-5 space-y-4">
            {channelPerformance.map((channel) => (
              <div key={channel.channel} className="rounded-2xl bg-stone-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-stone-950">{channel.channel}</p>
                  <p className="font-black text-stone-950">{formatCurrency(channel.revenue)}</p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-stone-600">
                  <span>Spend {formatCurrency(channel.spend)}</span>
                  <span>Clicks {channel.clicks}</span>
                  <span>Orders {channel.purchases}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Inventory by category</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">品类库存分布</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.categoryMetrics} layout="vertical" margin={{ top: 0, right: 8, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e7e5e4" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={120}
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid #e7e5e4', fontSize: 12 }}
                  formatter={(value) => [String(value), '库存']}
                />
                <Bar dataKey="totalStock" radius={[0, 8, 8, 0]}>
                  {summary.categoryMetrics.map((entry, index) => (
                    <Cell key={entry.category} fill={['#059669', '#d97706', '#2563eb', '#db2777', '#57534e', '#0891b2'][index % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] bg-amber-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">Decision review</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">
            Go / Pivot / Stop：{decisionReview.status}
          </h3>
          <p className="mt-3 leading-7 text-stone-700">{decisionReview.headline}</p>
          <div className="mt-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-stone-950">判断依据</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">
                {decisionReview.reasons.map((reason) => (
                  <li key={reason} className="rounded-2xl bg-white/70 px-4 py-3">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">下一步动作</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">
                {decisionReview.nextSteps.map((step) => (
                  <li key={step} className="rounded-2xl bg-white/70 px-4 py-3">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">SKU signals</p>
            <h3 className="mt-2 text-2xl font-black text-stone-950">Hero SKU 测试信号</h3>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-3 py-3 font-bold">SKU</th>
                <th className="px-3 py-3 font-bold">信号</th>
                <th className="px-3 py-3 font-bold">决策</th>
                <th className="px-3 py-3 font-bold">说明</th>
              </tr>
            </thead>
            <tbody>
              {heroSkuSignals.map((item) => (
                <tr key={item.sku} className="border-b border-stone-100">
                  <td className="px-3 py-4 font-bold text-stone-950">{item.sku}</td>
                  <td className="px-3 py-4 text-stone-700">{item.signal}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${decisionStyles[item.decision as keyof typeof decisionStyles]}`}>
                      {item.decision}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-stone-600">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Catalog operations</p>
            <h3 className="mt-2 text-2xl font-black text-stone-950">全店 SKU 运营表</h3>
          </div>
          <p className="text-sm text-stone-500">
            平均评分 {summary.averageRating.toFixed(1)} · 平均售价 {formatCurrency(summary.averagePrice)}
          </p>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-3 py-3 font-bold">商品</th>
                <th className="px-3 py-3 font-bold">品类</th>
                <th className="px-3 py-3 font-bold">价格</th>
                <th className="px-3 py-3 font-bold">库存</th>
                <th className="px-3 py-3 font-bold">评分</th>
                <th className="px-3 py-3 font-bold">标签</th>
                <th className="px-3 py-3 font-bold">状态</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => {
                const status = getSkuOperationalStatus(product.stock)
                return (
                  <tr key={product.id} className="border-b border-stone-100">
                    <td className="px-3 py-4 font-bold text-stone-950">{product.name}</td>
                    <td className="px-3 py-4 text-stone-600">{product.category}</td>
                    <td className="px-3 py-4 font-black text-stone-950">{formatCurrency(product.price)}</td>
                    <td className="px-3 py-4 text-stone-700">{product.stock}</td>
                    <td className="px-3 py-4 text-stone-700">
                      {product.rating} ({product.reviewCount})
                    </td>
                    <td className="px-3 py-4 text-stone-600">{product.badge ?? '-'}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[status].className}`}>
                        {statusStyles[status].label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Weekly rhythm</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">本周运营动作</h3>
          <ul className="mt-5 space-y-3">
            {weeklyActions.map((action) => (
              <li key={action} className="rounded-2xl bg-stone-100 px-4 py-3 text-sm leading-6 text-stone-700">
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Compliance</p>
          <h3 className="mt-2 text-2xl font-black text-stone-950">合规与履约检查</h3>
          <div className="mt-5 space-y-3">
            {complianceChecks.map((check) => (
              <div key={check.item} className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3">
                <p className="text-sm text-stone-700">{check.item}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    check.status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {check.status === 'pass' ? '正常' : '关注'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
