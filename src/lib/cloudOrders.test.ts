import { describe, expect, it } from 'vitest'
import { parseCloudOrderList } from './cloudOrders'

const validOrder = {
  id: 'ER-TEST-01',
  items: [],
  customer: {
    name: 'Test',
    email: 'test@example.com',
    address: '1 Main St',
    city: 'LA',
    country: 'US',
    postalCode: '90001',
  },
  shippingMethod: 'standard',
  discountCode: '',
  total: 10,
  createdAt: new Date().toISOString(),
  paymentStatus: 'paid',
  status: 'processing',
}

describe('cloudOrders', () => {
  it('parses order arrays from cloud payload shapes', () => {
    expect(parseCloudOrderList([])).toEqual([])
    expect(parseCloudOrderList([validOrder])).toHaveLength(1)
    expect(parseCloudOrderList({ orders: [validOrder] })).toHaveLength(1)
  })

  it('filters malformed entries', () => {
    expect(parseCloudOrderList([null, {}, { id: 123 }, validOrder])).toHaveLength(1)
    expect(parseCloudOrderList('not-a-list')).toEqual([])
  })
})
