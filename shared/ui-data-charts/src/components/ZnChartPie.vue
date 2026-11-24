<script setup>
import { computed } from 'vue'
import { buildSlices, getChartPalette } from '../utils/chart-data.js'
import { arcPath, polarToCartesian } from '../utils/chart-geometry.js'

const props = defineProps({
  model: { type: Object, required: true },
  config: { type: Object, default: () => ({}) },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  activeKey: { type: String, default: null },
  formatValue: { type: Function, required: true },
  formatPercent: { type: Function, required: true },
})

const emit = defineEmits(['point-enter', 'point-leave', 'point-click', 'clear'])

const palette = computed(() => getChartPalette(props.config))
const donut = computed(() => props.model.type === 'donut')
const donutConfig = computed(() => props.config.donut || {})

const geometry = computed(() => {
  const cx = Math.max(60, props.width) / 2
  const cy = Math.max(80, props.height) / 2
  const radius = Math.max(12, Math.min(Math.max(60, props.width), Math.max(80, props.height)) / 2 - 14)
  const ratio = Number.isFinite(donutConfig.value.innerRadius) ? donutConfig.value.innerRadius : 0.62
  const innerRadius = donut.value ? Math.min(radius * 0.95, Math.max(0, radius * ratio)) : 0
  return { cx, cy, radius, innerRadius }
})

const slices = computed(() => {
  const values = props.model.series?.[0]?.values ?? []
  const { cx, cy, radius, innerRadius } = geometry.value
  return buildSlices(values)
    .filter((slice) => slice.value > 0)
    .map((slice) => {
      const color = palette.value[slice.index % palette.value.length]
      const middleAngle = (slice.startAngle + slice.endAngle) / 2
      const tipRadius = (innerRadius + radius) / 2
      const tip = polarToCartesian(cx, cy, tipRadius, middleAngle)
      const category = props.model.categories?.[slice.index]
      return {
        key: `slice-${slice.index}`,
        index: slice.index,
        categoryIndex: slice.index,
        value: slice.value,
        percent: slice.percent,
        color,
        path: arcPath(cx, cy, innerRadius, radius, slice.startAngle, slice.endAngle),
        tipX: tip.x,
        tipY: tip.y,
        label: `${category?.label ?? ''}: ${props.formatValue(slice.value)} (${props.formatPercent(slice.percent)})`,
      }
    })
})

const total = computed(() => slices.value.reduce((sum, slice) => sum + slice.value, 0))
const totalLabel = computed(() => donutConfig.value.totalLabel ?? '')

function activate(slice) {
  emit('point-click', slice)
}

function clear() {
  emit('clear')
}
</script>

<template>
  <g class="zn-chart-pie">
    <rect
      class="zn-chart__background"
      x="0"
      y="0"
      :width="width"
      :height="height"
      fill="transparent"
      @click="clear"
    />

    <g class="zn-chart__slices">
      <g
        v-for="slice in slices"
        :key="slice.key"
        class="zn-chart__mark"
        :class="{ 'zn-chart__mark--active': activeKey === slice.key }"
        data-chart-mark="slice"
        role="button"
        tabindex="0"
        :aria-label="slice.label"
        @click.stop="activate(slice)"
        @keydown.enter.prevent="activate(slice)"
        @keydown.space.prevent="activate(slice)"
        @mouseenter="emit('point-enter', slice)"
        @mouseleave="emit('point-leave')"
        @focus="emit('point-enter', slice)"
        @blur="emit('point-leave')"
      >
        <path class="zn-chart__slice" :d="slice.path" :style="{ '--zn-chart-mark-color': slice.color }" />
      </g>
    </g>

    <g
      v-if="donut && donutConfig.showTotal !== false"
      class="zn-chart__total"
      aria-hidden="true"
    >
      <text
        class="zn-chart__total-value"
        :x="geometry.cx"
        :y="geometry.cy + (totalLabel ? -2 : 6)"
        text-anchor="middle"
      >{{ formatValue(total) }}</text>
      <text
        v-if="totalLabel"
        class="zn-chart__total-label"
        :x="geometry.cx"
        :y="geometry.cy + 16"
        text-anchor="middle"
      >{{ totalLabel }}</text>
    </g>
  </g>
</template>

<style scoped>
.zn-chart-pie {
  font-family: inherit;
}

.zn-chart__mark {
  cursor: pointer;
  outline: none;
}

.zn-chart__slice {
  fill: var(--zn-chart-mark-color);
  stroke: var(--md-surface, #fef7ff);
  stroke-width: 1;
  transition: fill-opacity 120ms ease;
}

.zn-chart__mark:hover .zn-chart__slice,
.zn-chart__mark--active .zn-chart__slice {
  fill-opacity: 0.82;
}

.zn-chart__mark:focus-visible .zn-chart__slice {
  stroke: var(--md-on-surface-variant, #49454f);
  stroke-width: 2;
}

.zn-chart__total-value {
  fill: var(--md-on-background, #1d1b20);
  font-size: 20px;
  font-weight: 500;
  font-family: inherit;
}

.zn-chart__total-label {
  fill: var(--md-on-surface-variant, #49454f);
  font-size: 11px;
  letter-spacing: 0.4px;
  font-family: inherit;
}
</style>
