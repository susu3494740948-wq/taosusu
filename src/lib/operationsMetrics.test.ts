import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { buildOperationsSummary, getSkuOperationalStatus } from './operationsMetrics'

describe('operationsMetrics', () => {
  it('summarizes catalog inventory and category metrics', () => {
    const summary = buildOperationsSummary(products)

    expect(summary.activeSkus).toBe(30)
    expect(summary.totalStockUnits).toBeGreaterThan(0)
    expect(summary.categoryMetrics).toHaveLength(6)
    expect(summary.categoryMetrics[0].skuCount).toBeGreaterThan(0)
  })

  it('labels sku stock status for operations alerts', () => {
    expect(getSkuOperationalStatus(0)).toBe('out-of-stock')
    expect(getSkuOperationalStatus(5)).toBe('low-stock')
    expect(getSkuOperationalStatus(20)).toBe('healthy')
  })
})
