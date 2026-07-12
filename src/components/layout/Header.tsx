import { selectCartCount, useCartStore } from '../../store/cartStore'
import { selectStoreConfig, useSiteContentStore } from '../../store/siteContentStore'
import { theme } from '../../lib/themeClasses'
import type { ViewRole } from '../../store/roleStore'
import type { Product } from '../../types'
import { SearchBar } from './SearchBar'

type HeaderPage =
  | 'home'
  | 'portfolio'
  | 'categories'
  | 'checkout'
  | 'admin'
  | 'upload'
  | 'reviews'
  | 'settings'
  | 'account'
  | 'site-content'
  | 'blog'
  | 'blog-editor'
  | 'merchant-orders'

interface HeaderProps {
  currentPage: string
  role: ViewRole
  products: Product[]
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onSelectProduct: (productId: string) => void
  onNavigate: (page: HeaderPage) => void
  onSwitchRole: (role: ViewRole) => void
  onOpenCart: () => void
}

const customerNavItems: { label: string; page: HeaderPage }[] = [
  { label: '作品集', page: 'portfolio' },
  { label: 'Home', page: 'home' },
  { label: '商品分类', page: 'categories' },
  { label: '顾客博客', page: 'blog' },
  { label: '刚收到评论', page: 'reviews' },
]

const merchantNavItems: { label: string; page: HeaderPage }[] = [
  { label: '运营中心', page: 'admin' },
  { label: '订单物流', page: 'merchant-orders' },
  { label: '商品上架', page: 'upload' },
  { label: '站点内容', page: 'site-content' },
  { label: '博客编辑', page: 'blog-editor' },
]

export function Header({
  currentPage,
  role,
  products,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  onNavigate,
  onSwitchRole,
  onOpenCart,
}: HeaderProps) {
  const cartCount = useCartStore(selectCartCount)
  const storeConfig = useSiteContentStore(selectStoreConfig)
  const isMerchant = role === 'merchant'
  const navItems = isMerchant ? merchantNavItems : customerNavItems

  return (
    <header className={`mobile-header sticky top-0 z-40 backdrop-blur ${theme.surface} ${theme.border} border-b`}>
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button
            type="button"
            className="min-w-0 shrink text-left"
            onClick={() => onNavigate(isMerchant ? 'admin' : 'home')}
          >
            <p className={`hidden text-xs font-bold uppercase tracking-[0.3em] sm:block ${theme.muted}`}>
              {isMerchant ? 'Merchant Workspace' : 'US Cross-Border Store'}
            </p>
            <h1 className={`truncate text-lg font-black sm:text-xl ${theme.heading}`}>
              {storeConfig.name}
              {isMerchant ? <span className={`ml-2 text-sm font-bold ${theme.accentText}`}>商家后台</span> : null}
            </h1>
          </button>

          {!isMerchant ? (
            <div className="hidden min-w-0 flex-1 px-2 md:block md:max-w-xl lg:px-4">
              <SearchBar
                products={products}
                value={searchQuery}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                onSelectProduct={onSelectProduct}
              />
            </div>
          ) : (
            <div className="hidden flex-1 md:block" />
          )}

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
            {!isMerchant ? (
              <button
                type="button"
                onClick={() => onNavigate('account')}
                className={`hidden rounded-full px-3 py-2 text-sm sm:inline-flex md:px-4 md:py-3 ${
                  currentPage === 'account' ? theme.navActive : `${theme.secondaryBtn} border ${theme.border}`
                }`}
              >
                我的订单
              </button>
            ) : null}
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
              onClick={() => onSwitchRole(isMerchant ? 'customer' : 'merchant')}
              className={`rounded-full px-3 py-2 text-xs font-bold sm:text-sm md:px-4 md:py-3 ${theme.secondaryBtn} border ${theme.border}`}
            >
              {isMerchant ? '切回顾客视图' : '商家入口'}
            </button>
            {!isMerchant ? (
              <button
                type="button"
                onClick={onOpenCart}
                className={`relative hidden min-h-11 rounded-full px-4 py-3 text-sm md:inline-flex ${theme.primaryBtn}`}
                aria-label={`购物车，${cartCount} 件商品`}
              >
                Cart ({cartCount})
              </button>
            ) : null}
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

        {!isMerchant ? (
          <div className="mt-2 md:hidden">
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
