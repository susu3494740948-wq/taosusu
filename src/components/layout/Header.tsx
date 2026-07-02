import { selectCartCount, useCartStore } from '../../store/cartStore'
import { storeConfig } from '../../data/store'
import { theme } from '../../lib/themeClasses'
import type { Product } from '../../types'
import { SearchBar } from './SearchBar'

interface HeaderProps {
  currentPage: string
  showSearch: boolean
  products: Product[]
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onSelectProduct: (productId: string) => void
  onNavigate: (page: 'home' | 'categories' | 'checkout' | 'admin' | 'reviews' | 'settings' | 'account') => void
  onOpenCart: () => void
}

export function Header({
  currentPage,
  showSearch,
  products,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  onNavigate,
  onOpenCart,
}: HeaderProps) {
  const cartCount = useCartStore(selectCartCount)
  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: '商品分类', page: 'categories' as const },
    { label: '运营中心', page: 'admin' as const },
    { label: '刚收到评论', page: 'reviews' as const },
  ]

  return (
    <header className={`sticky top-0 z-40 backdrop-blur ${theme.surface} ${theme.border} border-b`}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button type="button" className="shrink-0 text-left" onClick={() => onNavigate('home')}>
            <p className={`text-xs font-bold uppercase tracking-[0.3em] ${theme.muted}`}>US Cross-Border Store</p>
            <h1 className={`text-xl font-black ${theme.heading}`}>{storeConfig.name}</h1>
          </button>

          {showSearch ? (
            <div className="hidden min-w-0 flex-1 px-4 lg:block lg:max-w-xl">
              <SearchBar
                products={products}
                value={searchQuery}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                onSelectProduct={onSelectProduct}
              />
            </div>
          ) : null}

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

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('account')}
              className={`rounded-full px-4 py-3 text-sm ${
                currentPage === 'account' ? theme.navActive : `${theme.secondaryBtn} border ${theme.border}`
              }`}
            >
              我的订单
            </button>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`rounded-full px-4 py-3 text-sm ${
                currentPage === 'settings' ? theme.navActive : `${theme.secondaryBtn} border ${theme.border}`
              }`}
              aria-label="偏好设置"
            >
              设置
            </button>
            <button type="button" onClick={onOpenCart} className={`rounded-full px-4 py-3 text-sm ${theme.primaryBtn}`}>
              Cart ({cartCount})
            </button>
          </div>
        </div>

        {showSearch ? (
          <div className="mt-3 lg:hidden">
            <SearchBar
              products={products}
              value={searchQuery}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              onSelectProduct={onSelectProduct}
            />
          </div>
        ) : null}
      </div>
    </header>
  )
}
