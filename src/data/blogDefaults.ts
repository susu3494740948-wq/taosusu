export type BlogPostType = 'article' | 'product-review' | 'photo' | 'video'

export interface BlogPost {
  id: string
  type: BlogPostType
  title: string
  author: string
  content: string
  createdAt: string
  productId?: string
  productName?: string
  rating?: number
  imageUrl?: string
  videoUrl?: string
}

export const blogTypeLabels: Record<BlogPostType, string> = {
  article: '图文分享',
  'product-review': '商品评价',
  photo: '图片动态',
  video: '视频分享',
}

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-cooling-towel-review',
    type: 'product-review',
    title: '夏日通勤必备：降温毛巾真实体验',
    author: 'Jess M.',
    content:
      '在佛罗里达户外走了整整一下午，毛巾打湿后挂在脖子上真的能撑几个小时。面料不磨皮肤，洗了一次也没有掉色。',
    createdAt: '2026-07-01T10:00:00.000Z',
    productId: 'cooling-towel-kit',
    productName: 'Cooling Towel 4-Pack',
    rating: 5,
    imageUrl: '',
  },
  {
    id: 'blog-travel-packing-photo',
    type: 'photo',
    title: '周末旅行收纳实拍',
    author: 'Chris L.',
    content: '压缩收纳袋 + 鞋袋组合，登机箱侧边刚好塞下三件套，机场开箱超整齐。',
    createdAt: '2026-06-28T14:30:00.000Z',
    imageUrl: '',
  },
  {
    id: 'blog-neck-fan-video',
    type: 'video',
    title: '挂脖风扇开箱：办公室静音实测',
    author: 'Sam T.',
    content: '录了一段 30 秒开箱，三档风力在工位上完全够用，USB-C 充电也方便。',
    createdAt: '2026-06-25T09:15:00.000Z',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
]

export function mergeBlogPosts(payload: unknown): BlogPost[] {
  if (Array.isArray(payload)) return payload as BlogPost[]
  if (payload && typeof payload === 'object' && Array.isArray((payload as { posts?: BlogPost[] }).posts)) {
    return (payload as { posts: BlogPost[] }).posts
  }
  return defaultBlogPosts
}

export function createBlogPostId(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'blog'}-${Date.now().toString(36)}`
}

export function getVideoEmbedUrl(url: string): string | null {
  try {
    const trimmed = url.trim()
    if (!trimmed) return null
    if (trimmed.includes('youtube.com/watch')) {
      const id = new URL(trimmed).searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (trimmed.includes('youtu.be/')) {
      const id = trimmed.split('youtu.be/')[1]?.split(/[?&]/)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (trimmed.includes('youtube.com/embed/')) return trimmed
    if (trimmed.includes('vimeo.com/')) {
      const id = trimmed.split('vimeo.com/')[1]?.split(/[?&]/)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    return trimmed
  } catch {
    return url.trim() || null
  }
}

export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith('data:video/')
}
