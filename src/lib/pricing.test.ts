import { describe, expect, it } from 'vitest'
import { calculateCartSummary, validateDiscountCode } from './pricing'

const items = [
  { price: 19.99, quantity: 2 },
  { price: 29.99, quantity: 1 },
]

describe('pricing helpers', () => {
  it('calculates subtotal, discount, shipping, tax, and total', () => {
    const summary = calculateCartSummary(items, 'WELCOME10', 'standard')

    expect(summary.subtotal).toBe(69.97)
    expect(summary.discount).toBe(7)
    expect(summary.shipping).toBe(0)
    expect(summary.tax).toBe(5.04)
    expect(summary.total).toBe(68.01)
  })

  it('uses free shipping discount code for standard delivery', () => {
    const summary = calculateCartSummary([{ price: 19.99, quantity: 1 }], 'FREESHIP', 'standard')

    expect(summary.discount).toBe(0)
    expect(summary.shipping).toBe(0)
    expect(summary.total).toBe(21.59)
  })

  it('validates supported discount codes', () => {
    expect(validateDiscountCode('WELCOME10')).toEqual({ valid: true, message: '10% off applied' })
    expect(validateDiscountCode('missing')).toEqual({ valid: false, message: 'Code not found' })
  })
})
