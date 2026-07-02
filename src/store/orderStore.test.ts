import { beforeEach, describe, expect, it } from 'vitest'
import { demoOrders } from '../data/demoOrders'
import { enrichPlacedOrder } from '../lib/orderLogistics'
import { countOrders, filterOrders, useOrderStore } from './orderStore'
import type { Order } from '../types'

const sampleOrder: Order = {
  id: 'ER-TEST-001',
  items: demoOrders[0].items,
  customer: demoOrders[0].customer,
  shippingMethod: 'standard',
  discountCode: '',
  total: 19.99,
  createdAt: new Date().toISOString(),
  paymentStatus: 'paid',
  status: 'processing',
}

describe('order store', () => {
  beforeEach(() => {
    localStorage.clear()
    useOrderStore.setState({ orders: demoOrders })
  })

  it('seeds demo orders with multiple statuses', () => {
    const counts = countOrders(useOrderStore.getState().orders)
    expect(counts.all).toBeGreaterThanOrEqual(4)
    expect(counts.unpaid).toBeGreaterThan(0)
    expect(counts.shipped).toBeGreaterThan(0)
  })

  it('adds a placed order with logistics', () => {
    useOrderStore.getState().addOrder(sampleOrder)
    const saved = useOrderStore.getState().orders.find((order) => order.id === sampleOrder.id)

    expect(saved?.paymentStatus).toBe('paid')
    expect(saved?.logistics?.trackingNumber).toMatch(/^1Z/)
  })

  it('marks an unpaid order as paid', () => {
    const unpaid = demoOrders.find((order) => order.paymentStatus === 'unpaid')
    expect(unpaid).toBeDefined()

    useOrderStore.getState().payOrder(unpaid!.id)
    const updated = useOrderStore.getState().orders.find((order) => order.id === unpaid!.id)

    expect(updated?.paymentStatus).toBe('paid')
    expect(updated?.status).toBe('processing')
    expect(updated?.logistics).toBeDefined()
  })

  it('filters orders by account tabs', () => {
    const orders = useOrderStore.getState().orders
    expect(filterOrders(orders, 'unpaid').every((order) => order.paymentStatus === 'unpaid')).toBe(true)
    expect(filterOrders(orders, 'delivered').every((order) => order.status === 'delivered')).toBe(true)
  })

  it('enriches checkout orders with tracking info', () => {
    const enriched = enrichPlacedOrder(sampleOrder)
    expect(enriched.paidAt).toBeTruthy()
    expect(enriched.logistics?.events.length).toBeGreaterThan(0)
  })
})
