import { fetchCloudJson, syncJsonToGitHub, getCloudJsonUrls, githubRepoConfig } from './cloudSync'
import type { BlogPost } from '../data/blogDefaults'
import { mergeBlogPosts } from '../data/blogDefaults'

export const cloudBlogConfig = {
  ...githubRepoConfig,
  path: 'public/data/customer-blog.json',
} as const

export { getCloudJsonUrls }

export async function fetchCloudBlogPosts(): Promise<BlogPost[]> {
  const result = await fetchCloudJson<unknown>(cloudBlogConfig.path)
  if (!result.ok) return []
  return mergeBlogPosts(result.data)
}

export async function fetchCloudBlogResult() {
  const result = await fetchCloudJson<unknown>(cloudBlogConfig.path)
  if (!result.ok) return { ok: false as const, posts: null }
  return { ok: true as const, posts: mergeBlogPosts(result.data) }
}

export async function syncBlogPostsToGitHub(posts: BlogPost[], token: string): Promise<void> {
  await syncJsonToGitHub(
    cloudBlogConfig.path,
    posts,
    token,
    'Sync customer blog posts from taosusu storefront',
  )
}
