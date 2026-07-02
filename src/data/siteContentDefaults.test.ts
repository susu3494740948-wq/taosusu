import { describe, expect, it } from 'vitest'
import { mergeSiteContent } from '../data/siteContentDefaults'

describe('siteContentDefaults', () => {
  it('merges partial cloud payloads with defaults', () => {
    const merged = mergeSiteContent({
      store: { name: '云端店名' },
      homepage: { heroTitle: '云端标题' },
    })

    expect(merged.store.name).toBe('云端店名')
    expect(merged.homepage.heroTitle).toBe('云端标题')
    expect(merged.store.supportEmail).toContain('@')
    expect(merged.promos.length).toBeGreaterThan(0)
  })
})
