import type { Category, Product } from '../types'

const categoryAliases: Record<Category, string[]> = {
  'Summer Comfort': ['summer', 'cooling', '夏日', '降温', 'fan', 'blanket'],
  'Pet Cleaning': ['pet', '宠物', 'dog', 'cat', 'lint', 'grooming'],
  'Travel Organization': ['travel', '旅行', 'packing', 'luggage', 'toiletry', 'shoe'],
  'Hair And Beauty': ['hair', 'beauty', '美妆', 'curl', 'makeup', 'skincare'],
  'Home Organization': ['home', '家居', 'organizer', 'drawer', 'kitchen', 'closet'],
  'Fitness & Outdoor': ['fitness', '健身', 'workout', 'yoga', 'outdoor', 'gym'],
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function tokenizeQuery(query: string): string[] {
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean)
}

function buildHaystack(product: Product): string {
  const categoryKeywords = categoryAliases[product.category] ?? []

  return [
    product.name,
    product.category,
    product.description,
    product.badge ?? '',
    ...product.tags,
    ...product.benefits,
    ...product.details,
    ...categoryKeywords,
  ]
    .join(' ')
    .toLowerCase()
}

function scoreProduct(product: Product, tokens: string[]): number {
  const haystack = buildHaystack(product)
  const name = product.name.toLowerCase()
  const category = product.category.toLowerCase()

  return tokens.reduce((score, token) => {
    if (name.includes(token)) return score + 12
    if (category.includes(token)) return score + 8
    if (product.tags.some((tag) => tag.includes(token))) return score + 6
    if (haystack.includes(token)) return score + 3
    return score - 100
  }, 0)
}

export function searchProducts(products: Product[], query: string): Product[] {
  const tokens = tokenizeQuery(query)
  if (tokens.length === 0) return products

  return products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product)
}

export function getSearchSuggestions(products: Product[], query: string, limit = 6): Product[] {
  return searchProducts(products, query).slice(0, limit)
}

export const popularSearchTerms = ['cooling', 'pet', 'travel', 'yoga', 'organizer', 'mirror']
