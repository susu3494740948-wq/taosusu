import { fetchCloudJson, syncJsonToGitHub, canSyncToCloud, getCloudJsonUrls, githubRepoConfig } from './cloudSync'
import type { Product } from '../types'

export const cloudCatalogConfig = {
  ...githubRepoConfig,
  path: 'public/data/custom-products.json',
} as const

export { canSyncToCloud, getCloudJsonUrls }

export function parseCloudProductList(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload as Product[]
  }
  if (payload && typeof payload === 'object' && Array.isArray((payload as { products?: Product[] }).products)) {
    return (payload as { products: Product[] }).products
  }
  return []
}

export function getCloudCatalogUrls(): string[] {
  return getCloudJsonUrls(cloudCatalogConfig.path)
}

export async function fetchCloudProducts(): Promise<Product[]> {
  const result = await fetchCloudJson<unknown>(cloudCatalogConfig.path)
  if (!result.ok) return []
  return parseCloudProductList(result.data)
}

export async function fetchCloudProductsResult() {
  const result = await fetchCloudJson<unknown>(cloudCatalogConfig.path)
  if (!result.ok) return { ok: false as const, products: null }
  return { ok: true as const, products: parseCloudProductList(result.data) }
}

export async function syncProductsToGitHub(products: Product[], token: string): Promise<void> {
  await syncJsonToGitHub(
    cloudCatalogConfig.path,
    products,
    token,
    'Sync custom products from taosusu storefront',
  )
}
