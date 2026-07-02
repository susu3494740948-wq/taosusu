import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MobileBottomNav } from './MobileBottomNav'

describe('MobileBottomNav', () => {
  it('renders primary mobile navigation actions', () => {
    render(<MobileBottomNav currentPage="home" onNavigate={() => {}} onOpenCart={() => {}} />)

    expect(screen.getByRole('navigation', { name: '手机底部导航' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /首页/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /购物车/ })).toBeInTheDocument()
  })
})
