import type { Product } from '../../types'
import { formatCurrency } from '../../lib/formatters'
import { theme } from '../../lib/themeClasses'
import { usePreferencesStore } from '../../store/preferencesStore'
import { ProductArtwork } from './ProductArtwork'

interface ProductCardProps {
  product: Product
  onSelect: (productId: string) => void
  onAddToCart: (product: Product, quantity?: number) => void
  showImageOverlay?: boolean
}

export function ProductCard({ product, onSelect, onAddToCart, showImageOverlay = false }: ProductCardProps) {
  const showCompareAtPrice = usePreferencesStore((state) => state.showCompareAtPrice)
  const compactCatalog = usePreferencesStore((state) => state.compactCatalog)
  const showReviewStars = usePreferencesStore((state) => state.showReviewStars)
  const showLowStockBadge = usePreferencesStore((state) => state.showLowStockBadge)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion)

  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <article
      className={`group rounded-3xl p-3 ${theme.surface} ${theme.border} border ${
        compactCatalog ? 'p-2' : ''
      } ${reducedMotion ? '' : 'transition hover:-translate-y-1 hover:border-[var(--accent)]'}`}
    >
      <button type="button" className="block w-full text-left" onClick={() => onSelect(product.id)}>
        <ProductArtwork
          image={product.image}
          name={product.name}
          customImageUrl={product.customImageUrl}
          showOverlay={showImageOverlay}
        />
        <div className={`px-2 pb-2 ${compactCatalog ? 'pt-2' : 'pt-4'}`}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {product.badge ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.accentSoft}`}>
                {product.badge}
              </span>
            ) : null}
            {showLowStockBadge && isLowStock ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                低库存
              </span>
            ) : null}
            {showReviewStars ? (
              <span className="text-xs text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
                <span className="ml-1 text-stone-500">{product.rating}</span>
              </span>
            ) : (
              <span className={`text-xs ${theme.muted}`}>{product.rating} rating</span>
            )}
          </div>
          <h3
            className={`line-clamp-2 font-bold ${theme.heading} ${
              compactCatalog ? 'min-h-10 text-sm' : 'min-h-12 text-base'
            }`}
          >
            {product.name}
          </h3>
          <p className={`mt-2 text-sm ${theme.muted}`}>{product.category}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className={`text-lg font-black ${theme.heading}`}>
              {formatCurrency(product.price, currencyFormat)}
            </span>
            {showCompareAtPrice && product.compareAtPrice ? (
              <span className="text-sm text-stone-400 line-through">
                {formatCurrency(product.compareAtPrice, currencyFormat)}
              </span>
            ) : null}
          </div>
        </div>
      </button>
      <div className="mt-2 grid gap-2 px-2 pb-2">
        <button
          type="button"
          onClick={() => onSelect(product.id)}
          className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn}`}
        >
          查看详情
        </button>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className={`w-full rounded-full px-4 py-3 text-sm ${theme.primaryBtn} disabled:opacity-40`}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  )
}
