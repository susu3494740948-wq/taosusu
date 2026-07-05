import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BlogPost } from '../data/blogDefaults'
import { createBlogPostId, getVideoEmbedUrl } from '../data/blogDefaults'
import type { BlogFormValues } from '../lib/blogForm'
import { fetchCloudBlogResult, syncBlogPostsToGitHub } from '../lib/cloudBlog'
import { usePreferencesStore } from './preferencesStore'

interface BlogState {
  posts: BlogPost[]
  cloudLoaded: boolean
  cloudSyncError: string | null
  loadFromCloud: () => Promise<void>
  addPostFromForm: (values: BlogFormValues, imageUrl?: string, existing?: BlogPost) => Promise<void>
  removePost: (postId: string) => Promise<void>
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function pushToCloud(posts: BlogPost[]): Promise<string | null> {
  const token = usePreferencesStore.getState().githubSyncToken
  if (!token.trim()) return null
  try {
    await syncBlogPostsToGitHub(posts, token)
    return null
  } catch {
    return '博客同步失败，请检查 GitHub Token 是否正确。'
  }
}

function buildPostFromForm(values: BlogFormValues, imageUrl?: string, existing?: BlogPost): BlogPost {
  const rating = values.type === 'product-review' ? Number(values.rating) : undefined
  const videoUrl =
    values.type === 'video' ? getVideoEmbedUrl(values.videoUrl) ?? values.videoUrl.trim() : undefined

  return {
    id: existing?.id ?? createBlogPostId(values.title),
    type: values.type,
    title: values.title.trim(),
    author: values.author.trim(),
    content: values.content.trim(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    productId: values.productId.trim() || undefined,
    productName: values.productName.trim() || undefined,
    rating,
    imageUrl: imageUrl ?? existing?.imageUrl,
    videoUrl: videoUrl || existing?.videoUrl,
  }
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: [],
      cloudLoaded: false,
      cloudSyncError: null,

      loadFromCloud: async () => {
        const result = await fetchCloudBlogResult()
        if (result.ok) {
          set({ posts: sortPosts(result.posts), cloudLoaded: true, cloudSyncError: null })
          return
        }
        set({ cloudLoaded: true })
      },

      addPostFromForm: async (values, imageUrl, existing) => {
        const post = buildPostFromForm(values, imageUrl, existing)
        const posts = sortPosts([
          post,
          ...get().posts.filter((item) => item.id !== post.id),
        ])
        set({ posts })
        const syncError = await pushToCloud(posts)
        set({ cloudSyncError: syncError })
      },

      removePost: async (postId) => {
        const posts = get().posts.filter((post) => post.id !== postId)
        set({ posts })
        const syncError = await pushToCloud(posts)
        set({ cloudSyncError: syncError })
      },
    }),
    {
      name: 'taosusu-customer-blog',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function blogPostToFormValues(post: BlogPost): BlogFormValues {
  return {
    type: post.type,
    title: post.title,
    author: post.author,
    content: post.content,
    productId: post.productId ?? '',
    productName: post.productName ?? '',
    rating: String(post.rating ?? 5),
    videoUrl: post.videoUrl ?? '',
  }
}
