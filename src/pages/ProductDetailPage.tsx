import { useState } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { ProductMediaGallery } from '../components/product/ProductMediaGallery'
import { ProductReviewsSection } from '../components/product/ProductReviewsSection'
import { getCatalogRelatedProducts } from '../lib/catalog'
import { storeConfig } from '../data/store'
import { formatCurrency, getDiscountPercent } from '../lib/formatters'
import { theme } from '../lib/themeClasses'
import { usePreferencesStore } from '../store/preferencesStore'
import type { Category, Product } from '../types'

interface ProductDetailPageProps {
  product: Product
  customProducts: Product[]
  delistedProductIds?: string[]
  onBack: () => void
  onNavigateHome: () => void
  onBrowseCategory: (category: Category) => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product, quantity?: number) => void
}

type DetailTab = 'benefits' | 'details' | 'shipping'

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: 'benefits', label: '核心卖点' },
  { id: 'details', label: '规格参数' },
  { id: 'shipping', label: '配送退换' },
]

const trustBadges = [
  { icon: '🔒', label: 'PayPal / 卡支付' },
  { icon: '📦', label: `满 $${storeConfig.freeShippingThreshold} 免邮` },
  { icon: '🛡️', label: '30 天售后' },
]

export function ProductDetailPage({
  product,
  customProducts,
  delistedProductIds = [],
  onBack,
  onNavigateHome,
  onBrowseCategory,
  onSelectProduct,
  onAddToCart,
}: ProductDetailPageProps) {
  const relatedProducts = getCatalogRelatedProducts(product, customProducts, delistedProductIds)
  const showCompareAtPrice = usePreferencesStore((state) => state.showCompareAtPrice)
  const showReviewStars = usePreferencesStore((state) => state.showReviewStars)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<DetailTab>('benefits')

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1))
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(product.stock, current + 1))
  }

  return (
    <main className="mx-auto max-w-7xl px-3 pb-28 pt-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
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
        <span className={`max-w-[12rem] truncate sm:max-w-none ${theme.heading}`}>{product.name}</span>
      </nav>

      <button type="button" onClick={onBack} className={`mb-6 font-bold md:hidden ${theme.accentText}`}>
        ← 返回上一页
      </button>

      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <ProductMediaGallery product={product} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            {product.badge ? (
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${theme.accentSoft}`}>
                {product.badge}
              </span>
            ) : null}
            {discountPercent ? (
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-black text-white">
                省 {discountPercent}%
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onBrowseCategory(product.category)}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${theme.surfaceMuted}`}
            >
              {product.category}
            </button>
          </div>

          <h1 className={`text-2xl font-black leading-tight tracking-tight sm:text-4xl ${theme.heading}`}>
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {showReviewStars ? (
              <span className="text-sm text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
                <span className={`ml-1 font-semibold ${theme.muted}`}>
                  {product.rating} · {product.reviewCount} 条评价
                </span>
              </span>
            ) : (
              <span className={`text-sm font-semibold ${theme.muted}`}>
                {product.rating} 分 · {product.reviewCount} 条评价
              </span>
            )}
          </div>

          <p className={`mt-4 text-base leading-7 sm:text-lg ${theme.muted}`}>{product.description}</p>

          {product.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className={`rounded-full px-3 py-1 text-xs font-bold ${theme.surfaceMuted}`}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className={`mt-6 rounded-[1.5rem] p-4 sm:p-5 ${theme.surfaceMuted}`}>
            <div className="flex flex-wrap items-end gap-3">
              <span className={`text-3xl font-black sm:text-4xl ${theme.heading}`}>
                {formatCurrency(product.price, currencyFormat)}
              </span>
              {showCompareAtPrice && product.compareAtPrice ? (
                <span className={`pb-1 text-lg line-through ${theme.muted}`}>
                  {formatCurrency(product.compareAtPrice, currencyFormat)}
                </span>
              ) : null}
            </div>
            <p className={`mt-3 text-sm ${theme.muted}`}>
              {isOutOfStock ? (
                <span className="font-bold text-red-600">暂时缺货，补货后恢复销售</span>
              ) : isLowStock ? (
                <span className="font-bold text-amber-700">仅剩 {product.stock} 件，建议尽快下单</span>
              ) : (
                <span>
                  现货 {product.stock} 件 · 美国直邮 · 满 ${storeConfig.freeShippingThreshold} 免标准运费
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold sm:text-sm ${theme.surface}`}
              >
                <span aria-hidden="true">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>

          <div className="mt-6 hidden flex-wrap items-center gap-4 md:flex">
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
              className={`min-w-[12rem] flex-1 rounded-full px-6 py-4 text-base ${theme.primaryBtn} disabled:opacity-40`}
            >
              {isOutOfStock ? '暂时缺货' : '加入购物车'}
            </button>
          </div>

          <div className={`mt-8 overflow-hidden rounded-[1.5rem] ${theme.surface} ${theme.border} border`}>
            <div className="flex overflow-x-auto border-b border-stone-200/80">
              {detailTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[6.5rem] shrink-0 px-4 py-3 text-sm font-bold transition sm:min-w-0 sm:flex-1 ${
                    activeTab === tab.id
                      ? `${theme.accentText} border-b-2 border-[var(--accent)] bg-[var(--accent-soft)]/40`
                      : theme.muted
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === 'benefits' ? (
                <ul className={`space-y-3 text-sm leading-7 ${theme.muted}`}>
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3">
                      <span className="mt-0.5 font-black text-emerald-600">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {activeTab === 'details' ? (
                <ul className={`space-y-3 text-sm leading-7 ${theme.muted}`}>
                  {product.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-0.5 font-black text-stone-400">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {activeTab === 'shipping' ? (
                <div className={`space-y-3 text-sm leading-7 ${theme.muted}`}>
                  <p>{product.shippingNote}</p>
                  <p>
                    发货后 {storeConfig.processingDays} 处理，预计 {storeConfig.deliveryDays} 送达美国。
                  </p>
                  <p>
                    如有破损、缺件或发错货，请在收货 30 天内联系 {storeConfig.supportEmail}。
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <ProductReviewsSection product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className={`text-2xl font-black ${theme.heading}`}>相关推荐</h2>
            <button type="button" onClick={onBack} className={`font-bold ${theme.accentText}`}>
              查看更多 →
            </button>
          </div>
          <div className="grid mobile-card-grid lg:grid-cols-3">
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
            <p className={`truncate text-base font-black ${theme.heading}`}>
              {formatCurrency(product.price, currencyFormat)}
            </p>
            <p className={`truncate text-xs ${theme.muted}`}>
              {isOutOfStock ? '暂时缺货' : isLowStock ? `仅剩 ${product.stock} 件` : `现货 ${product.stock} 件`}
            </p>
          </div>
          <div className={`flex items-center gap-1 rounded-full px-1 py-1 ${theme.surfaceMuted}`}>
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
