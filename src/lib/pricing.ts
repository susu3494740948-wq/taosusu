import type { ShippingMethod } from '../types'
import { defaultSiteContent, type PromoCode } from '../data/siteContentDefaults'
import { useSiteContentStore } from '../store/siteContentStore'

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

function resolvePromos(promos?: PromoCode[]): PromoCode[] {
  return promos ?? useSiteContentStore.getState().content.promos ?? defaultSiteContent.promos
}

function resolveFreeShippingThreshold(threshold?: number): number {
  return threshold ?? useSiteContentStore.getState().content.store.freeShippingThreshold
}

function findPromo(code: string, promos: PromoCode[]): PromoCode | undefined {
  const normalized = code.trim().toUpperCase()
  return promos.find((promo) => promo.code.trim().toUpperCase() === normalized)
}

export function validateDiscountCode(code: string, promos?: PromoCode[]): { valid: boolean; message: string } {
  const normalized = code.trim().toUpperCase()
  if (!normalized) return { valid: true, message: '' }

  const promo = findPromo(normalized, resolvePromos(promos))
  if (promo) return { valid: true, message: promo.message }
  return { valid: false, message: 'Code not found' }
}

export function calculateCartSummary(
  items: PricedItem[],
  discountCode = '',
  shippingMethod: ShippingMethod = 'standard',
  options?: { promos?: PromoCode[]; freeShippingThreshold?: number },
): CartSummary {
  const promos = resolvePromos(options?.promos)
  const freeShippingThreshold = resolveFreeShippingThreshold(options?.freeShippingThreshold)
  const subtotal = money(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const normalizedCode = discountCode.trim().toUpperCase()
  const promo = normalizedCode ? findPromo(normalizedCode, promos) : undefined
  const discount =
    promo?.type === 'percent' && promo.value
      ? money(subtotal * (promo.value / 100))
      : 0
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0
  const baseShipping = shippingMethod === 'express' ? 14.95 : qualifiesForFreeShipping ? 0 : 6.95
  const shipping =
    promo?.type === 'free-shipping' && shippingMethod === 'standard' ? 0 : baseShipping
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
