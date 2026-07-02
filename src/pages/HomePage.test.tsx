import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../data/products'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders a full cross-border ecommerce storefront homepage', () => {
    render(
      <HomePage
        products={products}
        onNavigateCategories={vi.fn()}
        onSelectProduct={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: /淘酥酥 · 跨境好物直邮美国/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '浏览商品分类' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Shop all products' })).not.toBeInTheDocument()
    expect(screen.getByText(/精选跨境生活方式好物，直邮美国/)).toBeInTheDocument()
    expect(screen.getByText('限时活动')).toBeInTheDocument()
    expect(screen.getByText(/SUMMER10/)).toBeInTheDocument()
    expect(screen.getAllByText('Cooling Towel 4-Pack').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Summer Comfort').length).toBeGreaterThan(0)
    expect(screen.queryByText('淘酥酥', { selector: 'p' })).not.toBeInTheDocument()
  })
})
