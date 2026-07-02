import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductArtwork } from './ProductArtwork'

describe('ProductArtwork', () => {
  it('renders a realistic product photo for known product image keys', () => {
    render(
      <ProductArtwork
        image="cooling"
        name="Cooling Towel 4-Pack"
        subtitle="Summer Comfort"
        showBottomCaption
      />,
    )

    const image = screen.getByRole('img', { name: 'Cooling Towel 4-Pack product lifestyle photo' })

    expect(image).toHaveAttribute('src', expect.stringContaining('images.pexels.com'))
    expect(screen.getByText('Cooling Towel 4-Pack')).toBeInTheDocument()
    expect(screen.getByText('Summer Comfort')).toBeInTheDocument()
  })
})
