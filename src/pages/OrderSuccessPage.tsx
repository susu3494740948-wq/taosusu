import { formatCurrency } from '../lib/formatters'
import { theme } from '../lib/themeClasses'
import type { Order } from '../types'

interface OrderSuccessPageProps {
  order: Order | null
  onBackHome: () => void
  onViewOrders: () => void
}

export function OrderSuccessPage({ order, onBackHome, onViewOrders }: OrderSuccessPageProps) {
  if (!order) {
    return (
      <main className={`${theme.pageMainNarrow} text-center`}>
        <div className={`${theme.pageHero} ${theme.surface} ${theme.border} border`}>
          <h2 className={`text-2xl font-black sm:text-3xl ${theme.heading}`}>暂无订单</h2>
          <p className={`mt-4 ${theme.muted}`}>完成结账后可在此查看订单确认信息。</p>
          <button type="button" onClick={onBackHome} className={`mt-8 min-h-12 rounded-full px-6 py-3 ${theme.primaryBtn}`}>
            返回首页
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={theme.pageMainNarrow}>
      <div className={`text-center ${theme.pageHero} ${theme.surface} ${theme.border} border`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.accentText}`}>Order placed</p>
        <h2 className={`${theme.pageTitle} ${theme.heading}`}>订单已确认</h2>
        <p className={`mt-4 text-sm sm:text-base ${theme.muted}`}>
          订单 {order.id} 已收到，确认邮件将很快发送。
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
        <section className={`rounded-3xl p-5 sm:p-6 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-lg font-black sm:text-xl ${theme.heading}`}>收货人</h3>
          <div className={`mt-4 space-y-2 text-sm ${theme.muted}`}>
            <p>{order.customer.name}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.postalCode}
            </p>
          </div>
        </section>
        <section className={`rounded-3xl p-5 sm:p-6 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-lg font-black sm:text-xl ${theme.heading}`}>物流预览</h3>
          <div className={`mt-4 space-y-2 text-sm ${theme.muted}`}>
            <p>状态：{order.status === 'processing' ? '处理中' : order.status}</p>
            <p>下一步：仓库处理</p>
            <p>预计送达：{order.shippingMethod === 'express' ? '4-7' : '7-12'} 个工作日</p>
            <p>合计：{formatCurrency(order.total)}</p>
            {order.logistics ? <p>运单号：{order.logistics.trackingNumber}</p> : null}
          </div>
        </section>
      </div>

      <section className={`mt-6 rounded-3xl p-5 sm:mt-8 sm:p-6 ${theme.surface} ${theme.border} border`}>
        <h3 className={`text-lg font-black sm:text-xl ${theme.heading}`}>商品明细</h3>
        <div className={`mt-4 divide-y ${theme.border}`}>
          {order.items.map((item) => (
            <div key={item.product.id} className={`flex justify-between gap-3 py-4 text-sm ${theme.muted}`}>
              <span className="min-w-0 truncate">
                {item.product.name} × {item.quantity}
              </span>
              <span className="shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={onViewOrders} className={`min-h-12 rounded-full px-6 py-3 ${theme.primaryBtn}`}>
          查看我的订单
        </button>
        <button
          type="button"
          onClick={onBackHome}
          className={`min-h-12 rounded-full px-6 py-3 ${theme.secondaryBtn} border ${theme.border}`}
        >
          继续购物
        </button>
      </div>
    </main>
  )
}
