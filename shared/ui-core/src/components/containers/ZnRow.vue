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
    default: 'center' // 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch'
  },
  justify: {
    type: String,
    default: 'flex-start' // 'flex-start' | 'center' | 'flex-end' | 'space-between'
  },
  direction: {
    type: String,
    default: 'row', // 'row' | 'column'
    validator: (value) => ['row', 'column'].includes(value)
  },
  wrap: {
    type: Boolean,
    default: false
  }
})

const rowStyles = computed(() => ({
  padding: props.padding,
  gap: props.gap,
  flexDirection: props.direction,
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  alignItems: props.align,
  justifyContent: props.justify
}))
</script>

<style scoped>
.zn-row {
  display: flex;
  width: 100%;
  box-sizing: border-box;
}
</style>
