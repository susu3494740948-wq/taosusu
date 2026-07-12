import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { CartDrawer } from './components/cart/CartDrawer'
import { Header } from './components/layout/Header'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { products as baseProducts } from './data/products'
import { usePreferencesEffect } from './hooks/usePreferencesEffect'
import { mergeCatalogProducts, getCatalogProductById } from './lib/catalog'
import { theme } from './lib/themeClasses'
import { enrichPlacedOrder } from './lib/orderLogistics'
import { useCartStore } from './store/cartStore'
import { useOrderStore } from './store/orderStore'
import { usePreferencesStore } from './store/preferencesStore'
import { useProductStore } from './store/productStore'
import { useRoleStore, type ViewRole } from './store/roleStore'
import { useSiteContentStore } from './store/siteContentStore'
import type { Category, Order, Product } from './types'
import { HomePage } from './pages/HomePage'
import { useBlogStore } from './store/blogStore'

// 页面级代码分割:首页保持同步加载,其余页面按需加载,
// 让 recharts(仅运营中心使用)等重依赖不进入首屏 bundle。
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const RecentReviewsPage = lazy(() =>
  import('./pages/RecentReviewsPage').then((m) => ({ default: m.RecentReviewsPage })),
)
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderSuccessPage = lazy(() =>
  import('./pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })),
)
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
)
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const SiteContentPage = lazy(() =>
  import('./pages/SiteContentPage').then((m) => ({ default: m.SiteContentPage })),
)
const UploadProductPage = lazy(() =>
  import('./pages/UploadProductPage').then((m) => ({ default: m.UploadProductPage })),
)
const UserAccountPage = lazy(() =>
  import('./pages/UserAccountPage').then((m) => ({ default: m.UserAccountPage })),
)
const CustomerBlogPage = lazy(() =>
  import('./pages/CustomerBlogPage').then((m) => ({ default: m.CustomerBlogPage })),
)
const BlogEditorPage = lazy(() =>
  import('./pages/BlogEditorPage').then((m) => ({ default: m.BlogEditorPage })),
)
const PortfolioCasePage = lazy(() =>
  import('./pages/PortfolioCasePage').then((m) => ({ default: m.PortfolioCasePage })),
)
const MerchantOrdersPage = lazy(() =>
  import('./pages/MerchantOrdersPage').then((m) => ({ default: m.MerchantOrdersPage })),
)

function PageLoader() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center" aria-busy="true">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-[var(--accent)]" />
      <span className="sr-only">页面加载中</span>
    </main>
  )
}

type Page =
  | 'home'
  | 'portfolio'
  | 'categories'
  | 'detail'
  | 'checkout'
  | 'success'
  | 'admin'
  | 'upload'
  | 'site-content'
  | 'blog'
  | 'blog-editor'
  | 'reviews'
  | 'settings'
  | 'account'
  | 'merchant-orders'

/** 仅商家模式可见的页面，切回顾客视图时会自动跳转首页 */
const merchantOnlyPages: Page[] = ['admin', 'upload', 'site-content', 'blog-editor', 'merchant-orders']

export default function App() {
  const addItem = useCartStore((state) => state.addItem)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const setDiscountCode = useCartStore((state) => state.setDiscountCode)
  const defaultShippingMethod = usePreferencesStore((state) => state.defaultShippingMethod)
  const addToCartBehavior = usePreferencesStore((state) => state.addToCartBehavior)
  const autoApplySavedPromo = usePreferencesStore((state) => state.autoApplySavedPromo)
  const savedPromoCode = usePreferencesStore((state) => state.savedPromoCode)
  const customProducts = useProductStore((state) => state.customProducts)
  const delistedProductIds = useProductStore((state) => state.delistedProductIds)
  const role = useRoleStore((state) => state.role)
  const setRole = useRoleStore((state) => state.setRole)
  const catalogProducts = useMemo(
    () => mergeCatalogProducts(customProducts, delistedProductIds),
    [customProducts, delistedProductIds],
  )
  const [page, setPage] = useState<Page>('home')
  const [selectedProductId, setSelectedProductId] = useState(baseProducts[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [shopCategory, setShopCategory] = useState<Category | null>(null)
  const [detailReturnPage, setDetailReturnPage] = useState<'home' | 'categories' | 'reviews' | 'blog'>('home')

  const selectedProduct =
    getCatalogProductById(selectedProductId, customProducts, delistedProductIds) ??
    catalogProducts[0] ??
    baseProducts[0]
  const showMobileNav =
    page !== 'checkout' && page !== 'success' && page !== 'detail' && page !== 'portfolio'

  usePreferencesEffect()

  useEffect(() => {
    void useProductStore.getState().loadFromCloud()
    void useSiteContentStore.getState().loadFromCloud()
    void usePreferencesStore.getState().loadFromCloud()
    void useBlogStore.getState().loadFromCloud()
    void useOrderStore.getState().loadFromCloud()
  }, [])

  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: '淘酥酥 · 跨境电商独立站',
      portfolio: '作品集 · 淘酥酥',
      categories: '商品分类 · 淘酥酥',
      detail: `${selectedProduct.name} · 淘酥酥`,
      checkout: '结账 · 淘酥酥',
      success: '订单确认 · 淘酥酥',
      admin: '运营中心 · 淘酥酥',
      upload: '上传商品 · 淘酥酥',
      'site-content': '站点内容 · 淘酥酥',
      blog: '顾客博客 · 淘酥酥',
      'blog-editor': '博客编辑 · 淘酥酥',
      reviews: '最新评论 · 淘酥酥',
      settings: '设置 · 淘酥酥',
      account: '我的订单 · 淘酥酥',
      'merchant-orders': '订单与物流管理 · 淘酥酥',
    }
    document.title = pageTitles[page]
  }, [page, selectedProduct.name])

  useEffect(() => {
    setShippingMethod(defaultShippingMethod)
  }, [defaultShippingMethod, setShippingMethod])

  useEffect(() => {
    if (autoApplySavedPromo && savedPromoCode) {
      setDiscountCode(savedPromoCode)
    }
  }, [autoApplySavedPromo, savedPromoCode, setDiscountCode])

  function navigate(nextPage: Page) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function switchRole(nextRole: ViewRole) {
    setRole(nextRole)
    if (nextRole === 'merchant') {
      navigate('admin')
      return
    }
    if (merchantOnlyPages.includes(page)) {
      navigate('home')
    }
  }

  function selectProduct(productId: string) {
    setDetailReturnPage(
      page === 'categories' ? 'categories' : page === 'reviews' ? 'reviews' : page === 'blog' ? 'blog' : 'home',
    )
    setSelectedProductId(productId)
    navigate('detail')
  }

  function addProductToCart(product: Product, quantity = 1) {
    addItem(product, quantity)
    if (addToCartBehavior === 'open-drawer') {
      setCartOpen(true)
    }
  }

  function completeOrder(order: Order) {
    useOrderStore.getState().addOrder(order)
    setLastOrder(enrichPlacedOrder(order))
    navigate('success')
  }

  function browseCategory(category: Category) {
    setShopCategory(category)
    navigate('categories')
  }

  function clearCategoryFilters() {
    setShopCategory(null)
    setSearchQuery('')
  }

  function submitSearch() {
    setShopCategory(null)
    navigate('categories')
  }

  function renderPage() {
    if (page === 'categories') {
      return (
        <CategoryPage
          products={catalogProducts}
          selectedCategory={shopCategory}
          searchQuery={searchQuery}
          onBrowseCategory={browseCategory}
          onClearFilters={clearCategoryFilters}
          onNavigateHome={() => navigate('home')}
          onSelectProduct={selectProduct}
          onAddToCart={addProductToCart}
        />
      )
    }
    if (page === 'detail') {
      return (
        <ProductDetailPage
          product={selectedProduct}
          customProducts={customProducts}
          delistedProductIds={delistedProductIds}
          onBack={() => navigate(detailReturnPage)}
          onNavigateHome={() => navigate('home')}
          onBrowseCategory={browseCategory}
          onSelectProduct={selectProduct}
          onAddToCart={addProductToCart}
        />
      )
    }
    if (page === 'checkout') {
      return <CheckoutPage onBackToShop={() => navigate('home')} onOrderComplete={completeOrder} />
    }
    if (page === 'success') {
      return (
        <OrderSuccessPage
          order={lastOrder}
          onBackHome={() => navigate('home')}
          onViewOrders={() => navigate('account')}
        />
      )
    }
    if (page === 'admin') {
      return (
        <AdminDashboardPage
          onNavigateUpload={() => navigate('upload')}
          onNavigateSiteContent={() => navigate('site-content')}
          onNavigateBlog={() => navigate('blog-editor')}
          onNavigateBlogView={() => navigate('blog')}
          onNavigateOrders={() => navigate('merchant-orders')}
          catalogCount={catalogProducts.length}
        />
      )
    }
    if (page === 'upload') {
      return (
        <UploadProductPage
          onNavigateAdmin={() => navigate('admin')}
          onViewProduct={selectProduct}
        />
      )
    }
    if (page === 'site-content') {
      return <SiteContentPage onNavigateAdmin={() => navigate('admin')} />
    }
    if (page === 'blog') {
      return (
        <CustomerBlogPage
          onNavigateEditor={() => navigate('blog-editor')}
          onViewProduct={selectProduct}
        />
      )
    }
    if (page === 'blog-editor') {
      return (
        <BlogEditorPage
          onNavigateBlog={() => navigate('blog')}
          onNavigateAdmin={() => navigate('admin')}
        />
      )
    }
    if (page === 'reviews') {
      return <RecentReviewsPage onViewProduct={selectProduct} />
    }
    if (page === 'settings') {
      return <SettingsPage onNavigateAdmin={() => navigate('admin')} />
    }
    if (page === 'account') {
      return <UserAccountPage onNavigateShop={() => navigate('home')} onSelectProduct={selectProduct} />
    }
    if (page === 'merchant-orders') {
      return <MerchantOrdersPage onNavigateAdmin={() => navigate('admin')} />
    }
    if (page === 'portfolio') {
      return (
        <PortfolioCasePage
          onNavigateDemo={() => navigate('home')}
          onNavigateAdmin={() => navigate('admin')}
          onNavigateReviews={() => navigate('reviews')}
        />
      )
    }

    return (
      <HomePage
        products={catalogProducts}
        onNavigateCategories={() => navigate('categories')}
        onNavigatePortfolio={() => navigate('portfolio')}
        onSelectProduct={selectProduct}
        onAddToCart={addProductToCart}
      />
    )
  }

  return (
    <div className={theme.page}>
      <Header
        currentPage={page}
        role={role}
        products={catalogProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={submitSearch}
        onSelectProduct={selectProduct}
        onNavigate={(nextPage) => navigate(nextPage)}
        onSwitchRole={switchRole}
        onOpenCart={() => setCartOpen(true)}
      />
      <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      {showMobileNav ? (
        <MobileBottomNav
          currentPage={page}
          role={role}
          onNavigate={(nextPage) => navigate(nextPage)}
          onOpenCart={() => setCartOpen(true)}
        />
      ) : null}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          navigate('checkout')
        }}
      />
    </div>
  )
}
