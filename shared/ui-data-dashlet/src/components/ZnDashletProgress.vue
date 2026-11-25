<script setup>
import { computed } from 'vue'
import ZnDashlet from './ZnDashlet.vue'

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

const percentage = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const cardHeight = computed(() => props.height + (props.showValue ? 16 : 0))
</script>

<template>
  <ZnDashlet
    :variant="variant"
    :filled="filled"
    :height="cardHeight"
    class="zn-dashlet-progress-card"
  >
    <div class="zn-dashlet-progress-wrapper">
      <span v-if="showValue" class="zn-dashlet-progress__value">
        {{ Math.round(percentage) }}%
      </span>
      <div class="zn-dashlet-progress" :style="{ height: `${height}px` }">
        <div
          class="zn-dashlet-progress__fill"
          :style="{
            width: `${percentage}%`,
            background: filled ? 'var(--zn-dashlet-bg)' : 'currentColor'
          }"
        />
      </div>
    </div>
  </ZnDashlet>
</template>

<style scoped>
.zn-dashlet-progress-card :deep(.zn-card__content) {
  justify-content: center;
  padding: 0 12px;
}

.zn-dashlet-progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.zn-dashlet-progress__value {
  align-self: flex-end;
  font-size: 0.75rem;
  line-height: 1;
  color: var(--md-on-surface-variant, #787878);
}

.zn-dashlet-progress {
  width: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: var(--md-surface-variant, #e7e0ec);
}

.zn-dashlet-progress__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}
</style>
