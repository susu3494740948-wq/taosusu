import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortfolioCasePage } from './PortfolioCasePage'

describe('PortfolioCasePage', () => {
  it('renders the operations case study outline and job-search packaging', () => {
    render(<PortfolioCasePage />)

    expect(screen.getByRole('heading', { name: /4-8 周独立站 MVP 验证案例/ })).toBeInTheDocument()
    expect(screen.getAllByText('市场与品类选择').length).toBeGreaterThan(0)
    expect(screen.getAllByText('SKU 评分与优先级').length).toBeGreaterThan(0)
    expect(screen.getAllByText('供应商验证').length).toBeGreaterThan(0)
    expect(screen.getAllByText('独立站搭建方案').length).toBeGreaterThan(0)
    expect(screen.getAllByText('14 天流量测试计划').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Go / Pivot / Stop 决策').length).toBeGreaterThan(0)
    expect(screen.getByText('推荐承载形式：React 作品集站')).toBeInTheDocument()
    expect(screen.getByText(/RMB 10,000-30,000 预算/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pet hair remover before and after sofa cleaning demo' })).toBeInTheDocument()
  })
})
