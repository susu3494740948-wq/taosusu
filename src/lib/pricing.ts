import type { ShippingMethod } from '../types'

export interface PricedItem {
  price: number
  quantity: number
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}

const TAX_RATE = 0.08

function money(value: number): number {
  return Math.round(value * 100) / 100
}

export function validateDiscountCode(code: string): { valid: boolean; message: string } {
  const normalized = code.trim().toUpperCase()
  if (!normalized) return { valid: true, message: '' }
  if (normalized === 'WELCOME10') return { valid: true, message: '10% off applied' }
  if (normalized === 'FREESHIP') return { valid: true, message: 'Free standard shipping applied' }
  return { valid: false, message: 'Code not found' }
}

export function calculateCartSummary(
  items: PricedItem[],
  discountCode = '',
  shippingMethod: ShippingMethod = 'standard',
): CartSummary {
  const subtotal = money(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const normalizedCode = discountCode.trim().toUpperCase()
  const discount = normalizedCode === 'WELCOME10' ? money(subtotal * 0.1) : 0
  const baseShipping = shippingMethod === 'express' ? 14.95 : subtotal >= 50 || subtotal === 0 ? 0 : 6.95
  const shipping = normalizedCode === 'FREESHIP' && shippingMethod === 'standard' ? 0 : baseShipping
  const taxable = Math.max(subtotal - discount + shipping, 0)
  const tax = money(taxable * TAX_RATE)
  const total = money(taxable + tax)

  return {
    subtotal,
    discount,
    shipping: money(shipping),
    tax,
    total,
  }
}
