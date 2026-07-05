import { useMemo, useState, type FormEvent } from 'react'
import { BlogPostMedia } from '../components/blog/BlogPostMedia'
import { blogTypeLabels } from '../data/blogDefaults'
import { compressImageFile } from '../lib/compressImage'
import { canSyncToCloud } from '../lib/cloudSync'
import {
  defaultBlogFormValues,
  validateBlogForm,
  type BlogFormValues,
} from '../lib/blogForm'
import { theme } from '../lib/themeClasses'
import { blogPostToFormValues, useBlogStore } from '../store/blogStore'
import type { BlogPost } from '../data/blogDefaults'
import { usePreferencesStore } from '../store/preferencesStore'

interface BlogEditorPageProps {
  onNavigateBlog: () => void
  onNavigateAdmin: () => void
}

export function BlogEditorPage({ onNavigateBlog, onNavigateAdmin }: BlogEditorPageProps) {
  const posts = useBlogStore((state) => state.posts)
  const addPostFromForm = useBlogStore((state) => state.addPostFromForm)
  const removePost = useBlogStore((state) => state.removePost)
  const loadFromCloud = useBlogStore((state) => state.loadFromCloud)
  const cloudSyncError = useBlogStore((state) => state.cloudSyncError)
  const cloudLoaded = useBlogStore((state) => state.cloudLoaded)
  const githubSyncToken = usePreferencesStore((state) => state.githubSyncToken)

  const [values, setValues] = useState<BlogFormValues>(defaultBlogFormValues)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<ReturnType<typeof validateBlogForm>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const cloudSyncEnabled = canSyncToCloud(githubSyncToken)
  const fieldClass = `mt-2 rounded-2xl px-4 py-3 ${theme.input}`
  const recentPosts = useMemo(() => posts.slice(0, 6), [posts])

  function resetForm() {
    setValues(defaultBlogFormValues)
    setEditingPost(null)
    setImageFile(null)
    setImagePreview(null)
    setErrors({})
    setSuccessMessage(null)
  }

  function startEditing(post: BlogPost) {
    setEditingPost(post)
    setValues(blogPostToFormValues(post))
    setImageFile(null)
    setImagePreview(post.imageUrl ?? null)
    setErrors({})
    setSuccessMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateField<K extends keyof BlogFormValues>(field: K, value: BlogFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, image: undefined }))
    setSuccessMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateBlogForm(values, imageFile, editingPost?.imageUrl)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const imageUrl = imageFile ? await compressImageFile(imageFile) : undefined
      await addPostFromForm(values, imageUrl, editingPost ?? undefined)
      setSuccessMessage(
        cloudSyncEnabled
          ? `博客「${values.title}」已发布并同步到云端。`
          : `博客已保存到本机。请配置 GitHub Token 以同步到线上。`,
      )
      resetForm()
    } catch {
      setErrors({ image: '图片处理失败，请重试' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={theme.pageMainNarrow}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Blog Editor</p>
        <h2 className={theme.pageTitle}>发布顾客博客</h2>
        <p className={theme.pageSubtitle}>
          支持图文、图片、视频链接与商品评价。保存后自动同步到 customer-blog.json，所有访客可见。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onNavigateBlog} className={`rounded-full px-5 py-3 text-sm ${theme.secondaryBtn}`}>
            ← 查看博客
          </button>
          <button type="button" onClick={onNavigateAdmin} className={`rounded-full px-5 py-3 text-sm ${theme.secondaryBtn}`}>
            运营中心
          </button>
        </div>
      </section>

      <section className={`mt-6 rounded-2xl border px-5 py-4 ${theme.surface} ${theme.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-sm ${theme.muted}`}>
            {cloudSyncEnabled ? '已启用云端同步' : '未配置 Token，仅本机保存'}
          </p>
          <button
            type="button"
            disabled={isRefreshing || !cloudLoaded}
            onClick={() => {
              setIsRefreshing(true)
              void loadFromCloud().finally(() => setIsRefreshing(false))
            }}
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
        {editingPost ? (
          <div className={`rounded-2xl border px-5 py-4 ${theme.accentSoft}`}>
            <p className={`font-bold ${theme.accentText}`}>正在编辑：{editingPost.title}</p>
            <button type="button" onClick={resetForm} className={`mt-2 text-sm font-bold ${theme.accentText}`}>
              取消编辑，发布新内容
            </button>
          </div>
        ) : null}

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>内容类型</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(blogTypeLabels) as Array<keyof typeof blogTypeLabels>).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('type', type)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  values.type === type ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
                }`}
              >
                {blogTypeLabels[type]}
              </button>
            ))}
          </div>
        </section>

        <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
          <h3 className={`text-xl font-black ${theme.heading}`}>基础信息</h3>
          <div className="mt-6 grid gap-5">
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-title">标题 *</label>
              <input id="blog-title" value={values.title} onChange={(e) => updateField('title', e.target.value)} className={fieldClass} />
              {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-author">作者昵称 *</label>
              <input id="blog-author" value={values.author} onChange={(e) => updateField('author', e.target.value)} className={fieldClass} />
              {errors.author ? <p className="mt-2 text-sm text-red-600">{errors.author}</p> : null}
            </div>
            <div>
              <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-content">正文 *</label>
              <textarea id="blog-content" rows={4} value={values.content} onChange={(e) => updateField('content', e.target.value)} className={fieldClass} />
              {errors.content ? <p className="mt-2 text-sm text-red-600">{errors.content}</p> : null}
            </div>
          </div>
        </section>

        {values.type === 'product-review' ? (
          <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-xl font-black ${theme.heading}`}>商品评价信息</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-product-name">商品名称 *</label>
                <input id="blog-product-name" value={values.productName} onChange={(e) => updateField('productName', e.target.value)} className={fieldClass} />
                {errors.productName ? <p className="mt-2 text-sm text-red-600">{errors.productName}</p> : null}
              </div>
              <div>
                <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-rating">评分 (1-5) *</label>
                <input id="blog-rating" inputMode="numeric" value={values.rating} onChange={(e) => updateField('rating', e.target.value)} className={fieldClass} />
                {errors.rating ? <p className="mt-2 text-sm text-red-600">{errors.rating}</p> : null}
              </div>
              <div className="sm:col-span-2">
                <label className={`text-sm font-bold ${theme.heading}`} htmlFor="blog-product-id">商品 ID（可选，用于跳转详情）</label>
                <input id="blog-product-id" value={values.productId} onChange={(e) => updateField('productId', e.target.value)} className={fieldClass} placeholder="cooling-towel-kit" />
              </div>
            </div>
          </section>
        ) : null}

        {values.type === 'video' ? (
          <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-xl font-black ${theme.heading}`}>视频链接</h3>
            <input
              value={values.videoUrl}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              className={fieldClass}
              placeholder="YouTube / Vimeo / MP4 链接"
            />
            {errors.videoUrl ? <p className="mt-2 text-sm text-red-600">{errors.videoUrl}</p> : null}
            {values.videoUrl ? (
              <div className="mt-4">
                <BlogPostMedia videoUrl={values.videoUrl} title={values.title || '视频预览'} />
              </div>
            ) : null}
          </section>
        ) : null}

        {values.type === 'photo' || values.type === 'article' || values.type === 'product-review' ? (
          <section className={`rounded-[2rem] p-5 sm:p-8 ${theme.surface} ${theme.border} border`}>
            <h3 className={`text-xl font-black ${theme.heading}`}>配图</h3>
            <p className={`mt-2 text-sm ${theme.muted}`}>图片动态必须上传图片；其他类型可选。</p>
            <input
              type="file"
              accept="image/*"
              className="mt-4 block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setImageFile(file)
                setErrors((c) => ({ ...c, image: undefined }))
                if (!file) {
                  setImagePreview(editingPost?.imageUrl ?? null)
                  return
                }
                void compressImageFile(file, 720).then(setImagePreview).catch(() => {
                  setErrors((c) => ({ ...c, image: '无法预览图片' }))
                })
              }}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="预览" className="mt-4 aspect-[4/3] w-full max-w-md rounded-2xl object-cover" />
            ) : null}
            {errors.image ? <p className="mt-2 text-sm text-red-600">{errors.image}</p> : null}
          </section>
        ) : null}

        <button type="submit" disabled={isSubmitting} className={`min-h-11 rounded-full px-8 py-3 ${theme.primaryBtn} disabled:opacity-50`}>
          {isSubmitting ? '发布中…' : editingPost ? '保存修改' : '发布博客'}
        </button>
      </form>

      {recentPosts.length > 0 ? (
        <section className="mt-12">
          <h3 className={`text-2xl font-black ${theme.heading}`}>已发布 ({recentPosts.length})</h3>
          <div className="mt-5 grid gap-4">
            {recentPosts.map((post) => (
              <article key={post.id} className={`rounded-3xl p-4 ${theme.surface} ${theme.border} border`}>
                <p className={`font-bold ${theme.heading}`}>{post.title}</p>
                <p className={`mt-1 text-sm ${theme.muted}`}>{blogTypeLabels[post.type]} · {post.author}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEditing(post)} className={`rounded-full px-4 py-2 text-sm font-bold ${theme.secondaryBtn} border ${theme.border}`}>
                    编辑
                  </button>
                  <button type="button" onClick={() => void removePost(post.id)} className="rounded-full px-4 py-2 text-sm font-bold text-red-700">
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
