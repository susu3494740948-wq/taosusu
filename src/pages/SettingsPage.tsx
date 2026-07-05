import type { ReactNode } from 'react'
import { useState } from 'react'
import { ThemePicker } from '../components/settings/ThemePicker'
import { storeThemes } from '../data/storeThemes'
import { storeConfig } from '../data/store'
import { buildPreferencesSummary } from '../lib/preferenceLabels'
import { canSyncToCloud } from '../lib/cloudSync'
import { theme } from '../lib/themeClasses'
import { useCartStore } from '../store/cartStore'
import {
  defaultPreferences,
  usePreferencesStore,
  type AddToCartBehavior,
  type CurrencyFormat,
  type FontSize,
  type PreferredPayment,
  type ProductSort,
  type ShippingRegion,
  type StoreLanguage,
  type StoreTheme,
  type ThemeMode,
} from '../store/preferencesStore'
import type { ShippingMethod } from '../types'

type SettingsTab = 'all' | 'appearance' | 'shopping' | 'notifications' | 'privacy' | 'checkout'

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'appearance', label: '外观' },
  { id: 'shopping', label: '购物' },
  { id: 'notifications', label: '通知' },
  { id: 'privacy', label: '隐私' },
  { id: 'checkout', label: '结账' },
]

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl px-4 py-4 ${theme.surfaceMuted}`}>
      <span>
        <span className={`block text-sm font-bold ${theme.heading}`}>{label}</span>
        {description ? <span className={`mt-1 block text-sm leading-6 ${theme.muted}`}>{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}

function OptionGroup<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string
  description?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className={`text-sm font-bold ${theme.heading}`}>{label}</p>
      {description ? <p className={`mt-1 text-sm ${theme.muted}`}>{description}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              value === option.value ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className={`rounded-[2rem] p-6 sm:p-8 ${theme.surface} ${theme.border} border`}>
      <h3 className={`text-xl font-black ${theme.heading}`}>{title}</h3>
      {description ? <p className={`mt-2 text-sm leading-6 ${theme.muted}`}>{description}</p> : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  )
}

export function SettingsPage({ onNavigateAdmin }: { onNavigateAdmin?: () => void }) {
  const preferences = usePreferencesStore()
  const cloudSyncError = usePreferencesStore((state) => state.cloudSyncError)
  const cloudSyncing = usePreferencesStore((state) => state.cloudSyncing)
  const cloudLoaded = usePreferencesStore((state) => state.cloudLoaded)
  const loadFromCloud = usePreferencesStore((state) => state.loadFromCloud)
  const syncToCloudNow = usePreferencesStore((state) => state.syncToCloudNow)
  const cloudSyncEnabled = canSyncToCloud(preferences.githubSyncToken)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const setDiscountCode = useCartStore((state) => state.setDiscountCode)
  const [activeTab, setActiveTab] = useState<SettingsTab>('all')

  function updateDefaultShipping(defaultShippingMethod: ShippingMethod) {
    preferences.updatePreferences({ defaultShippingMethod })
    setShippingMethod(defaultShippingMethod)
  }

  function updateAutoApplyPromo(autoApplySavedPromo: boolean) {
    preferences.updatePreferences({ autoApplySavedPromo })
    if (autoApplySavedPromo && preferences.savedPromoCode) {
      setDiscountCode(preferences.savedPromoCode)
    }
  }

  function updateSavedPromoCode(savedPromoCode: string) {
    preferences.updatePreferences({ savedPromoCode: savedPromoCode.trim().toUpperCase() })
    if (preferences.autoApplySavedPromo) {
      setDiscountCode(savedPromoCode.trim().toUpperCase())
    }
  }

  const showAppearance = activeTab === 'all' || activeTab === 'appearance'
  const showShopping = activeTab === 'all' || activeTab === 'shopping'
  const showNotifications = activeTab === 'all' || activeTab === 'notifications'
  const showPrivacy = activeTab === 'all' || activeTab === 'privacy'
  const showCheckout = activeTab === 'all' || activeTab === 'checkout'

  return (
    <main className={theme.pageMainNarrow}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Preferences</p>
        <h2 className={theme.pageTitle}>{storeConfig.name} · 偏好设置</h2>
        <p className={theme.pageSubtitle}>
          修改主题、购物习惯或优惠码后会自动同步到云端 JSON，本地与线上网站保持一致。请先在「结账」标签配置 GitHub Token。
        </p>
      </section>

      <section className={`mt-6 rounded-2xl border px-5 py-4 ${theme.surface} ${theme.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-bold ${theme.heading}`}>云端自动同步</p>
            <p className={`mt-1 text-sm ${theme.muted}`}>
              {cloudSyncEnabled
                ? cloudSyncing
                  ? '正在同步设置到 GitHub…'
                  : '已启用：每次修改设置会自动写入 public/data/site-settings.json。'
                : '未配置 Token：设置仅保存在本机。请在下方「结账」标签填写 GitHub Token。'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!cloudLoaded}
              onClick={() => void loadFromCloud()}
              className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border} disabled:opacity-50`}
            >
              从云端刷新
            </button>
            <button
              type="button"
              disabled={!cloudSyncEnabled || cloudSyncing}
              onClick={() => void syncToCloudNow()}
              className={`rounded-full px-4 py-2 text-sm font-bold ${theme.primaryBtn} disabled:opacity-50`}
            >
              立即同步
            </button>
          </div>
        </div>
        {cloudSyncError ? <p className="mt-3 text-sm text-red-600">{cloudSyncError}</p> : null}
      </section>

      <div className="home-scroll-row mt-6 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition sm:shrink ${
              activeTab === tab.id ? theme.navActive : `${theme.surface} ${theme.border} border ${theme.muted}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {onNavigateAdmin ? (
          <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-xl font-black ${theme.heading}`}>运营工具</h3>
            <p className={`mt-2 text-sm leading-6 ${theme.muted}`}>在手机上管理商品上架与站点内容。</p>
            <button
              type="button"
              onClick={onNavigateAdmin}
              className={`mt-4 min-h-11 w-full rounded-full px-6 py-3 text-sm font-bold sm:w-auto ${theme.primaryBtn}`}
            >
              进入运营中心 →
            </button>
          </section>
        ) : null}

        {showAppearance ? (
          <SectionCard title="外观与显示" description="店铺主题、明暗模式、字号与动效。">
            <div>
              <p className={`text-sm font-bold ${theme.heading}`}>店铺主题</p>
              <p className={`mt-1 text-sm ${theme.muted}`}>切换整站配色，影响首页、商品页、购物车与结账页。</p>
              <div className="mt-4">
                <ThemePicker
                  value={preferences.storeTheme}
                  themes={storeThemes}
                  onChange={(storeTheme: StoreTheme) => preferences.updatePreferences({ storeTheme })}
                />
              </div>
            </div>
            <OptionGroup
              label="明暗模式"
              value={preferences.theme}
              options={[
                { value: 'light', label: '浅色' },
                { value: 'dark', label: '深色' },
                { value: 'system', label: '跟随系统' },
              ]}
              onChange={(themeMode: ThemeMode) => preferences.updatePreferences({ theme: themeMode })}
            />
            <OptionGroup
              label="界面语言"
              value={preferences.language}
              options={[
                { value: 'bilingual', label: '中英混合' },
                { value: 'zh', label: '中文优先' },
                { value: 'en', label: 'English' },
              ]}
              onChange={(language: StoreLanguage) => preferences.updatePreferences({ language })}
            />
            <OptionGroup
              label="字号大小"
              value={preferences.fontSize}
              options={[
                { value: 'normal', label: '标准' },
                { value: 'large', label: '较大' },
              ]}
              onChange={(fontSize: FontSize) => preferences.updatePreferences({ fontSize })}
            />
            <ToggleField
              label="减少动效"
              description="降低页面动画与 hover 位移，适合对动效敏感的用户。"
              checked={preferences.reducedMotion}
              onChange={(reducedMotion) => preferences.updatePreferences({ reducedMotion })}
            />
          </SectionCard>
        ) : null}

        {showShopping ? (
          <SectionCard title="购物与浏览" description="控制商品列表、价格展示与加购行为。">
            <OptionGroup
              label="默认排序"
              value={preferences.productSort}
              options={[
                { value: 'featured', label: '推荐' },
                { value: 'price-low', label: '价格低→高' },
                { value: 'price-high', label: '价格高→低' },
                { value: 'rating', label: '评分' },
                { value: 'reviews', label: '评论数' },
              ]}
              onChange={(productSort: ProductSort) => preferences.updatePreferences({ productSort })}
            />
            <OptionGroup
              label="货币显示"
              value={preferences.currencyFormat}
              options={[
                { value: 'symbol', label: '$19.99' },
                { value: 'code', label: 'USD 19.99' },
              ]}
              onChange={(currencyFormat: CurrencyFormat) => preferences.updatePreferences({ currencyFormat })}
            />
            <OptionGroup
              label="配送区域偏好"
              value={preferences.shippingRegion}
              options={[
                { value: 'us-all', label: '全美' },
                { value: 'us-west', label: '美国西部' },
                { value: 'us-east', label: '美国东部' },
              ]}
              onChange={(shippingRegion: ShippingRegion) => preferences.updatePreferences({ shippingRegion })}
            />
            <OptionGroup
              label="加购后行为"
              value={preferences.addToCartBehavior}
              options={[
                { value: 'open-drawer', label: '打开购物车' },
                { value: 'stay-on-page', label: '停留当前页' },
              ]}
              onChange={(addToCartBehavior: AddToCartBehavior) => preferences.updatePreferences({ addToCartBehavior })}
            />
            <ToggleField
              label="显示划线价"
              checked={preferences.showCompareAtPrice}
              onChange={(showCompareAtPrice) => preferences.updatePreferences({ showCompareAtPrice })}
            />
            <ToggleField
              label="紧凑商品列表"
              checked={preferences.compactCatalog}
              onChange={(compactCatalog) => preferences.updatePreferences({ compactCatalog })}
            />
            <ToggleField
              label="显示星级评分"
              checked={preferences.showReviewStars}
              onChange={(showReviewStars) => preferences.updatePreferences({ showReviewStars })}
            />
            <ToggleField
              label="显示缺货商品"
              checked={preferences.showOutOfStock}
              onChange={(showOutOfStock) => preferences.updatePreferences({ showOutOfStock })}
            />
            <ToggleField
              label="低库存提醒标签"
              checked={preferences.showLowStockBadge}
              onChange={(showLowStockBadge) => preferences.updatePreferences({ showLowStockBadge })}
            />
          </SectionCard>
        ) : null}

        {showNotifications ? (
          <SectionCard title="通知偏好" description="选择希望接收的订单、物流与营销提醒。">
            <ToggleField
              label="订单邮件通知"
              description={`发货与物流更新；客服 ${storeConfig.supportEmail}`}
              checked={preferences.orderEmailUpdates}
              onChange={(orderEmailUpdates) => preferences.updatePreferences({ orderEmailUpdates })}
            />
            <ToggleField
              label="短信物流提醒"
              description="关键节点通过短信推送（演示偏好，需结账时填写手机号）。"
              checked={preferences.smsShippingUpdates}
              onChange={(smsShippingUpdates) => preferences.updatePreferences({ smsShippingUpdates })}
            />
            <ToggleField
              label="降价提醒"
              description="收藏或浏览过的 SKU 降价时通知你。"
              checked={preferences.priceDropAlerts}
              onChange={(priceDropAlerts) => preferences.updatePreferences({ priceDropAlerts })}
            />
            <ToggleField
              label="补货提醒"
              description="缺货商品重新上架时通知你。"
              checked={preferences.backInStockAlerts}
              onChange={(backInStockAlerts) => preferences.updatePreferences({ backInStockAlerts })}
            />
            <ToggleField
              label="活动与上新邮件"
              checked={preferences.marketingEmails}
              onChange={(marketingEmails) => preferences.updatePreferences({ marketingEmails })}
            />
          </SectionCard>
        ) : null}

        {showPrivacy ? (
          <SectionCard title="隐私与个性化" description="控制数据使用与推荐体验。">
            <ToggleField
              label="保存浏览记录"
              description="用于最近浏览、继续选购体验。"
              checked={preferences.saveBrowsingHistory}
              onChange={(saveBrowsingHistory) => preferences.updatePreferences({ saveBrowsingHistory })}
            />
            <ToggleField
              label="个性化推荐"
              description="根据浏览与购买偏好展示相关商品。"
              checked={preferences.personalizedRecommendations}
              onChange={(personalizedRecommendations) => preferences.updatePreferences({ personalizedRecommendations })}
            />
            <ToggleField
              label="分析 Cookie"
              description="帮助优化页面性能与转化漏斗（演示开关）。"
              checked={preferences.analyticsCookies}
              onChange={(analyticsCookies) => preferences.updatePreferences({ analyticsCookies })}
            />
          </SectionCard>
        ) : null}

        {showCheckout ? (
          <SectionCard title="结账与支付" description="默认物流、优惠码与支付方式偏好。">
            <OptionGroup
              label="默认物流方式"
              value={preferences.defaultShippingMethod}
              options={[
                { value: 'standard', label: '标准配送' },
                { value: 'express', label: '加急配送' },
              ]}
              onChange={updateDefaultShipping}
            />
            <OptionGroup
              label="首选支付方式"
              value={preferences.preferredPayment}
              options={[
                { value: 'paypal', label: 'PayPal' },
                { value: 'card', label: '信用卡' },
                { value: 'apple-pay', label: 'Apple Pay' },
              ]}
              onChange={(preferredPayment: PreferredPayment) => preferences.updatePreferences({ preferredPayment })}
            />
            <ToggleField
              label="记住结账信息"
              description="在本机保存姓名、地址等字段，下次更快结账。"
              checked={preferences.rememberCheckoutInfo}
              onChange={(rememberCheckoutInfo) => preferences.updatePreferences({ rememberCheckoutInfo })}
            />
            <ToggleField
              label="自动应用优惠码"
              checked={preferences.autoApplySavedPromo}
              onChange={updateAutoApplyPromo}
            />
            <label className="block rounded-2xl bg-stone-100 px-4 py-4 dark:bg-stone-900">
              <span className="text-sm font-bold text-stone-950 dark:text-stone-50">常用优惠码</span>
              <input
                value={preferences.savedPromoCode}
                onChange={(event) => updateSavedPromoCode(event.target.value)}
                placeholder="例如 SUMMER10"
                className="mt-3 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-950 dark:border-stone-700 dark:bg-stone-950"
              />
            </label>
            <label className="block rounded-2xl bg-stone-100 px-4 py-4 dark:bg-stone-900">
              <span className="text-sm font-bold text-stone-950 dark:text-stone-50">GitHub 云端同步 Token</span>
              <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-300">
                创建 Personal Access Token（需 repo 写权限）。配置后，设置、商品与站点内容会在每次修改时自动同步到
                public/data/ 下的 JSON 文件，线上网站随即更新。Token 仅保存在本机浏览器。
              </p>
              <input
                type="password"
                value={preferences.githubSyncToken}
                onChange={(event) => preferences.updatePreferences({ githubSyncToken: event.target.value.trim() })}
                placeholder="ghp_..."
                autoComplete="off"
                className="mt-3 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-950 dark:border-stone-700 dark:bg-stone-950"
              />
            </label>
          </SectionCard>
        ) : null}

        <section className={`rounded-[2rem] p-6 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>当前偏好摘要</h3>
          <ul className={`mt-4 space-y-2 text-sm leading-6 ${theme.muted}`}>
            {buildPreferencesSummary(preferences).map((line) => (
              <li key={line} className={`rounded-2xl px-4 py-3 ${theme.surfaceMuted}`}>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => preferences.resetPreferences()}
              className={`rounded-full px-5 py-3 text-sm font-bold ${theme.secondaryBtn}`}
            >
              恢复默认设置
            </button>
          </div>
          <p className={`mt-4 text-xs ${theme.muted}`}>
            默认主题 {defaultPreferences.storeTheme} · 默认优惠码 {defaultPreferences.savedPromoCode}
          </p>
        </section>
      </div>
    </main>
  )
}
