import { getProductGalleryPhotoUrls, getProductPhotoUrl } from '../data/productPhotos'
import type { Product } from '../types'

export type ProductMediaType = 'main' | 'gallery' | 'size' | 'video'

export interface ProductMediaSlide {
  id: string
  type: ProductMediaType
  label: string
  src: string
  poster?: string
  alt: string
}

const demoVideos: Partial<Record<string, { src: string; label?: string }>> = {
  'cooling-towel-kit': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    label: '降温毛巾使用演示',
  },
  'portable-neck-fan': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    label: '挂脖风扇佩戴演示',
  },
  'ice-silk-blanket': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    label: '冰丝毯触感展示',
  },
  'pet-hair-remover': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    label: '宠物除毛演示',
  },
  'compression-packing-cubes': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    label: '压缩收纳演示',
  },
  'heatless-curl-set': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    label: '免烫卷发教程',
  },
  'resistance-bands-set': {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    label: '阻力带训练演示',
  },
}

function buildSizeChartDataUrl(product: Product): string {
  const rows = product.details.map(
    (detail, index) =>
      `<tr><td style="padding:12px 16px;border-bottom:1px solid #e7e5e4;color:#57534e;">规格 ${index + 1}</td><td style="padding:12px 16px;border-bottom:1px solid #e7e5e4;font-weight:700;color:#1c1917;">${detail}</td></tr>`,
  )

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <rect width="900" height="640" fill="#fafaf9"/>
  <rect x="40" y="40" width="820" height="560" rx="24" fill="#ffffff" stroke="#e7e5e4"/>
  <text x="450" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#1c1917">尺寸与规格参考</text>
  <text x="450" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#78716c">${product.name}</text>
  <foreignObject x="70" y="160" width="760" height="380">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:16px;">
      <table style="width:100%;border-collapse:collapse;background:#f5f5f4;border-radius:16px;overflow:hidden;">
        <thead>
          <tr style="background:#1c1917;color:#ffffff;">
            <th style="padding:14px 16px;text-align:left;">项目</th>
            <th style="padding:14px 16px;text-align:left;">参数</th>
          </tr>
        </thead>
        <tbody>${rows.join('')}</tbody>
      </table>
      <p style="margin:18px 4px 0;color:#78716c;font-size:14px;line-height:1.6;">* 手工测量可能存在 1-2 cm 误差，请以收到实物为准。跨境商品默认美制包装规格。</p>
    </div>
  </foreignObject>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function getProductMedia(product: Product): ProductMediaSlide[] {
  const mainPhoto = getProductPhotoUrl(product.image)
  const gallery = getProductGalleryPhotoUrls(product.image)
  const slides: ProductMediaSlide[] = [
    {
      id: `${product.id}-main`,
      type: 'main',
      label: '主图',
      src: mainPhoto,
      alt: `${product.name} 主图`,
    },
  ]

  gallery.forEach((url, index) => {
    slides.push({
      id: `${product.id}-gallery-${index + 1}`,
      type: 'gallery',
      label: `轮播 ${index + 1}`,
      src: url,
      alt: `${product.name} 场景图 ${index + 1}`,
    })
  })

  slides.push({
    id: `${product.id}-size`,
    type: 'size',
    label: '尺寸图',
    src: buildSizeChartDataUrl(product),
    alt: `${product.name} 尺寸规格图`,
  })

  const video = demoVideos[product.id]
  if (video) {
    slides.push({
      id: `${product.id}-video`,
      type: 'video',
      label: '视频',
      src: video.src,
      poster: mainPhoto,
      alt: video.label ?? `${product.name} 演示视频`,
    })
  }

  return slides
}
