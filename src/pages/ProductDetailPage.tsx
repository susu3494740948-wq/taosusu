import { useState } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { ProductMediaGallery } from '../components/product/ProductMediaGallery'
import { ProductReviewsSection } from '../components/product/ProductReviewsSection'
import { getCatalogRelatedProducts } from '../lib/catalog'
import { storeConfig } from '../data/store'
import { formatCurrency } from '../lib/formatters'
import { theme } from '../lib/themeClasses'
import { usePreferencesStore } from '../store/preferencesStore'
import type { Category, Product } from '../types'

interface ProductDetailPageProps {
  product: Product
  customProducts: Product[]
  onBack: () => void
  onNavigateHome: () => void
  onBrowseCategory: (category: Category) => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product, quantity?: number) => void
}

export function ProductDetailPage({
  product,
  customProducts,
  onBack,
  onNavigateHome,
  onBrowseCategory,
  onSelectProduct,
  onAddToCart,
}: ProductDetailPageProps) {
  const relatedProducts = getCatalogRelatedProducts(product, customProducts)
  const showCompareAtPrice = usePreferencesStore((state) => state.showCompareAtPrice)
  const showReviewStars = usePreferencesStore((state) => state.showReviewStars)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const [quantity, setQuantity] = useState(1)

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1))
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(product.stock, current + 1))
  }

  return (
    <main className="mx-auto max-w-7xl px-3 pb-24 pt-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
      <nav aria-label="面包屑" className={`mb-4 flex flex-wrap items-center gap-2 text-xs sm:mb-6 sm:text-sm ${theme.muted}`}>
        <button type="button" onClick={onNavigateHome} className={`font-bold ${theme.accentText}`}>
          首页
        </button>
        <span>/</span>
        <button type="button" onClick={onBack} className={`font-bold ${theme.accentText}`}>
          商品分类
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onBrowseCategory(product.category)}
          className={`font-bold ${theme.accentText}`}
        >
          {product.category}
        </button>
        <span>/</span>
        <span className={`hidden max-w-[40%] truncate sm:inline ${theme.heading}`}>{product.name}</span>
      </nav>

      <button type="button" onClick={onBack} className={`mb-6 font-bold ${theme.accentText}`}>
        ← 返回上一页
      </button>

      <section className="grid gap-10 lg:grid-cols-2">
        <ProductMediaGallery product={product} />

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {product.badge ? (
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${theme.accentSoft}`}>
                {product.badge}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onBrowseCategory(product.category)}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${theme.surfaceMuted}`}
            >
              {product.category}
            </button>
            {showReviewStars ? (
              <span className="text-sm text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
                <span className={`ml-1 ${theme.muted}`}>{product.rating}</span>
              </span>
            ) : (
              <span className={`text-sm font-semibold ${theme.muted}`}>
                {product.rating} 分 · {product.reviewCount} 条评价
              </span>
            )}
          </div>

          <h2 className={`text-2xl font-black tracking-tight sm:text-4xl ${theme.heading}`}>{product.name}</h2>
          <p className={`mt-4 text-lg leading-8 ${theme.muted}`}>{product.description}</p>

          {product.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className={`rounded-full px-3 py-1 text-xs font-bold ${theme.surfaceMuted}`}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex items-end gap-3">
            <span className={`text-3xl font-black sm:text-4xl ${theme.heading}`}>
              {formatCurrency(product.price, currencyFormat)}
            </span>
            {showCompareAtPrice && product.compareAtPrice ? (
              <span className={`pb-1 text-lg line-through ${theme.muted}`}>
                {formatCurrency(product.compareAtPrice, currencyFormat)}
              </span>
            ) : null}
          </div>

          <p className={`mt-4 text-sm ${theme.muted}`}>
            {isOutOfStock ? (
              <span className="font-bold text-red-600">暂时缺货</span>
            ) : isLowStock ? (
              <span className="font-bold text-amber-700">仅剩 {product.stock} 件</span>
            ) : (
              <span>现货 {product.stock} 件 · 美国直邮</span>
            )}
          </p>

          <div className="mt-8 hidden flex-wrap items-center gap-4 md:flex">
            <div className={`flex items-center gap-3 rounded-full px-2 py-2 ${theme.surfaceMuted}`}>
              <button
                type="button"
                className="h-10 w-10 rounded-full font-bold"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="减少数量"
              >
                -
              </button>
              <span className={`w-8 text-center font-black ${theme.heading}`}>{quantity}</span>
              <button
                type="button"
                className="h-10 w-10 rounded-full font-bold"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                aria-label="增加数量"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart(product, quantity)}
              disabled={isOutOfStock}
              className={`rounded-full px-6 py-4 text-base ${theme.primaryBtn} disabled:opacity-40`}
            >
              {isOutOfStock ? '暂时缺货' : '加入购物车'}
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className={`rounded-3xl p-5 ${theme.surface}`}>
              <h3 className={`font-black ${theme.heading}`}>核心卖点</h3>
              <ul className={`mt-4 space-y-3 text-sm ${theme.muted}`}>
                {product.benefits.map((benefit) => (
                  <li key={benefit}>- {benefit}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl p-5 ${theme.surface}`}>
              <h3 className={`font-black ${theme.heading}`}>规格参数</h3>
              <ul className={`mt-4 space-y-3 text-sm ${theme.muted}`}>
                {product.details.map((detail) => (
                  <li key={detail}>- {detail}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`mt-5 rounded-3xl p-5 text-sm ${theme.surfaceMuted}`}>
            <p className={`font-bold ${theme.heading}`}>配送与退换</p>
            <p className={`mt-2 ${theme.muted}`}>{product.shippingNote}</p>
            <p className={`mt-2 ${theme.muted}`}>
              发货后 {storeConfig.processingDays} 处理，预计 {storeConfig.deliveryDays} 送达美国。
              如有破损、缺件或发错货，请在收货 30 天内联系 {storeConfig.supportEmail}。
            </p>
          </div>
        </div>
      </section>

      <ProductReviewsSection product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h3 className={`text-2xl font-black ${theme.heading}`}>相关推荐</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                showImageOverlay={false}
              />
            ))}
          </div>
        </section>
      )}
      <div
        className={`mobile-sticky-bar fixed inset-x-0 bottom-0 z-40 border-t md:hidden ${theme.surface} ${theme.border}`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-black ${theme.heading}`}>
              {formatCurrency(product.price, currencyFormat)}
            </p>
            <p className={`truncate text-xs ${theme.muted}`}>
              {isOutOfStock ? '暂时缺货' : `现货 ${product.stock} 件`}
            </p>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-1 py-1 ${theme.surfaceMuted}`}>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="减少数量"
            >
              -
            </button>
            <span className={`w-6 text-center text-sm font-black ${theme.heading}`}>{quantity}</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
              onClick={increaseQuantity}
              disabled={quantity >= product.stock}
              aria-label="增加数量"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product, quantity)}
            disabled={isOutOfStock}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-bold ${theme.primaryBtn} disabled:opacity-40`}
          >
            {isOutOfStock ? '缺货' : '加入购物车'}
          </button>
        </div>
      </div>
    </main>
  )
}
