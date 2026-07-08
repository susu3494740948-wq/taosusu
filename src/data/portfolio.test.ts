import { describe, expect, it } from 'vitest'
import {
  caseStudySections,
  executionTimeline,
  portfolioAttachments,
  portfolioSummary,
  portfolioVisuals,
  resumeBullets,
  wireframeOptions,
} from './portfolio.ts'

describe('portfolio content', () => {
  it('summarizes the cross-border operations assistant portfolio', () => {
    expect(portfolioSummary.positioning).toContain('多平台运营助理作品集')
    expect(portfolioSummary.targetRole).toBe('跨境电商运营助理（多平台）')
    expect(portfolioSummary.capabilities).toEqual([
      'Listing 上架',
      '日报周报',
      '库存跟进',
      '评论处理',
      '活动协助',
      '数据整理',
    ])
    expect(portfolioSummary.platforms).toContain('TikTok Shop')
  })

  it('keeps the case study in assistant-focused order', () => {
    expect(caseStudySections.map((section) => section.id)).toEqual([
      'overview',
      'multi-platform-listing',
      'ops-reporting',
      'cs-review',
      'supplier-support',
      'traffic-data-entry',
      'demo-store',
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
    expect(resumeBullets[0]).toContain('TikTok Shop / Shopee / Temu')
  })

  it('recommends the assistant portfolio layout as the primary wireframe', () => {
    const recommended = wireframeOptions.find((option) => option.recommended)

    expect(recommended?.id).toBe('assistant-portfolio')
    expect(recommended?.sections).toContain('案例 1：多平台 Listing 上架')
  })

  it('provides downloadable portfolio attachments', () => {
    expect(portfolioAttachments.length).toBeGreaterThanOrEqual(4)
    expect(portfolioAttachments.some((a) => a.href.includes('multi-platform-listing-guide'))).toBe(true)
  })

  it('provides realistic visual assets for the portfolio pages', () => {
    expect(portfolioVisuals).toHaveLength(4)
    expect(portfolioVisuals[0]).toMatchObject({
      title: '多平台 Listing 对照',
    })
    expect(portfolioVisuals.every((visual) => visual.imageUrl.startsWith('https://images.unsplash.com/'))).toBe(
      true,
    )
  })
})
