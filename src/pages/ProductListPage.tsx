import { useMemo } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { categories } from '../data/products'
import { searchProducts } from '../lib/productSearch'
import { theme } from '../lib/themeClasses'
import { usePreferencesStore } from '../store/preferencesStore'
import type { Category, Product } from '../types'

interface ProductListPageProps {
  products: Product[]
  query: string
  category: Category | 'All'
  onCategoryChange: (category: Category | 'All') => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product) => void
}

export function ProductListPage({
  products,
  query,
  category,
  onCategoryChange,
  onSelectProduct,
  onAddToCart,
}: ProductListPageProps) {
  const productSort = usePreferencesStore((state) => state.productSort)
  const showOutOfStock = usePreferencesStore((state) => state.showOutOfStock)

  const filteredProducts = useMemo(() => {
    const searched = searchProducts(products, query)
    const result = searched.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesStock = showOutOfStock || product.stock > 0
      return matchesCategory && matchesStock
    })

    return [...result].sort((a, b) => {
      if (productSort === 'price-low') return a.price - b.price
      if (productSort === 'price-high') return b.price - a.price
      if (productSort === 'rating') return b.rating - a.rating
      if (productSort === 'reviews') return b.reviewCount - a.reviewCount
      return products.indexOf(a) - products.indexOf(b)
    })
  }, [category, products, query, productSort, showOutOfStock])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Shop all</p>
        <h2 className={`mt-2 text-4xl font-black ${theme.heading}`}>
          Everyday lifestyle products for US delivery
        </h2>
        <p className={`mt-3 max-w-2xl ${theme.muted}`}>
          Browse {products.length} lightweight cross-border SKUs across summer comfort, pet cleaning, travel,
          beauty, home organization, and fitness categories.
        </p>
        {query ? (
          <p className="mt-3 text-sm font-bold text-stone-700 dark:text-stone-300">
            搜索结果："{query}" · 共 {filteredProducts.length} 件商品
          </p>
        ) : null}
      </div>

      <div className={`mb-8 rounded-3xl p-4 ${theme.surface} ${theme.border} border`}>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as Category | 'All')}
          className={`w-full rounded-2xl px-4 py-3 ${theme.input}`}
        >
          <option value="All">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <p className={`mt-3 text-sm ${theme.muted}`}>
          排序与库存显示可在「设置 → 购物与浏览」中调整。
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={`rounded-3xl border border-dashed p-12 text-center ${theme.surface} ${theme.border}`}>
          <h3 className={`text-2xl font-black ${theme.heading}`}>No products found</h3>
          <p className={`mt-2 ${theme.muted}`}>Try another keyword or category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </main>
  )
}
