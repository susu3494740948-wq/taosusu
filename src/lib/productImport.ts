import { categories } from '../data/products'
import type { Category, Product } from '../types'

export interface ProductImportRow {
  sku: string
  name: string
  category: Category
  price: number
  compareAtPrice?: number
  stock: number
  mainImageUrl: string
  detailImageUrls?: string[]
  badge?: string
  description: string
  tags?: string[]
  benefits: string[]
  details: string[]
  shippingNote?: string
  sourceNote?: string
}

export interface ProductImportResult {
  products: Product[]
  errors: string[]
  warnings: string[]
}

const defaultShippingNote =
  'Processing 2-5 business days. Estimated US delivery 7-12 business days after dispatch.'

function splitList(value: unknown, separators: RegExp): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  return value
    .split(separators)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseNumber(value: unknown, field: string, rowIndex: number, errors: string[]): number | null {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  if (Number.isNaN(parsed)) {
    errors.push(`第 ${rowIndex} 行 ${field} 不是有效数字`)
    return null
  }
  return parsed
}

function isCategory(value: string): value is Category {
  return (categories as string[]).includes(value)
}

export function normalizeImportSku(rawSku: string): string {
  const cleaned = rawSku
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!cleaned) return `TTS-SKU-${Date.now().toString(36).toUpperCase()}`
  return cleaned.startsWith('TTS-') ? cleaned : `TTS-${cleaned}`
}

function parseImportObject(raw: Record<string, unknown>, rowIndex: number, errors: string[]): ProductImportRow | null {
  const sku = normalizeImportSku(String(raw.sku ?? raw.id ?? ''))
  const name = String(raw.name ?? '').trim()
  const category = String(raw.category ?? '').trim()
  const description = String(raw.description ?? '').trim()
  const mainImageUrl = String(raw.mainImageUrl ?? raw.main_image_url ?? raw.customImageUrl ?? '').trim()

  if (!name) errors.push(`第 ${rowIndex} 行缺少 name`)
  if (!category || !isCategory(category)) errors.push(`第 ${rowIndex} 行 category 无效`)
  if (!description) errors.push(`第 ${rowIndex} 行缺少 description`)
  if (!mainImageUrl) errors.push(`第 ${rowIndex} 行缺少 mainImageUrl`)

  const price = parseNumber(raw.price, 'price', rowIndex, errors)
  const stock = parseNumber(raw.stock, 'stock', rowIndex, errors)
  if (price === null || stock === null) return null

  const compareAtRaw = raw.compareAtPrice ?? raw.compare_at_price
  const compareAtPrice =
    compareAtRaw === undefined || compareAtRaw === '' || compareAtRaw === null
      ? undefined
      : parseNumber(compareAtRaw, 'compareAtPrice', rowIndex, errors) ?? undefined

  const benefits = splitList(raw.benefits, /\n|\|/)
  const details = splitList(raw.details, /\n|\|/)
  if (benefits.length === 0) errors.push(`第 ${rowIndex} 行至少填写 1 条 benefits`)
  if (details.length === 0) errors.push(`第 ${rowIndex} 行至少填写 1 条 details`)

  const detailImageUrls = splitList(
    raw.detailImageUrls ?? raw.detail_image_urls ?? raw.galleryImageUrls,
    /\n|\||,/,
  )

  return {
    sku,
    name,
    category: category as Category,
    price,
    compareAtPrice,
    stock: Math.max(0, Math.floor(stock)),
    mainImageUrl,
    detailImageUrls,
    badge: String(raw.badge ?? '').trim() || 'New Arrival',
    description,
    tags: splitList(raw.tags, /[,，]/),
    benefits,
    details,
    shippingNote: String(raw.shippingNote ?? raw.shipping_note ?? '').trim() || defaultShippingNote,
    sourceNote: String(raw.sourceNote ?? raw.source_note ?? raw.sourcePlatform ?? '').trim() || undefined,
  }
}

export function buildProductFromImportRow(row: ProductImportRow): Product {
  return {
    id: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    rating: 4.8,
    reviewCount: 0,
    stock: row.stock,
    badge: row.badge,
    image: 'custom',
    customImageUrl: row.mainImageUrl,
    galleryImageUrls: row.detailImageUrls,
    tags: row.tags ?? [],
    benefits: row.benefits,
    description: row.description,
    details: row.details,
    shippingNote: row.shippingNote ?? defaultShippingNote,
    sourceNote: row.sourceNote,
  }
}

export function parseProductImportPayload(payload: unknown): ProductImportResult {
  const errors: string[] = []
  const warnings: string[] = []

  let rows: Record<string, unknown>[] = []
  if (Array.isArray(payload)) {
    rows = payload as Record<string, unknown>[]
  } else if (payload && typeof payload === 'object' && Array.isArray((payload as { products?: unknown[] }).products)) {
    rows = (payload as { products: Record<string, unknown>[] }).products
  } else {
    return { products: [], errors: ['导入格式无效，请使用 JSON 数组或 { "products": [...] }'], warnings }
  }

  const parsedRows: ProductImportRow[] = []
  rows.forEach((row, index) => {
    const parsed = parseImportObject(row, index + 1, errors)
    if (parsed) parsedRows.push(parsed)
  })

  const seen = new Set<string>()
  const products: Product[] = []
  parsedRows.forEach((row) => {
    if (seen.has(row.sku)) {
      warnings.push(`SKU ${row.sku} 重复，后一条会覆盖前一条`)
    }
    seen.add(row.sku)
    products.push(buildProductFromImportRow(row))
  })

  return { products, errors, warnings }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  cells.push(current.trim())
  return cells
}

export function parseProductImportCsv(text: string): ProductImportResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return { products: [], errors: ['CSV 至少需要表头 + 1 行数据'], warnings: [] }
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim())
  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))
  })

  return parseProductImportPayload(rows)
}
