<script setup>
import { computed } from 'vue'
import ZnDashlet from './ZnDashlet.vue'

/**
 * ZnDashletSparkline - Small trend sparkline for dashboard cards.
 *
 * Props:
 *  - data: Array<number> - numeric data points
 *  - height: number - height in px (default 40)
 *  - width: number - width in px (default 120)
 *  - variant: variant of ZnDashlet
 *  - filled: boolean - whether to fill with variant color
 */
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 40
  },
  width: {
    type: Number,
    default: 120
  },
  variant: {
    type: String,
    default: 'primary'
  },
  filled: {
    type: Boolean,
    default: true
  }
})

const sparklinePath = computed(() => {
  const data = Array.isArray(props.data) ? props.data.map(Number) : []
  if (data.length < 2) return ''

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  const padding = 4
  const innerWidth = Math.max(props.width - padding * 2, 1)
  const innerHeight = Math.max(props.height - padding * 2, 1)

  return data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * innerWidth
      const ratio = range === 0 ? 0.5 : (value - min) / range
      // SVG's y axis grows downwards: invert so larger values sit higher.
      const y = padding + innerHeight - ratio * innerHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
})
</script>

<template>
  <ZnDashlet
    :variant="variant"
    :filled="filled"
    :height="height"
    class="zn-dashlet-sparkline-card"
    :style="{ width: `${width}px` }"
  >
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      class="zn-dashlet-sparkline"
      aria-hidden="true"
    >
      <path
        v-if="sparklinePath"
        class="zn-dashlet-sparkline__line"
        :d="sparklinePath"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </ZnDashlet>
</template>

<style scoped>
.zn-dashlet.zn-dashlet-sparkline-card {
  border-radius: 8px;
  overflow: hidden;
}

/* El svg ocupa exactamente la card: sin padding ni layout de columna. */
.zn-dashlet-sparkline-card :deep(.zn-card__content) {
  display: block;
  padding: 0;
}

.zn-dashlet-sparkline {
  display: block;
}

.zn-dashlet-sparkline__line {
  stroke: currentColor;
}

/* Variant colors override the stroke */
.zn-dashlet--primary .zn-dashlet-sparkline__line { stroke: var(--md-primary, #6750A4); }
.zn-dashlet--success .zn-dashlet-sparkline__line { stroke: var(--md-success, #2e7d32); }
.zn-dashlet--warning .zn-dashlet-sparkline__line { stroke: var(--md-warning, #f57f17); }
.zn-dashlet--error .zn-dashlet-sparkline__line { stroke: var(--md-error, #b00020); }
.zn-dashlet--info .zn-dashlet-sparkline__line { stroke: var(--md-info, #0288d1); }
.zn-dashlet--neutral .zn-dashlet-sparkline__line { stroke: var(--md-on-surface-variant, #787878); }
</style>
