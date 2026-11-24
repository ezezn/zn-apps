<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ZnChartCartesian from './ZnChartCartesian.vue'
import ZnChartLegend from './ZnChartLegend.vue'
import ZnChartPie from './ZnChartPie.vue'
import ZnChartTooltip from './ZnChartTooltip.vue'
import {
  ChartTypes,
  createPercentFormatter,
  createValueFormatter,
  getChartPalette,
  isCircularType,
  normalizeChartData,
} from '../utils/chart-data.js'

const props = defineProps({
  /** Raw rows: objects, numbers or numeric strings. */
  data: { type: Array, default: () => [] },
  /** Data mapping, series definition, axes, colors and chart options. */
  config: { type: Object, default: () => ({}) },
  /** Text of the empty state; translate it in the app. */
  emptyText: { type: String, default: 'No data' },
  /** Accessible name of the SVG; falls back to `config.ariaLabel`. */
  ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['point-click'])

const rootEl = ref(null)
const width = ref(0)
const active = ref(null)

const type = computed(() => props.config.type || ChartTypes.BAR)
const circular = computed(() => isCircularType(type.value))
const model = computed(() => normalizeChartData(props.data, props.config))
const height = computed(() => {
  const value = Number(props.config.height)
  return Number.isFinite(value) && value > 0 ? value : 280
})
const palette = computed(() => getChartPalette(props.config))
const formatValue = computed(() => createValueFormatter(props.config))
const formatPercent = computed(() => createPercentFormatter(props.config))
const tooltipEnabled = computed(() => props.config.tooltip !== false)
const resolvedAriaLabel = computed(() => props.ariaLabel || props.config.ariaLabel || `${type.value} chart`)

const showLegend = computed(() => {
  if (props.config.legend === false) return false
  if (props.config.legend === true) return true
  return circular.value || model.value.series.length > 1
})

const legendItems = computed(() => {
  if (circular.value) {
    return model.value.categories.map((category, index) => ({
      key: category.key,
      label: category.label,
      color: palette.value[index % palette.value.length],
    }))
  }
  return model.value.series.map((entry, index) => ({
    key: entry.key,
    label: entry.label || `Series ${index + 1}`,
    color: entry.color,
  }))
})

function categoryTitle(payload) {
  return model.value.categories[payload.categoryIndex]?.label ?? ''
}

function rowsFor(payload) {
  if (circular.value) {
    return [
      {
        label: props.config.valueLabel ?? 'Value',
        value: formatValue.value(payload.value),
        color: payload.color,
      },
      {
        label: props.config.percentLabel ?? 'Share',
        value: formatPercent.value(payload.percent),
      },
    ]
  }
  return model.value.series.map((entry, index) => ({
    label: entry.label || `Series ${index + 1}`,
    value: formatValue.value(entry.values[payload.categoryIndex]),
    color: entry.color,
    active: index === payload.seriesIndex,
  }))
}

const tooltipPlacement = computed(() => {
  if (!active.value) return null
  const plotWidth = Math.max(width.value, 120)
  const inset = Math.min(100, plotWidth / 2)
  return {
    x: Math.min(Math.max(active.value.tipX, inset), Math.max(inset, plotWidth - inset)),
    y: active.value.tipY,
    flip: active.value.tipY < 64,
  }
})

function clearActive() {
  active.value = null
}

function showPoint(payload) {
  if (!tooltipEnabled.value) return
  if (active.value?.pinned) return
  if (active.value?.key === payload.key) return
  active.value = {
    ...payload,
    title: categoryTitle(payload),
    rows: rowsFor(payload),
    pinned: false,
  }
}

function hidePoint() {
  if (active.value?.pinned) return
  active.value = null
}

function clickPoint(payload) {
  if (active.value?.pinned && active.value.key === payload.key) {
    active.value = null
  } else if (tooltipEnabled.value) {
    active.value = {
      ...payload,
      title: categoryTitle(payload),
      rows: rowsFor(payload),
      pinned: true,
    }
  }
  emit('point-click', {
    type: type.value,
    category: categoryTitle(payload),
    categoryIndex: payload.categoryIndex,
    series: circular.value ? null : model.value.series[payload.seriesIndex]?.key ?? null,
    seriesLabel: circular.value ? null : model.value.series[payload.seriesIndex]?.label || null,
    seriesIndex: circular.value ? null : payload.seriesIndex,
    value: payload.value,
    seriesValues: circular.value
      ? null
      : model.value.series.map((entry) => entry.values[payload.categoryIndex] ?? null),
    percent: circular.value ? payload.percent : null,
  })
}

let resizeObserver = null

function measure() {
  const element = rootEl.value
  if (!element) return
  const rectWidth = element.getBoundingClientRect?.().width ?? 0
  const next = Math.floor(rectWidth || element.clientWidth || 0)
  if (next > 0) width.value = next
}

onMounted(() => {
  measure()
  if (!width.value) width.value = 600
  if (typeof ResizeObserver !== 'undefined' && rootEl.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(rootEl.value)
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', measure)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
  if (typeof window !== 'undefined') window.removeEventListener('resize', measure)
})

watch(() => [props.data, props.config], clearActive)
</script>

<template>
  <div ref="rootEl" class="zn-chart" :style="{ '--zn-chart-height': `${height}px` }">
    <div v-if="model.empty" class="zn-chart__empty" role="status">{{ emptyText }}</div>

    <template v-else>
      <ZnChartLegend v-if="showLegend" class="zn-chart__legend" :items="legendItems" />

      <div class="zn-chart__plot" @keydown.esc="clearActive">
        <svg
          v-if="width"
          class="zn-chart__svg"
          :width="width"
          :height="height"
          :viewBox="`0 0 ${width} ${height}`"
          role="img"
          :aria-label="resolvedAriaLabel"
        >
          <ZnChartPie
            v-if="circular"
            :model="model"
            :config="config"
            :width="width"
            :height="height"
            :active-key="active?.key ?? null"
            :format-value="formatValue"
            :format-percent="formatPercent"
            @point-enter="showPoint"
            @point-leave="hidePoint"
            @point-click="clickPoint"
            @clear="clearActive"
          />
          <ZnChartCartesian
            v-else
            :model="model"
            :config="config"
            :width="width"
            :height="height"
            :active-key="active?.key ?? null"
            :format-value="formatValue"
            @point-enter="showPoint"
            @point-leave="hidePoint"
            @point-click="clickPoint"
            @clear="clearActive"
          />
        </svg>

        <ZnChartTooltip
          v-if="active && tooltipEnabled && tooltipPlacement"
          :title="active.title"
          :rows="active.rows"
          :x="tooltipPlacement.x"
          :y="tooltipPlacement.y"
          :flip="tooltipPlacement.flip"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.zn-chart {
  width: 100%;
  min-width: 0;
}

.zn-chart__legend {
  margin-bottom: 10px;
}

.zn-chart__plot {
  position: relative;
  width: 100%;
  height: var(--zn-chart-height);
}

.zn-chart__svg {
  display: block;
  overflow: hidden;
  font-family: inherit;
}

.zn-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--zn-chart-height);
  min-height: 120px;
  border-radius: 12px;
  background: var(--md-surface-container-low, #f7f2fa);
  color: var(--md-on-surface-variant, #49454f);
  font-size: 13px;
  line-height: 18px;
}
</style>
