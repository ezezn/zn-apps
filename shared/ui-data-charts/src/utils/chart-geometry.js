/** Pure geometry helpers: linear scales and SVG path strings. */

const round = (value) => Math.round(value * 100) / 100
const point = (value) => `${round(value.x)} ${round(value.y)}`

export function createScale(domainMin, domainMax, rangeMin, rangeMax) {
  const span = domainMax - domainMin || 1
  return (value) => rangeMin + ((value - domainMin) / span) * (rangeMax - rangeMin)
}

export function polarToCartesian(cx, cy, radius, angleDeg) {
  const radians = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) }
}

function splitSegments(points) {
  const segments = []
  let current = []
  points.forEach((entry) => {
    if (entry && Number.isFinite(entry.x) && Number.isFinite(entry.y)) current.push(entry)
    else if (current.length) {
      segments.push(current)
      current = []
    }
  })
  if (current.length) segments.push(current)
  return segments
}

function straightSegment(segment) {
  return segment.map((entry, index) => `${index ? 'L' : 'M'} ${point(entry)}`).join(' ')
}

function smoothSegment(segment) {
  if (segment.length < 2) return straightSegment(segment)
  const parts = [`M ${point(segment[0])}`]
  for (let index = 0; index < segment.length - 1; index += 1) {
    const previous = segment[index - 1] || segment[index]
    const current = segment[index]
    const next = segment[index + 1]
    const after = segment[index + 2] || next
    const c1x = current.x + (next.x - previous.x) / 6
    const c1y = current.y + (next.y - previous.y) / 6
    const c2x = next.x - (after.x - current.x) / 6
    const c2y = next.y - (after.y - current.y) / 6
    parts.push(`C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${point(next)}`)
  }
  return parts.join(' ')
}

/** Line path; `null` entries break the line into separate subpaths. */
export function linePath(points = [], curve = 'linear') {
  const draw = curve === 'smooth' ? smoothSegment : straightSegment
  return splitSegments(points)
    .map((segment) => {
      // A lone point still needs drawable geometry for round linecaps/dots.
      if (segment.length === 1) {
        const entry = segment[0]
        return `M ${point(entry)} l 0.01 0`
      }
      return draw(segment)
    })
    .filter(Boolean)
    .join(' ')
}

/** Filled area between the line and a baseline. */
export function areaPath(points = [], baseline = 0, curve = 'linear') {
  const draw = curve === 'smooth' ? smoothSegment : straightSegment
  return splitSegments(points)
    .map((segment) => {
      if (segment.length === 1) return ''
      const first = segment[0]
      const last = segment[segment.length - 1]
      return `${draw(segment)} L ${round(last.x)} ${round(baseline)} L ${round(first.x)} ${round(baseline)} Z`
    })
    .filter(Boolean)
    .join(' ')
}

/** Polygon between two aligned point arrays (stacked areas). */
export function bandPath(topPoints = [], bottomPoints = []) {
  const runs = []
  let current = []
  topPoints.forEach((top, index) => {
    const bottom = bottomPoints[index]
    if (top && bottom) current.push([top, bottom])
    else if (current.length) {
      runs.push(current)
      current = []
    }
  })
  if (current.length) runs.push(current)

  return runs
    .map((run) => {
      const parts = [`M ${point(run[0][0])}`]
      run.slice(1).forEach(([top]) => parts.push(`L ${point(top)}`))
      for (let index = run.length - 1; index >= 0; index -= 1) {
        parts.push(`L ${point(run[index][1])}`)
      }
      parts.push('Z')
      return parts.join(' ')
    })
    .join(' ')
}

/** Pie/donut slice; angles in degrees with -90 at 12 o'clock. */
export function arcPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  let sweep = endAngle - startAngle
  if (!Number.isFinite(sweep) || sweep <= 0) return ''
  if (sweep >= 359.99) sweep = 359.99
  const largeArc = sweep > 180 ? 1 : 0
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle + sweep)

  if (innerRadius > 0) {
    const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
    const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle + sweep)
    return [
      `M ${point(outerStart)}`,
      `A ${round(outerRadius)} ${round(outerRadius)} 0 ${largeArc} 1 ${point(outerEnd)}`,
      `L ${point(innerEnd)}`,
      `A ${round(innerRadius)} ${round(innerRadius)} 0 ${largeArc} 0 ${point(innerStart)}`,
      'Z',
    ].join(' ')
  }

  return [
    `M ${round(cx)} ${round(cy)}`,
    `L ${point(outerStart)}`,
    `A ${round(outerRadius)} ${round(outerRadius)} 0 ${largeArc} 1 ${point(outerEnd)}`,
    'Z',
  ].join(' ')
}

/** Bar path with rounded corners only on the value end. */
export function roundedBarPath(x, y, width, height, radius = 4, roundTop = true) {
  if (!(width > 0) || !(height > 0)) return ''
  const r = Math.max(0, Math.min(radius, width / 2, height))
  if (r === 0) return `M ${round(x)} ${round(y)} H ${round(x + width)} V ${round(y + height)} H ${round(x)} Z`
  if (roundTop) {
    return [
      `M ${round(x)} ${round(y + height)}`,
      `V ${round(y + r)}`,
      `Q ${round(x)} ${round(y)} ${round(x + r)} ${round(y)}`,
      `H ${round(x + width - r)}`,
      `Q ${round(x + width)} ${round(y)} ${round(x + width)} ${round(y + r)}`,
      `V ${round(y + height)}`,
      'Z',
    ].join(' ')
  }
  return [
    `M ${round(x)} ${round(y)}`,
    `V ${round(y + height - r)}`,
    `Q ${round(x)} ${round(y + height)} ${round(x + r)} ${round(y + height)}`,
    `H ${round(x + width - r)}`,
    `Q ${round(x + width)} ${round(y + height)} ${round(x + width)} ${round(y + height - r)}`,
    `V ${round(y)}`,
    'Z',
  ].join(' ')
}
