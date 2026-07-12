import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { demoOrders } from '../data/demoOrders'
import { useOrderStore } from '../store/orderStore'
import { MerchantOrdersPage } from './MerchantOrdersPage'

describe('MerchantOrdersPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useOrderStore.setState({ orders: demoOrders, cloudLoaded: true, cloudSyncError: null })
  })

  it('renders fulfillment overview and order list', () => {
    render(<MerchantOrdersPage onNavigateAdmin={() => {}} />)

    expect(screen.getByRole('heading', { name: '订单与物流管理' })).toBeInTheDocument()
    expect(screen.getByText(/订单号 ER-20250618-PAY01/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '从云端刷新订单' })).toBeInTheDocument()
  })

  it('marks a processing order as shipped', () => {
    render(<MerchantOrdersPage onNavigateAdmin={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '标记已发货' }))

    const updated = useOrderStore.getState().orders.find((order) => order.id === 'ER-20250615-PRO04')
    expect(updated?.status).toBe('shipped')
  })

  it('adds a custom logistics event through the editor', () => {
    render(<MerchantOrdersPage onNavigateAdmin={() => {}} />)

    fireEvent.click(screen.getAllByRole('button', { name: '管理物流轨迹' })[0])
    fireEvent.change(screen.getByPlaceholderText('如 洛杉矶海关'), { target: { value: '洛杉矶海关' } })
    fireEvent.change(screen.getByPlaceholderText('如 包裹已完成清关，转交本地派送'), {
      target: { value: '包裹已完成清关' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加节点' }))

    const hasCustomEvent = useOrderStore
      .getState()
      .orders.some((order) => order.logistics?.events.some((event) => event.custom))
    expect(hasCustomEvent).toBe(true)
  })
})
