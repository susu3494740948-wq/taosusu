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

function NavButton({
  active,
  label,
  icon,
  onClick,
  badge,
}: {
  active: boolean
  label: string
  icon: string
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-bold transition active:scale-95 ${
        active ? theme.accentText : theme.muted
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-2xl text-base leading-none ${
          active ? theme.accentSoft : ''
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
      {badge && badge > 0 ? (
        <span className="absolute right-2 top-1 min-w-5 rounded-full bg-[var(--accent)] px-1 text-[10px] font-black text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function MobileBottomNav({ currentPage, onNavigate, onOpenCart }: MobileBottomNavProps) {
  const cartCount = useCartStore(selectCartCount)

  return (
    <nav
      className={`mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden ${theme.surface} ${theme.border}`}
      aria-label="手机底部导航"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.slice(0, 2).map((item) => (
          <NavButton
            key={item.page}
            active={currentPage === item.page}
            label={item.label}
            icon={item.icon}
            onClick={() => onNavigate(item.page)}
          />
        ))}

        <NavButton active={false} label="购物车" icon="🛒" onClick={onOpenCart} badge={cartCount} />

        {navItems.slice(2).map((item) => (
          <NavButton
            key={item.page}
            active={currentPage === item.page}
            label={item.label}
            icon={item.icon}
            onClick={() => onNavigate(item.page)}
          />
        ))}
      </div>
    </nav>
  )
}
