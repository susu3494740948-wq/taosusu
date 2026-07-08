import { describe, expect, it } from 'vitest'
import {
  buildProductFromImportRow,
  normalizeImportSku,
  parseProductImportCsv,
  parseProductImportPayload,
} from './productImport'

describe('productImport', () => {
  it('normalizes sku with TTS prefix', () => {
    expect(normalizeImportSku('2026-001')).toBe('TTS-2026-001')
    expect(normalizeImportSku('tts-neck-fan')).toBe('TTS-NECK-FAN')
  })

  it('parses json payload and builds products with gallery images', () => {
    const result = parseProductImportPayload([
      {
        sku: 'neck-fan-01',
        name: 'Neck Fan',
        category: 'Summer Comfort',
        price: 19.99,
        stock: 10,
        mainImageUrl: 'https://example.com/main.jpg',
        detailImageUrls: ['https://example.com/detail-1.jpg', 'https://example.com/detail-2.jpg'],
        description: 'Cooling fan',
        benefits: ['Benefit A'],
        details: ['Detail A'],
      },
    ])

    expect(result.errors).toHaveLength(0)
    expect(result.products).toHaveLength(1)
    expect(result.products[0]?.id).toBe('TTS-NECK-FAN-01')
    expect(result.products[0]?.customImageUrl).toBe('https://example.com/main.jpg')
    expect(result.products[0]?.galleryImageUrls).toEqual([
      'https://example.com/detail-1.jpg',
      'https://example.com/detail-2.jpg',
    ])
  })

  it('parses csv rows with pipe-separated detail images', () => {
    const csv = `sku,name,category,price,stock,mainImageUrl,detailImageUrls,description,benefits,details
TTS-CSV-001,CSV Product,Summer Comfort,12,5,https://example.com/main.jpg,https://example.com/a.jpg|https://example.com/b.jpg,Desc,Benefit A,Detail A`

    const result = parseProductImportCsv(csv)
    expect(result.errors).toHaveLength(0)
    expect(result.products[0]?.galleryImageUrls).toEqual([
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
    ])
  })

  it('reports validation errors for invalid rows', () => {
    const result = parseProductImportPayload([
      {
        sku: 'bad-row',
        name: '',
        category: 'Unknown',
        price: 'x',
        stock: 1,
        mainImageUrl: '',
        description: '',
        benefits: [],
        details: [],
      },
    ])

    expect(result.products).toHaveLength(0)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('builds product from import row', () => {
    const product = buildProductFromImportRow({
      sku: 'TTS-DEMO',
      name: 'Demo',
      category: 'Pet Cleaning',
      price: 9.99,
      stock: 3,
      mainImageUrl: 'https://example.com/main.jpg',
      description: 'Demo product',
      benefits: ['Benefit'],
      details: ['Detail'],
    })

    expect(product.id).toBe('TTS-DEMO')
    expect(product.image).toBe('custom')
  })
})
