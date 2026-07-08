import { useEffect, useMemo, useState } from 'react'
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
import { useSiteContentStore } from './store/siteContentStore'
import type { Category, Order, Product } from './types'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CategoryPage } from './pages/CategoryPage'
import { RecentReviewsPage } from './pages/RecentReviewsPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SettingsPage } from './pages/SettingsPage'
import { SiteContentPage } from './pages/SiteContentPage'
import { UploadProductPage } from './pages/UploadProductPage'
import { UserAccountPage } from './pages/UserAccountPage'
import { CustomerBlogPage } from './pages/CustomerBlogPage'
import { BlogEditorPage } from './pages/BlogEditorPage'
import { PortfolioCasePage } from './pages/PortfolioCasePage'
import { useBlogStore } from './store/blogStore'

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
  }, [])

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
        products={catalogProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={submitSearch}
        onSelectProduct={selectProduct}
        onNavigate={(nextPage) => navigate(nextPage)}
        onOpenCart={() => setCartOpen(true)}
      />
      {renderPage()}
      {showMobileNav ? (
        <MobileBottomNav
          currentPage={page}
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
