import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MobileBottomNav } from './MobileBottomNav'

describe('MobileBottomNav', () => {
  it('renders primary mobile navigation actions', () => {
    render(<MobileBottomNav currentPage="home" role="customer" onNavigate={() => {}} onOpenCart={() => {}} />)

    expect(screen.getByRole('navigation', { name: '手机底部导航' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /首页/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /购物车/ })).toBeInTheDocument()
  })

  it('renders merchant workspace tabs in merchant mode', () => {
    render(<MobileBottomNav currentPage="admin" role="merchant" onNavigate={() => {}} onOpenCart={() => {}} />)

    expect(screen.getByRole('button', { name: /订单物流/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /上架/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /购物车/ })).not.toBeInTheDocument()
  })
})
