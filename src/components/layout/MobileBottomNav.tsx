import { selectCartCount, useCartStore } from '../../store/cartStore'
import { theme } from '../../lib/themeClasses'

type NavPage = 'home' | 'categories' | 'account' | 'settings'

interface MobileBottomNavProps {
  currentPage: string
  onNavigate: (page: NavPage) => void
  onOpenCart: () => void
}

const navItems: { page: NavPage; label: string; icon: string }[] = [
  { page: 'home', label: '首页', icon: '⌂' },
  { page: 'categories', label: '分类', icon: '▦' },
  { page: 'account', label: '订单', icon: '☰' },
  { page: 'settings', label: '我的', icon: '⚙' },
]

export function MobileBottomNav({ currentPage, onNavigate, onOpenCart }: MobileBottomNavProps) {
  const cartCount = useCartStore(selectCartCount)

  return (
    <nav
      className={`mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t md:hidden ${theme.surface} ${theme.border}`}
      aria-label="手机底部导航"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.page}
            type="button"
            onClick={() => onNavigate(item.page)}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-bold ${
              currentPage === item.page ? theme.accentText : theme.muted
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenCart}
          className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-bold ${theme.muted}`}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            🛒
          </span>
          购物车
          {cartCount > 0 ? (
            <span className="absolute right-[calc(50%-1.25rem)] top-1.5 min-w-5 rounded-full bg-[var(--accent)] px-1 text-[10px] font-black text-white">
              {cartCount}
            </span>
          ) : null}
        </button>

        {navItems.slice(2).map((item) => (
          <button
            key={item.page}
            type="button"
            onClick={() => onNavigate(item.page)}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-bold ${
              currentPage === item.page ? theme.accentText : theme.muted
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
