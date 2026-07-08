import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useProductStore } from '../store/productStore'
import { UploadProductPage } from './UploadProductPage'

vi.mock('../lib/compressImage', () => ({
  compressImageFile: vi.fn(async () => 'data:image/jpeg;base64,demo'),
}))

describe('UploadProductPage', () => {
  it('renders upload form and publishes a custom product', async () => {
    useProductStore.setState({ customProducts: [], delistedProductIds: [], cloudLoaded: true, cloudSyncError: null })

    render(<UploadProductPage onNavigateAdmin={vi.fn()} onViewProduct={vi.fn()} />)

    expect(screen.getByRole('heading', { name: '商品上架' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/商品名称/), { target: { value: 'Uploaded Demo Towel' } })
    fireEvent.change(screen.getByLabelText(/售价/), { target: { value: '18.99' } })
    fireEvent.change(screen.getByLabelText(/库存/), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText(/商品描述/), { target: { value: 'Uploaded from admin demo form.' } })
    fireEvent.change(screen.getByLabelText(/核心卖点/), { target: { value: 'Fast cooling' } })
    fireEvent.change(screen.getByLabelText(/规格参数/), { target: { value: 'One size' } })

    fireEvent.click(screen.getByRole('button', { name: '确认上架' }))

    await waitFor(() => {
      expect(screen.getByText(/在售商品/)).toBeInTheDocument()
    })
    expect(useProductStore.getState().customProducts[0]?.name).toBe('Uploaded Demo Towel')
  })
})
