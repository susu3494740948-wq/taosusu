import { selectCartCount, useCartStore } from '../../store/cartStore'
import { selectStoreConfig, useSiteContentStore } from '../../store/siteContentStore'
import { theme } from '../../lib/themeClasses'
import type { Product } from '../../types'
import { SearchBar } from './SearchBar'

interface HeaderProps {
  currentPage: string
  products: Product[]
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onSelectProduct: (productId: string) => void
  onNavigate: (
    page:
      | 'home'
      | 'categories'
      | 'checkout'
      | 'admin'
      | 'upload'
      | 'reviews'
      | 'settings'
      | 'account'
      | 'site-content'
      | 'blog'
      | 'blog-editor',
  ) => void
  onOpenCart: () => void
}

export function Header({
  currentPage,
  products,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  onNavigate,
  onOpenCart,
}: HeaderProps) {
  const cartCount = useCartStore(selectCartCount)
  const storeConfig = useSiteContentStore(selectStoreConfig)
  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: '商品分类', page: 'categories' as const },
    { label: '运营中心', page: 'admin' as const },
    { label: '顾客博客', page: 'blog' as const },
    { label: '刚收到评论', page: 'reviews' as const },
  ]

  return (
    <header className={`mobile-header sticky top-0 z-40 backdrop-blur ${theme.surface} ${theme.border} border-b`}>
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button type="button" className="min-w-0 shrink text-left" onClick={() => onNavigate('home')}>
            <p className={`hidden text-xs font-bold uppercase tracking-[0.3em] sm:block ${theme.muted}`}>
              US Cross-Border Store
            </p>
            <h1 className={`truncate text-lg font-black sm:text-xl ${theme.heading}`}>{storeConfig.name}</h1>
          </button>

          <div className="hidden min-w-0 flex-1 px-2 md:block md:max-w-xl lg:px-4">
            <SearchBar
              products={products}
              value={searchQuery}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              onSelectProduct={onSelectProduct}
            />
          </div>

          <nav className="hidden items-center gap-2 xl:flex">
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                className={`rounded-full px-4 py-2 text-sm ${
                  currentPage === item.page ? theme.navActive : theme.navIdle
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigate('account')}
              className={`hidden rounded-full px-3 py-2 text-sm sm:inline-flex md:px-4 md:py-3 ${
                currentPage === 'account' ? theme.navActive : `${theme.secondaryBtn} border ${theme.border}`
              }`}
            >
              我的订单
            </button>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`hidden rounded-full px-3 py-2 text-sm sm:inline-flex md:px-4 md:py-3 ${
                currentPage === 'settings' ? theme.navActive : `${theme.secondaryBtn} border ${theme.border}`
              }`}
              aria-label="偏好设置"
            >
              设置
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className={`relative hidden min-h-11 rounded-full px-4 py-3 text-sm md:inline-flex ${theme.primaryBtn}`}
              aria-label={`购物车，${cartCount} 件商品`}
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>

        <div className="home-scroll-row mt-2 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
              className={`shrink-0 touch-target rounded-full px-4 py-2 text-xs font-bold ${
                currentPage === item.page ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-2 md:hidden">
          <SearchBar
            products={products}
            value={searchQuery}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </header>
  )
}
