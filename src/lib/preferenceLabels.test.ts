import { describe, expect, it } from 'vitest'
import { buildPreferencesSummary } from './preferenceLabels'
import { defaultPreferences } from '../store/preferencesStore'

describe('preferenceLabels', () => {
  it('builds a multi-line preferences summary', () => {
    const lines = buildPreferencesSummary(defaultPreferences)
    expect(lines.length).toBeGreaterThan(3)
    expect(lines[0]).toContain('主题')
  })
})
