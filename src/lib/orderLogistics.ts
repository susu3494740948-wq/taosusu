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
    updatedAt: paidAt,
    logistics: buildLogistics({ ...order, paidAt }, 'processing'),
  }
}

export function enrichPaidOrder(order: Order): Order {
  return enrichPlacedOrder(order)
}

/** 商家推进订单状态：重建基础轨迹节点，但保留商家手动添加的节点和运单信息 */
export function applyOrderStatus(order: Order, status: OrderStatus): Order {
  if (order.paymentStatus !== 'paid') return order

  const rebuilt = buildLogistics(order, status)
  const customEvents = order.logistics?.events.filter((event) => event.custom) ?? []
  const events = [...rebuilt.events, ...customEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  return {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
    logistics: {
      ...rebuilt,
      carrier: order.logistics?.carrier ?? rebuilt.carrier,
      trackingNumber: order.logistics?.trackingNumber ?? rebuilt.trackingNumber,
      events,
    },
  }
}

/** 商家手动追加一条物流节点（例如"包裹已到达海关"） */
export function appendLogisticsEvent(order: Order, location: string, description: string): Order {
  if (!order.logistics) return order

  const timestamp = new Date().toISOString()
  const event: LogisticsEvent = {
    id: `${order.id}-c-${Date.now()}`,
    timestamp,
    location: location.trim(),
    description: description.trim(),
    completed: true,
    custom: true,
  }

  return {
    ...order,
    updatedAt: timestamp,
    logistics: {
      ...order.logistics,
      events: [...order.logistics.events, event].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    },
  }
}

/** 商家修改承运商 / 运单号 */
export function updateTrackingInfo(order: Order, carrier: string, trackingNumber: string): Order {
  if (!order.logistics) return order

  return {
    ...order,
    updatedAt: new Date().toISOString(),
    logistics: {
      ...order.logistics,
      carrier: carrier.trim() || order.logistics.carrier,
      trackingNumber: trackingNumber.trim() || order.logistics.trackingNumber,
    },
  }
}

/** 云端与本地订单合并：按订单号去重，updatedAt 新者优先 */
export function mergeOrderLists(local: Order[], cloud: Order[]): Order[] {
  const byId = new Map<string, Order>()
  for (const order of local) {
    byId.set(order.id, order)
  }
  for (const order of cloud) {
    const existing = byId.get(order.id)
    if (!existing) {
      byId.set(order.id, order)
      continue
    }
    const existingTime = new Date(existing.updatedAt ?? existing.paidAt ?? existing.createdAt).getTime()
    const incomingTime = new Date(order.updatedAt ?? order.paidAt ?? order.createdAt).getTime()
    if (incomingTime >= existingTime) {
      byId.set(order.id, order)
    }
  }
  return [...byId.values()]
}
