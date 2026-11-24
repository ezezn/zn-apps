<script setup>
import { computed } from 'vue'

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
</script>

<template>
  <div class="zn-dashlet"
       :class="`zn-dashlet--${props.variant} ${props.class}`"
       style="
         height: ${props.height}px;
         width: ${props.width}px;
         background: ${props.filled ? 'var(--zn-dashlet-bg)' : 'transparent'};
         color: ${props.filled ? 'var(--zn-dashlet-fg)' : 'inherit'};
         border-radius: 8px;
         overflow: hidden;
         font-size: 0;
       ">
    <svg :height="props.height" :width="props.width" class="zn-dashlet-sparkline" aria-hidden="true">
      <path
        class="zn-dashlet-sparkline__line"
        :d="sparklinePath"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.zn-dashlet-sparkline {
  display: block;
  position: relative;
}

.zn-dashlet-sparkline__line {
  stroke: currentColor;
  fill: none;
}

/* Variant colors override the stroke */
.zn-dashlet--primary .zn-dashlet-sparkline__line { stroke: var(--md-primary, #6750A4); }
.zn-dashlet--success .zn-dashlet-sparkline__line { stroke: var(--md-success, #2e7d32); }
.zn-dashlet--warning .zn-dashlet-sparkline__line { stroke: var(--md-warning, #f57f17); }
.zn-dashlet--error .zn-dashlet-sparkline__line { stroke: var(--md-error, #b00020); }
.zn-dashlet--info .zn-dashlet-sparkline__line { stroke: var(--md-info, #0288d1); }
.zn-dashlet--neutral .zn-dashlet-sparkline__line { stroke: var(--md-on-surface-variant, #787878); }
</style>

<script setup>
const generateSparkline = (data) => {
  if (data.length < 2) return 'M 0 0 L 0 0'

  const max = Math.max(...data.map(d => Math.abs(d)))
  const min = Math.min(...data.map(d => Math.abs(d)))
  const range = Math.max(max - min, 1)

  const normalize = (d) => {
    if (range === 0) return 0.5
    return ((d - min) / range) * (props.height - 8) + 4
  }

  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * (props.width - 4)
    const y = normalize(d)
    return `${x},${y}`
  })

  return `M ${points.join(' L ')} Z`
}

const sparklinePath = computed(() => generateSparkline(props.data))
</script>