import { useMemo, useState, type FormEvent } from 'react'
import { categories } from '../data/products'
import { getProductPhotoUrl } from '../data/productPhotos'
import { storeConfig } from '../data/store'
import { formatCurrency } from '../lib/formatters'
import {
  buildProductFromForm,
  defaultProductFormValues,
  readImageFileAsDataUrl,
  validateProductForm,
  type ProductFormValues,
} from '../lib/productForm'
import { compressImageFile } from '../lib/compressImage'
import { canSyncToCloud } from '../lib/cloudCatalog'
import { theme } from '../lib/themeClasses'
import { useProductStore } from '../store/productStore'
import { usePreferencesStore } from '../store/preferencesStore'

interface UploadProductPageProps {
  onNavigateAdmin: () => void
  onViewProduct: (productId: string) => void
}

export function UploadProductPage({ onNavigateAdmin, onViewProduct }: UploadProductPageProps) {
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)
  const customProducts = useProductStore((state) => state.customProducts)
  const addProduct = useProductStore((state) => state.addProduct)
  const removeProduct = useProductStore((state) => state.removeProduct)
  const loadFromCloud = useProductStore((state) => state.loadFromCloud)
  const cloudSyncError = useProductStore((state) => state.cloudSyncError)
  const cloudLoaded = useProductStore((state) => state.cloudLoaded)
  const githubSyncToken = usePreferencesStore((state) => state.githubSyncToken)

  const [values, setValues] = useState<ProductFormValues>(defaultProductFormValues)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<ReturnType<typeof validateProductForm>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshingCloud, setIsRefreshingCloud] = useState(false)
  const cloudSyncEnabled = canSyncToCloud(githubSyncToken)

  const fieldClass = `mt-2 rounded-2xl px-4 py-3 ${theme.input}`

  const recentUploads = useMemo(() => customProducts.slice(0, 6), [customProducts])

  function updateField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, image: undefined }))
    setSuccessMessage(null)
  }

  function handleImageChange(file: File | null) {
    setImageFile(file)
    setErrors((current) => ({ ...current, image: undefined }))
    setSuccessMessage(null)

    if (!file) {
      setImagePreview(null)
      return
    }

    void readImageFileAsDataUrl(file)
      .then(setImagePreview)
      .catch(() => setErrors((current) => ({ ...current, image: '无法预览图片，请换一张试试' })))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateProductForm(values, imageFile)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const customImageUrl = imageFile ? await compressImageFile(imageFile) : undefined
      const product = buildProductFromForm(values, customImageUrl)
      await addProduct(product)
      setSuccessMessage(
        cloudSyncEnabled
          ? `「${product.name}」已上架并同步到云端，所有访客可见。`
          : `「${product.name}」已上架。请在设置中配置 GitHub Token 以同步给所有访客。`,
      )
      setValues(defaultProductFormValues)
      setImageFile(null)
      setImagePreview(null)
    } catch {
      setErrors({ image: '图片上传失败，请重试' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={theme.pageMainNarrow}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Product Upload</p>
        <h2 className={theme.pageTitle}>上传商品</h2>
        <p className={theme.pageSubtitle}>
          填写商品信息并上传图片。配置 GitHub Token 后，新商品会同步到云端 JSON，所有访客在
          {storeConfig.name} 前台都能看到；未配置时仅保存在本机浏览器。
        </p>
        <button
          type="button"
          onClick={onNavigateAdmin}
          className={`mt-6 rounded-full px-5 py-3 text-sm ${theme.secondaryBtn}`}
        >
          ← 返回运营中心
        </button>
      </section>

      {successMessage ? (
        <div className={`mt-6 rounded-2xl border px-5 py-4 ${theme.accentSoft}`}>
          <p className={`font-bold ${theme.accentText}`}>{successMessage}</p>
        </div>
      ) : null}

      <section className={`mt-6 rounded-2xl border px-5 py-4 ${theme.surface} ${theme.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-bold ${theme.heading}`}>云端同步</p>
            <p className={`mt-1 text-sm ${theme.muted}`}>
              {cloudSyncEnabled
                ? '已启用：上传/删除会自动写入 GitHub 仓库。'
                : '未配置 Token：商品仅在本机可见。请到「设置 → 结账」填写 GitHub Token。'}
            </p>
          </div>
          <button
            type="button"
            disabled={isRefreshingCloud || !cloudLoaded}
            onClick={() => {
              setIsRefreshingCloud(true)
              void loadFromCloud().finally(() => setIsRefreshingCloud(false))
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border} disabled:opacity-50`}
          >
            {isRefreshingCloud ? '刷新中…' : '从云端刷新'}
          </button>
        </div>
        {cloudSyncError ? <p className="mt-3 text-sm text-red-600">{cloudSyncError}</p> : null}
      </section>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>基础信息</h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-name">
                商品名称 *
              </label>
              <input
                id="product-name"
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                className={fieldClass}
                placeholder="例如：Portable Neck Fan Pro"
              />
              {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-category">
                分类 *
              </label>
              <select
                id="product-category"
                value={values.category}
                onChange={(event) => updateField('category', event.target.value as ProductFormValues['category'])}
                className={fieldClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-badge">
                角标
              </label>
              <input
                id="product-badge"
                value={values.badge}
                onChange={(event) => updateField('badge', event.target.value)}
                className={fieldClass}
                placeholder="New Arrival / Best Seller"
              />
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-price">
                售价 (USD) *
              </label>
              <input
                id="product-price"
                inputMode="decimal"
                value={values.price}
                onChange={(event) => updateField('price', event.target.value)}
                className={fieldClass}
                placeholder="19.99"
              />
              {errors.price ? <p className="mt-2 text-sm text-red-600">{errors.price}</p> : null}
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-compare-price">
                划线价 (USD)
              </label>
              <input
                id="product-compare-price"
                inputMode="decimal"
                value={values.compareAtPrice}
                onChange={(event) => updateField('compareAtPrice', event.target.value)}
                className={fieldClass}
                placeholder="29.99"
              />
              {errors.compareAtPrice ? <p className="mt-2 text-sm text-red-600">{errors.compareAtPrice}</p> : null}
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-stock">
                库存 *
              </label>
              <input
                id="product-stock"
                inputMode="numeric"
                value={values.stock}
                onChange={(event) => updateField('stock', event.target.value)}
                className={fieldClass}
                placeholder="20"
              />
              {errors.stock ? <p className="mt-2 text-sm text-red-600">{errors.stock}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-description">
                商品描述 *
              </label>
              <textarea
                id="product-description"
                rows={3}
                value={values.description}
                onChange={(event) => updateField('description', event.target.value)}
                className={fieldClass}
                placeholder="一句话介绍商品卖点与使用场景"
              />
              {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-tags">
                标签
              </label>
              <input
                id="product-tags"
                value={values.tags}
                onChange={(event) => updateField('tags', event.target.value)}
                className={fieldClass}
                placeholder="summer, travel, outdoor（逗号分隔）"
              />
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>详情与配送</h3>

          <div className="mt-6 grid gap-5">
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-benefits">
                核心卖点 * <span className={`font-normal ${theme.muted}`}>（每行一条）</span>
              </label>
              <textarea
                id="product-benefits"
                rows={4}
                value={values.benefits}
                onChange={(event) => updateField('benefits', event.target.value)}
                className={fieldClass}
                placeholder={'Hands-free neck wear\nUSB-C rechargeable\n3 speed modes'}
              />
              {errors.benefits ? <p className="mt-2 text-sm text-red-600">{errors.benefits}</p> : null}
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-details">
                规格参数 * <span className={`font-normal ${theme.muted}`}>（每行一条）</span>
              </label>
              <textarea
                id="product-details"
                rows={4}
                value={values.details}
                onChange={(event) => updateField('details', event.target.value)}
                className={fieldClass}
                placeholder={'Bladeless neck design\nUSB-C cable included\nQuiet airflow'}
              />
              {errors.details ? <p className="mt-2 text-sm text-red-600">{errors.details}</p> : null}
            </div>

            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="product-shipping">
                配送说明
              </label>
              <textarea
                id="product-shipping"
                rows={2}
                value={values.shippingNote}
                onChange={(event) => updateField('shippingNote', event.target.value)}
                className={fieldClass}
              />
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>商品图片</h3>
          <p className={`mt-2 text-sm ${theme.muted}`}>支持 JPG / PNG / WebP。不上传则使用默认占位图。</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_12rem] sm:items-start">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
              className={`block w-full text-sm ${theme.muted}`}
            />
            <div className={`overflow-hidden rounded-3xl ${theme.surfaceMuted}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="商品图片预览" className="aspect-square w-full object-cover" />
              ) : (
                <div className={`flex aspect-square items-center justify-center p-4 text-center text-sm ${theme.muted}`}>
                  预览区域
                </div>
              )}
            </div>
          </div>
          {errors.image ? <p className="mt-2 text-sm text-red-600">{errors.image}</p> : null}
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`min-h-12 rounded-full px-8 py-3 ${theme.primaryBtn} disabled:opacity-50`}
          >
            {isSubmitting ? '上传中…' : '发布商品'}
          </button>
          <button
            type="button"
            onClick={() => {
              setValues(defaultProductFormValues)
              setImageFile(null)
              setImagePreview(null)
              setErrors({})
              setSuccessMessage(null)
            }}
            className={`min-h-12 rounded-full px-8 py-3 ${theme.secondaryBtn} border ${theme.border}`}
          >
            清空表单
          </button>
        </div>
      </form>

      {customProducts.length > 0 ? (
        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.muted}`}>Uploaded SKUs</p>
              <h3 className={`mt-2 text-2xl font-black ${theme.heading}`}>已上传商品 ({customProducts.length})</h3>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {recentUploads.map((product) => (
              <article key={product.id} className={`rounded-3xl p-4 ${theme.surface} ${theme.border} border`}>
                <div className="flex gap-4">
                  <img
                    src={product.customImageUrl ?? getProductPhotoUrl(product.image)}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-bold ${theme.heading}`}>{product.name}</p>
                    <p className={`mt-1 text-sm ${theme.muted}`}>{product.category}</p>
                    <p className={`mt-2 text-sm font-black ${theme.heading}`}>
                      {formatCurrency(product.price, currencyFormat)}
                      <span className={`ml-2 font-normal ${theme.muted}`}>库存 {product.stock}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProduct(product.id)}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border}`}
                  >
                    查看详情
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeProduct(product.id)}
                    className="rounded-full px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
