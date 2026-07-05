import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { canSyncToCloud } from '../lib/cloudSync'
import { theme } from '../lib/themeClasses'
import type { SiteContent } from '../data/siteContentDefaults'
import { usePreferencesStore } from '../store/preferencesStore'
import { useSiteContentStore } from '../store/siteContentStore'

interface SiteContentPageProps {
  onNavigateAdmin: () => void
}

function linesToList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function listToLines(values: string[]): string {
  return values.join('\n')
}

export function SiteContentPage({ onNavigateAdmin }: SiteContentPageProps) {
  const content = useSiteContentStore((state) => state.content)
  const saveContent = useSiteContentStore((state) => state.saveContent)
  const loadFromCloud = useSiteContentStore((state) => state.loadFromCloud)
  const cloudSyncError = useSiteContentStore((state) => state.cloudSyncError)
  const cloudLoaded = useSiteContentStore((state) => state.cloudLoaded)
  const githubSyncToken = usePreferencesStore((state) => state.githubSyncToken)

  const [draft, setDraft] = useState<SiteContent>(content)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const cloudSyncEnabled = canSyncToCloud(githubSyncToken)
  const fieldClass = `mt-2 rounded-2xl px-4 py-3 ${theme.input}`

  const activityDeals = useMemo(() => draft.homepage.activityDeals.slice(0, 3), [draft.homepage.activityDeals])
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content),
    [draft, content],
  )

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined
    const timer = setTimeout(() => {
      void (async () => {
        setIsSaving(true)
        try {
          await saveContent(draft)
          setSuccessMessage(
            cloudSyncEnabled
              ? '站点内容已自动同步到云端。'
              : '站点内容已保存到本机。请配置 GitHub Token 以同步到线上。',
          )
        } finally {
          setIsSaving(false)
        }
      })()
    }, 1200)
    return () => clearTimeout(timer)
  }, [draft, hasUnsavedChanges, cloudSyncEnabled, saveContent])

  function updateDraft(next: Partial<SiteContent>) {
    setDraft((current) => ({ ...current, ...next }))
    setSuccessMessage(null)
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadFromCloud()
    setDraft(useSiteContentStore.getState().content)
    setIsRefreshing(false)
    setSuccessMessage('已从云端拉取最新站点内容。')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    try {
      await saveContent(draft)
      setDraft(useSiteContentStore.getState().content)
      setSuccessMessage(
        cloudSyncEnabled
          ? '站点内容已保存并同步到云端，本地与线上将保持一致。'
          : '站点内容已保存到本机。请在设置中配置 GitHub Token 以同步到线上。',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className={theme.pageMainNarrow}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Site Content</p>
        <h2 className={theme.pageTitle}>编辑站点内容</h2>
        <p className={theme.pageSubtitle}>
          修改店名、首页文案、活动卡片与优惠码。内容会在停止输入约 1 秒后自动同步到云端 JSON。
        </p>
        <button
          type="button"
          onClick={onNavigateAdmin}
          className={`mt-6 rounded-full px-5 py-3 text-sm ${theme.secondaryBtn}`}
        >
          ← 返回运营中心
        </button>
      </section>

      <section className={`mt-6 rounded-2xl border px-5 py-4 ${theme.surface} ${theme.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-bold ${theme.heading}`}>云端同步</p>
            <p className={`mt-1 text-sm ${theme.muted}`}>
              {cloudSyncEnabled
                ? '已启用：保存后会写入 GitHub 仓库 public/data/site-content.json。'
                : '未配置 Token：仅本机生效。请到「设置 → 结账」填写 GitHub Token。'}
            </p>
          </div>
          <button
            type="button"
            disabled={isRefreshing || !cloudLoaded}
            onClick={() => void handleRefresh()}
            className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border} disabled:opacity-50`}
          >
            {isRefreshing ? '刷新中…' : '从云端刷新'}
          </button>
        </div>
        {cloudSyncError ? <p className="mt-3 text-sm text-red-600">{cloudSyncError}</p> : null}
      </section>

      {successMessage ? (
        <div className={`mt-6 rounded-2xl border px-5 py-4 ${theme.accentSoft}`}>
          <p className={`font-bold ${theme.accentText}`}>{successMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>店铺信息</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="store-name">
                店名
              </label>
              <input
                id="store-name"
                value={draft.store.name}
                onChange={(event) =>
                  updateDraft({ store: { ...draft.store, name: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="store-email">
                客服邮箱
              </label>
              <input
                id="store-email"
                value={draft.store.supportEmail}
                onChange={(event) =>
                  updateDraft({ store: { ...draft.store, supportEmail: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="store-tagline">
                店铺标语
              </label>
              <textarea
                id="store-tagline"
                rows={2}
                value={draft.store.tagline}
                onChange={(event) =>
                  updateDraft({ store: { ...draft.store, tagline: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="free-shipping">
                免邮门槛 (USD)
              </label>
              <input
                id="free-shipping"
                inputMode="numeric"
                value={draft.store.freeShippingThreshold}
                onChange={(event) =>
                  updateDraft({
                    store: {
                      ...draft.store,
                      freeShippingThreshold: Number(event.target.value) || 0,
                    },
                  })
                }
                className={fieldClass}
              />
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>首页横幅</h3>
          <div className="mt-6 grid gap-5">
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="hero-badge">
                角标文案
              </label>
              <input
                id="hero-badge"
                value={draft.homepage.heroBadge}
                onChange={(event) =>
                  updateDraft({ homepage: { ...draft.homepage, heroBadge: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="hero-title">
                主标题
              </label>
              <input
                id="hero-title"
                value={draft.homepage.heroTitle}
                onChange={(event) =>
                  updateDraft({ homepage: { ...draft.homepage, heroTitle: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="hero-subtitle">
                副标题
              </label>
              <textarea
                id="hero-subtitle"
                rows={3}
                value={draft.homepage.heroSubtitle}
                onChange={(event) =>
                  updateDraft({ homepage: { ...draft.homepage, heroSubtitle: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={`text-sm font-bold ${theme.heading}`} htmlFor="primary-cta">
                  主按钮
                </label>
                <input
                  id="primary-cta"
                  value={draft.homepage.primaryCta}
                  onChange={(event) =>
                    updateDraft({ homepage: { ...draft.homepage, primaryCta: event.target.value } })
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={`text-sm font-bold ${theme.heading}`} htmlFor="secondary-cta">
                  次按钮
                </label>
                <input
                  id="secondary-cta"
                  value={draft.homepage.secondaryCta}
                  onChange={(event) =>
                    updateDraft({ homepage: { ...draft.homepage, secondaryCta: event.target.value } })
                  }
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>活动区与信任条</h3>
          <div className="mt-6 grid gap-5">
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="promo-title">
                活动区标题
              </label>
              <input
                id="promo-title"
                value={draft.homepage.promoSectionTitle}
                onChange={(event) =>
                  updateDraft({ homepage: { ...draft.homepage, promoSectionTitle: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="promo-subtitle">
                活动区说明
              </label>
              <textarea
                id="promo-subtitle"
                rows={2}
                value={draft.homepage.promoSectionSubtitle}
                onChange={(event) =>
                  updateDraft({ homepage: { ...draft.homepage, promoSectionSubtitle: event.target.value } })
                }
                className={fieldClass}
              />
            </div>
            {activityDeals.map((deal, index) => (
              <div key={deal.label} className={`rounded-2xl p-4 ${theme.surfaceMuted}`}>
                <p className={`text-sm font-bold ${theme.heading}`}>活动卡片 {index + 1}</p>
                <input
                  value={deal.label}
                  onChange={(event) => {
                    const nextDeals = [...draft.homepage.activityDeals]
                    nextDeals[index] = { ...nextDeals[index], label: event.target.value }
                    updateDraft({ homepage: { ...draft.homepage, activityDeals: nextDeals } })
                  }}
                  className={fieldClass}
                  placeholder="标签"
                />
                <input
                  value={deal.title}
                  onChange={(event) => {
                    const nextDeals = [...draft.homepage.activityDeals]
                    nextDeals[index] = { ...nextDeals[index], title: event.target.value }
                    updateDraft({ homepage: { ...draft.homepage, activityDeals: nextDeals } })
                  }}
                  className={fieldClass}
                  placeholder="标题"
                />
                <textarea
                  rows={2}
                  value={deal.description}
                  onChange={(event) => {
                    const nextDeals = [...draft.homepage.activityDeals]
                    nextDeals[index] = { ...nextDeals[index], description: event.target.value }
                    updateDraft({ homepage: { ...draft.homepage, activityDeals: nextDeals } })
                  }}
                  className={fieldClass}
                  placeholder="说明"
                />
              </div>
            ))}
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="trust-points">
                信任条（每行一条）
              </label>
              <textarea
                id="trust-points"
                rows={4}
                value={listToLines(draft.trustPoints)}
                onChange={(event) => updateDraft({ trustPoints: linesToList(event.target.value) })}
                className={fieldClass}
              />
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>优惠码</h3>
          <div className="mt-6 space-y-4">
            {draft.promos.map((promo, index) => (
              <div key={`${promo.code}-${index}`} className={`rounded-2xl p-4 ${theme.surfaceMuted}`}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    value={promo.code}
                    onChange={(event) => {
                      const nextPromos = [...draft.promos]
                      nextPromos[index] = { ...nextPromos[index], code: event.target.value.toUpperCase() }
                      updateDraft({ promos: nextPromos })
                    }}
                    className={fieldClass}
                    placeholder="优惠码"
                  />
                  <select
                    value={promo.type}
                    onChange={(event) => {
                      const nextPromos = [...draft.promos]
                      nextPromos[index] = {
                        ...nextPromos[index],
                        type: event.target.value as typeof promo.type,
                      }
                      updateDraft({ promos: nextPromos })
                    }}
                    className={fieldClass}
                  >
                    <option value="percent">百分比折扣</option>
                    <option value="free-shipping">免标准运费</option>
                  </select>
                  {promo.type === 'percent' ? (
                    <input
                      inputMode="numeric"
                      value={promo.value ?? 0}
                      onChange={(event) => {
                        const nextPromos = [...draft.promos]
                        nextPromos[index] = {
                          ...nextPromos[index],
                          value: Number(event.target.value) || 0,
                        }
                        updateDraft({ promos: nextPromos })
                      }}
                      className={fieldClass}
                      placeholder="折扣 %"
                    />
                  ) : (
                    <input value={promo.message} readOnly className={`${fieldClass} opacity-60`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSaving}
          className={`min-h-12 rounded-full px-8 py-3 ${theme.primaryBtn} disabled:opacity-50`}
        >
          {isSaving ? '保存中…' : '保存并同步'}
        </button>
      </form>
    </main>
  )
}
