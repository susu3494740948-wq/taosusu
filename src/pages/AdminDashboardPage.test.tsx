import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboardPage } from './AdminDashboardPage'

describe('AdminDashboardPage', () => {
  it('renders expanded cross-border operations dashboard sections', () => {
    render(<AdminDashboardPage onNavigateUpload={() => {}} catalogCount={31} />)

    expect(screen.getByRole('heading', { name: /淘酥酥 运营中心/ })).toBeInTheDocument()
    expect(screen.getByText('14 天转化漏斗')).toBeInTheDocument()
    expect(screen.getByText('全店 SKU 运营表')).toBeInTheDocument()
    expect(screen.getByText(/Go \/ Pivot \/ Stop：Pivot/)).toBeInTheDocument()
    expect(screen.getByText('本周运营动作')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '上传新商品 →' })).toBeInTheDocument()
  })
})
