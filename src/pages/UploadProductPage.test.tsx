import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useProductStore } from '../store/productStore'
import { UploadProductPage } from './UploadProductPage'

describe('UploadProductPage', () => {
  it('renders upload form and publishes a custom product', () => {
    useProductStore.setState({ customProducts: [] })

    render(<UploadProductPage onNavigateAdmin={vi.fn()} onViewProduct={vi.fn()} />)

    expect(screen.getByRole('heading', { name: '上传商品' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/商品名称/), { target: { value: 'Uploaded Demo Towel' } })
    fireEvent.change(screen.getByLabelText(/售价/), { target: { value: '18.99' } })
    fireEvent.change(screen.getByLabelText(/库存/), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText(/商品描述/), { target: { value: 'Uploaded from admin demo form.' } })
    fireEvent.change(screen.getByLabelText(/核心卖点/), { target: { value: 'Fast cooling' } })
    fireEvent.change(screen.getByLabelText(/规格参数/), { target: { value: 'One size' } })

    fireEvent.click(screen.getByRole('button', { name: '发布商品' }))

    expect(screen.getByText(/已上架，可在全站分类与搜索中找到/)).toBeInTheDocument()
    expect(useProductStore.getState().customProducts[0]?.name).toBe('Uploaded Demo Towel')
  })
})
