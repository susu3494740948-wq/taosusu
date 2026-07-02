import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../data/products'
import { ProductDetailPage } from './ProductDetailPage'

describe('ProductDetailPage', () => {
  it('renders product detail sections and customer reviews', () => {
    render(
      <ProductDetailPage
        product={products[0]}
        onBack={vi.fn()}
        onNavigateHome={vi.fn()}
        onBrowseCategory={vi.fn()}
        onSelectProduct={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: products[0].name })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查看主图' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查看尺寸图' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '买家怎么说' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '加入购物车' })).toBeInTheDocument()
    expect(screen.getByText('Perfect for theme parks')).toBeInTheDocument()
    expect(screen.getAllByText(/已验证购买/).length).toBeGreaterThan(0)
  })
})
