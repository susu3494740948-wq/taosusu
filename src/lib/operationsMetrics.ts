import type { Category, Product } from '../types'

export type SkuOperationalStatus = 'healthy' | 'low-stock' | 'out-of-stock'

export interface CategoryMetrics {
  category: Category
  skuCount: number
  totalStock: number
  avgPrice: number
  inventoryValue: number
}

export interface OperationsSummary {
  activeSkus: number
  totalStockUnits: number
  inventoryValue: number
  projectedRevenue: number
  lowStockCount: number
  outOfStockCount: number
  averageRating: number
  averagePrice: number
  categoryMetrics: CategoryMetrics[]
}

export function getSkuOperationalStatus(stock: number): SkuOperationalStatus {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 9) return 'low-stock'
  return 'healthy'
}

export function buildOperationsSummary(products: Product[]): OperationsSummary {
  const totalStockUnits = products.reduce((sum, product) => sum + product.stock, 0)
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const projectedRevenue = products.reduce(
    (sum, product) => sum + product.price * Math.min(product.stock, 4),
    0,
  )
  const lowStockCount = products.filter((product) => getSkuOperationalStatus(product.stock) === 'low-stock').length
  const outOfStockCount = products.filter((product) => product.stock === 0).length
  const averageRating =
    products.reduce((sum, product) => sum + product.rating, 0) / Math.max(products.length, 1)
  const averagePrice =
    products.reduce((sum, product) => sum + product.price, 0) / Math.max(products.length, 1)

  const categoryMetrics = [...new Set(products.map((product) => product.category))].map((category) => {
    const categoryProducts = products.filter((product) => product.category === category)
    const totalStock = categoryProducts.reduce((sum, product) => sum + product.stock, 0)
    const avgPrice =
      categoryProducts.reduce((sum, product) => sum + product.price, 0) / categoryProducts.length

    return {
      category,
      skuCount: categoryProducts.length,
      totalStock,
      avgPrice,
      inventoryValue: categoryProducts.reduce((sum, product) => sum + product.price * product.stock, 0),
    }
  })

  return {
    activeSkus: products.length,
    totalStockUnits,
    inventoryValue,
    projectedRevenue,
    lowStockCount,
    outOfStockCount,
    averageRating,
    averagePrice,
    categoryMetrics,
  }
}
