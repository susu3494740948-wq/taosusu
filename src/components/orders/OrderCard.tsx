import { useState } from 'react'
import { ProductArtwork } from '../product/ProductArtwork'
import { formatCurrency, formatDate, formatDateTime } from '../../lib/formatters'
import { orderStatusLabels, orderStatusTone, paymentStatusLabels } from '../../lib/orderLabels'
import { theme } from '../../lib/themeClasses'
import { usePreferencesStore } from '../../store/preferencesStore'
import type { Order } from '../../types'

interface OrderCardProps {
  order: Order
  onPay?: (orderId: string) => void
  onCancel?: (orderId: string) => void
  onSelectProduct?: (productId: string) => void
}

export function OrderCard({ order, onPay, onCancel, onSelectProduct }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)

  return (
    <article className={`overflow-hidden rounded-[2rem] ${theme.surface} ${theme.border} border`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-5 sm:px-6">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.muted}`}>订单号 {order.id}</p>
          <p className={`mt-2 text-sm ${theme.muted}`}>下单时间：{formatDateTime(order.createdAt)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${orderStatusTone[order.status]}`}>
              {orderStatusLabels[order.status]}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.accentSoft}`}>
              {paymentStatusLabels[order.paymentStatus]}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm ${theme.muted}`}>共 {order.items.length} 件商品</p>
          <p className={`mt-1 text-2xl font-black ${theme.heading}`}>{formatCurrency(order.total, currencyFormat)}</p>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-[120px_1fr] sm:px-6">
        <div className="flex gap-3 overflow-x-auto sm:flex-col">
          {order.items.slice(0, 3).map((item) => (
            <button
              key={item.product.id}
              type="button"
              onClick={() => onSelectProduct?.(item.product.id)}
              className="w-28 shrink-0 overflow-hidden rounded-2xl sm:w-full"
            >
              <ProductArtwork image={item.product.image} name={item.product.name} />
            </button>
          ))}
        </div>
        <div>
          <ul className={`space-y-2 text-sm ${theme.muted}`}>
            {order.items.map((item) => (
              <li key={item.product.id} className="flex justify-between gap-4">
                <span className={`font-medium ${theme.heading}`}>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.price * item.quantity, currencyFormat)}</span>
              </li>
            ))}
          </ul>
          <p className={`mt-4 text-sm ${theme.muted}`}>
            配送至 {order.customer.name} · {order.customer.city}, {order.customer.country}
          </p>
          {order.logistics ? (
            <p className={`mt-2 text-sm ${theme.muted}`}>
              {order.logistics.carrier} · 运单 {order.logistics.trackingNumber}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border}`}
        >
          {expanded ? '收起详情' : '查看物流与详情'}
        </button>
        {order.paymentStatus === 'unpaid' ? (
          <>
            <button type="button" onClick={() => onPay?.(order.id)} className={`rounded-full px-4 py-2 text-sm ${theme.primaryBtn}`}>
              继续支付
            </button>
            <button
              type="button"
              onClick={() => onCancel?.(order.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${theme.muted}`}
            >
              取消订单
            </button>
          </>
        ) : null}
      </div>

      {expanded ? (
        <div className={`border-t px-5 py-6 sm:px-6 ${theme.surfaceMuted}`}>
          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h4 className={`text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>收货信息</h4>
              <div className={`mt-3 space-y-1 text-sm ${theme.muted}`}>
                <p className={`font-bold ${theme.heading}`}>{order.customer.name}</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.address}</p>
                <p>
                  {order.customer.city}, {order.customer.postalCode}
                </p>
                <p>{order.customer.country}</p>
              </div>
            </section>
            <section>
              <h4 className={`text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>配送信息</h4>
              <div className={`mt-3 space-y-1 text-sm ${theme.muted}`}>
                <p>配送方式：{order.shippingMethod === 'express' ? 'Express 4-7 天' : 'Standard 7-12 天'}</p>
                {order.paidAt ? <p>付款时间：{formatDateTime(order.paidAt)}</p> : null}
                {order.logistics?.estimatedDelivery ? (
                  <p>预计送达：{formatDate(order.logistics.estimatedDelivery)}</p>
                ) : null}
                {order.discountCode ? <p>优惠码：{order.discountCode}</p> : null}
              </div>
            </section>
          </div>

          {order.logistics ? (
            <section className="mt-8">
              <h4 className={`text-sm font-black uppercase tracking-[0.15em] ${theme.muted}`}>物流轨迹</h4>
              <ol className="mt-4 space-y-4">
                {order.logistics.events.map((event, index) => (
                  <li key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 h-3 w-3 rounded-full ${
                          event.completed ? 'bg-[var(--accent)]' : 'border-2 border-[var(--border)] bg-white'
                        }`}
                      />
                      {index < order.logistics!.events.length - 1 ? (
                        <span className={`min-h-10 w-px flex-1 ${event.completed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                      ) : null}
                    </div>
                    <div className="pb-2">
                      <p className={`font-bold ${theme.heading}`}>{event.description}</p>
                      <p className={`mt-1 text-sm ${theme.muted}`}>
                        {event.location} · {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <p className={`mt-6 text-sm ${theme.muted}`}>订单尚未支付，完成付款后可查看物流信息。</p>
          )}
        </div>
      ) : null}
    </article>
  )
}
