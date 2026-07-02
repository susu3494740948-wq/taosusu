import type { Product } from '../types'

export const cloudCatalogConfig = {
  owner: 'susu3494740948-wq',
  repo: 'taosusu',
  branch: 'main',
  path: 'public/data/custom-products.json',
} as const

function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

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
  const base = import.meta.env.BASE_URL
  return [
    `${base}data/custom-products.json`,
    `https://raw.githubusercontent.com/${cloudCatalogConfig.owner}/${cloudCatalogConfig.repo}/${cloudCatalogConfig.branch}/${cloudCatalogConfig.path}`,
  ]
}

export async function fetchCloudProducts(): Promise<Product[]> {
  for (const url of getCloudCatalogUrls()) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
      if (!response.ok) continue
      const payload = await response.json()
      return parseCloudProductList(payload)
    } catch {
      continue
    }
  }
  return []
}

export async function syncProductsToGitHub(products: Product[], token: string): Promise<void> {
  const trimmedToken = token.trim()
  if (!trimmedToken) {
    throw new Error('Missing GitHub sync token')
  }

  const apiUrl = `https://api.github.com/repos/${cloudCatalogConfig.owner}/${cloudCatalogConfig.repo}/contents/${cloudCatalogConfig.path}`
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${trimmedToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }

  let sha: string | undefined
  const existing = await fetch(apiUrl, { headers })
  if (existing.ok) {
    const body = (await existing.json()) as { sha?: string }
    sha = body.sha
  } else if (existing.status !== 404) {
    throw new Error(`GitHub read failed (${existing.status})`)
  }

  const content = utf8ToBase64(JSON.stringify(products, null, 2))
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Sync custom products from taosusu storefront',
      content,
      sha,
      branch: cloudCatalogConfig.branch,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub sync failed (${response.status})`)
  }
}

export function canSyncToCloud(token: string | undefined): boolean {
  return Boolean(token?.trim())
}
