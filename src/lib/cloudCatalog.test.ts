import { describe, expect, it } from 'vitest'
import { parseCloudProductList } from './cloudCatalog'

describe('cloudCatalog', () => {
  it('parses product arrays from cloud payload shapes', () => {
    expect(parseCloudProductList([])).toEqual([])
    expect(parseCloudProductList({ products: [{ id: 'a' }] })).toEqual([{ id: 'a' }])
    expect(parseCloudProductList([{ id: 'b' }])).toEqual([{ id: 'b' }])
  })
})
