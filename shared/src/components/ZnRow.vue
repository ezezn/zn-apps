<template>
  <div class="zn-row" :style="rowStyles">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: '16px'
  },
  gap: {
    type: String,
    default: '12px'
  },
  align: {
    type: String,
    default: 'center' // 'center' | 'flex-start' | 'flex-end'
  }
})

const rowStyles = computed(() => ({
  padding: props.padding,
  gap: props.gap,
  alignItems: props.align
}))
</script>

<style scoped>
.zn-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
}
</style>