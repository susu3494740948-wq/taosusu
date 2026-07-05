import { describe, expect, it } from 'vitest'
import { defaultBlogFormValues, validateBlogForm } from './blogForm'

describe('validateBlogForm', () => {
  it('requires core fields for all post types', () => {
    const errors = validateBlogForm(defaultBlogFormValues)
    expect(errors.title).toBeTruthy()
    expect(errors.author).toBeTruthy()
    expect(errors.content).toBeTruthy()
  })

  it('requires product name and valid rating for product reviews', () => {
    const errors = validateBlogForm({
      ...defaultBlogFormValues,
      type: 'product-review',
      title: 'Great towel',
      author: 'Alex',
      content: 'Loved it.',
      rating: '6',
    })
    expect(errors.productName).toBeTruthy()
    expect(errors.rating).toBeTruthy()
  })

  it('requires video url for video posts', () => {
    const errors = validateBlogForm({
      ...defaultBlogFormValues,
      type: 'video',
      title: 'Unboxing',
      author: 'Sam',
      content: 'Quick clip.',
      videoUrl: '',
    })
    expect(errors.videoUrl).toBeTruthy()
  })

  it('requires an image for photo posts without existing image', () => {
    const errors = validateBlogForm(
      {
        ...defaultBlogFormValues,
        type: 'photo',
        title: 'Packing',
        author: 'Chris',
        content: 'Weekend trip.',
      },
      null,
      undefined,
    )
    expect(errors.image).toBeTruthy()
  })
})
