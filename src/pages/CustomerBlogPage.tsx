import { useMemo, useState } from 'react'
import { BlogPostMedia } from '../components/blog/BlogPostMedia'
import { blogTypeLabels, defaultBlogPosts, type BlogPost, type BlogPostType } from '../data/blogDefaults'
import { selectStoreConfig, useSiteContentStore } from '../store/siteContentStore'
import { useBlogStore } from '../store/blogStore'
import { useRoleStore } from '../store/roleStore'
import { theme } from '../lib/themeClasses'

type BlogFilter = 'all' | BlogPostType

const filterTabs: { id: BlogFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'article', label: '图文' },
  { id: 'photo', label: '图片' },
  { id: 'video', label: '视频' },
  { id: 'product-review', label: '商品评价' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating} 星`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

function formatBlogDate(value: string): string {
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface CustomerBlogPageProps {
  onNavigateEditor: () => void
  onViewProduct: (productId: string) => void
}

export function CustomerBlogPage({ onNavigateEditor, onViewProduct }: CustomerBlogPageProps) {
  const storeConfig = useSiteContentStore(selectStoreConfig)
  const posts = useBlogStore((state) => state.posts)
  const role = useRoleStore((state) => state.role)
  const [activeFilter, setActiveFilter] = useState<BlogFilter>('all')

  const displayPosts = useMemo(() => {
    const source = posts.length > 0 ? posts : defaultBlogPosts
    const filtered =
      activeFilter === 'all' ? source : source.filter((post) => post.type === activeFilter)
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, activeFilter])

  return (
    <main className={theme.pageMain}>
      <section className={`${theme.pageHero} ${theme.hero}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.heroAccent}`}>Customer Blog</p>
        <h2 className={theme.pageTitle}>{storeConfig.name} · 顾客博客</h2>
        <p className={theme.pageSubtitle}>
          真实买家分享图文、视频与商品评价。支持运营后台发布图片动态、开箱视频和单品测评。
        </p>
        {role === 'merchant' ? (
          <button
            type="button"
            onClick={onNavigateEditor}
            className={`mt-6 min-h-11 rounded-full px-6 py-3 text-sm font-bold ${theme.primaryBtn}`}
          >
            发布博客内容 →
          </button>
        ) : null}
      </section>

      <section className={`mt-6 rounded-[2rem] p-5 sm:p-6 ${theme.surface} ${theme.border} border`}>
        <div className="home-scroll-row flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition sm:shrink ${
                activeFilter === tab.id ? theme.navActive : `${theme.surfaceMuted} ${theme.muted}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <BlogCard key={post.id} post={post} onViewProduct={onViewProduct} />
          ))}
        </div>

        {displayPosts.length === 0 ? (
          <p className={`mt-8 text-center text-sm ${theme.muted}`}>暂无该类型的博客内容。</p>
        ) : null}
      </section>
    </main>
  )
}

function BlogCard({ post, onViewProduct }: { post: BlogPost; onViewProduct: (productId: string) => void }) {
  return (
    <article className={`overflow-hidden rounded-3xl ${theme.surface} ${theme.border} border`}>
      {(post.type === 'photo' || post.type === 'video' || post.imageUrl || post.videoUrl) && (
        <div className="p-3 pb-0">
          <BlogPostMedia imageUrl={post.imageUrl} videoUrl={post.videoUrl} title={post.title} />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.accentSoft}`}>
            {blogTypeLabels[post.type]}
          </span>
          <span className={`text-xs ${theme.muted}`}>{formatBlogDate(post.createdAt)}</span>
        </div>

        <h3 className={`mt-3 text-lg font-black leading-snug ${theme.heading}`}>{post.title}</h3>
        <p className={`mt-2 text-sm font-bold ${theme.muted}`}>{post.author}</p>
        <p className={`mt-3 text-sm leading-6 ${theme.heading}`}>{post.content}</p>

        {post.type === 'product-review' ? (
          <div className={`mt-4 rounded-2xl p-4 ${theme.surfaceMuted}`}>
            {post.rating ? <Stars rating={post.rating} /> : null}
            {post.productName ? (
              <button
                type="button"
                onClick={() => post.productId && onViewProduct(post.productId)}
                className={`mt-2 text-sm font-bold ${theme.accentText} hover:underline disabled:opacity-50`}
                disabled={!post.productId}
              >
                {post.productName}
                {post.productId ? ' · 查看商品' : ''}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
