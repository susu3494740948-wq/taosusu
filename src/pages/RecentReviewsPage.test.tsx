import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RecentReviewsPage } from './RecentReviewsPage'

describe('RecentReviewsPage', () => {
  it('renders recent review inbox sections', () => {
    render(<RecentReviewsPage onViewProduct={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /刚收到评论/ })).toBeInTheDocument()
    expect(screen.getByText('评论列表')).toBeInTheDocument()
    expect(screen.getByText('回复优先级')).toBeInTheDocument()
    expect(screen.getByText(/Disney in July/)).toBeInTheDocument()
  })
})
