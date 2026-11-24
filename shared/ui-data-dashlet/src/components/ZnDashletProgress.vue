<script setup>
import { computed } from 'vue'

/**
 * ZnDashletProgress - Progress bar for dashboard cards.
 *
 * Props:
 *  - value: number - current value (0-100)
 *  - max: number - maximum value (default 100)
 *  - showValue: boolean - whether to show the percentage text
 *  - height: number - bar height in px (default 8)
 *  - variant: variant of ZnDashlet
 *  - filled: boolean - whether the bar should use the variant color
 */
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  showValue: {
    type: Boolean,
    default: true
  },
  height: {
    type: Number,
    default: 8
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
         background: ${props.filled ? 'var(--zn-dashlet-bg)' : 'transparent'};
         color: ${props.filled ? 'var(--zn-dashlet-fg)' : 'inherit'};
         border-radius: 4px;
         overflow: hidden;
         font-size: 0;
       ">
  </div>
</template>

<style scoped>
/* Progress bar background track */
.zn-dashlet-progress {
  height: 100%;
  width: 100%;
  background: currentColor;
  opacity: 0.1;
}

/* Progress fill */
.zn-dashlet-progress__fill {
  height: 100%;
  width: 0%;
  background: currentColor;
  transition: width 0.3s ease;
}

/* Variant colors for progress fill */
.zn-dashlet--primary .zn-dashlet-progress__fill { background: var(--md-primary, #6750A4); }
.zn-dashlet--success .zn-dashlet-progress__fill { background: var(--md-success, #2e7d32); }
.zn-dashlet--warning .zn-dashlet-progress__fill { background: var(--md-warning, #f57f17); }
.zn-dashlet--error .zn-dashlet-progress__fill { background: var(--md-error, #b00020); }
.zn-dashlet--info .zn-dashlet-progress__fill { background: var(--md-info, #0288d1); }
.zn-dashlet--neutral .zn-dashlet-progress__fill { background: var(--md-on-surface-variant, #787878); }
</style>

<script setup>
const percentage = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>