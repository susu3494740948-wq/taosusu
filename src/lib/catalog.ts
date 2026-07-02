import { products as baseProducts } from '../data/products'
import type { Category, Product } from '../types'

export function mergeCatalogProducts(customProducts: Product[]): Product[] {
  return [...customProducts, ...baseProducts]
}

export function getCatalogProductById(id: string, customProducts: Product[]): Product | undefined {
  return mergeCatalogProducts(customProducts).find((product) => product.id === id)
}

export function getCatalogRelatedProducts(product: Product, customProducts: Product[], limit = 3): Product[] {
  const catalog = mergeCatalogProducts(customProducts)
  return catalog
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.category === product.category ||
          candidate.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, limit)
}

export function getCatalogProductsByCategory(category: Category, customProducts: Product[]): Product[] {
  return mergeCatalogProducts(customProducts).filter((product) => product.category === category)
}

export { baseProducts }
