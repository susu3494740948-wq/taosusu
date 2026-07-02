import { useMemo, useState } from 'react'
import { OrderCard } from '../components/orders/OrderCard'
import { storeConfig } from '../data/store'
import { formatCurrency } from '../lib/formatters'
import { orderFilterLabels, type OrderFilter } from '../lib/orderLabels'
import { theme } from '../lib/themeClasses'
import { countOrders, filterOrders, useOrderStore } from '../store/orderStore'
import { usePreferencesStore } from '../store/preferencesStore'

const filters: OrderFilter[] = ['all', 'unpaid', 'processing', 'shipped', 'delivered']

interface UserAccountPageProps {
  onNavigateShop: () => void
  onSelectProduct: (productId: string) => void
}

export function UserAccountPage({ onNavigateShop, onSelectProduct }: UserAccountPageProps) {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all')
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const allOrders = useOrderStore((state) => state.orders)
  const payOrder = useOrderStore((state) => state.payOrder)
  const cancelOrder = useOrderStore((state) => state.cancelOrder)
  const orders = useMemo(() => filterOrders(allOrders, activeFilter), [allOrders, activeFilter])
  const counts = useMemo(() => countOrders(allOrders), [allOrders])

  const summary = useMemo(() => {
    const paidTotal = allOrders
      .filter((order) => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0)

    return {
      totalOrders: allOrders.length,
      unpaidCount: counts.unpaid,
      inTransitCount: counts.shipped,
      paidTotal,
    }
  }, [allOrders, counts])

  return (
    <main className={theme.pageMain}>
      <div className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>My Account</p>
        <h2 className={theme.pageTitle}>我的订单</h2>
        <p className={theme.pageSubtitle}>
          在这里查看购买记录、待付款订单和跨境物流进度。如有问题请联系 {storeConfig.supportEmail}。
        </p>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-4">
        {[
          ['全部订单', summary.totalOrders, '累计下单'],
          ['待付款', summary.unpaidCount, '需尽快完成支付'],
          ['运输中', summary.inTransitCount, '可查看物流轨迹'],
          ['已购金额', formatCurrency(summary.paidTotal, currencyFormat), '已付款订单合计'],
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
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPay={payOrder}
              onCancel={cancelOrder}
              onSelectProduct={onSelectProduct}
            />
          ))
        ) : (
          <div className={`rounded-[2rem] p-10 text-center ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-2xl font-black ${theme.heading}`}>暂无相关订单</h3>
            <p className={`mt-3 ${theme.muted}`}>当前筛选下没有订单，去首页挑选跨境好物吧。</p>
            <button type="button" onClick={onNavigateShop} className={`mt-6 rounded-full px-6 py-3 ${theme.primaryBtn}`}>
              去逛逛
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
