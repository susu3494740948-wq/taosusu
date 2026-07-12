import { useEffect } from 'react'
import { calculateCartSummary, validateDiscountCode } from '../../lib/pricing'
import { formatCurrency } from '../../lib/formatters'
import { theme } from '../../lib/themeClasses'
import { useCartStore } from '../../store/cartStore'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const discountCode = useCartStore((state) => state.discountCode)
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const setDiscountCode = useCartStore((state) => state.setDiscountCode)
  const summary = calculateCartSummary(
    items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    discountCode,
    shippingMethod,
  )
  const discountMessage = validateDiscountCode(discountCode)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/40"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="购物车"
        className={`absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-md flex-col p-3 shadow-2xl sm:p-6 ${theme.surface}`}
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className={`flex items-center justify-between border-b pb-4 ${theme.border}`}>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme.muted}`}>Cart</p>
            <h2 className={`text-2xl font-black ${theme.heading}`}>Your cart</h2>
          </div>
          <button type="button" className={`rounded-full px-3 py-2 ${theme.surfaceMuted}`} onClick={onClose}>
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <p className={`text-xl font-bold ${theme.heading}`}>Your cart is empty</p>
              <p className={`mt-2 text-sm ${theme.muted}`}>Add a product to start checkout.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-auto py-6">
              {items.map((item) => (
                <div key={item.product.id} className={`rounded-2xl p-4 ${theme.surface} ${theme.border} border`}>
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className={`font-bold ${theme.heading}`}>{item.product.name}</h3>
                      <p className={`mt-1 text-sm ${theme.muted}`}>{formatCurrency(item.product.price)}</p>
                      <p className="mt-1 text-xs text-stone-400">Stock cap: {item.product.stock}</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-stone-500"
                      onClick={() => removeItem(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-stone-100"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-stone-100"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t pt-4 ${theme.border}`}>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="discount-code">
                Discount code
              </label>
              <input
                id="discount-code"
                value={discountCode}
                onChange={(event) => setDiscountCode(event.target.value)}
                placeholder="WELCOME10 or FREESHIP"
                className={`mt-2 rounded-2xl px-4 py-3 text-sm ${theme.input}`}
              />
              {discountCode && (
                <p className={discountMessage.valid ? 'mt-2 text-sm text-emerald-700' : 'mt-2 text-sm text-red-600'}>
                  {discountMessage.message}
                </p>
              )}
              <div className="mt-5 space-y-2 text-sm">
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
                  <span>Estimated tax</span>
                  <span>{formatCurrency(summary.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-black">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                className={`mt-5 w-full rounded-full px-5 py-4 ${theme.primaryBtn}`}
              >
                Continue to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
