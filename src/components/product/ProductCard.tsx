import type { Product } from '../../types'
import { formatCurrency, getDiscountPercent } from '../../lib/formatters'
import { theme } from '../../lib/themeClasses'
import { usePreferencesStore } from '../../store/preferencesStore'
import { ProductArtwork } from './ProductArtwork'

interface ProductCardProps {
  product: Product
  onSelect: (productId: string) => void
  onAddToCart: (product: Product, quantity?: number) => void
  showImageOverlay?: boolean
  variant?: 'default' | 'featured'
}

export function ProductCard({
  product,
  onSelect,
  onAddToCart,
  showImageOverlay = false,
  variant = 'default',
}: ProductCardProps) {
  const showCompareAtPrice = usePreferencesStore((state) => state.showCompareAtPrice)
  const compactCatalog = usePreferencesStore((state) => state.compactCatalog)
  const showReviewStars = usePreferencesStore((state) => state.showReviewStars)
  const showLowStockBadge = usePreferencesStore((state) => state.showLowStockBadge)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion)

  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock === 0
  const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)
  const primaryBenefit = product.benefits[0]
  const isFeatured = variant === 'featured'

  return (
    <article
      className={`group flex h-full flex-col rounded-3xl ${theme.surface} ${theme.border} border ${
        compactCatalog && !isFeatured ? 'p-2' : isFeatured ? 'p-4 sm:p-5' : 'p-3'
      } ${reducedMotion ? '' : 'transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg'}`}
    >
      <button type="button" className="block w-full flex-1 text-left" onClick={() => onSelect(product.id)}>
        <div className="relative">
          <ProductArtwork
            image={product.image}
            name={product.name}
            customImageUrl={product.customImageUrl}
            showOverlay={showImageOverlay}
          />
          {discountPercent ? (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-black text-white shadow">
              -{discountPercent}%
            </span>
          ) : null}
          {isOutOfStock ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-stone-950/45 text-sm font-black text-white">
              暂时缺货
            </span>
          ) : null}
        </div>
        <div className={`px-1 pb-1 ${compactCatalog && !isFeatured ? 'pt-2' : 'pt-4'} ${isFeatured ? 'sm:px-1' : 'px-2'}`}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {product.badge ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.accentSoft}`}>
                {product.badge}
              </span>
            ) : null}
            {showLowStockBadge && isLowStock ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                仅剩 {product.stock} 件
              </span>
            ) : null}
            {showReviewStars ? (
              <span className="text-xs text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
                <span className="ml-1 text-stone-500">{product.rating}</span>
              </span>
            ) : (
              <span className={`text-xs ${theme.muted}`}>
                {product.rating} 分 · {product.reviewCount} 评
              </span>
            )}
          </div>
          <h3
            className={`line-clamp-2 font-bold ${theme.heading} ${
              isFeatured ? 'text-lg sm:text-xl' : compactCatalog ? 'min-h-10 text-sm' : 'min-h-12 text-base'
            }`}
          >
            {product.name}
          </h3>
          {primaryBenefit ? (
            <p className={`mt-2 line-clamp-2 text-sm leading-6 ${theme.muted}`}>{primaryBenefit}</p>
          ) : (
            <p className={`mt-2 text-sm ${theme.muted}`}>{product.category}</p>
          )}
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <span className={`font-black ${theme.heading} ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
              {formatCurrency(product.price, currencyFormat)}
            </span>
            {showCompareAtPrice && product.compareAtPrice ? (
              <span className="pb-0.5 text-sm text-stone-400 line-through">
                {formatCurrency(product.compareAtPrice, currencyFormat)}
              </span>
            ) : null}
          </div>
        </div>
      </button>
      <div className={`mt-auto grid gap-2 ${isFeatured ? 'mt-4 grid-cols-2' : 'mt-2 grid-cols-1 px-1 pb-1 sm:px-2 sm:pb-2'}`}>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className={`rounded-full px-4 py-3 text-sm ${theme.primaryBtn} disabled:opacity-40`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '暂时缺货' : '加入购物车'}
        </button>
        <button
          type="button"
          onClick={() => onSelect(product.id)}
          className={`rounded-full px-4 py-3 text-sm font-bold ${theme.secondaryBtn} border ${theme.border} ${
            isFeatured ? '' : 'hidden sm:inline-flex'
          }`}
        >
          查看详情
        </button>
      </div>
    </article>
  )
}
