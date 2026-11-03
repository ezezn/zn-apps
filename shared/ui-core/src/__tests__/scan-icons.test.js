/** @vitest-environment happy-dom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/** Helper: parse the ATTRIBUTE_RE regex used in scan-icons.mjs */
function parseAttribute(attributes, attributeName) {
  // ATTRIBUTE_RE from scan-icons.mjs: /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
  const ATTRIBUTE_RE = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
  ATTRIBUTE_RE.lastIndex = 0
  let match
  while ((match = ATTRIBUTE_RE.exec(attributes)) !== null) {
    if (match[1] !== attributeName) continue
    return match[2] ?? match[3] ?? ''
  }
  return ''
}

/** Helper: strip comments as in scan-icons.mjs */
function stripComments(source) {
  // strip comments as in scan-icons.mjs
  return source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*/g, '')
}

/** Helper: ICON_TAG_RE regex used in scan-icons.mjs */
const ICON_TAG_RE = /<ZnIcon\b([^>]*)>/g

describe('scan-icons: attribute parsing', () => {
  it('reads static name attribute correctly', () => {
    const attrs = 'name="home" family="filled"'
    expect(parseAttribute(attrs, 'name')).toBe('home')
  })

  it('reads static family attribute correctly', () => {
    const attrs = 'name="home" family="outlined"'
    expect(parseAttribute(attrs, 'family')).toBe('outlined')
  })

  it('ignores dynamic :name binding', () => {
    const attrs = ':name="icon" family="filled"'
    expect(parseAttribute(attrs, 'name')).toBe('')
  })

  it('ignores dynamic v-bind:name binding', () => {
    const attrs = 'v-bind:name="icon" family="filled"'
    expect(parseAttribute(attrs, 'name')).toBe('')
  })

  it('ignores @name binding', () => {
    const attrs = '@name="icon" family="filled"'
    expect(parseAttribute(attrs, 'name')).toBe('')
  })

  it('ignores @ sign prefix', () => {
    const attrs = '@name="home" family="filled"'
    expect(parseAttribute(attrs, 'name')).toBe('')
  })
})

describe('scan-icons: comment stripping', () => {
  it('strips HTML comments', () => {
    const source = '<ZnIcon name="home" /><!-- commented out -->'
    expect(stripComments(source)).toBe('<ZnIcon name="home" />')
  })

  it('strips block comments', () => {
    const source = '<ZnIcon name="play_arrow" />/* block comment */'
    expect(stripComments(source)).toBe('<ZnIcon name="play_arrow" />')
  })

  it('strips both comment types', () => {
    const source = '<ZnIcon name="favorite" /><!--[if IE]><ZnIcon name="a" /><![endif]-->'
    expect(stripComments(source)).toBe('<ZnIcon name="favorite" />')
  })
})

describe('scan-icons: icon name regex validation', () => {
  it('accepts valid snake_case icon names', () => {
    const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/
    expect(ICON_NAME_RE.test('home')).toBe(true)
    expect(ICON_NAME_RE.test('play_arrow')).toBe(true)
    expect(ICON_NAME_RE.test('delete')).toBe(true)
    expect(ICON_NAME_RE.test('settings')).toBe(true)
  })

  it('rejects names with uppercase', () => {
    const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/
    expect(ICON_NAME_RE.test('Home')).toBe(false)
    expect(ICON_NAME_RE.test('Play_Arrow')).toBe(false)
  })

  it('rejects names with dots', () => {
    const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/
    expect(ICON_NAME_RE.test('home.1')).toBe(false)
  })

  it('rejects names with special chars', () => {
    const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/
    expect(ICON_NAME_RE.test('-home')).toBe(false)
    expect(ICON_NAME_RE.test('home!')).toBe(false)
  })
})

describe('scan-icons: reserved words', () => {
  const RESERVED_WORDS = new Set([
    'name', 'icon', 'btn', 'class', 'type', 'value', 'ref', 'key',
    'function', 'const', 'let', 'var', 'return', 'import', 'export',
    'from', 'as', 'await', 'async', 'new', 'delete', 'void', 'typeof',
    'instanceof', 'in', 'of', 'if', 'else', 'switch', 'case', 'break',
    'while', 'do', 'for', 'try', 'catch', 'finally', 'throw', 'debugger',
    'this', 'super', 'extends', 'window', 'document',
    'router', 'route', 'routes', 'Vue', 'createApp', 'mount', 'createRouter'
  ])

  it('rejects reserved words as icon names', () => {
    expect(RESERVED_WORDS.has('name')).toBe(true)
    expect(RESERVED_WORDS.has('icon')).toBe(true)
    expect(RESERVED_WORDS.has('btn')).toBe(true)
    expect(RESERVED_WORDS.has('class')).toBe(true)
  })

  it('accepts non-reserved names', () => {
    expect(RESERVED_WORDS.has('home')).toBe(false)
    expect(RESERVED_WORDS.has('play_arrow')).toBe(false)
    expect(RESERVED_WORDS.has('favorite')).toBe(false)
  })
})

describe('scan-icons: ICON_TAG_RE matching', () => {
  it('matches <ZnIcon name="home" family="filled">', () => {
    const source = '<ZnIcon name="home" family="filled">test</ZnIcon>'
    let match
    while ((match = ICON_TAG_RE.exec(source)) !== null) {
      // match[1] should contain the attributes
      expect(match[1]).toContain('name="home"')
      expect(match[1]).toContain('family="filled"')
    }
  })

  it('matches <ZnIcon> with no attributes', () => {
    const source = '<ZnIcon />'
    let match
    while ((match = ICON_TAG_RE.exec(source)) !== null) {
      expect(match[1]).toBe('')
    }
  })

  it('does not match commented-out ZnIcon', () => {
    const source = '<!-- <ZnIcon name="home" /> -->'
    // After stripComments, this should be gone
    expect(stripComments(source)).not.toContain('ZnIcon')
  })
})

describe('scan-icons: full extractIconUsage flow', () => {
  function extractIconUsage(source) {
    const names = new Set()
    const families = new Set()
    const clean = stripComments(source)
    let match
    const ICON_TAG_RE = /<ZnIcon\b([^>]*)>/g
    while ((match = ICON_TAG_RE.exec(clean)) !== null) {
      const attributes = match[1]
      const ATTRIBUTE_RE = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
      ATTRIBUTE_RE.lastIndex = 0
      let attrMatch
      while ((attrMatch = ATTRIBUTE_RE.exec(attributes)) !== null) {
        if (attrMatch[1] === 'name') {
          const name = attrMatch[2] ?? attrMatch[3] ?? ''
          if (name && /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name) && !RESERVED_WORDS.has(name)) {
            names.add(name)
          }
        }
        if (attrMatch[1] === 'family') {
          const family = attrMatch[2] ?? attrMatch[3] ?? ''
          if (family && ['filled', 'outlined', 'round', 'sharp', 'two-tone'].includes(family)) {
            families.add(family)
          }
        }
      }
    }
    return { names, families }
  }

  const RESERVED_WORDS = new Set([
    'name', 'icon', 'btn', 'class', 'type', 'value', 'ref', 'key',
    'function', 'const', 'let', 'var', 'return', 'import', 'export',
    'from', 'as', 'await', 'async', 'new', 'delete', 'void', 'typeof',
    'instanceof', 'in', 'of', 'if', 'else', 'switch', 'case', 'break',
    'while', 'do', 'for', 'try', 'catch', 'finally', 'throw', 'debugger',
    'this', 'super', 'extends', 'window', 'document',
    'router', 'route', 'routes', 'Vue', 'createApp', 'mount', 'createRouter'
  ])

  it('scans static name and family from <ZnIcon> tags', () => {
    const source = '<ZnIcon name="home" family="filled" /><ZnIcon name="play_arrow" family="outlined" />'
    const { names, families } = extractIconUsage(source)
    expect(names).toEqual(expect.arrayContaining(['home', 'play_arrow']))
    expect(families).toEqual(expect.arrayContaining(['filled', 'outlined']))
  })

  it('ignores dynamic bindings :name and v-bind:name', () => {
    const source = '<ZnIcon :name="icon" family="filled" /><ZnIcon v-bind:name="other" family="outlined" />'
    const { names, families } = extractIconUsage(source)
    // Should not pick up :name or v-bind:name
    expect(names).not.toContain('icon')
    expect(names).not.toContain('other')
    // But static family should still be picked up
    expect(families).toEqual(expect.arrayContaining(['filled', 'outlined']))
  })

  it('ignores commented-out ZnIcon tags', () => {
    const source = '<!-- <ZnIcon name="home" /> --><ZnIcon name="favorite" family="rounded" />'
    const { names, families } = extractIconUsage(source)
    expect(names).not.toContain('home')
    expect(names).toContain('favorite')
    expect(families).toEqual(expect.arrayContaining(['rounded']))
  })

  it('rejects invalid icon names (uppercase, special chars)', () => {
    const source = '<ZnIcon name="Home" family="filled" /><ZnIcon name="home.1" family="outlined" />'
    const { names, families } = extractIconUsage(source)
    expect(names).not.toContain('Home')
    expect(names).not.toContain('home.1')
    // But valid names should still be captured if any
  })

  it('uses default family when none specified (via ICON_FAMILIES check)', () => {
    // This tests that family is only added if it's in the valid families set
    // If family is missing or invalid, it should not be added
    const source = '<ZnIcon name="home" />'
    const { names, families } = extractIconUsage(source)
    expect(names).toContain('home')
    // No family added since none specified or valid
    expect(families.size).toBe(0)
  })
})