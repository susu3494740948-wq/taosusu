import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { demoOrders } from '../data/demoOrders'
import { enrichPaidOrder, enrichPlacedOrder } from '../lib/orderLogistics'
import type { OrderFilter } from '../lib/orderLabels'
import type { Order } from '../types'

interface OrderState {
  orders: Order[]
  addOrder: (order: Order) => void
  payOrder: (orderId: string) => void
  cancelOrder: (orderId: string) => void
}

function sortOrders(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function matchesFilter(order: Order, filter: OrderFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'unpaid') return order.paymentStatus === 'unpaid'
  if (filter === 'processing') return order.status === 'processing'
  if (filter === 'shipped') return order.status === 'shipped'
  return order.status === 'delivered'
}

export function filterOrders(orders: Order[], filter: OrderFilter): Order[] {
  return sortOrders(orders.filter((order) => matchesFilter(order, filter)))
}

export function countOrders(orders: Order[]): Record<OrderFilter, number> {
  return {
    all: orders.length,
    unpaid: orders.filter((order) => order.paymentStatus === 'unpaid').length,
    processing: orders.filter((order) => order.status === 'processing').length,
    shipped: orders.filter((order) => order.status === 'shipped').length,
    delivered: orders.filter((order) => order.status === 'delivered').length,
  }
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: sortOrders(demoOrders),

      addOrder: (order) =>
        set((state) => ({
          orders: sortOrders([enrichPlacedOrder(order), ...state.orders.filter((item) => item.id !== order.id)]),
        })),

      payOrder: (orderId) =>
        set((state) => ({
          orders: sortOrders(
            state.orders.map((order) =>
              order.id === orderId && order.paymentStatus === 'unpaid' ? enrichPaidOrder(order) : order,
            ),
          ),
        })),

      cancelOrder: (orderId) =>
        set((state) => ({
          orders: sortOrders(
            state.orders.map((order) =>
              order.id === orderId && order.paymentStatus === 'unpaid'
                ? { ...order, status: 'cancelled' as const }
                : order,
            ),
          ),
        })),
    }),
    {
      name: 'taosusu-orders',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<OrderState>),
        orders: sortOrders(
          (persistedState as Partial<OrderState>)?.orders?.length
            ? (persistedState as OrderState).orders
            : currentState.orders,
        ),
      }),
    },
  ),
)

export function selectRecentOrders(state: OrderState, limit = 3): Order[] {
  return state.orders.slice(0, limit)
}
