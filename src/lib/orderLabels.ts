import type { OrderStatus, PaymentStatus } from '../types'

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: '待付款',
  paid: '已付款',
  refunded: '已退款',
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: '待付款',
  processing: '待发货',
  shipped: '运输中',
  delivered: '已完成',
  cancelled: '已取消',
}

export const orderStatusTone: Record<OrderStatus, string> = {
  pending_payment: 'bg-amber-100 text-amber-800',
  processing: 'bg-sky-100 text-sky-800',
  shipped: 'bg-violet-100 text-violet-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-stone-200 text-stone-600',
}

export type OrderFilter = 'all' | 'unpaid' | 'processing' | 'shipped' | 'delivered'

export const orderFilterLabels: Record<OrderFilter, string> = {
  all: '全部订单',
  unpaid: '待付款',
  processing: '待发货',
  shipped: '运输中',
  delivered: '已完成',
}
