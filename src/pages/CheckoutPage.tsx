import { useState, type FormEvent } from 'react'
import { calculateCartSummary } from '../lib/pricing'
import { formatCurrency, formatOrderId } from '../lib/formatters'
import { validateCustomerInfo } from '../lib/validation'
import { theme } from '../lib/themeClasses'
import { useCartStore } from '../store/cartStore'
import { usePreferencesStore } from '../store/preferencesStore'
import type { CustomerInfo, Order, ShippingMethod } from '../types'

interface CheckoutPageProps {
  onBackToShop: () => void
  onOrderComplete: (order: Order) => void
}

const emptyCustomer: CustomerInfo = {
  name: '',
  email: '',
  address: '',
  city: '',
  country: 'United States',
  postalCode: '',
}

const fieldLabels: Record<keyof CustomerInfo, string> = {
  name: '姓名',
  email: '邮箱',
  address: '地址',
  city: '城市',
  country: '国家',
  postalCode: '邮编',
}

export function CheckoutPage({ onBackToShop, onOrderComplete }: CheckoutPageProps) {
  const items = useCartStore((state) => state.items)
  const discountCode = useCartStore((state) => state.discountCode)
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const clearCart = useCartStore((state) => state.clearCart)
  const preferredPayment = usePreferencesStore((state) => state.preferredPayment)
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})

  const summary = calculateCartSummary(
    items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    discountCode,
    shippingMethod,
  )

  function updateCustomer(field: keyof CustomerInfo, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCustomerInfo(customer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || items.length === 0) return

    const order: Order = {
      id: formatOrderId(),
      items,
      customer,
      shippingMethod,
      discountCode,
      total: summary.total,
      createdAt: new Date().toISOString(),
      paymentStatus: 'paid',
      status: 'processing',
    }
    clearCart()
    onOrderComplete(order)
  }

  if (items.length === 0) {
    return (
      <main className={`${theme.pageMainNarrow} text-center`}>
        <div className={`${theme.pageHero} ${theme.surface} ${theme.border} border`}>
          <h2 className={`text-2xl font-black sm:text-3xl ${theme.heading}`}>购物车是空的</h2>
          <p className={`mt-4 ${theme.muted}`}>请先添加商品再结账。</p>
          <button type="button" onClick={onBackToShop} className={`mt-8 min-h-12 rounded-full px-6 py-3 ${theme.primaryBtn}`}>
            返回选购
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={`${theme.pageMain} grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8`}>
      <form onSubmit={submitOrder} className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Checkout</p>
        <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>收货信息</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(Object.keys(fieldLabels) as (keyof CustomerInfo)[]).map((field) => (
            <label key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
              <span className={`text-sm font-bold ${theme.heading}`}>{fieldLabels[field]}</span>
              <input
                value={customer[field]}
                onChange={(event) => updateCustomer(field, event.target.value)}
                className={`mt-2 rounded-2xl px-4 py-3 text-base sm:text-sm ${theme.input}`}
              />
              {errors[field] ? <span className="mt-1 block text-sm text-red-600">{errors[field]}</span> : null}
            </label>
          ))}
        </div>

        <div className="mt-8">
          <h3 className={`font-black ${theme.heading}`}>支付方式</h3>
          <p className={`mt-2 rounded-2xl px-4 py-3 text-sm ${theme.surfaceMuted} ${theme.muted}`}>
            你的偏好：
            {preferredPayment === 'paypal'
              ? ' PayPal'
              : preferredPayment === 'apple-pay'
                ? ' Apple Pay'
                : ' 信用卡'}{' '}
            · 可在设置中更改
          </p>
        </div>

        <div className="mt-8">
          <h3 className={`font-black ${theme.heading}`}>配送方式</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ['standard', '标准配送', '7-12 个工作日'],
              ['express', '加急配送', '4-7 个工作日'],
            ].map(([method, label, note]) => (
              <button
                key={method}
                type="button"
                onClick={() => setShippingMethod(method as ShippingMethod)}
                className={`rounded-2xl border p-4 text-left transition ${
                  shippingMethod === method
                    ? `border-[var(--accent)] ${theme.surfaceMuted}`
                    : `${theme.border} ${theme.surface}`
                }`}
              >
                <p className={`font-bold ${theme.heading}`}>{label}</p>
                <p className={`mt-1 text-sm ${theme.muted}`}>{note}</p>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={`mt-8 min-h-12 w-full rounded-full px-6 py-3 ${theme.primaryBtn}`}>
          提交订单
        </button>
      </form>

      <aside className={`h-fit rounded-[2rem] p-5 sm:p-6 ${theme.hero}`}>
        <h3 className="text-xl font-black sm:text-2xl">订单摘要</h3>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between gap-3 text-sm opacity-90">
              <span className="min-w-0 truncate">
                {item.product.name} × {item.quantity}
              </span>
              <span className="shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 border-t border-white/20 pt-5 text-sm opacity-90">
          <div className="flex justify-between">
            <span>小计</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>优惠</span>
            <span>-{formatCurrency(summary.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>运费</span>
            <span>{summary.shipping === 0 ? '免运费' : formatCurrency(summary.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>税费</span>
            <span>{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex justify-between pt-3 text-lg font-black sm:text-xl">
            <span>合计</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>
        </div>
      </aside>
    </main>
  )
}
