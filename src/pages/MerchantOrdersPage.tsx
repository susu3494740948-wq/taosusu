import { useMemo, useState, type FormEvent } from 'react'
import { formatCurrency, formatDateTime } from '../lib/formatters'
import { canSyncToCloud } from '../lib/cloudSync'
import { orderFilterLabels, orderStatusLabels, orderStatusTone, paymentStatusLabels, type OrderFilter } from '../lib/orderLabels'
import { theme } from '../lib/themeClasses'
import { countOrders, filterOrders, useOrderStore } from '../store/orderStore'
import { usePreferencesStore } from '../store/preferencesStore'
import type { Order } from '../types'

const filters: OrderFilter[] = ['all', 'unpaid', 'processing', 'shipped', 'delivered']

interface MerchantOrdersPageProps {
  onNavigateAdmin: () => void
}

interface LogisticsEditorProps {
  order: Order
  onUpdateTracking: (orderId: string, carrier: string, trackingNumber: string) => void
  onAddEvent: (orderId: string, location: string, description: string) => void
}

function LogisticsEditor({ order, onUpdateTracking, onAddEvent }: LogisticsEditorProps) {
  const [carrier, setCarrier] = useState(order.logistics?.carrier ?? '')
  const [trackingNumber, setTrackingNumber] = useState(order.logistics?.trackingNumber ?? '')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [savedTip, setSavedTip] = useState<string | null>(null)

  if (!order.logistics) {
    return <p className={`mt-4 text-sm ${theme.muted}`}>买家尚未付款，暂无物流信息可管理。</p>
  }

  function saveTracking(event: FormEvent) {
    event.preventDefault()
    onUpdateTracking(order.id, carrier, trackingNumber)
    setSavedTip('运单信息已保存')
  }

  function addEvent(event: FormEvent) {
    event.preventDefault()
    if (!eventLocation.trim() || !eventDescription.trim()) return
    onAddEvent(order.id, eventLocation, eventDescription)
    setEventLocation('')
    setEventDescription('')
    setSavedTip('物流节点已添加')
  }

  const fieldClass = `rounded-2xl px-4 py-2.5 text-sm ${theme.input}`

  return (
    <div className={`mt-5 border-t pt-5 ${theme.border}`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h4 className={`text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>运单信息</h4>
          <form onSubmit={saveTracking} className="mt-3 space-y-3">
            <label className="block">
              <span className={`text-xs font-bold ${theme.muted}`}>承运商</span>
              <input
                value={carrier}
                onChange={(event) => setCarrier(event.target.value)}
                className={`mt-1 w-full ${fieldClass}`}
                placeholder="如 DHL Express / USPS International"
              />
            </label>
            <label className="block">
              <span className={`text-xs font-bold ${theme.muted}`}>运单号</span>
              <input
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                className={`mt-1 w-full ${fieldClass}`}
                placeholder="如 1Z999AA1XXXXXX"
              />
            </label>
            <button type="submit" className={`rounded-full px-5 py-2 text-sm ${theme.primaryBtn}`}>
              保存运单信息
            </button>
          </form>

          <h4 className={`mt-6 text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>添加物流节点</h4>
          <form onSubmit={addEvent} className="mt-3 space-y-3">
            <label className="block">
              <span className={`text-xs font-bold ${theme.muted}`}>当前位置</span>
              <input
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
                className={`mt-1 w-full ${fieldClass}`}
                placeholder="如 洛杉矶海关"
              />
            </label>
            <label className="block">
              <span className={`text-xs font-bold ${theme.muted}`}>物流动态</span>
              <input
                value={eventDescription}
                onChange={(event) => setEventDescription(event.target.value)}
                className={`mt-1 w-full ${fieldClass}`}
                placeholder="如 包裹已完成清关，转交本地派送"
              />
            </label>
            <button
              type="submit"
              disabled={!eventLocation.trim() || !eventDescription.trim()}
              className={`rounded-full px-5 py-2 text-sm ${theme.primaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              添加节点
            </button>
          </form>
          {savedTip ? <p className="mt-3 text-sm font-bold text-emerald-600">{savedTip}</p> : null}
        </section>

        <section>
          <h4 className={`text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>物流轨迹（顾客可见）</h4>
          <ol className="mt-3 space-y-4">
            {order.logistics.events.map((event, index) => (
              <li key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${
                      event.completed ? 'bg-[var(--accent)]' : 'border-2 border-[var(--border)] bg-white'
                    }`}
                  />
                  {index < order.logistics!.events.length - 1 ? (
                    <span className={`min-h-8 w-px flex-1 ${event.completed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                  ) : null}
                </div>
                <div className="pb-1">
                  <p className={`text-sm font-bold ${theme.heading}`}>
                    {event.description}
                    {event.custom ? (
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black ${theme.accentSoft}`}>
                        商家添加
                      </span>
                    ) : null}
                  </p>
                  <p className={`mt-1 text-xs ${theme.muted}`}>
                    {event.location} · {formatDateTime(event.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

export function MerchantOrdersPage({ onNavigateAdmin }: MerchantOrdersPageProps) {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const githubSyncToken = usePreferencesStore((state) => state.githubSyncToken)
  const allOrders = useOrderStore((state) => state.orders)
  const cloudSyncError = useOrderStore((state) => state.cloudSyncError)
  const loadFromCloud = useOrderStore((state) => state.loadFromCloud)
  const setOrderStatus = useOrderStore((state) => state.setOrderStatus)
  const addLogisticsEvent = useOrderStore((state) => state.addLogisticsEvent)
  const updateTracking = useOrderStore((state) => state.updateTracking)

  const orders = useMemo(() => filterOrders(allOrders, activeFilter), [allOrders, activeFilter])
  const counts = useMemo(() => countOrders(allOrders), [allOrders])
  const cloudSyncEnabled = canSyncToCloud(githubSyncToken)

  async function refreshFromCloud() {
    setIsRefreshing(true)
    try {
      await loadFromCloud()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <main className={theme.pageMain}>
      <section className={`${theme.pageHero} bg-stone-950 p-6 text-white sm:p-10`}>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Order Fulfillment</p>
        <h2 className={`${theme.pageTitle} text-white`}>订单与物流管理</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
          查看全部订单、推进发货状态、维护物流轨迹。配置 GitHub Token 后，物流更新会同步到线上，顾客在「我的订单」里实时可见。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onNavigateAdmin}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            ← 返回运营中心
          </button>
          <button
            type="button"
            onClick={refreshFromCloud}
            disabled={isRefreshing}
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-stone-950 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {isRefreshing ? '刷新中…' : '从云端刷新订单'}
          </button>
        </div>
      </section>

      <section className={`mt-6 rounded-2xl border px-5 py-4 ${theme.surface} ${theme.border}`}>
        <p className={`text-sm font-bold ${theme.heading}`}>云端同步</p>
        <p className={`mt-1 text-sm ${theme.muted}`}>
          {cloudSyncEnabled
            ? '已启用：发货与物流更新会自动写入 GitHub 仓库，线上顾客可见。'
            : '未启用：当前更新仅保存在本机。请在「设置 → 结账」里配置 GitHub Token。'}
        </p>
        {cloudSyncError ? <p className="mt-2 text-sm text-red-600">{cloudSyncError}</p> : null}
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {[
          ['待付款', counts.unpaid, '等待买家完成支付'],
          ['待发货', counts.processing, '已付款，需要安排发货'],
          ['运输中', counts.shipped, '在途包裹'],
          ['已完成', counts.delivered, '已送达签收'],
        ].map(([label, value, note]) => (
          <div key={label} className={`rounded-3xl p-4 sm:p-5 ${theme.surface} ${theme.border} border`}>
            <p className={`text-xs font-bold sm:text-sm ${theme.muted}`}>{label}</p>
            <p className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>{value}</p>
            <p className={`mt-2 text-sm ${theme.muted}`}>{note}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 sm:mt-8">
        <div className="home-scroll-row flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition sm:shrink ${
                activeFilter === filter ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
              }`}
            >
              {orderFilterLabels[filter]}
              <span className="ml-2 opacity-70">({counts[filter]})</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => {
            const expanded = expandedOrderId === order.id
            return (
              <article key={order.id} className={`overflow-hidden rounded-[2rem] ${theme.surface} ${theme.border} border`}>
                <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.muted}`}>订单号 {order.id}</p>
                    <p className={`mt-2 text-sm ${theme.muted}`}>
                      {formatDateTime(order.createdAt)} · {order.customer.name} · {order.customer.city},{' '}
                      {order.customer.country}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${orderStatusTone[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.accentSoft}`}>
                        {paymentStatusLabels[order.paymentStatus]}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.surfaceMuted} ${theme.muted}`}>
                        {order.shippingMethod === 'express' ? 'Express 4-7 天' : 'Standard 7-12 天'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${theme.muted}`}>共 {order.items.length} 件商品</p>
                    <p className={`mt-1 text-2xl font-black ${theme.heading}`}>
                      {formatCurrency(order.total, currencyFormat)}
                    </p>
                  </div>
                </div>

                <div className={`px-5 pb-4 sm:px-6 text-sm ${theme.muted}`}>
                  {order.items.map((item) => `${item.product.name} × ${item.quantity}`).join('，')}
                </div>

                {order.logistics ? (
                  <div className={`px-5 pb-4 sm:px-6 text-sm ${theme.muted}`}>
                    {order.logistics.carrier} · 运单 {order.logistics.trackingNumber}
                  </div>
                ) : null}

                <div className={`flex flex-wrap gap-3 border-t px-5 py-4 sm:px-6 ${theme.border}`}>
                  {order.paymentStatus === 'paid' && order.status === 'processing' ? (
                    <button
                      type="button"
                      onClick={() => setOrderStatus(order.id, 'shipped')}
                      className={`rounded-full px-4 py-2 text-sm ${theme.primaryBtn}`}
                    >
                      标记已发货
                    </button>
                  ) : null}
                  {order.paymentStatus === 'paid' && order.status === 'shipped' ? (
                    <button
                      type="button"
                      onClick={() => setOrderStatus(order.id, 'delivered')}
                      className={`rounded-full px-4 py-2 text-sm ${theme.primaryBtn}`}
                    >
                      标记已送达
                    </button>
                  ) : null}
                  {order.paymentStatus === 'unpaid' && order.status === 'pending_payment' ? (
                    <span className={`rounded-full px-4 py-2 text-sm font-bold ${theme.surfaceMuted} ${theme.muted}`}>
                      等待买家付款
                    </span>
                  ) : null}
                  {order.logistics ? (
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                      className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border}`}
                    >
                      {expanded ? '收起物流管理' : '管理物流轨迹'}
                    </button>
                  ) : null}
                </div>

                {expanded ? (
                  <div className={`px-5 pb-6 sm:px-6 ${theme.surfaceMuted}`}>
                    <LogisticsEditor
                      key={`${order.id}-${order.status}`}
                      order={order}
                      onUpdateTracking={updateTracking}
                      onAddEvent={addLogisticsEvent}
                    />
                  </div>
                ) : null}
              </article>
            )
          })
        ) : (
          <div className={`rounded-[2rem] p-10 text-center ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-2xl font-black ${theme.heading}`}>暂无相关订单</h3>
            <p className={`mt-3 ${theme.muted}`}>当前筛选下没有订单。</p>
          </div>
        )}
      </section>
    </main>
  )
}
