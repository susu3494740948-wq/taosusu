import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { demoOrders } from '../data/demoOrders'
import { fetchCloudOrdersResult, syncOrdersToGitHub } from '../lib/cloudOrders'
import {
  appendLogisticsEvent,
  applyOrderStatus,
  enrichPaidOrder,
  enrichPlacedOrder,
  mergeOrderLists,
  updateTrackingInfo,
} from '../lib/orderLogistics'
import type { OrderFilter } from '../lib/orderLabels'
import { usePreferencesStore } from './preferencesStore'
import type { Order, OrderStatus } from '../types'

interface OrderState {
  orders: Order[]
  cloudLoaded: boolean
  cloudSyncError: string | null
  loadFromCloud: () => Promise<void>
  addOrder: (order: Order) => void
  payOrder: (orderId: string) => void
  cancelOrder: (orderId: string) => void
  setOrderStatus: (orderId: string, status: OrderStatus) => void
  addLogisticsEvent: (orderId: string, location: string, description: string) => void
  updateTracking: (orderId: string, carrier: string, trackingNumber: string) => void
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

async function pushToCloud(orders: Order[]): Promise<string | null> {
  const token = usePreferencesStore.getState().githubSyncToken
  if (!token.trim()) return null

  try {
    await syncOrdersToGitHub(orders, token)
    return null
  } catch {
    return '订单云端同步失败，请检查 GitHub Token 是否正确。'
  }
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => {
      const commit = (orders: Order[]) => {
        const sorted = sortOrders(orders)
        set({ orders: sorted })
        void pushToCloud(sorted).then((syncError) => set({ cloudSyncError: syncError }))
      }

      return {
        orders: sortOrders(demoOrders),
        cloudLoaded: false,
        cloudSyncError: null,

        loadFromCloud: async () => {
          const result = await fetchCloudOrdersResult()
          if (result.ok && result.orders.length > 0) {
            set({
              orders: sortOrders(mergeOrderLists(get().orders, result.orders)),
              cloudLoaded: true,
              cloudSyncError: null,
            })
            return
          }
          set({ cloudLoaded: true })
        },

        addOrder: (order) =>
          commit([enrichPlacedOrder(order), ...get().orders.filter((item) => item.id !== order.id)]),

        payOrder: (orderId) =>
          commit(
            get().orders.map((order) =>
              order.id === orderId && order.paymentStatus === 'unpaid' ? enrichPaidOrder(order) : order,
            ),
          ),

        cancelOrder: (orderId) =>
          commit(
            get().orders.map((order) =>
              order.id === orderId && order.paymentStatus === 'unpaid'
                ? { ...order, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
                : order,
            ),
          ),

        setOrderStatus: (orderId, status) =>
          commit(
            get().orders.map((order) => (order.id === orderId ? applyOrderStatus(order, status) : order)),
          ),

        addLogisticsEvent: (orderId, location, description) =>
          commit(
            get().orders.map((order) =>
              order.id === orderId ? appendLogisticsEvent(order, location, description) : order,
            ),
          ),

        updateTracking: (orderId, carrier, trackingNumber) =>
          commit(
            get().orders.map((order) =>
              order.id === orderId ? updateTrackingInfo(order, carrier, trackingNumber) : order,
            ),
          ),
      }
    },
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
