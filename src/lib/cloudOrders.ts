import { fetchCloudJson, syncJsonToGitHub, getCloudJsonUrls, githubRepoConfig } from './cloudSync'
import type { Order } from '../types'

export const cloudOrdersConfig = {
  ...githubRepoConfig,
  path: 'public/data/orders.json',
} as const

export { getCloudJsonUrls }

export function parseCloudOrderList(payload: unknown): Order[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { orders?: Order[] }).orders)
      ? (payload as { orders: Order[] }).orders
      : []
  return (list as Order[]).filter(
    (order) => Boolean(order) && typeof order.id === 'string' && Array.isArray(order.items),
  )
}

export async function fetchCloudOrdersResult() {
  const result = await fetchCloudJson<unknown>(cloudOrdersConfig.path)
  if (!result.ok) return { ok: false as const, orders: null }
  return { ok: true as const, orders: parseCloudOrderList(result.data) }
}

export async function syncOrdersToGitHub(orders: Order[], token: string): Promise<void> {
  await syncJsonToGitHub(
    cloudOrdersConfig.path,
    orders,
    token,
    'Sync order logistics from taosusu storefront',
  )
}
