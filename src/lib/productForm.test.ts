import { describe, expect, it } from 'vitest'
import {
  buildProductFromForm,
  createProductId,
  defaultProductFormValues,
  validateProductForm,
} from './productForm'

describe('productForm', () => {
  it('validates required product fields', () => {
    const errors = validateProductForm(defaultProductFormValues)
    expect(errors.name).toBeTruthy()
    expect(errors.price).toBeTruthy()
    expect(errors.stock).toBeTruthy()
    expect(errors.benefits).toBeTruthy()
  })

  it('builds a product from valid form values', () => {
    const product = buildProductFromForm({
      ...defaultProductFormValues,
      name: 'Demo Upload Fan',
      price: '24.99',
      stock: '10',
      description: 'A demo uploaded product.',
      benefits: 'USB-C rechargeable',
      details: 'One size fits all',
      tags: 'summer, demo',
    })

    expect(product.name).toBe('Demo Upload Fan')
    expect(product.price).toBe(24.99)
    expect(product.stock).toBe(10)
    expect(product.tags).toEqual(['summer', 'demo'])
    expect(product.image).toBe('custom')
    expect(createProductId('Demo Upload Fan')).toContain('demo-upload-fan')
  })
})
