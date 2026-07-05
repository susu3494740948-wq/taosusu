import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBlogStore } from './blogStore'

vi.mock('../lib/cloudBlog', () => ({
  fetchCloudBlogResult: vi.fn(async () => ({ ok: false, posts: null })),
  syncBlogPostsToGitHub: vi.fn(async () => undefined),
}))

describe('blogStore', () => {
  beforeEach(() => {
    useBlogStore.setState({ posts: [], cloudLoaded: false, cloudSyncError: null })
  })

  it('adds and removes blog posts from form values', async () => {
    await useBlogStore.getState().addPostFromForm({
      type: 'article',
      title: 'Summer haul',
      author: 'Jamie',
      content: 'Packed light and stayed cool.',
      productId: '',
      productName: '',
      rating: '5',
      videoUrl: '',
    })

    expect(useBlogStore.getState().posts).toHaveLength(1)
    expect(useBlogStore.getState().posts[0]?.title).toBe('Summer haul')

    const postId = useBlogStore.getState().posts[0]!.id
    await useBlogStore.getState().removePost(postId)
    expect(useBlogStore.getState().posts).toHaveLength(0)
  })
})
