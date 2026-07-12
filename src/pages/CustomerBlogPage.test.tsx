import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoleStore } from '../store/roleStore'
import { CustomerBlogPage } from './CustomerBlogPage'

describe('CustomerBlogPage', () => {
  beforeEach(() => {
    useRoleStore.setState({ role: 'customer' })
  })

  it('renders blog filters and sample posts', () => {
    render(<CustomerBlogPage onNavigateEditor={vi.fn()} onViewProduct={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /顾客博客/ })).toBeInTheDocument()
    expect(screen.getByText('夏日通勤必备：降温毛巾真实体验')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '视频' }))
    expect(screen.getByText('挂脖风扇开箱：办公室静音实测')).toBeInTheDocument()
    expect(screen.queryByText('夏日通勤必备：降温毛巾真实体验')).not.toBeInTheDocument()
  })

  it('hides publish entry for customers and shows it for merchants', () => {
    const { unmount } = render(<CustomerBlogPage onNavigateEditor={vi.fn()} onViewProduct={vi.fn()} />)
    expect(screen.queryByRole('button', { name: '发布博客内容 →' })).not.toBeInTheDocument()
    unmount()

    useRoleStore.setState({ role: 'merchant' })
    render(<CustomerBlogPage onNavigateEditor={vi.fn()} onViewProduct={vi.fn()} />)
    expect(screen.getByRole('button', { name: '发布博客内容 →' })).toBeInTheDocument()
  })
})
