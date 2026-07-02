import { describe, expect, it } from 'vitest'
import {
  caseStudySections,
  executionTimeline,
  portfolioSummary,
  portfolioVisuals,
  resumeBullets,
  wireframeOptions,
} from './portfolio.ts'

describe('portfolio content', () => {
  it('summarizes the cross-border ecommerce operations portfolio', () => {
    expect(portfolioSummary.positioning).toContain('美国市场轻量生活方式产品独立站 MVP 验证项目')
    expect(portfolioSummary.targetRole).toBe('跨境电商 / 独立站运营')
    expect(portfolioSummary.capabilities).toEqual([
      '选品判断',
      '供应商验证',
      '独立站搭建',
      '流量测试',
      '数据复盘',
      '风险控制',
    ])
  })

  it('keeps the case study in the planned operations funnel order', () => {
    expect(caseStudySections.map((section) => section.id)).toEqual([
      'overview',
      'market-selection',
      'sku-scorecard',
      'supplier-validation',
      'site-build',
      'traffic-test',
      'decision-review',
    ])
  })

  it('maps execution into the 4-8 week validation timeline', () => {
    expect(executionTimeline.map((item) => item.period)).toEqual([
      'Week 1',
      'Week 2',
      'Week 3-4',
      'Week 5-6',
      'Week 7-8',
    ])
  })

  it('provides concise job-search packaging materials', () => {
    expect(resumeBullets).toHaveLength(5)
    expect(resumeBullets[0]).toContain('RMB 10,000-30,000')
  })

  it('recommends the operations case layout as the primary wireframe', () => {
    const recommended = wireframeOptions.find((option) => option.recommended)

    expect(recommended?.id).toBe('operations-case')
    expect(recommended?.sections).toContain('Go / Pivot / Stop 决策')
  })

  it('provides realistic visual assets for the portfolio pages', () => {
    expect(portfolioVisuals).toHaveLength(4)
    expect(portfolioVisuals[0]).toMatchObject({
      title: '夏季 hero SKU 场景',
      alt: 'Cooling towels prepared for a summer outdoor kit',
    })
    expect(portfolioVisuals.every((visual) => visual.imageUrl.startsWith('https://images.unsplash.com/'))).toBe(
      true,
    )
  })
})
