import { describe, expect, it } from 'vitest'
import {
  arcPath,
  areaPath,
  bandPath,
  createScale,
  linePath,
  polarToCartesian,
  roundedBarPath,
} from '../chart-geometry.js'

describe('createScale', () => {
  it('maps a domain onto a range', () => {
    const scale = createScale(0, 10, 100, 0)
    expect(scale(0)).toBe(100)
    expect(scale(10)).toBe(0)
    expect(scale(5)).toBe(50)
  })
})

describe('linePath', () => {
  it('draws straight segments', () => {
    const path = linePath([{ x: 0, y: 10 }, { x: 10, y: 0 }])
    expect(path).toBe('M 0 10 L 10 0')
  })

  it('breaks at null values', () => {
    const path = linePath([{ x: 0, y: 1 }, null, { x: 10, y: 3 }, { x: 20, y: 4 }])
    expect(path.match(/M/g)).toHaveLength(2)
  })

  it('uses cubic curves when smooth', () => {
    const path = linePath([{ x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 0 }], 'smooth')
    expect(path).toContain('C')
    expect(path).not.toContain('NaN')
  })

  it('is empty without points', () => {
    expect(linePath([])).toBe('')
  })
})

describe('areaPath', () => {
  it('closes the shape on the baseline', () => {
    const path = areaPath([{ x: 0, y: 10 }, { x: 10, y: 0 }], 50)
    expect(path).toContain('L 10 50')
    expect(path.trim().endsWith('Z')).toBe(true)
  })

  it('ignores single points', () => {
    expect(areaPath([{ x: 1, y: 2 }], 0)).toBe('')
  })
})

describe('bandPath', () => {
  it('joins the top and mirrored bottom edges', () => {
    const path = bandPath(
      [{ x: 0, y: 10 }, { x: 10, y: 5 }],
      [{ x: 0, y: 20 }, { x: 10, y: 18 }],
    )
    expect(path).toBe('M 0 10 L 10 5 L 10 18 L 0 20 Z')
  })

  it('skips gaps', () => {
    const path = bandPath([{ x: 0, y: 1 }, null, { x: 20, y: 1 }], [{ x: 0, y: 2 }, null, { x: 20, y: 2 }])
    expect(path.match(/M/g)).toHaveLength(2)
  })
})

describe('arcPath', () => {
  it('draws a pie wedge from the center', () => {
    const path = arcPath(100, 100, 0, 80, -90, 0)
    expect(path.startsWith('M 100 100')).toBe(true)
    expect(path).toContain('A 80 80 0 0 1')
    expect(path.endsWith('Z')).toBe(true)
  })

  it('draws a donut arc with an inner radius', () => {
    const path = arcPath(100, 100, 40, 80, -90, 180)
    expect(path).toContain('A 80 80 0 1 1')
    expect(path).toContain('A 40 40 0 1 0')
  })

  it('uses the large arc flag past 180 degrees and clamps full circles', () => {
    expect(arcPath(0, 0, 0, 10, 0, 270)).toContain('0 1 1')
    const full = arcPath(0, 0, 0, 10, 0, 360)
    expect(full).not.toMatch(/NaN/)
    expect(full).toContain('A 10 10')
  })

  it('returns nothing for degenerate angles', () => {
    expect(arcPath(0, 0, 0, 10, 10, 10)).toBe('')
  })
})

describe('polarToCartesian', () => {
  it('starts at twelve o clock', () => {
    const top = polarToCartesian(50, 50, 10, 0)
    expect(top.x).toBeCloseTo(50)
    expect(top.y).toBeCloseTo(40)
  })
})

describe('roundedBarPath', () => {
  it('rounds the value end only', () => {
    const top = roundedBarPath(0, 10, 20, 30, 4, true)
    const bottom = roundedBarPath(0, 10, 20, 30, 4, false)
    expect(top).toContain('Q')
    expect(top).not.toBe(bottom)
  })

  it('degrades to a rectangle for tiny bars', () => {
    expect(roundedBarPath(0, 0, 10, 2, 0, true)).toBe('M 0 0 H 10 V 2 H 0 Z')
  })

  it('is empty without dimensions', () => {
    expect(roundedBarPath(0, 0, 0, 10)).toBe('')
  })
})
