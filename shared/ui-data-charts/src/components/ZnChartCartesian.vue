<script setup>
import { computed } from 'vue'
import { cartesianDomain, niceTicks, stackSeries } from '../utils/chart-data.js'
import { areaPath, bandPath, createScale, linePath, roundedBarPath } from '../utils/chart-geometry.js'

const props = defineProps({
  model: { type: Object, required: true },
  config: { type: Object, default: () => ({}) },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  activeKey: { type: String, default: null },
  formatValue: { type: Function, required: true },
})

const emit = defineEmits(['point-enter', 'point-leave', 'point-click', 'clear'])

const xAxis = computed(() => props.config.xAxis || {})
const yAxis = computed(() => props.config.yAxis || {})
const categories = computed(() => props.model.categories || [])
const series = computed(() => props.model.series || [])
const type = computed(() => props.model.type || 'bar')
const isBar = computed(() => String(type.value).startsWith('bar'))
const isArea = computed(() => String(type.value).startsWith('area'))
const isLine = computed(() => String(type.value).startsWith('line'))
const stacked = computed(() => Boolean(props.model.stacked))
const curve = computed(() => (props.config.curve === 'smooth' ? 'smooth' : 'linear'))
const domain = computed(() => cartesianDomain(props.model, props.config))

function tickText(value) {
  const format = yAxis.value.format
  if (typeof format === 'function') return String(format(value))
  return props.formatValue(value)
}

const tickValues = computed(() => {
  const axis = yAxis.value
  if (Array.isArray(axis.ticks) && axis.ticks.length) {
    return axis.ticks.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b)
  }
  const count = typeof axis.ticks === 'number' ? axis.ticks : axis.tickCount ?? 5
  return niceTicks(domain.value.min, domain.value.max, count)
})

const metrics = computed(() => {
  const width = Math.max(80, props.width)
  const height = Math.max(80, props.height)
  const labelLengths = tickValues.value.map((value) => tickText(value).length)
  const widestLabel = labelLengths.length ? Math.max(...labelLengths) : 1
  const left = yAxis.value.hide ? 14 : Math.min(120, widestLabel * 6.6 + 16)
  const right = 16
  const innerW = Math.max(20, width - left - right)
  const bandW = innerW / Math.max(1, categories.value.length)
  const longest = categories.value.reduce(
    (longestLabel, entry) => Math.max(longestLabel, String(entry.label ?? '').length),
    1,
  )
  const autoRotate = categories.value.length > 2 && longest * 6.8 > bandW - 8
  const rotate = xAxis.value.rotateLabels ?? autoRotate
  const top = yAxis.value.title ? 24 : 12
  const axisBottom = xAxis.value.hide ? 12 : rotate ? Math.min(88, 36 + longest * 4.2) : 32
  const bottom = axisBottom + (xAxis.value.title ? 18 : 0)
  const innerH = Math.max(20, height - top - bottom)
  return { width, height, left, right, top, bottom, innerW, innerH, bandW, rotate: Boolean(rotate), longest }
})

const yScale = computed(() => createScale(
  domain.value.min,
  domain.value.max,
  metrics.value.top + metrics.value.innerH,
  metrics.value.top,
))

function centerX(index) {
  return metrics.value.left + metrics.value.bandW * (index + 0.5)
}

function shortLabel(label) {
  const text = String(label ?? '')
  const limit = metrics.value.rotate ? 18 : Math.max(4, Math.floor(metrics.value.bandW / 6.8))
  return text.length > limit ? `${text.slice(0, Math.max(1, limit - 1))}…` : text
}

const stackedValues = computed(() => (stacked.value ? stackSeries(series.value, categories.value.length) : null))

const bars = computed(() => {
  if (!isBar.value) return []
  const track = metrics.value
  const count = Math.max(1, series.value.length)
  const usable = Math.max(2, track.bandW * 0.72)
  const slot = usable / count
  const barWidth = stacked.value ? Math.max(1, usable * 0.86) : Math.max(1, slot * 0.86)
  const baseline = yScale.value(0)
  const output = []

  series.value.forEach((entry, seriesIndex) => {
    entry.values.forEach((raw, categoryIndex) => {
      const value = Number.isFinite(raw) ? raw : null
      if (stacked.value && value == null) return
      if (!stacked.value && (value == null || value === 0)) return

      let top = value
      let bottom = 0
      if (stacked.value) {
        top = stackedValues.value[seriesIndex].top[categoryIndex]
        bottom = stackedValues.value[seriesIndex].bottom[categoryIndex]
        if (top === bottom) return
      }

      const topY = yScale.value(top)
      const bottomY = yScale.value(bottom)
      const y = Math.min(topY, bottomY)
      const height = Math.max(0.5, Math.abs(bottomY - topY))
      const x = stacked.value
        ? centerX(categoryIndex) - barWidth / 2
        : track.left + track.bandW * categoryIndex + (track.bandW - usable) / 2 + seriesIndex * slot + (slot - barWidth) / 2

      output.push({
        key: `${seriesIndex}:${categoryIndex}`,
        x,
        y,
        width: barWidth,
        height,
        path: roundedBarPath(x, y, barWidth, height, 4, baseline >= topY),
        color: entry.color,
        seriesIndex,
        categoryIndex,
        value: value ?? 0,
        tipX: x + barWidth / 2,
        tipY: y,
        label: `${categories.value[categoryIndex]?.label ?? ''}: ${entry.label ? `${entry.label} ` : ''}${props.formatValue(value ?? 0)}`,
      })
    })
  })
  return output
})

const paths = computed(() => {
  if (isBar.value) return []
  const baseline = yScale.value(0)
  if (stacked.value) {
    return series.value.map((entry, seriesIndex) => {
      const tops = entry.values.map((raw, categoryIndex) => (
        Number.isFinite(raw)
          ? { x: centerX(categoryIndex), y: yScale.value(stackedValues.value[seriesIndex].top[categoryIndex]) }
          : null
      ))
      const bottoms = entry.values.map((raw, categoryIndex) => (
        Number.isFinite(raw)
          ? { x: centerX(categoryIndex), y: yScale.value(stackedValues.value[seriesIndex].bottom[categoryIndex]) }
          : null
      ))
      return {
        key: entry.key ?? `series-${seriesIndex}`,
        color: entry.color,
        topPath: linePath(tops, curve.value),
        band: isArea.value ? bandPath(tops, bottoms) : '',
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
      topPath: linePath(points, curve.value),
      band: '',
      area: isArea.value ? areaPath(points, baseline, curve.value) : '',
    }
  })
})

const pointMarks = computed(() => {
  if (isBar.value) return []
  const output = []
  series.value.forEach((entry, seriesIndex) => {
    entry.values.forEach((raw, categoryIndex) => {
      if (!Number.isFinite(raw)) return
      const y = stacked.value
        ? yScale.value(stackedValues.value[seriesIndex].top[categoryIndex])
        : yScale.value(raw)
      output.push({
        key: `${seriesIndex}:${categoryIndex}`,
        x: centerX(categoryIndex),
        y,
        color: entry.color,
        seriesIndex,
        categoryIndex,
        value: raw,
        label: `${categories.value[categoryIndex]?.label ?? ''}: ${entry.label ? `${entry.label} ` : ''}${props.formatValue(raw)}`,
      })
    })
  })
  return output
})

const showDots = computed(() => props.config.points ?? isLine.value)

function activate(mark) {
  emit('point-click', mark)
}

function clear() {
  emit('clear')
}
</script>

<template>
  <g class="zn-chart-cartesian">
    <rect
      class="zn-chart__background"
      x="0"
      y="0"
      :width="metrics.width"
      :height="metrics.height"
      fill="transparent"
      @click="clear"
    />

    <g v-if="!yAxis.hide && yAxis.grid !== false" class="zn-chart__grid" aria-hidden="true">
      <line
        v-for="tick in tickValues"
        :key="`grid-${tick}`"
        :x1="metrics.left"
        :x2="metrics.left + metrics.innerW"
        :y1="yScale(tick)"
        :y2="yScale(tick)"
      />
    </g>

    <g class="zn-chart__labels" aria-hidden="true">
      <text
        v-for="tick in tickValues"
        :key="`y-${tick}`"
        class="zn-chart__tick"
        :x="metrics.left - 8"
        :y="yScale(tick)"
        text-anchor="end"
        dominant-baseline="middle"
      >{{ tickText(tick) }}</text>

      <line
        v-if="domain.min < 0 && domain.max > 0"
        class="zn-chart__zero"
        :x1="metrics.left"
        :x2="metrics.left + metrics.innerW"
        :y1="yScale(0)"
        :y2="yScale(0)"
      />

      <text
        v-for="(category, index) in categories"
        :key="`x-${index}`"
        class="zn-chart__tick"
        :x="centerX(index)"
        :y="metrics.height - metrics.bottom + (metrics.rotate ? 14 : 18)"
        :text-anchor="metrics.rotate ? 'end' : 'middle'"
        :transform="metrics.rotate ? `rotate(-35 ${centerX(index)} ${metrics.height - metrics.bottom + 14})` : undefined"
      >{{ shortLabel(category.label) }}</text>

      <text
        v-if="xAxis.title"
        class="zn-chart__axis-title"
        :x="metrics.left + metrics.innerW / 2"
        :y="metrics.height - 4"
        text-anchor="middle"
      >{{ xAxis.title }}</text>

      <text
        v-if="yAxis.title"
        class="zn-chart__axis-title"
        x="12"
        :y="metrics.top + metrics.innerH / 2"
        text-anchor="middle"
        :transform="`rotate(-90 12 ${metrics.top + metrics.innerH / 2})`"
      >{{ yAxis.title }}</text>
    </g>

    <g v-if="isArea" class="zn-chart__areas">
      <path
        v-for="entry in paths"
        :key="`area-${entry.key}`"
        class="zn-chart__area"
        :d="entry.band || entry.area"
        :style="{ '--zn-chart-mark-color': entry.color }"
      />
    </g>

    <g v-if="!isBar" class="zn-chart__lines">
      <path
        v-for="entry in paths"
        :key="`line-${entry.key}`"
        class="zn-chart__line"
        :d="entry.topPath"
        :style="{ '--zn-chart-mark-color': entry.color }"
      />
    </g>

    <g v-if="isBar" class="zn-chart__bars">
      <g
        v-for="bar in bars"
        :key="bar.key"
        class="zn-chart__mark"
        :class="{ 'zn-chart__mark--active': activeKey === bar.key }"
        data-chart-mark="bar"
        role="button"
        tabindex="0"
        :aria-label="bar.label"
        @click.stop="activate(bar)"
        @keydown.enter.prevent="activate(bar)"
        @keydown.space.prevent="activate(bar)"
        @mouseenter="emit('point-enter', bar)"
        @mouseleave="emit('point-leave')"
        @focus="emit('point-enter', bar)"
        @blur="emit('point-leave')"
      >
        <path class="zn-chart__bar" :d="bar.path" :style="{ '--zn-chart-mark-color': bar.color }" />
      </g>
    </g>

    <g v-else class="zn-chart__points">
      <g
        v-for="mark in pointMarks"
        :key="mark.key"
        class="zn-chart__mark"
        :class="{ 'zn-chart__mark--active': activeKey === mark.key }"
        data-chart-mark="point"
        role="button"
        tabindex="0"
        :aria-label="mark.label"
        @click.stop="activate(mark)"
        @keydown.enter.prevent="activate(mark)"
        @keydown.space.prevent="activate(mark)"
        @mouseenter="emit('point-enter', mark)"
        @mouseleave="emit('point-leave')"
        @focus="emit('point-enter', mark)"
        @blur="emit('point-leave')"
      >
        <circle class="zn-chart__hit" :cx="mark.x" :cy="mark.y" r="11" />
        <circle
          v-if="showDots"
          class="zn-chart__dot"
          :cx="mark.x"
          :cy="mark.y"
          r="3.5"
          :style="{ '--zn-chart-mark-color': mark.color }"
        />
      </g>
    </g>
  </g>
</template>

<style scoped>
.zn-chart-cartesian {
  font-family: inherit;
}

.zn-chart__grid line {
  stroke: var(--md-outline, #79747e);
  stroke-opacity: 0.24;
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.zn-chart__tick {
  fill: var(--md-on-surface-variant, #49454f);
  font-size: 11px;
  font-family: inherit;
}

.zn-chart__axis-title {
  fill: var(--md-on-surface-variant, #49454f);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.zn-chart__zero {
  stroke: var(--md-outline, #79747e);
  stroke-opacity: 0.6;
  stroke-width: 1;
}

.zn-chart__bar {
  fill: var(--zn-chart-mark-color);
  transition: fill-opacity 120ms ease;
}

.zn-chart__mark {
  cursor: pointer;
  outline: none;
}

.zn-chart__mark:hover .zn-chart__bar,
.zn-chart__mark--active .zn-chart__bar {
  fill-opacity: 0.78;
}

.zn-chart__mark:focus-visible .zn-chart__bar,
.zn-chart__mark:focus-visible .zn-chart__dot {
  stroke: var(--md-primary, #6750a4);
  stroke-width: 2;
}

.zn-chart__area {
  fill: var(--zn-chart-mark-color);
  fill-opacity: 0.18;
  stroke: none;
}

.zn-chart__line {
  fill: none;
  stroke: var(--zn-chart-mark-color);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.zn-chart__hit {
  fill: transparent;
  stroke: none;
}

.zn-chart__dot {
  fill: var(--zn-chart-mark-color);
  stroke: var(--md-surface, #fef7ff);
  stroke-width: 1.5;
  transition: r 120ms ease;
}

.zn-chart__mark:hover .zn-chart__dot,
.zn-chart__mark--active .zn-chart__dot {
  r: 5;
}
</style>
