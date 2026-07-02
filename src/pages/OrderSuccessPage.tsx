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
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className={`text-4xl font-black ${theme.heading}`}>No order yet</h2>
        <p className={`mt-4 ${theme.muted}`}>Complete checkout to see your order confirmation.</p>
        <button type="button" onClick={onBackHome} className={`mt-8 rounded-full px-6 py-4 ${theme.primaryBtn}`}>
          Back home
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className={`rounded-[2rem] p-8 text-center ${theme.surface} ${theme.border} border`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.accentText}`}>Order placed</p>
        <h2 className={`mt-3 text-4xl font-black ${theme.heading}`}>Order confirmed</h2>
        <p className={`mt-4 ${theme.muted}`}>
          Order {order.id} has been received. A confirmation email will be sent shortly.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className={`rounded-3xl p-6 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>Customer</h3>
          <div className={`mt-4 space-y-2 text-sm ${theme.muted}`}>
            <p>{order.customer.name}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.postalCode}
            </p>
          </div>
        </section>
        <section className={`rounded-3xl p-6 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>Fulfillment preview</h3>
          <div className={`mt-4 space-y-2 text-sm ${theme.muted}`}>
            <p>Status: {order.status === 'processing' ? 'Processing' : order.status}</p>
            <p>Next step: Processing</p>
            <p>Delivery: {order.shippingMethod === 'express' ? '4-7' : '7-12'} business days</p>
            <p>Total: {formatCurrency(order.total)}</p>
            {order.logistics ? <p>Tracking: {order.logistics.trackingNumber}</p> : null}
          </div>
        </section>
      </div>

      <section className={`mt-8 rounded-3xl p-6 ${theme.surface} ${theme.border} border`}>
        <h3 className={`text-xl font-black ${theme.heading}`}>Items</h3>
        <div className={`mt-4 divide-y ${theme.border}`}>
          {order.items.map((item) => (
            <div key={item.product.id} className={`flex justify-between py-4 text-sm ${theme.muted}`}>
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onViewOrders} className={`rounded-full px-6 py-4 ${theme.primaryBtn}`}>
          查看我的订单
        </button>
        <button
          type="button"
          onClick={onBackHome}
          className={`rounded-full px-6 py-4 ${theme.secondaryBtn} border ${theme.border}`}
        >
          Back to storefront
        </button>
      </div>
    </main>
  )
}
