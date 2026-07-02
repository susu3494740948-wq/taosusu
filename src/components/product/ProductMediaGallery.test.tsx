import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { products } from '../../data/products'
import { getProductMedia } from '../../lib/productMedia'
import { ProductMediaGallery } from './ProductMediaGallery'

describe('ProductMediaGallery', () => {
  it('renders main image, gallery slides, size chart, and video when available', () => {
    const product = products[0]
    const slides = getProductMedia(product)

    render(<ProductMediaGallery product={product} />)

    expect(screen.getByRole('button', { name: '查看主图' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查看尺寸图' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查看视频' })).toBeInTheDocument()
    expect(slides.some((slide) => slide.type === 'video')).toBe(true)
  })

  it('switches to the size chart slide when its thumbnail is clicked', () => {
    render(<ProductMediaGallery product={products[0]} />)

    fireEvent.click(screen.getByRole('button', { name: '查看尺寸图' }))

    expect(screen.getByRole('img', { name: /尺寸规格图/ })).toBeInTheDocument()
    expect(screen.getAllByText('尺寸图').length).toBeGreaterThan(0)
  })
})
