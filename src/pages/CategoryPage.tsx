import { categoryMeta } from '../data/categoryMeta'
import { categories, getProductsByCategory } from '../data/products'
import { searchProducts } from '../lib/productSearch'
import { theme } from '../lib/themeClasses'
import { usePreferencesStore } from '../store/preferencesStore'
import { ProductCard } from '../components/product/ProductCard'
import type { Category, Product } from '../types'

interface CategoryPageProps {
  products: Product[]
  selectedCategory: Category | null
  searchQuery: string
  onBrowseCategory: (category: Category) => void
  onClearFilters: () => void
  onNavigateHome: () => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product) => void
}

export function CategoryPage({
  products,
  selectedCategory,
  searchQuery,
  onBrowseCategory,
  onClearFilters,
  onNavigateHome,
  onSelectProduct,
  onAddToCart,
}: CategoryPageProps) {
  const showOutOfStock = usePreferencesStore((state) => state.showOutOfStock)
  const filteredProducts = searchProducts(products, searchQuery)
    .filter((product) => !selectedCategory || product.category === selectedCategory)
    .filter((product) => showOutOfStock || product.stock > 0)

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className={`rounded-[2rem] p-8 sm:p-10 ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Categories</p>
        <h2 className="mt-3 text-4xl font-black">商品分类</h2>
        <p className="mt-4 max-w-3xl leading-7 opacity-80">
          按场景浏览淘酥酥跨境好物：夏日降温、宠物清洁、旅行收纳、美妆护理、家居整理与健身户外。
        </p>
        <button type="button" onClick={onNavigateHome} className={`mt-6 rounded-full px-6 py-3 text-sm ${theme.secondaryBtn}`}>
          返回首页
        </button>
      </section>

      {(selectedCategory || searchQuery) && (
        <section className={`mt-8 rounded-[2rem] p-6 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className={`text-2xl font-black ${theme.heading}`}>
                {selectedCategory ? `${selectedCategory} 商品` : '搜索结果'}
              </h3>
              {searchQuery ? (
                <p className={`mt-2 text-sm ${theme.muted}`}>
                  关键词 "{searchQuery}" · 共 {filteredProducts.length} 件
                </p>
              ) : null}
            </div>
            <button type="button" onClick={onClearFilters} className={`rounded-full px-4 py-2 text-sm ${theme.secondaryBtn}`}>
              清除筛选
            </button>
          </div>
          {filteredProducts.length === 0 ? (
            <p className={`mt-6 ${theme.muted}`}>没有找到匹配商品，请换个关键词或分类。</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  showImageOverlay={false}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const meta = categoryMeta[category]
          const categoryProducts = getProductsByCategory(category)

          return (
            <article
              key={category}
              className={`overflow-hidden rounded-[2rem] transition hover:-translate-y-1 ${theme.surface} ${theme.border} border hover:border-[var(--accent)]`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={meta.image} alt={category} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.heroAccent}`}>
                    {categoryProducts.length} products
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{category}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className={`text-sm leading-7 ${theme.muted}`}>{meta.description}</p>
                <button
                  type="button"
                  onClick={() => onBrowseCategory(category)}
                  className={`mt-5 rounded-full px-5 py-3 text-sm ${theme.primaryBtn}`}
                >
                  浏览该分类
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
