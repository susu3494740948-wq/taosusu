import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { products as baseProducts } from '../data/products'
import { useProductStore } from '../store/productStore'
import { AdminDashboardPage } from './AdminDashboardPage'

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    useProductStore.setState({ customProducts: [], delistedProductIds: [], cloudLoaded: true, cloudSyncError: null })
  })

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

  it('delists and relists a product from the catalog operations table', () => {
    const target = baseProducts[0]
    if (!target) return

    render(
      <AdminDashboardPage
        onNavigateUpload={() => {}}
        onNavigateSiteContent={() => {}}
        onNavigateBlog={() => {}}
        onNavigateBlogView={() => {}}
        catalogCount={baseProducts.length}
      />,
    )

    const delistButtons = screen.getAllByRole('button', { name: '下架' })
    const targetRowButton = delistButtons.find((button) =>
      button.closest('tr')?.textContent?.includes(target.name),
    )
    expect(targetRowButton).toBeTruthy()

    fireEvent.click(targetRowButton!)
    expect(useProductStore.getState().delistedProductIds).toContain(target.id)
    expect(screen.getByText('已下架：1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '重新上架' }))
    expect(useProductStore.getState().delistedProductIds).not.toContain(target.id)
  })
})
