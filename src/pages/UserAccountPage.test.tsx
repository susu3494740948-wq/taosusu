import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { demoOrders } from '../data/demoOrders'
import { useOrderStore } from '../store/orderStore'
import { UserAccountPage } from './UserAccountPage'

describe('UserAccountPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useOrderStore.setState({ orders: demoOrders })
  })

  it('renders order summary and unpaid orders', () => {
    render(<UserAccountPage onNavigateShop={() => {}} onSelectProduct={() => {}} />)

    expect(screen.getByRole('heading', { name: '我的订单' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /待付款/ })).toBeInTheDocument()
    expect(screen.getByText(/订单号 ER-20250618-PAY01/)).toBeInTheDocument()
  })

  it('filters shipped orders', () => {
    render(<UserAccountPage onNavigateShop={() => {}} onSelectProduct={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /运输中/ }))
    expect(screen.getByText(/订单号 ER-20250610-SHP02/)).toBeInTheDocument()
    expect(screen.queryByText(/订单号 ER-20250618-PAY01/)).not.toBeInTheDocument()
  })

  it('shows logistics timeline when expanded', () => {
    render(<UserAccountPage onNavigateShop={() => {}} onSelectProduct={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /运输中/ }))
    fireEvent.click(screen.getAllByRole('button', { name: '查看物流与详情' })[0])

    expect(screen.getByText('物流轨迹')).toBeInTheDocument()
    expect(screen.getByText(/国际运输中/)).toBeInTheDocument()
  })
})
