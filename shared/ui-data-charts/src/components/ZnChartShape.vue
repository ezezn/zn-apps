<script setup>
import { computed } from 'vue'
import {
  buildSlices,
  cartesianDomain,
  getChartPalette,
  isCircularType,
  normalizeChartData,
  stackSeries,
} from '../utils/chart-data.js'
import {
  arcPath,
  areaPath,
  bandPath,
  createScale,
  linePath,
  roundedBarPath,
} from '../utils/chart-geometry.js'

/**
 * Miniature of the same chart: no axes, labels, legend, popup or interaction.
 * It uses a compact pixel viewBox so it can live in an icon slot or a summary
 * card; the SVG scales with CSS when the container is larger.
 */
const props = defineProps({
  /** Same rows accepted by `ZnChart`. */
  data: { type: Array, default: () => [] },
  /** Same mapping/presentation config; `width`/`height` of the chart are ignored. */
  config: { type: Object, default: () => ({}) },
  /** ViewBox width in px; also the rendered width unless CSS overrides it. */
  width: { type: Number, default: 64 },
  /** ViewBox height in px. */
  height: { type: Number, default: 40 },
  /** Accessible name. Without it the shape is decorative (`aria-hidden`). */
  ariaLabel: { type: String, default: '' },
})

const PADDING = 2

const model = computed(() => normalizeChartData(props.data, props.config))
const type = computed(() => model.value.type || 'bar')
const circular = computed(() => isCircularType(type.value))
const isBar = computed(() => String(type.value).startsWith('bar'))
const isArea = computed(() => String(type.value).startsWith('area'))
const stacked = computed(() => Boolean(model.value.stacked))
const curve = computed(() => (props.config.curve === 'smooth' ? 'smooth' : 'linear'))
const empty = computed(() => model.value.empty)

const viewWidth = computed(() => Math.max(8, Number(props.width) || 64))
const viewHeight = computed(() => Math.max(8, Number(props.height) || 40))
const innerWidth = computed(() => Math.max(1, viewWidth.value - PADDING * 2))
const innerHeight = computed(() => Math.max(1, viewHeight.value - PADDING * 2))
const categories = computed(() => model.value.categories || [])
const series = computed(() => model.value.series || [])
const bandWidth = computed(() => innerWidth.value / Math.max(1, categories.value.length))

const yScale = computed(() => {
  const domain = cartesianDomain(model.value, props.config)
  return createScale(domain.min, domain.max, PADDING + innerHeight.value, PADDING)
})

function centerX(index) {
  return PADDING + bandWidth.value * (index + 0.5)
}

const stacks = computed(() => (stacked.value ? stackSeries(series.value, categories.value.length) : null))

const bars = computed(() => {
  if (!isBar.value || empty.value) return []
  const count = Math.max(1, series.value.length)
  const usable = Math.max(1, bandWidth.value * 0.76)
  const slot = usable / count
  const barWidth = stacked.value ? Math.max(1, usable * 0.9) : Math.max(1, slot * 0.86)
  const radius = Math.min(2, barWidth / 2, innerHeight.value / 3)
  const output = []

  series.value.forEach((entry, seriesIndex) => {
    entry.values.forEach((raw, categoryIndex) => {
      const value = Number.isFinite(raw) ? raw : null
      if (stacked.value && value == null) return
      if (!stacked.value && (value == null || value === 0)) return

      let top = value
      let bottom = 0
      if (stacked.value) {
        top = stacks.value[seriesIndex].top[categoryIndex]
        bottom = stacks.value[seriesIndex].bottom[categoryIndex]
        if (top === bottom) return
      }

      const topY = yScale.value(top)
      const bottomY = yScale.value(bottom)
      const y = Math.min(topY, bottomY)
      const barHeight = Math.max(0.5, Math.abs(bottomY - topY))
      const x = stacked.value
        ? centerX(categoryIndex) - barWidth / 2
        : PADDING + bandWidth.value * categoryIndex + (bandWidth.value - usable) / 2 + seriesIndex * slot + (slot - barWidth) / 2

      output.push({
        key: `${seriesIndex}:${categoryIndex}`,
        path: roundedBarPath(x, y, barWidth, barHeight, radius, yScale.value(0) >= topY),
        color: entry.color,
      })
    })
  })
  return output
})

const paths = computed(() => {
  if (isBar.value || empty.value) return []
  const baseline = yScale.value(0)
  if (stacked.value) {
    return series.value.map((entry, seriesIndex) => {
      const tops = entry.values.map((raw, categoryIndex) => (
        Number.isFinite(raw)
          ? { x: centerX(categoryIndex), y: yScale.value(stacks.value[seriesIndex].top[categoryIndex]) }
          : null
      ))
      const bottoms = entry.values.map((raw, categoryIndex) => (
        Number.isFinite(raw)
          ? { x: centerX(categoryIndex), y: yScale.value(stacks.value[seriesIndex].bottom[categoryIndex]) }
          : null
      ))
      return {
        key: entry.key ?? `series-${seriesIndex}`,
        color: entry.color,
        line: linePath(tops, curve.value),
        area: isArea.value ? bandPath(tops, bottoms) : '',
      }
    })
  }
  return series.value.map((entry, seriesIndex) => {
    const points = entry.values.map((raw, categoryIndex) => (
      Number.isFinite(raw) ? { x: centerX(categoryIndex), y: yScale.value(raw) } : null
    ))
    return {
      key: entry.key ?? `series-${seriesIndex}`,
      color: entry.color,
      line: linePath(points, curve.value),
      area: isArea.value ? areaPath(points, baseline, curve.value) : '',
    }
  })
})

const slices = computed(() => {
  if (!circular.value || empty.value) return []
  const radius = Math.max(2, Math.min(viewWidth.value, viewHeight.value) / 2 - 1)
  const cx = viewWidth.value / 2
  const cy = viewHeight.value / 2
  const donut = type.value === 'donut'
  const ratio = Number.isFinite(props.config.donut?.innerRadius) ? props.config.donut.innerRadius : 0.62
  const innerRadius = donut ? Math.min(radius * 0.95, Math.max(0, radius * ratio)) : 0
  const palette = getChartPalette(props.config)

  return buildSlices(series.value[0]?.values ?? [])
    .filter((slice) => slice.value > 0)
    .map((slice) => ({
      key: `slice-${slice.index}`,
      path: arcPath(cx, cy, innerRadius, radius, slice.startAngle, slice.endAngle),
      color: palette[slice.index % palette.length],
    }))
})
</script>

<template>
  <svg
    class="zn-chart-shape"
    :class="`zn-chart-shape--${type}`"
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    :width="viewWidth"
    :height="viewHeight"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    focusable="false"
  >
    <template v-if="empty">
      <line
        v-if="!circular"
        class="zn-chart-shape__placeholder"
        :x1="PADDING"
        :x2="viewWidth - PADDING"
        :y1="viewHeight / 2"
        :y2="viewHeight / 2"
        stroke-dasharray="3 3"
      />
      <circle
        v-else
        class="zn-chart-shape__placeholder"
        :cx="viewWidth / 2"
        :cy="viewHeight / 2"
        :r="Math.max(2, Math.min(viewWidth, viewHeight) / 2 - 2)"
        stroke-dasharray="3 3"
      />
    </template>

    <g v-else-if="circular" class="zn-chart-shape__slices">
      <path
        v-for="slice in slices"
        :key="slice.key"
        class="zn-chart-shape__slice"
        :d="slice.path"
        :style="{ '--zn-chart-mark-color': slice.color }"
      />
    </g>

    <g v-else>
      <template v-for="entry in paths" :key="`area-${entry.key}`">
        <path
          v-if="entry.area"
          class="zn-chart-shape__area"
          :d="entry.area"
          :style="{ '--zn-chart-mark-color': entry.color }"
        />
      </template>
      <path
        v-for="entry in paths"
        :key="`line-${entry.key}`"
        class="zn-chart-shape__line"
        :d="entry.line"
        :style="{ '--zn-chart-mark-color': entry.color }"
      />
      <path
        v-for="bar in bars"
        :key="bar.key"
        class="zn-chart-shape__bar"
        :d="bar.path"
        :style="{ '--zn-chart-mark-color': bar.color }"
      />
    </g>
  </svg>
</template>

<style scoped>
.zn-chart-shape {
  display: block;
  overflow: visible;
  font-family: inherit;
}

.zn-chart-shape__bar,
.zn-chart-shape__slice {
  fill: var(--zn-chart-mark-color);
}

.zn-chart-shape__slice {
  stroke: var(--md-surface, #fef7ff);
  stroke-width: 0.75;
}

.zn-chart-shape__area {
  fill: var(--zn-chart-mark-color);
  fill-opacity: 0.22;
  stroke: none;
}

.zn-chart-shape__line {
  fill: none;
  stroke: var(--zn-chart-mark-color);
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.zn-chart-shape__placeholder {
  fill: none;
  stroke: var(--md-outline-variant, #cac4d0);
  stroke-width: 1.5;
  stroke-linecap: round;
}
</style>
