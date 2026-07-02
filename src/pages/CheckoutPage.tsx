import { useState, type FormEvent } from 'react'
import { calculateCartSummary } from '../lib/pricing'
import { formatCurrency, formatOrderId } from '../lib/formatters'
import { validateCustomerInfo } from '../lib/validation'
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
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-4xl font-black text-stone-950">Your cart is empty</h2>
        <p className="mt-4 text-stone-600">Add products before checkout.</p>
        <button
          type="button"
          onClick={onBackToShop}
          className="mt-8 rounded-full bg-stone-950 px-6 py-4 font-bold text-white"
        >
          Back to shop
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <form onSubmit={submitOrder} className="rounded-3xl border border-stone-200 bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">Checkout</p>
        <h2 className="mt-2 text-3xl font-black text-stone-950">Shipping information</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ['name', 'Full name'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['city', 'City'],
            ['country', 'Country'],
            ['postalCode', 'Postal code'],
          ].map(([field, label]) => (
            <label key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
              <span className="text-sm font-bold text-stone-700">{label}</span>
              <input
                value={customer[field as keyof CustomerInfo]}
                onChange={(event) => updateCustomer(field as keyof CustomerInfo, event.target.value)}
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
              />
              {errors[field as keyof CustomerInfo] && (
                <span className="mt-1 block text-sm text-red-600">
                  {errors[field as keyof CustomerInfo]}
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-black text-stone-950">Preferred payment</h3>
          <p className="mt-2 rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
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
          <h3 className="font-black text-stone-950">Delivery method</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ['standard', 'Standard', '7-12 business days'],
              ['express', 'Express', '4-7 business days'],
            ].map(([method, label, note]) => (
              <button
                key={method}
                type="button"
                onClick={() => setShippingMethod(method as ShippingMethod)}
                className={`rounded-2xl border p-4 text-left ${
                  shippingMethod === method ? 'border-stone-950 bg-stone-100' : 'border-stone-200'
                }`}
              >
                <p className="font-bold text-stone-950">{label}</p>
                <p className="mt-1 text-sm text-stone-500">{note}</p>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="mt-8 w-full rounded-full bg-stone-950 px-6 py-4 font-bold text-white">
          Place order
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-stone-950 p-6 text-white">
        <h3 className="text-2xl font-black">Order summary</h3>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 border-t border-white/20 pt-5 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(summary.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex justify-between pt-3 text-xl font-black">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>
        </div>
      </aside>
    </main>
  )
}
