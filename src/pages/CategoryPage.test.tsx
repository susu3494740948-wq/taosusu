import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { categories } from '../data/products'
import { products } from '../data/products'
import { CategoryPage } from './CategoryPage'

describe('CategoryPage', () => {
  it('renders all product categories', () => {
    render(
      <CategoryPage
        products={products}
        selectedCategory={null}
        searchQuery=""
        onBrowseCategory={vi.fn()}
        onClearFilters={vi.fn()}
        onNavigateHome={vi.fn()}
        onSelectProduct={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: '商品分类' })).toBeInTheDocument()
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: category })).toBeInTheDocument()
    }
  })
})
