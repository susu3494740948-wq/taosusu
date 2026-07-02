import { useEffect, useState } from 'react'
import { CartDrawer } from './components/cart/CartDrawer'
import { Header } from './components/layout/Header'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { products, getProductById } from './data/products'
import { usePreferencesEffect } from './hooks/usePreferencesEffect'
import { theme } from './lib/themeClasses'
import { enrichPlacedOrder } from './lib/orderLogistics'
import { useCartStore } from './store/cartStore'
import { useOrderStore } from './store/orderStore'
import { usePreferencesStore } from './store/preferencesStore'
import type { Category, Order, Product } from './types'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CategoryPage } from './pages/CategoryPage'
import { RecentReviewsPage } from './pages/RecentReviewsPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SettingsPage } from './pages/SettingsPage'
import { UserAccountPage } from './pages/UserAccountPage'

type Page = 'home' | 'categories' | 'detail' | 'checkout' | 'success' | 'admin' | 'reviews' | 'settings' | 'account'

export default function App() {
  const addItem = useCartStore((state) => state.addItem)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const setDiscountCode = useCartStore((state) => state.setDiscountCode)
  const defaultShippingMethod = usePreferencesStore((state) => state.defaultShippingMethod)
  const addToCartBehavior = usePreferencesStore((state) => state.addToCartBehavior)
  const autoApplySavedPromo = usePreferencesStore((state) => state.autoApplySavedPromo)
  const savedPromoCode = usePreferencesStore((state) => state.savedPromoCode)
  const [page, setPage] = useState<Page>('home')
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [shopCategory, setShopCategory] = useState<Category | null>(null)
  const [detailReturnPage, setDetailReturnPage] = useState<'home' | 'categories' | 'reviews'>('home')

  const selectedProduct = getProductById(selectedProductId) ?? products[0]
  const showSearch = page !== 'admin' && page !== 'reviews' && page !== 'settings' && page !== 'account'
  const showMobileNav = page !== 'checkout' && page !== 'success'

  usePreferencesEffect()

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
    setDetailReturnPage(page === 'categories' ? 'categories' : page === 'reviews' ? 'reviews' : 'home')
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
          products={products}
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
    if (page === 'admin') return <AdminDashboardPage />
    if (page === 'reviews') {
      return <RecentReviewsPage onViewProduct={selectProduct} />
    }
    if (page === 'settings') return <SettingsPage />
    if (page === 'account') {
      return <UserAccountPage onNavigateShop={() => navigate('home')} onSelectProduct={selectProduct} />
    }

    return (
      <HomePage
        products={products}
        onNavigateCategories={() => navigate('categories')}
        onSelectProduct={selectProduct}
        onAddToCart={addProductToCart}
      />
    )
  }

  return (
    <div className={theme.page}>
      <Header
        currentPage={page}
        showSearch={showSearch}
        products={products}
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
