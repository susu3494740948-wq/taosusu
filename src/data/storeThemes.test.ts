import { describe, expect, it } from 'vitest'
import { storeThemes } from './storeThemes'

describe('storeThemes', () => {
  it('defines six selectable store themes', () => {
    expect(storeThemes).toHaveLength(6)
    expect(storeThemes.map((theme) => theme.id)).toEqual([
      'classic',
      'ocean',
      'sunset',
      'rose',
      'forest',
      'midnight',
    ])
  })
})
