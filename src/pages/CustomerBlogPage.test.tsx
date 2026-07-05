import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CustomerBlogPage } from './CustomerBlogPage'

describe('CustomerBlogPage', () => {
  it('renders blog filters and sample posts', () => {
    render(<CustomerBlogPage onNavigateEditor={vi.fn()} onViewProduct={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /顾客博客/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '发布博客内容 →' })).toBeInTheDocument()
    expect(screen.getByText('夏日通勤必备：降温毛巾真实体验')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '视频' }))
    expect(screen.getByText('挂脖风扇开箱：办公室静音实测')).toBeInTheDocument()
    expect(screen.queryByText('夏日通勤必备：降温毛巾真实体验')).not.toBeInTheDocument()
  })
})
