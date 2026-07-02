import { ProductCard } from '../components/product/ProductCard'
import { ProductArtwork } from '../components/product/ProductArtwork'
import { categoryMeta } from '../data/categoryMeta'
import { categories, getProductsByCategory } from '../data/products'
import { heroImageUrl } from '../data/productPhotos'
import { formatCurrency } from '../lib/formatters'
import { theme } from '../lib/themeClasses'
import {
  selectHomepageContent,
  selectStoreConfig,
  selectTrustPoints,
  useSiteContentStore,
} from '../store/siteContentStore'
import type { Product } from '../types'

interface HomePageProps {
  products: Product[]
  onNavigateCategories: () => void
  onSelectProduct: (productId: string) => void
  onAddToCart: (product: Product) => void
}

const trustIcons = ['🔒', '📦', '🛡️', '✓']

const categoryLabels: Record<string, string> = {
  'Summer Comfort': '夏日降温',
  'Pet Cleaning': '宠物清洁',
  'Travel Organization': '旅行收纳',
  'Hair And Beauty': '美妆护理',
  'Home Organization': '家居整理',
  'Fitness & Outdoor': '健身户外',
}

export function HomePage({
  products,
  onNavigateCategories,
  onSelectProduct,
  onAddToCart,
}: HomePageProps) {
  const storeConfig = useSiteContentStore(selectStoreConfig)
  const homepage = useSiteContentStore(selectHomepageContent)
  const trustPoints = useSiteContentStore(selectTrustPoints)
  const bestSellers = products.slice(0, 8)
  const lowestPrice = Math.min(...products.map((product) => product.price))

  return (
    <main>
      <section className={`relative overflow-hidden ${theme.hero}`}>
        <img
          src={heroImageUrl}
          alt="淘酥酥跨境生活方式独立站"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/95 via-stone-950/80 to-stone-950/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.accentSoft}`}>
                  {homepage.heroBadge}
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-white/90">
                  满 ${storeConfig.freeShippingThreshold} 免邮
                </span>
              </div>

              <p className={`mt-5 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm ${theme.heroAccent}`}>
                US Cross-Border Store
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {homepage.heroTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/85 sm:mt-5 sm:text-lg sm:leading-8">
                {homepage.heroSubtitle} 支持 PayPal 与信用卡安全结账，日常好物定价从{' '}
                {formatCurrency(lowestPrice, 'symbol')} 起。
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:max-w-lg">
                {[
                  ['起售价', formatCurrency(lowestPrice, 'symbol')],
                  ['免邮门槛', `$${storeConfig.freeShippingThreshold}`],
                  ['预计送达', '7-15 天'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/60 sm:text-xs">{label}</p>
                    <p className="mt-1 text-sm font-black text-white sm:text-base">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={onNavigateCategories}
                  className={`min-h-12 rounded-full px-7 py-3 text-base sm:py-4 ${theme.primaryBtn}`}
                >
                  {homepage.primaryCta}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProduct(bestSellers[0].id)}
                  className={`min-h-12 rounded-full px-7 py-3 sm:py-4 ${theme.secondaryBtn}`}
                >
                  {homepage.secondaryCta}
                </button>
              </div>

              <p className="mt-5 text-xs leading-6 text-white/65 sm:text-sm">
                {storeConfig.processingDays} 处理 · {storeConfig.deliveryDays} 送达美国 · 支持 PayPal / 信用卡
              </p>
            </div>

            <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:gap-4">
              {bestSellers.slice(0, 4).map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => onSelectProduct(product.id)}
                  className="group overflow-hidden rounded-3xl ring-1 ring-white/10 transition hover:ring-white/30"
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
        </div>
      </section>

      <section className={`border-b ${theme.border} ${theme.surface}`}>
        <div className="home-scroll-row mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8">
          {trustPoints.map((point, index) => (
            <div
              key={point}
              className={`flex min-w-[11rem] shrink-0 snap-start items-start gap-3 rounded-2xl p-4 sm:min-w-0 ${theme.surfaceMuted}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg">
                {trustIcons[index] ?? '✓'}
              </span>
              <p className={`text-sm font-bold leading-6 ${theme.heading}`}>{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Shop by category</p>
            <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>按场景选购</h2>
          </div>
          <button type="button" onClick={onNavigateCategories} className={`font-bold ${theme.accentText}`}>
            查看全部分类 →
          </button>
        </div>

        <div className="home-scroll-row mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {categories.map((category) => {
            const meta = categoryMeta[category]
            return (
              <button
                key={category}
                type="button"
                onClick={onNavigateCategories}
                className={`group min-w-[10.5rem] shrink-0 snap-start overflow-hidden rounded-[1.5rem] text-left transition hover:-translate-y-0.5 sm:min-w-0 ${theme.surface} ${theme.border} border`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={meta.image}
                    alt={category}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.heroAccent}`}>
                      {getProductsByCategory(category).length} 件商品
                    </p>
                    <h3 className="mt-1 text-lg font-black">{categoryLabels[category] ?? category}</h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className={`overflow-hidden rounded-[2rem] p-5 sm:p-8 ${theme.promoBanner}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.accentText}`}>限时活动</p>
              <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>{homepage.promoSectionTitle}</h2>
              <p className={`mt-3 text-sm leading-7 sm:text-base ${theme.muted}`}>
                {homepage.promoSectionSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateCategories}
              className={`shrink-0 rounded-full px-6 py-3 ${theme.primaryBtn}`}
            >
              去逛活动商品
            </button>
          </div>

          <div className="home-scroll-row mt-6 flex gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {homepage.activityDeals.map((deal) => (
              <button
                key={deal.label}
                type="button"
                onClick={onNavigateCategories}
                className={`min-w-[16rem] shrink-0 snap-start rounded-3xl p-5 text-left shadow-sm transition hover:-translate-y-1 sm:min-w-0 ${theme.surface}`}
              >
                <span className={`rounded-full px-3 py-1 text-xs font-black ${theme.accentSoft}`}>{deal.label}</span>
                <h3 className={`mt-4 text-lg font-black sm:text-xl ${theme.heading}`}>{deal.title}</h3>
                <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{deal.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Best sellers</p>
            <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>美国用户热选</h2>
          </div>
          <button type="button" onClick={onNavigateCategories} className={`font-bold ${theme.accentText}`}>
            查看全部 →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
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
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
                <div>
                  <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>
                    {categoryLabels[category] ?? category}
                  </p>
                  <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>
                    {category} 人气精选
                  </h2>
                </div>
                <button type="button" className={`font-bold ${theme.accentText}`} onClick={onNavigateCategories}>
                  浏览分类 →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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

      <section className={`px-4 py-12 sm:px-6 sm:py-14 lg:px-8 ${theme.hero}`}>
        <div className={`mx-auto max-w-7xl overflow-hidden rounded-[2rem] ${theme.footerPanel}`}>
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>
                Cross-border fulfillment
              </p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">为美国用户设计的跨境配送体验</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">
                {storeConfig.processingDays} 处理，预计 {storeConfig.deliveryDays} 送达美国。提供物流追踪（如有）。
                如有破损、缺件或发错货，请联系 {storeConfig.supportEmail}。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {['PayPal / 信用卡安全支付', '满额免标准运费', '30 天售后支持', '保守真实的产品描述'].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold"
                >
                  <span className="text-[var(--hero-accent)]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
