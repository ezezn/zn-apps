import { describe, expect, it } from 'vitest'
import {
  ChartTypes,
  buildSlices,
  cartesianDomain,
  createPercentFormatter,
  createValueFormatter,
  DEFAULT_CHART_COLORS,
  getChartPalette,
  isCircularType,
  isStackedType,
  niceTicks,
  normalizeChartData,
  readChartPath,
  stackSeries,
} from '../chart-data.js'

const wideData = [
  { month: 'Jan', sales: 10, costs: 4 },
  { month: 'Feb', sales: 20, costs: 8 },
]

describe('readChartPath', () => {
  it('reads plain and nested keys', () => {
    expect(readChartPath({ a: { b: 3 } }, 'a.b')).toBe(3)
    expect(readChartPath({ a: 1 }, 'a')).toBe(1)
    expect(readChartPath(null, 'a')).toBeUndefined()
    expect(readChartPath({ a: 1 }, 'missing')).toBeUndefined()
  })
})

describe('normalizeChartData', () => {
  it('builds one series from category/value keys', () => {
    const model = normalizeChartData(wideData, { category: 'month', value: 'sales' })
    expect(model.categories.map((entry) => entry.label)).toEqual(['Jan', 'Feb'])
    expect(model.series).toHaveLength(1)
    expect(model.series[0].values).toEqual([10, 20])
    expect(model.series[0].color).toBe(DEFAULT_CHART_COLORS[0])
    expect(model.empty).toBe(false)
  })

  it('accepts primitive numeric rows', () => {
    const model = normalizeChartData([3, '7', 5], {})
    expect(model.categories.map((entry) => entry.label)).toEqual(['1', '2', '3'])
    expect(model.series[0].values).toEqual([3, 7, 5])
  })

  it('extracts series from a long format column and sums duplicates', () => {
    const data = [
      { day: 'Mon', kind: 'a', count: 1 },
      { day: 'Mon', kind: 'b', count: 2 },
      { day: 'Tue', kind: 'a', count: 3 },
      { day: 'Tue', kind: 'a', count: 4 },
    ]
    const model = normalizeChartData(data, {
      category: 'day',
      value: 'count',
      series: 'kind',
      seriesLabels: { a: 'Alpha' },
    })
    expect(model.categories.map((entry) => entry.label)).toEqual(['Mon', 'Tue'])
    expect(model.series.map((entry) => entry.label)).toEqual(['Alpha', 'b'])
    expect(model.series[0].values).toEqual([1, 7])
    expect(model.series[1].values).toEqual([2, null])
    expect(model.series[0].color).not.toBe(model.series[1].color)
  })

  it('reads wide series definitions with custom colors', () => {
    const model = normalizeChartData(wideData, {
      type: ChartTypes.BAR_GROUPED,
      category: 'month',
      series: [{ key: 'sales', label: 'Sales', color: '#ff0000' }, 'costs'],
    })
    expect(model.series[0]).toMatchObject({ key: 'sales', label: 'Sales', color: '#ff0000' })
    expect(model.series[1].label).toBe('costs')
    expect(model.series[1].color).toBe(DEFAULT_CHART_COLORS[1])
  })

  it('uses config.categories as labels', () => {
    const model = normalizeChartData(wideData, { category: 'month', categories: ['Enero', 'Febrero'] })
    expect(model.categories.map((entry) => entry.label)).toEqual(['Enero', 'Febrero'])
  })

  it('cycles a single custom color when the palette has one entry', () => {
    const model = normalizeChartData(wideData, {
      category: 'month',
      series: ['sales', 'costs'],
      colors: ['#123456'],
    })
    expect(model.series.map((entry) => entry.color)).toEqual(['#123456', '#123456'])
  })

  it('ignores series definitions for circular charts', () => {
    const model = normalizeChartData(wideData, {
      type: ChartTypes.PIE,
      category: 'month',
      value: 'sales',
      series: 'month',
    })
    expect(model.series).toHaveLength(1)
    expect(model.series[0].values).toEqual([10, 20])
  })

  it('reports empty data', () => {
    expect(normalizeChartData([], { type: 'pie' }).empty).toBe(true)
    expect(normalizeChartData([{ label: 'x' }], { value: 'missing' }).empty).toBe(true)
  })

  it('treats a circular chart without positive values as empty', () => {
    const data = [{ label: 'A', value: 0 }, { label: 'B', value: -3 }]
    expect(normalizeChartData(data, { type: 'pie' }).empty).toBe(true)
    expect(normalizeChartData(data, { type: 'bar' }).empty).toBe(false)
  })
})

describe('type helpers', () => {
  it('detects circular and stacked types', () => {
    expect(isCircularType(ChartTypes.PIE)).toBe(true)
    expect(isCircularType(ChartTypes.DONUT)).toBe(true)
    expect(isCircularType(ChartTypes.LINE)).toBe(false)
    expect(isStackedType(ChartTypes.BAR_STACKED)).toBe(true)
    expect(isStackedType(ChartTypes.AREA_STACKED)).toBe(true)
    expect(isStackedType(ChartTypes.AREA)).toBe(false)
  })

  it('selects a palette', () => {
    expect(getChartPalette({})).toBe(DEFAULT_CHART_COLORS)
    expect(getChartPalette({ colors: ['red'] })).toEqual(['red'])
    expect(getChartPalette({ colors: [] })).toBe(DEFAULT_CHART_COLORS)
  })
})

describe('cartesianDomain', () => {
  it('includes zero and the extremes', () => {
    const model = normalizeChartData([{ v: -5 }, { v: 12 }], { value: 'v' })
    expect(cartesianDomain(model, {})).toEqual({ min: -5, max: 12 })
  })

  it('respects explicit bounds and never collapses', () => {
    const model = normalizeChartData([{ v: 4 }], { value: 'v' })
    expect(cartesianDomain(model, { yAxis: { min: 0, max: 10 } })).toEqual({ min: 0, max: 10 })
    expect(cartesianDomain(model, { yAxis: { min: 5, max: 5 } })).toEqual({ min: 5, max: 6 })
  })

  it('uses stacked totals for both directions', () => {
    const model = normalizeChartData(
      [{ a: 5, b: 3, c: -2 }, { a: 1, b: 1, c: -4 }],
      { type: ChartTypes.BAR_STACKED, category: 'a', series: ['a', 'b', 'c'] },
    )
    expect(cartesianDomain(model, {})).toEqual({ min: -4, max: 8 })
  })
})

describe('niceTicks', () => {
  it('returns round ticks covering the domain', () => {
    const ticks = niceTicks(0, 93, 5)
    expect(ticks[0]).toBe(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(93)
    expect(ticks.length).toBeGreaterThan(2)
    ticks.forEach((tick) => expect(Number.isFinite(tick)).toBe(true))
  })

  it('handles flat and inverted domains', () => {
    expect(niceTicks(4, 4, 4).length).toBeGreaterThan(1)
    expect(niceTicks(10, 0, 2)[0]).toBe(0)
  })
})

describe('formatters', () => {
  it('uses a custom value formatter', () => {
    const format = createValueFormatter({ valueFormat: (value) => `${value} u` })
    expect(format(3)).toBe('3 u')
    expect(format(null)).toBe('–')
  })

  it('formats percentages', () => {
    expect(createPercentFormatter({})(50)).toBe('50%')
  })
})

describe('buildSlices', () => {
  it('spans a full circle starting at twelve o clock', () => {
    const slices = buildSlices([1, 1, 2])
    expect(slices[0].startAngle).toBe(-90)
    expect(slices[0].percent).toBe(25)
    expect(slices[2].endAngle).toBeCloseTo(270)
  })

  it('ignores non-positive values and empty totals', () => {
    const slices = buildSlices([0, -2, null])
    expect(slices.every((slice) => slice.percent === 0)).toBe(true)
  })
})

describe('stackSeries', () => {
  it('accumulates positives up and negatives down', () => {
    const stack = stackSeries(
      [{ values: [5, -1] }, { values: [3, -2] }],
      2,
    )
    expect(stack[0].bottom).toEqual([0, -1])
    expect(stack[0].top).toEqual([5, 0])
    expect(stack[1].bottom).toEqual([5, -3])
    expect(stack[1].top).toEqual([8, -1])
  })

  it('keeps gaps flat', () => {
    const stack = stackSeries([{ values: [2, null] }, { values: [1, 4] }], 2)
    expect(stack[0].top[1]).toBe(0)
    expect(stack[1].top[1]).toBe(4)
  })
})
