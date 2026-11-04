import { describe, expect, it } from 'vitest'
import { getAppMetadata } from '../packageMetadata.js'

describe('getAppMetadata', () => {
  it('extracts the fields used by ZnAbout from package metadata', () => {
    expect(getAppMetadata({
      name: 'sample-app',
      version: '1.2.3',
      description: 'A sample application',
      author: 'Example Author'
    })).toEqual({
      name: 'sample-app',
      version: '1.2.3',
      description: 'A sample application',
      author: 'Example Author'
    })
  })

  it('supports the object form of the package.json author field', () => {
    expect(getAppMetadata({ author: { name: 'Example Author', email: 'author@example.com' } }).author)
      .toBe('Example Author')
  })

  it('returns empty strings for missing fields', () => {
    expect(getAppMetadata()).toEqual({ name: '', version: '', description: '', author: '' })
  })
})
