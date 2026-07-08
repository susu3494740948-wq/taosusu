import { products as baseProducts } from '../data/products'
import type { Category, Product } from '../types'

export function getAllCatalogProducts(customProducts: Product[]): Product[] {
  const customIds = new Set(customProducts.map((product) => product.id))
  return [...customProducts, ...baseProducts.filter((product) => !customIds.has(product.id))]
}

export function isProductDelisted(productId: string, delistedProductIds: string[]): boolean {
  return delistedProductIds.includes(productId)
}

export function mergeCatalogProducts(
  customProducts: Product[],
  delistedProductIds: string[] = [],
): Product[] {
  const delisted = new Set(delistedProductIds)
  return getAllCatalogProducts(customProducts).filter((product) => !delisted.has(product.id))
}

export function getCatalogProductById(
  id: string,
  customProducts: Product[],
  delistedProductIds: string[] = [],
): Product | undefined {
  return mergeCatalogProducts(customProducts, delistedProductIds).find((product) => product.id === id)
}

export function getCatalogRelatedProducts(
  product: Product,
  customProducts: Product[],
  delistedProductIds: string[] = [],
  limit = 3,
): Product[] {
  const catalog = mergeCatalogProducts(customProducts, delistedProductIds)
  return catalog
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.category === product.category ||
          candidate.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, limit)
}

export function getCatalogProductsByCategory(
  category: Category,
  customProducts: Product[],
  delistedProductIds: string[] = [],
): Product[] {
  return mergeCatalogProducts(customProducts, delistedProductIds).filter(
    (product) => product.category === category,
  )
}

export { baseProducts }
