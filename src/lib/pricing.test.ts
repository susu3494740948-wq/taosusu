import { describe, expect, it } from 'vitest'
import { defaultSiteContent } from '../data/siteContentDefaults'
import { calculateCartSummary, validateDiscountCode } from './pricing'

const promos = defaultSiteContent.promos
const freeShippingThreshold = defaultSiteContent.store.freeShippingThreshold

const items = [
  { price: 19.99, quantity: 2 },
  { price: 29.99, quantity: 1 },
]

describe('pricing helpers', () => {
  it('calculates subtotal, discount, shipping, tax, and total', () => {
    const summary = calculateCartSummary(items, 'SUMMER10', 'standard', { promos, freeShippingThreshold })

    expect(summary.subtotal).toBe(69.97)
    expect(summary.discount).toBe(7)
    expect(summary.shipping).toBe(0)
    expect(summary.tax).toBe(5.04)
    expect(summary.total).toBe(68.01)
  })

  it('uses free shipping discount code for standard delivery', () => {
    const summary = calculateCartSummary([{ price: 19.99, quantity: 1 }], 'FREESHIP', 'standard', {
      promos,
      freeShippingThreshold,
    })

    expect(summary.discount).toBe(0)
    expect(summary.shipping).toBe(0)
    expect(summary.total).toBe(21.59)
  })

  it('validates supported discount codes', () => {
    expect(validateDiscountCode('SUMMER10', promos)).toEqual({ valid: true, message: '10% off applied' })
    expect(validateDiscountCode('missing', promos)).toEqual({ valid: false, message: 'Code not found' })
  })
})
