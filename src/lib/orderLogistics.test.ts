import { describe, expect, it } from 'vitest'
import {
  appendLogisticsEvent,
  applyOrderStatus,
  enrichPlacedOrder,
  mergeOrderLists,
  updateTrackingInfo,
} from './orderLogistics'
import type { Order } from '../types'

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'ER-LOGI-01',
    items: [],
    customer: {
      name: 'Emily Chen',
      email: 'emily@example.com',
      address: '742 Evergreen Terrace',
      city: 'Los Angeles',
      country: 'United States',
      postalCode: '90001',
    },
    shippingMethod: 'standard',
    discountCode: '',
    total: 25,
    createdAt: new Date().toISOString(),
    paymentStatus: 'unpaid',
    status: 'pending_payment',
    ...overrides,
  }
}

describe('merchant logistics actions', () => {
  it('advances a paid order to shipped and completes transit events', () => {
    const paid = enrichPlacedOrder(makeOrder())
    const shipped = applyOrderStatus(paid, 'shipped')

    expect(shipped.status).toBe('shipped')
    expect(shipped.updatedAt).toBeTruthy()
    const transit = shipped.logistics!.events.find((event) => event.description.includes('国际运输中'))
    expect(transit?.completed).toBe(true)
  })

  it('does not advance an unpaid order', () => {
    const unpaid = makeOrder()
    expect(applyOrderStatus(unpaid, 'shipped')).toBe(unpaid)
  })

  it('keeps merchant custom events when advancing status', () => {
    const paid = enrichPlacedOrder(makeOrder())
    const withEvent = appendLogisticsEvent(paid, '洛杉矶海关', '包裹已完成清关')
    const delivered = applyOrderStatus(withEvent, 'delivered')

    const custom = delivered.logistics!.events.filter((event) => event.custom)
    expect(custom).toHaveLength(1)
    expect(custom[0].location).toBe('洛杉矶海关')
  })

  it('updates carrier and tracking number while keeping events', () => {
    const paid = enrichPlacedOrder(makeOrder())
    const updated = updateTrackingInfo(paid, 'FedEx International', 'FX123456')

    expect(updated.logistics?.carrier).toBe('FedEx International')
    expect(updated.logistics?.trackingNumber).toBe('FX123456')
    expect(updated.logistics?.events.length).toBe(paid.logistics!.events.length)
  })

  it('preserves edited tracking info after status change', () => {
    const paid = enrichPlacedOrder(makeOrder())
    const edited = updateTrackingInfo(paid, 'FedEx International', 'FX123456')
    const shipped = applyOrderStatus(edited, 'shipped')

    expect(shipped.logistics?.carrier).toBe('FedEx International')
    expect(shipped.logistics?.trackingNumber).toBe('FX123456')
  })
})

describe('mergeOrderLists', () => {
  it('prefers the newer version of the same order', () => {
    const older = { ...enrichPlacedOrder(makeOrder()), updatedAt: '2026-01-01T00:00:00.000Z' }
    const newer = { ...applyOrderStatus(older, 'shipped'), updatedAt: '2026-02-01T00:00:00.000Z' }

    const fromCloud = mergeOrderLists([older], [newer])
    expect(fromCloud).toHaveLength(1)
    expect(fromCloud[0].status).toBe('shipped')

    const localNewer = mergeOrderLists([newer], [older])
    expect(localNewer[0].status).toBe('shipped')
  })

  it('keeps orders that exist on only one side', () => {
    const localOnly = enrichPlacedOrder(makeOrder({ id: 'ER-LOCAL-01' }))
    const cloudOnly = enrichPlacedOrder(makeOrder({ id: 'ER-CLOUD-01' }))

    const merged = mergeOrderLists([localOnly], [cloudOnly])
    expect(merged.map((order) => order.id).sort()).toEqual(['ER-CLOUD-01', 'ER-LOCAL-01'])
  })
})
