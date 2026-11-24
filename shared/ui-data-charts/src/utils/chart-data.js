/**
 * Data model for ZnChart: turns an arbitrary array plus a declarative `config`
 * into ordered categories and numeric series. Rendering never reads the raw
 * data, so long (one row per point) and wide (one column per series) shapes
 * share the same downstream code.
 */

export const ChartTypes = Object.freeze({
  BAR: 'bar',
  BAR_GROUPED: 'bar-grouped',
  BAR_STACKED: 'bar-stacked',
  LINE: 'line',
  LINE_MULTI: 'line-multi',
  AREA: 'area',
  AREA_STACKED: 'area-stacked',
  PIE: 'pie',
  DONUT: 'donut',
})

export const CIRCULAR_TYPES = Object.freeze([ChartTypes.PIE, ChartTypes.DONUT])
export const STACKED_TYPES = Object.freeze([ChartTypes.BAR_STACKED, ChartTypes.AREA_STACKED])

/**
 * Default categorical palette: Material Design 3 baseline tones, ordered so
 * adjacent series stay distinguishable in light and dark themes. Any CSS color
 * is accepted, so `config.colors` can replace it (CSS variables included).
 */
export const DEFAULT_CHART_COLORS = Object.freeze([
  'var(--md-primary, #6750A4)',
  '#006A6A',
  '#386A20',
  '#7D5260',
  '#0061A4',
  '#984061',
  '#B26A00',
  '#8C4A32',
])

export function isCircularType(type) {
  return CIRCULAR_TYPES.includes(type)
}

export function isStackedType(type) {
  return STACKED_TYPES.includes(type)
}

/** Reads `a.b.c` paths; a plain key is a direct property read. */
export function readChartPath(row, path) {
  if (row == null || path == null || path === '') return undefined
  if (typeof row !== 'object') return undefined
  const key = String(path)
  if (!key.includes('.')) return row[key]
  return key.split('.').reduce((value, part) => (value == null ? undefined : value[part]), row)
}

export function toChartNumber(value) {
  if (value == null || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function getChartPalette(config = {}) {
  if (Array.isArray(config.colors) && config.colors.length) {
    return config.colors.map((color) => String(color))
  }
  return DEFAULT_CHART_COLORS
}

function seriesColor(key, index, config, palette) {
  const custom = config.seriesColors
  if (Array.isArray(custom) && custom[index]) return String(custom[index])
  if (custom && typeof custom === 'object' && custom[key]) return String(custom[key])
  return palette[index % palette.length]
}

function seriesLabel(key, config) {
  const custom = config.seriesLabels
  if (custom && typeof custom === 'object' && custom[key] != null) return String(custom[key])
  return String(key)
}

function categoryLabel(raw, index, config) {
  if (Array.isArray(config.categories) && config.categories[index] != null) {
    return String(config.categories[index])
  }
  if (raw == null || raw === '') return String(index + 1)
  return String(raw)
}

function isEmptyModel(categories, series) {
  if (!categories.length || !series.length) return true
  return series.every((entry) => entry.values.every((value) => value == null))
}

/**
 * @param {Array} data rows (objects, numbers or numeric strings)
 * @param {object} config `category`, `value`, `series`, `categories`, colors…
 * @returns {{ type, stacked, categories, series, empty }}
 */
export function normalizeChartData(data, config = {}) {
  const rows = Array.isArray(data) ? data : []
  const type = config.type || ChartTypes.BAR
  const stacked = config.stacked ?? isStackedType(type)
  const base = { type, stacked, categories: [], series: [], empty: true }
  if (!rows.length) return base

  const categoryKey = config.category ?? 'label'
  const valueKey = config.value ?? 'value'
  const palette = getChartPalette(config)
  const isPrimitive = (row) => typeof row !== 'object' || row === null

  const readCategories = () =>
    rows.map((row, index) => {
      const raw = isPrimitive(row) ? null : readChartPath(row, categoryKey)
      return { key: raw == null ? `c${index}` : String(raw), label: categoryLabel(raw, index, config) }
    })

  // Circular charts read one value per category, ignoring series definitions.
  if (isCircularType(type)) {
    const categories = readCategories()
    const values = rows.map((row) => toChartNumber(isPrimitive(row) ? row : readChartPath(row, valueKey)))
    const label = config.seriesLabel ?? config.valueLabel ?? ''
    const empty = isEmptyModel(categories, [{ values }])
      || values.every((value) => value == null || value <= 0)
    return {
      ...base,
      categories,
      series: [{ key: String(valueKey), label, color: palette[0], values }],
      empty,
    }
  }

  // Long format: one row per category+series pair, extracted with `series`.
  if (typeof config.series === 'string' && config.series) {
    const seriesKey = config.series
    const categoryIndex = new Map()
    const categories = []
    const seriesIndex = new Map()
    const keys = []

    rows.forEach((row, index) => {
      const rawCategory = readChartPath(row, categoryKey)
      const categoryId = rawCategory == null ? `c${index}` : String(rawCategory)
      if (!categoryIndex.has(categoryId)) {
        categoryIndex.set(categoryId, categories.length)
        categories.push({ key: categoryId, label: categoryLabel(rawCategory, index, config) })
      }
      const rawSeries = readChartPath(row, seriesKey)
      const seriesId = rawSeries == null ? 'series' : String(rawSeries)
      if (!seriesIndex.has(seriesId)) {
        seriesIndex.set(seriesId, keys.length)
        keys.push(seriesId)
      }
    })

    const matrix = keys.map(() => new Array(categories.length).fill(null))
    rows.forEach((row, index) => {
      const rawCategory = readChartPath(row, categoryKey)
      const categoryId = rawCategory == null ? `c${index}` : String(rawCategory)
      const rawSeries = readChartPath(row, seriesKey)
      const seriesId = rawSeries == null ? 'series' : String(rawSeries)
      const value = toChartNumber(readChartPath(row, valueKey))
      if (value == null) return
      const ci = categoryIndex.get(categoryId)
      const si = seriesIndex.get(seriesId)
      matrix[si][ci] = (matrix[si][ci] ?? 0) + value
    })

    const series = keys.map((key, index) => ({
      key,
      label: seriesLabel(key, config),
      color: seriesColor(key, index, config, palette),
      values: matrix[index],
    }))

    return { ...base, categories, series, empty: isEmptyModel(categories, series) }
  }

  // Wide format: `series` lists property names (or { key, label, color }).
  if (Array.isArray(config.series) && config.series.length) {
    const definitions = config.series.map((entry, index) => {
      if (typeof entry === 'string') return { key: entry, label: undefined, color: undefined }
      if (!entry || entry.key == null) return { key: `series${index + 1}`, label: undefined, color: undefined }
      return { key: String(entry.key), label: entry.label, color: entry.color }
    })
    const categories = readCategories()
    const series = definitions.map((definition, index) => ({
      key: definition.key,
      label: definition.label != null ? String(definition.label) : seriesLabel(definition.key, config),
      color: definition.color ? String(definition.color) : seriesColor(definition.key, index, config, palette),
      values: rows.map((row) => toChartNumber(readChartPath(row, definition.key))),
    }))
    return { ...base, categories, series, empty: isEmptyModel(categories, series) }
  }

  // Single series: primitive rows or one `value` column.
  const categories = readCategories()
  const values = rows.map((row) => toChartNumber(isPrimitive(row) ? row : readChartPath(row, valueKey)))
  const series = [{
    key: String(valueKey),
    label: config.seriesLabel ?? config.valueLabel ?? '',
    color: seriesColor(String(valueKey), 0, config, palette),
    values,
  }]
  return { ...base, categories, series, empty: isEmptyModel(categories, series) }
}

/** Y domain for cartesian charts; always includes 0 unless the config forces otherwise. */
export function cartesianDomain(model, config = {}) {
  const series = Array.isArray(model?.series) ? model.series : []
  const count = Array.isArray(model?.categories) ? model.categories.length : 0
  let min = 0
  let max = 0
  let seen = false

  if (model?.stacked) {
    for (let index = 0; index < count; index += 1) {
      let positive = 0
      let negative = 0
      series.forEach((entry) => {
        const value = entry.values[index]
        if (!Number.isFinite(value)) return
        seen = true
        if (value >= 0) positive += value
        else negative += value
      })
      max = Math.max(max, positive)
      min = Math.min(min, negative)
    }
  } else {
    series.forEach((entry) => {
      entry.values.forEach((value) => {
        if (!Number.isFinite(value)) return
        seen = true
        max = Math.max(max, value)
        min = Math.min(min, value)
      })
    })
  }

  const configuredMin = Number.isFinite(config.yAxis?.min) ? config.yAxis.min : null
  const configuredMax = Number.isFinite(config.yAxis?.max) ? config.yAxis.max : null
  let low = configuredMin ?? min
  let high = configuredMax ?? max
  if (!seen && configuredMin == null && configuredMax == null) {
    low = 0
    high = 1
  }
  if (low === high) high = low + 1
  if (high < low) [low, high] = [high, low]
  return { min: low, max: high }
}

/** Round tick values (1/2/5 × 10ⁿ) covering the domain. */
export function niceTicks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1]
  let low = min
  let high = max
  if (low === high) high = low + 1
  if (high < low) [low, high] = [high, low]
  const steps = Math.max(1, Math.min(20, Math.floor(Number(count) || 5)))
  const rough = (high - low) / steps
  const magnitude = 10 ** Math.floor(Math.log10(rough || 1))
  const normalized = rough / magnitude
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  const step = factor * magnitude
  const start = Math.floor(low / step) * step
  const end = Math.ceil(high / step) * step
  const ticks = []
  for (let index = 0; index <= 200; index += 1) {
    const value = start + index * step
    if (value > end + step / 2) break
    ticks.push(Number(value.toFixed(10)))
  }
  return ticks
}

function createNumberFormatter(locale, config) {
  const options = { maximumFractionDigits: Number.isFinite(config.maximumFractionDigits) ? config.maximumFractionDigits : 2 }
  try {
    return new Intl.NumberFormat(locale || undefined, options)
  } catch {
    return new Intl.NumberFormat(undefined, options)
  }
}

function emptyValue() {
  return '–'
}

/** Returns `(value) => string` honoring `config.valueFormat` (function or locale). */
export function createValueFormatter(config = {}) {
  const format = config.valueFormat
  if (typeof format === 'function') {
    return (value) => (value == null ? emptyValue() : String(format(value)))
  }
  const formatter = createNumberFormatter(typeof format === 'string' ? format : '', config)
  return (value) => (value == null || Number.isNaN(value) ? emptyValue() : formatter.format(value))
}

/** Percentage formatter for pie/donut slices and their popups. */
export function createPercentFormatter(config = {}) {
  const formatter = createNumberFormatter(
    typeof config.valueFormat === 'string' ? config.valueFormat : '',
    { ...config, maximumFractionDigits: Number.isFinite(config.maximumFractionDigits) ? config.maximumFractionDigits : 1 },
  )
  return (percent) => `${formatter.format(Number.isFinite(percent) ? percent : 0)}%`
}

/**
 * Pie/donut geometry. Angles in degrees, 0 at 12 o'clock, clockwise.
 * Non-positive values render no slice.
 */
export function buildSlices(values = []) {
  const entries = values.map((raw, index) => ({
    index,
    value: Number.isFinite(raw) && raw > 0 ? raw : 0,
  }))
  const total = entries.reduce((sum, entry) => sum + entry.value, 0)
  let angle = -90
  return entries.map((entry) => {
    const sweep = total > 0 ? (entry.value / total) * 360 : 0
    const slice = {
      index: entry.index,
      value: entry.value,
      percent: total > 0 ? (entry.value / total) * 100 : 0,
      startAngle: angle,
      endAngle: angle + sweep,
      total,
    }
    angle += sweep
    return slice
  })
}

/**
 * Cumulative tops/bottoms for stacked bars and areas. Positive values stack up,
 * negative ones stack down from the zero baseline.
 */
export function stackSeries(series = [], length = 0) {
  const positive = new Array(length).fill(0)
  const negative = new Array(length).fill(0)
  return series.map((entry) => {
    const top = new Array(length).fill(0)
    const bottom = new Array(length).fill(0)
    for (let position = 0; position < length; position += 1) {
      const value = toChartNumber(entry.values[position])
      if (value == null) {
        top[position] = positive[position]
        bottom[position] = positive[position]
      } else if (value >= 0) {
        bottom[position] = positive[position]
        positive[position] += value
        top[position] = positive[position]
      } else {
        top[position] = negative[position]
        negative[position] += value
        bottom[position] = negative[position]
      }
    }
    return { top, bottom }
  })
}
