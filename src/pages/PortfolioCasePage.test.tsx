import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortfolioCasePage } from './PortfolioCasePage'

describe('PortfolioCasePage', () => {
  it('renders the assistant portfolio outline and job-search packaging', () => {
    render(<PortfolioCasePage />)

    expect(screen.getByRole('heading', { name: /多平台运营助理作品集/ })).toBeInTheDocument()
    expect(screen.getAllByText('附件下载区').length).toBeGreaterThan(0)
    expect(screen.getByText('多平台 Listing 上架指南')).toBeInTheDocument()
    expect(screen.getAllByText(/Listing 上架/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/日报周报/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/TikTok Shop \/ Shopee \/ Temu/).length).toBeGreaterThan(0)
    expect(screen.getByRole('img', { name: 'Customer review response workflow for cross-border store' })).toBeInTheDocument()
  })
})
