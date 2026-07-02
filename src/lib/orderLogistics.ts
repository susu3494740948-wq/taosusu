import type { LogisticsEvent, Order, OrderLogistics, OrderStatus } from '../types'

function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function createTrackingNumber(orderId: string): string {
  const suffix = orderId.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase()
  return `1Z999AA1${suffix || 'DEMO01'}`
}

function createEvent(
  timestamp: string,
  location: string,
  description: string,
  completed: boolean,
  id: string,
): LogisticsEvent {
  return { id, timestamp, location, description, completed }
}

export function buildLogistics(order: Order, status: OrderStatus): OrderLogistics {
  const carrier = order.shippingMethod === 'express' ? 'DHL Express' : 'USPS International'
  const trackingNumber = createTrackingNumber(order.id)
  const estimatedDelivery = addDays(order.paidAt ?? order.createdAt, order.shippingMethod === 'express' ? 7 : 12)
  const baseTime = order.paidAt ?? order.createdAt

  const events: LogisticsEvent[] = [
    createEvent(baseTime, '深圳仓', '订单已确认，等待仓库拣货', true, `${order.id}-1`),
    createEvent(addDays(baseTime, 1), '深圳仓', '商品已出库，等待国际揽收', status !== 'processing', `${order.id}-2`),
    createEvent(addDays(baseTime, 2), '广州转运中心', '包裹已交运，国际运输中', status === 'shipped' || status === 'delivered', `${order.id}-3`),
    createEvent(addDays(baseTime, 5), '洛杉矶转运中心', '包裹到达美国，清关中', status === 'shipped' || status === 'delivered', `${order.id}-4`),
    createEvent(addDays(baseTime, 8), `${order.customer.city}, US`, '当地派送中', status === 'delivered', `${order.id}-5`),
    createEvent(addDays(baseTime, 9), order.customer.address, '已签收', status === 'delivered', `${order.id}-6`),
  ]

  return { carrier, trackingNumber, estimatedDelivery, events }
}

export function enrichPlacedOrder(order: Order): Order {
  const paidAt = new Date().toISOString()

  return {
    ...order,
    paymentStatus: 'paid',
    status: 'processing',
    paidAt,
    logistics: buildLogistics({ ...order, paidAt }, 'processing'),
  }
}

export function enrichPaidOrder(order: Order): Order {
  const paidAt = new Date().toISOString()

  return {
    ...order,
    paymentStatus: 'paid',
    status: 'processing',
    paidAt,
    logistics: buildLogistics({ ...order, paidAt }, 'processing'),
  }
}
