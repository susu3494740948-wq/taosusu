import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../../data/products'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('shows product suggestions and clears the query', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()
    const onSelectProduct = vi.fn()

    render(
      <SearchBar
        products={products}
        value="cool"
        onChange={onChange}
        onSubmit={onSubmit}
        onSelectProduct={onSelectProduct}
      />,
    )

    fireEvent.focus(screen.getByRole('combobox'))

    expect(screen.getByText('商品建议')).toBeInTheDocument()
    expect(screen.getByText('Cooling Towel 4-Pack')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '清除搜索' }))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('submits the current query', () => {
    const onSubmit = vi.fn()

    render(
      <SearchBar
        products={products}
        value="pet"
        onChange={vi.fn()}
        onSubmit={onSubmit}
        onSelectProduct={vi.fn()}
      />,
    )

    fireEvent.submit(screen.getByRole('search'))
    expect(onSubmit).toHaveBeenCalled()
  })
})
