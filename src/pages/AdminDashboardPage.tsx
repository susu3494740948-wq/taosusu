import { useState } from 'react'
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
import {
  channelPerformance,
  complianceChecks,
  decisionReview,
  heroSkuSignals,
  platformBreakdown,
  trafficFunnel,
  weeklyActions,
  type PlatformId,
} from '../data/operationsSnapshot'
import { storeConfig } from '../data/store'
import { getAllCatalogProducts, isProductDelisted, mergeCatalogProducts } from '../lib/catalog'
import { formatCurrency } from '../lib/formatters'
import { buildOperationsSummary, getSkuOperationalStatus } from '../lib/operationsMetrics'
import { theme } from '../lib/themeClasses'
import { useProductStore } from '../store/productStore'

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
  const [activePlatform, setActivePlatform] = useState<PlatformId | 'all'>('all')
  const customProducts = useProductStore((state) => state.customProducts)
  const delistedProductIds = useProductStore((state) => state.delistedProductIds)
  const delistProduct = useProductStore((state) => state.delistProduct)
  const relistProduct = useProductStore((state) => state.relistProduct)
  const activeProducts = mergeCatalogProducts(customProducts, delistedProductIds)
  const allProducts = getAllCatalogProducts(customProducts)
  const summary = buildOperationsSummary(activeProducts)
  const sortedProducts = [...allProducts].sort((a, b) => b.reviewCount - a.reviewCount)
  const delistedCount = delistedProductIds.length

  const selectedPlatform =
    activePlatform === 'all'
      ? null
      : platformBreakdown.find((platform) => platform.id === activePlatform) ?? null

  const displayRevenue = selectedPlatform?.gmv ?? trafficFunnel.revenue
  const displayOrders = selectedPlatform?.orders ?? trafficFunnel.purchases
  const displayAov = selectedPlatform?.averageOrderValue ?? trafficFunnel.averageOrderValue
  const displayAdSpend = selectedPlatform?.adSpend ?? trafficFunnel.adSpend
  const displayImpressions = selectedPlatform?.impressions ?? trafficFunnel.impressions
  const displayClicks = selectedPlatform?.clicks ?? trafficFunnel.clicks
  const displayAddToCarts = selectedPlatform?.addToCarts ?? trafficFunnel.addToCarts

  const platformFunnelSteps = [
    { step: 'Impressions', value: displayImpressions },
    { step: 'Clicks', value: displayClicks },
    { step: 'Add To Cart', value: displayAddToCarts },
    { step: 'Checkout', value: trafficFunnel.checkouts },
    { step: 'Purchase', value: displayOrders },
  ]

  return (
    <main className={theme.pageMain}>
      <section className={`${theme.pageHero} bg-stone-950 p-6 text-white sm:p-10`}>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Operations Center</p>
        <h2 className={`${theme.pageTitle} text-white`}>{storeConfig.name} 运营中心</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
          汇总多平台 GMV、库存、流量漏斗与合规检查，帮助运营助理每日跟数、周报汇总与低库存预警。（模拟数据）
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-300">
          <span className="rounded-full bg-white/10 px-4 py-2">市场：美国 + 东南亚</span>
          <span className="rounded-full bg-white/10 px-4 py-2">在售 SKU：{catalogCount}</span>
          {delistedCount > 0 ? (
            <span className="rounded-full bg-red-400/20 px-4 py-2 text-red-200">已下架：{delistedCount}</span>
          ) : null}
          <span className="rounded-full bg-white/10 px-4 py-2">测试周期：{trafficFunnel.period}</span>
          <span className="rounded-full bg-amber-400/20 px-4 py-2 text-amber-200">模拟练习数据</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {(['all', 'tiktok', 'shopee', 'temu'] as const).map((platformId) => {
            const label =
              platformId === 'all'
                ? '全平台'
                : platformBreakdown.find((p) => p.id === platformId)?.label ?? platformId
            return (
              <button
                key={platformId}
                type="button"
                onClick={() => setActivePlatform(platformId)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  activePlatform === platformId
                    ? 'bg-emerald-400 text-stone-950'
                    : 'border border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            )
          })}
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
          ['平台 GMV', formatCurrency(displayRevenue)],
          ['平台订单', String(displayOrders)],
          ['平均客单价', formatCurrency(displayAov)],
          ['低库存 SKU', String(summary.lowStockCount)],
          ['广告花费', formatCurrency(displayAdSpend)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-stone-500">{label}</p>
            <p className="mt-3 text-2xl font-black text-stone-950">{value}</p>
          </div>
        ))}
      </section>

      {selectedPlatform ? (
        <section className="mt-6 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            {selectedPlatform.label} · 平台摘要（模拟）
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Top SKU', selectedPlatform.topSku],
              ['退款率', `${selectedPlatform.refundRate}%`],
              ['曝光', selectedPlatform.impressions.toLocaleString()],
              ['备注', selectedPlatform.note],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p>
                <p className="mt-2 text-sm font-bold text-stone-950">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Platform comparison</p>
          <h3 className="mt-2 text-xl font-black text-stone-950">各平台 GMV 对比（模拟）</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {platformBreakdown.map((platform) => (
              <div key={platform.id} className="rounded-2xl bg-stone-100 p-4">
                <p className="font-bold text-stone-950">{platform.label}</p>
                <p className="mt-2 text-2xl font-black text-stone-950">{formatCurrency(platform.gmv)}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {platform.orders} 单 · 退款率 {platform.refundRate}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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
              <BarChart data={platformFunnelSteps} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                <th className="px-3 py-3 font-bold">库存状态</th>
                <th className="px-3 py-3 font-bold">上架状态</th>
                <th className="px-3 py-3 font-bold">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => {
                const status = getSkuOperationalStatus(product.stock)
                const delisted = isProductDelisted(product.id, delistedProductIds)
                return (
                  <tr key={product.id} className={`border-b border-stone-100 ${delisted ? 'bg-stone-50 opacity-75' : ''}`}>
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
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          delisted ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {delisted ? '已下架' : '在售'}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {delisted ? (
                        <button
                          type="button"
                          onClick={() => relistProduct(product.id)}
                          className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800 transition hover:bg-emerald-200"
                        >
                          重新上架
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => delistProduct(product.id)}
                          className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700 transition hover:bg-red-100"
                        >
                          下架
                        </button>
                      )}
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
