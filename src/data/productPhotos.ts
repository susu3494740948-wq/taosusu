import type { Product } from '../types'

const asset = (relativePath: string) => `${import.meta.env.BASE_URL}${relativePath}`

const productImageKeys = [
  'cooling',
  'fan',
  'blanket',
  'mistfan',
  'pet',
  'glove',
  'lint',
  'packing',
  'toiletry',
  'shoebag',
  'curl',
  'sleepcap',
  'mirror',
  'organizer',
  'sink',
  'divider',
  'bottle',
  'bands',
  'sunhat',
  'umbrella',
  'petwipes',
  'petbrush',
  'travelpillow',
  'cable',
  'clawclip',
  'jaderoller',
  'closet',
  'spice',
  'yogamat',
  'jumprope',
] as const

export type ProductImageKey = (typeof productImageKeys)[number]

/** Bundled photos served from /public/images — works on GitHub Pages and in China */
export const productPhotoUrls: Record<ProductImageKey, string> = Object.fromEntries(
  productImageKeys.map((key) => [key, asset(`images/products/${key}.jpg`)]),
) as Record<ProductImageKey, string>

/** Gallery uses main product photo variants for detail page carousel */
export const productGalleryPhotos: Record<ProductImageKey, string[]> = Object.fromEntries(
  productImageKeys.map((key) => [key, [productPhotoUrls[key], productPhotoUrls[key]]]),
) as Record<ProductImageKey, string[]>

export const heroImageUrl = asset('images/hero.jpg')

export const defaultProductPhoto = productPhotoUrls.cooling

export function getProductPhotoUrl(imageKey: string): string {
  return productPhotoUrls[imageKey as ProductImageKey] ?? defaultProductPhoto
}

export function getProductGalleryPhotoUrls(imageKey: string): string[] {
  return productGalleryPhotos[imageKey as ProductImageKey] ?? [getProductPhotoUrl(imageKey)]
}

export function productUsesLocalPhotos(product: Product): boolean {
  return Boolean(productPhotoUrls[product.image as ProductImageKey])
}
