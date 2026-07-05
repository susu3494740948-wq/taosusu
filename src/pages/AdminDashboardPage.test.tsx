import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboardPage } from './AdminDashboardPage'

describe('AdminDashboardPage', () => {
  it('renders expanded cross-border operations dashboard sections', () => {
    render(
      <AdminDashboardPage
        onNavigateUpload={() => {}}
        onNavigateSiteContent={() => {}}
        onNavigateBlog={() => {}}
        onNavigateBlogView={() => {}}
        catalogCount={31}
      />,
    )

    expect(screen.getByRole('heading', { name: /淘酥酥 运营中心/ })).toBeInTheDocument()
    expect(screen.getByText('14 天转化漏斗')).toBeInTheDocument()
    expect(screen.getByText('全店 SKU 运营表')).toBeInTheDocument()
    expect(screen.getByText(/Go \/ Pivot \/ Stop：Pivot/)).toBeInTheDocument()
    expect(screen.getByText('本周运营动作')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '商品上架 →' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '编辑站点内容 →' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '发布顾客博客 →' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查看顾客博客 →' })).toBeInTheDocument()
  })
})
