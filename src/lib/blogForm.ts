import type { BlogPostType } from '../data/blogDefaults'

export interface BlogFormValues {
  type: BlogPostType
  title: string
  author: string
  content: string
  productId: string
  productName: string
  rating: string
  videoUrl: string
}

export type BlogFormErrors = Partial<Record<keyof BlogFormValues | 'image', string>>

export const defaultBlogFormValues: BlogFormValues = {
  type: 'article',
  title: '',
  author: '',
  content: '',
  productId: '',
  productName: '',
  rating: '5',
  videoUrl: '',
}

export function validateBlogForm(
  values: BlogFormValues,
  imageFile?: File | null,
  editingImageUrl?: string,
): BlogFormErrors {
  const errors: BlogFormErrors = {}
  if (!values.title.trim()) errors.title = '请填写标题'
  if (!values.author.trim()) errors.author = '请填写作者昵称'
  if (!values.content.trim()) errors.content = '请填写正文内容'

  if (values.type === 'product-review') {
    if (!values.productName.trim()) errors.productName = '请填写商品名称'
    const rating = Number(values.rating)
    if (Number.isNaN(rating) || rating < 1 || rating > 5) errors.rating = '评分需为 1-5 星'
  }

  if (values.type === 'video' && !values.videoUrl.trim()) {
    errors.videoUrl = '请填写视频链接（YouTube / Vimeo / MP4）'
  }

  if (values.type === 'photo' && !imageFile && !editingImageUrl) {
    errors.image = '图片动态请上传至少一张图片'
  }

  if (imageFile && !imageFile.type.startsWith('image/')) {
    errors.image = '请上传图片文件'
  }

  return errors
}
