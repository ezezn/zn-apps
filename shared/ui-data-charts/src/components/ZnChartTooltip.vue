<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  rows: { type: Array, default: () => [] },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  /** Rendered under the point instead of above it (top edge of the plot). */
  flip: { type: Boolean, default: false },
})

const style = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}))
</script>

<template>
  <div
    class="zn-chart-tooltip"
    :class="{ 'zn-chart-tooltip--below': flip }"
    :style="style"
    role="tooltip"
  >
    <p v-if="title" class="zn-chart-tooltip__title">{{ title }}</p>
    <ul v-if="rows.length" class="zn-chart-tooltip__rows">
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="zn-chart-tooltip__row"
        :class="{ 'zn-chart-tooltip__row--active': row.active }"
      >
        <span
          v-if="row.color"
          class="zn-chart-tooltip__dot"
          :style="{ background: row.color }"
          aria-hidden="true"
        />
        <span class="zn-chart-tooltip__label">{{ row.label }}</span>
        <span class="zn-chart-tooltip__value">{{ row.value }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.zn-chart-tooltip {
  position: absolute;
  z-index: 3;
  min-width: 132px;
  max-width: 240px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--md-surface-container-highest, #e6e0e9);
  color: var(--md-on-background, #1d1b20);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.24);
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 12px));
  animation: zn-chart-tooltip-in 120ms ease-out;
}

.zn-chart-tooltip--below {
  transform: translate(-50%, 12px);
}

.zn-chart-tooltip__title {
  margin: 0 0 4px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--md-on-surface-variant, #49454f);
}

.zn-chart-tooltip__rows {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.zn-chart-tooltip__row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 18px;
  color: var(--md-on-background, #1d1b20);
}

.zn-chart-tooltip__row--active {
  font-weight: 500;
}

.zn-chart-tooltip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.zn-chart-tooltip__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-chart-tooltip__value {
  font-variant-numeric: tabular-nums;
}

@keyframes zn-chart-tooltip-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
