import { ProductCard } from '../components/product/ProductCard'
import { ProductArtwork } from '../components/product/ProductArtwork'
import { categories, getProductsByCategory } from '../data/products'
import { heroCategories, storeConfig, storeTrustPoints } from '../data/store'
import { theme } from '../lib/themeClasses'
import type { Product } from '../types'

interface HomePageProps {
  products: Product[]
  onNavigateCategories: () => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product) => void
}

export function HomePage({
  products,
  onNavigateCategories,
  onSelectProduct,
  onAddToCart,
}: HomePageProps) {
  const bestSellers = products.slice(0, 8)
  const heroImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80'
  const activityDeals = [
    {
      label: '满额免邮',
      title: `订单满 $${storeConfig.freeShippingThreshold} 免标准运费`,
      description: '适合旅行收纳、宠物清洁、夏日降温商品一起凑单。',
    },
    {
      label: '夏日热卖',
      title: 'Cooling 系列限时主推',
      description: '毛巾、挂脖风扇、冰丝毯覆盖通勤、健身和户外场景。',
    },
    {
      label: '新客优惠',
      title: '使用优惠码 SUMMER10',
      description: '首单享 10% off，适合从 TikTok 或 Instagram 首次进站用户。',
    },
  ]

  return (
    <main>
      <section className={`relative overflow-hidden ${theme.hero}`}>
        <img src={heroImage} alt="淘酥酥跨境生活方式独立站" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>
              US Cross-Border Store
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
              淘酥酥 · 跨境好物直邮美国
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 opacity-80">
              {storeConfig.tagline} 支持 PayPal 与信用卡安全结账，日常好物定价从 $14.99 起。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onNavigateCategories}
                className={`rounded-full px-6 py-4 ${theme.secondaryBtn}`}
              >
                浏览商品分类
              </button>
              <button
                type="button"
                onClick={() => onSelectProduct(bestSellers[0].id)}
                className={`rounded-full px-6 py-4 ${theme.secondaryBtn}`}
              >
                View best seller
              </button>
            </div>
            <p className="mt-6 text-sm opacity-70">
              Free standard shipping on orders over ${storeConfig.freeShippingThreshold}. {storeConfig.processingDays}{' '}
              processing · {storeConfig.deliveryDays} US delivery.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {bestSellers.slice(0, 4).map((product) => (
              <button
                type="button"
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className="overflow-hidden rounded-3xl transition hover:opacity-90"
              >
                <ProductArtwork
                  image={product.image}
                  name={product.name}
                  subtitle={product.category}
                  showBottomCaption
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`border-b ${theme.border} ${theme.surface}`}>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {storeTrustPoints.map((point) => (
            <div key={point}>
              <p className={`text-sm font-bold ${theme.heading}`}>{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Shop by category</p>
            <h2 className={`mt-2 text-2xl font-black ${theme.heading}`}>按场景选购</h2>
          </div>
          <button type="button" onClick={onNavigateCategories} className={`font-bold ${theme.accentText}`}>
            查看全部分类
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {heroCategories.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={onNavigateCategories}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${theme.surface} ${theme.border} border hover:border-[var(--accent)]`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className={`overflow-hidden rounded-[2rem] p-6 sm:p-8 ${theme.promoBanner}`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.accentText}`}>限时活动</p>
              <h2 className={`mt-2 text-3xl font-black ${theme.heading}`}>夏日跨境好物节</h2>
              <p className={`mt-3 max-w-2xl leading-7 ${theme.muted}`}>
                把首页活动、凑单免邮和社媒新客优惠放在同一入口，帮助用户更快理解当前促销。
              </p>
            </div>
            <button type="button" onClick={onNavigateCategories} className={`rounded-full px-6 py-3 ${theme.primaryBtn}`}>
              去逛活动商品
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activityDeals.map((deal) => (
              <button
                key={deal.label}
                type="button"
                onClick={onNavigateCategories}
                className={`rounded-3xl p-5 text-left shadow-sm transition hover:-translate-y-1 ${theme.surface}`}
              >
                <span className={`rounded-full px-3 py-1 text-xs font-black ${theme.accentSoft}`}>
                  {deal.label}
                </span>
                <h3 className={`mt-4 text-xl font-black ${theme.heading}`}>{deal.title}</h3>
                <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{deal.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Best sellers</p>
          <h2 className={`mt-2 text-3xl font-black ${theme.heading}`}>Top picks for US shoppers</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              showImageOverlay={false}
            />
          ))}
        </div>
      </section>

      {categories.slice(0, 3).map((category) => {
        const categoryProducts = getProductsByCategory(category).slice(0, 3)
        if (categoryProducts.length === 0) return null

        return (
          <section key={category} className={`border-t ${theme.border} ${theme.surface}`}>
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>{category}</p>
                  <h2 className={`mt-2 text-3xl font-black ${theme.heading}`}>Popular in {category}</h2>
                </div>
                <button type="button" className={`font-bold ${theme.accentText}`} onClick={onNavigateCategories}>
                  Browse category
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    showImageOverlay={false}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      <section className={`px-4 py-14 sm:px-6 lg:px-8 ${theme.hero}`}>
        <div className={`mx-auto max-w-7xl rounded-[2rem] p-8 sm:p-10 ${theme.footerPanel}`}>
          <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Cross-border fulfillment</p>
          <h2 className="mt-3 text-3xl font-black">Built for practical US delivery expectations</h2>
          <p className="mt-4 max-w-3xl leading-7 opacity-80">
            Processing in {storeConfig.processingDays}. Estimated delivery to the United States in{' '}
            {storeConfig.deliveryDays}. Tracking provided when available. Contact {storeConfig.supportEmail} for order
            support, damaged items, or delivery questions.
          </p>
        </div>
      </section>
    </main>
  )
}
