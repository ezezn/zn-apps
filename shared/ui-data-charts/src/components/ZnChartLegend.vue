<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <ul class="zn-chart-legend">
    <li v-for="item in items" :key="item.key" class="zn-chart-legend__item">
      <span class="zn-chart-legend__swatch" :style="{ background: item.color }" aria-hidden="true" />
      <span class="zn-chart-legend__label">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped>
.zn-chart-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.zn-chart-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: var(--md-on-surface-variant, #49454f);
}

.zn-chart-legend__swatch {
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.zn-chart-legend__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
