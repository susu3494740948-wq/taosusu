import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { getSearchSuggestions, searchProducts } from './productSearch'

describe('searchProducts', () => {
  it('filters products by name, tags, and category text', () => {
    expect(searchProducts(products, 'cooling').length).toBeGreaterThan(0)
    expect(searchProducts(products, 'pet').every((product) => product.category === 'Pet Cleaning' || product.tags.includes('pet') || product.name.toLowerCase().includes('pet'))).toBe(true)
    expect(searchProducts(products, '')).toHaveLength(products.length)
  })

  it('supports multi-word queries and ranks name matches first', () => {
    const results = searchProducts(products, 'cooling towel')

    expect(results[0]?.name).toBe('Cooling Towel 4-Pack')
  })

  it('returns suggestion shortlist for dropdown search', () => {
    const suggestions = getSearchSuggestions(products, 'travel', 4)

    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.length).toBeLessThanOrEqual(4)
  })
})
