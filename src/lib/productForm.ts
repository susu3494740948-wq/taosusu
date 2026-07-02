import { storeConfig } from '../data/store'
import type { Category, Product } from '../types'

export interface ProductFormValues {
  name: string
  category: Category
  price: string
  compareAtPrice: string
  stock: string
  badge: string
  description: string
  tags: string
  benefits: string
  details: string
  shippingNote: string
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues | 'image', string>>

export const defaultProductFormValues: ProductFormValues = {
  name: '',
  category: 'Summer Comfort',
  price: '',
  compareAtPrice: '',
  stock: '',
  badge: '',
  description: '',
  tags: '',
  benefits: '',
  details: '',
  shippingNote: `Processing ${storeConfig.processingDays}. Estimated US delivery ${storeConfig.deliveryDays} after dispatch.`,
}

function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseTags(value: string): string[] {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createProductId(name: string): string {
  const slug = slugifyName(name) || 'product'
  return `${slug}-${Date.now().toString(36)}`
}

export function validateProductForm(values: ProductFormValues, imageFile?: File | null): ProductFormErrors {
  const errors: ProductFormErrors = {}

  if (!values.name.trim()) errors.name = '请填写商品名称'
  if (!values.description.trim()) errors.description = '请填写商品描述'

  const price = Number(values.price)
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = '请填写有效售价（大于 0）'
  }

  if (values.compareAtPrice.trim()) {
    const compareAtPrice = Number(values.compareAtPrice)
    if (Number.isNaN(compareAtPrice) || compareAtPrice <= 0) {
      errors.compareAtPrice = '划线价需为大于 0 的数字'
    } else if (!Number.isNaN(price) && compareAtPrice <= price) {
      errors.compareAtPrice = '划线价应高于售价'
    }
  }

  const stock = Number(values.stock)
  if (!values.stock.trim() || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = '请填写有效库存（0 或正整数）'
  }

  if (parseLines(values.benefits).length === 0) errors.benefits = '请至少填写一条核心卖点'
  if (parseLines(values.details).length === 0) errors.details = '请至少填写一条规格参数'

  if (imageFile && !imageFile.type.startsWith('image/')) {
    errors.image = '请上传图片文件（JPG、PNG 等）'
  }

  return errors
}

export function buildProductFromForm(
  values: ProductFormValues,
  customImageUrl?: string,
  existing?: Pick<Product, 'id' | 'rating' | 'reviewCount' | 'image' | 'customImageUrl'>,
): Product {
  const price = Number(values.price)
  const compareAtPrice = values.compareAtPrice.trim() ? Number(values.compareAtPrice) : undefined
  const stock = Number(values.stock)
  const nextCustomImageUrl = customImageUrl ?? existing?.customImageUrl

  return {
    id: existing?.id ?? createProductId(values.name),
    name: values.name.trim(),
    category: values.category,
    price,
    compareAtPrice,
    rating: existing?.rating ?? 5,
    reviewCount: existing?.reviewCount ?? 0,
    stock,
    badge: values.badge.trim() || 'New Arrival',
    image: nextCustomImageUrl ? 'custom' : existing?.image ?? 'custom',
    customImageUrl: nextCustomImageUrl,
    tags: parseTags(values.tags),
    benefits: parseLines(values.benefits),
    description: values.description.trim(),
    details: parseLines(values.details),
    shippingNote: values.shippingNote.trim() || defaultProductFormValues.shippingNote,
  }
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
    stock: String(product.stock),
    badge: product.badge ?? '',
    description: product.description,
    tags: product.tags.join(', '),
    benefits: product.benefits.join('\n'),
    details: product.details.join('\n'),
    shippingNote: product.shippingNote,
  }
}

export async function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('无法读取图片文件'))
    }
    reader.onerror = () => reject(new Error('无法读取图片文件'))
    reader.readAsDataURL(file)
  })
}
