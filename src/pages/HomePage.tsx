import { useMemo } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { ProductArtwork } from '../components/product/ProductArtwork'
import { categoryMeta } from '../data/categoryMeta'
import { categories } from '../data/products'
import { baseProducts } from '../lib/catalog'
import { heroImageUrl } from '../data/productPhotos'
import { formatCurrency, getDiscountPercent } from '../lib/formatters'
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
  onNavigatePortfolio: () => void
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
  onNavigatePortfolio,
  onSelectProduct,
  onAddToCart,
}: HomePageProps) {
  const storeConfig = useSiteContentStore(selectStoreConfig)
  const homepage = useSiteContentStore(selectHomepageContent)
  const trustPoints = useSiteContentStore(selectTrustPoints)
  const baseProductIds = useMemo(() => new Set(baseProducts.map((product) => product.id)), [])
  const newListings = useMemo(
    () => products.filter((product) => !baseProductIds.has(product.id)),
    [products, baseProductIds],
  )
  const bestSellers = products.slice(0, 8)
  const featuredProduct = bestSellers[0]
  const lowestPrice = Math.min(...products.map((product) => product.price))

  function renderHeroProductTile(product: Product) {
    const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)

    return (
      <button
        type="button"
        key={product.id}
        onClick={() => onSelectProduct(product.id)}
        className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-white/30 active:scale-[0.98] sm:rounded-3xl"
      >
        <ProductArtwork
          image={product.image}
          name={product.name}
          customImageUrl={product.customImageUrl}
          subtitle={product.category}
          showBottomCaption
        />
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          {discountPercent ? (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">
              -{discountPercent}%
            </span>
          ) : null}
          <span className="rounded-full bg-stone-950/75 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-sm">
            {formatCurrency(product.price, 'symbol')}
          </span>
        </div>
      </button>
    )
  }

  return (
    <main>
      <section className="border-b border-emerald-100 bg-emerald-50/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <p className={`min-w-0 truncate text-xs font-semibold sm:text-sm ${theme.muted}`}>
            <span className="font-black text-emerald-800">运营助理作品集</span>
            <span className="hidden sm:inline"> · TikTok Shop / Shopee / Temu / Lazada</span>
          </p>
          <button
            type="button"
            onClick={onNavigatePortfolio}
            className={`shrink-0 rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-black sm:text-sm ${theme.secondaryBtn}`}
          >
            作品集 →
          </button>
        </div>
      </section>

      <section className={`relative overflow-hidden ${theme.hero}`}>
        <img
          src={heroImageUrl}
          alt="淘酥酥跨境生活方式独立站"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/95 via-stone-950/80 to-stone-950/50" />
        <div className="relative mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:text-xs ${theme.accentSoft}`}>
                  {homepage.heroBadge}
                </span>
                <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-bold text-white/90 sm:px-3 sm:text-xs">
                  满 ${storeConfig.freeShippingThreshold} 免邮
                </span>
              </div>

              <p className={`mt-4 text-[11px] font-bold uppercase tracking-[0.2em] sm:mt-5 sm:text-sm ${theme.heroAccent}`}>
                US Cross-Border Store
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight sm:mt-3 sm:text-4xl lg:text-6xl">
                {homepage.heroTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/85 sm:mt-5 sm:text-lg sm:leading-8">
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

              <div className="home-scroll-row mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={onNavigateCategories}
                    className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/20"
                  >
                    {categoryLabels[category] ?? category}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-xs leading-6 text-white/65 sm:text-sm">
                {storeConfig.processingDays} 处理 · {storeConfig.deliveryDays} 送达美国 · 支持 PayPal / 信用卡
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {bestSellers.slice(0, 2).map((product) => renderHeroProductTile(product))}
            </div>

            <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:gap-4">
              {bestSellers.slice(0, 4).map((product) => renderHeroProductTile(product))}
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
                      {products.filter((product) => product.category === category).length} 件商品
                    </p>
                    <h3 className="mt-1 text-lg font-black">{categoryLabels[category] ?? category}</h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {featuredProduct ? (
        <section className={`border-b ${theme.border} ${theme.surface}`}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Featured pick</p>
                <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>本周主推</h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectProduct(featuredProduct.id)}
                className={`font-bold ${theme.accentText}`}
              >
                查看详情 →
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <button
                type="button"
                onClick={() => onSelectProduct(featuredProduct.id)}
                className="group overflow-hidden rounded-[2rem] text-left ring-1 ring-stone-200 transition hover:ring-[var(--accent)]"
              >
                <ProductArtwork
                  image={featuredProduct.image}
                  name={featuredProduct.name}
                  customImageUrl={featuredProduct.customImageUrl}
                  showOverlay
                />
              </button>
              <div className="flex flex-col justify-center">
                <ProductCard
                  product={featuredProduct}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  variant="featured"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

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

      {newListings.length > 0 ? (
        <section className={`border-t ${theme.border} ${theme.surface}`}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>New listings</p>
                <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${theme.heading}`}>最新上架</h2>
              </div>
              <button type="button" onClick={onNavigateCategories} className={`font-bold ${theme.accentText}`}>
                查看全部 →
              </button>
            </div>
            <div className="grid mobile-card-grid">
              {newListings.slice(0, 4).map((product) => (
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
      ) : null}

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
        <div className="grid mobile-card-grid lg:grid-cols-4">
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
        const categoryProducts = products.filter((product) => product.category === category).slice(0, 3)
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
              <div className="grid mobile-card-grid lg:grid-cols-3">
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
