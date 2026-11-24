<script setup>
import { computed } from 'vue'
import { ZnDataViewField } from '@zn-apps/ui-data-view'
import { readAt } from '@zn-apps/ui-data-core'
import { DataGridColumnTypes } from '../constants.js'

const props = defineProps({
  row: { type: Object, required: true },
  column: { type: Object, required: true },
  rowIndex: { type: Number, default: 0 },
  emptyText: { type: String, default: '—' },
  size: { type: String, default: 'small' },
  /** Card body shows `column.label` above the value, like a view field. */
  showLabel: { type: Boolean, default: false }
})

const value = computed(() =>
  props.column.key ? readAt(props.row, props.column.key) : undefined
)

const isCustom = computed(
  () =>
    props.column.type === DataGridColumnTypes.CUSTOM_RENDER ||
    typeof props.column.render === 'function'
)

/** Column without the grid-only keys; `ZnDataViewField` renders the value. */
const field = computed(() => {
  const { render, sortable, editable, width, align, ...rest } = props.column
  return {
    ...rest,
    label: props.showLabel ? props.column.label : '',
    description: '',
    hidden: false
  }
})

/**
 * Functional cell renderer: reads the props at render time, so the cell
 * follows data changes without recreating the component.
 */
const CustomCell = () => {
  const output = props.column.render?.(props.row, {
    column: props.column,
    rowIndex: props.rowIndex,
    value: value.value
  })
  return output === null || output === undefined || output === '' ? props.emptyText : output
}
</script>

<template>
  <component :is="CustomCell" v-if="isCustom" />
  <ZnDataViewField
    v-else
    class="zn-data-grid-cell"
    :class="{ 'zn-data-grid-cell--with-label': showLabel }"
    :field="field"
    :model-value="value"
    :empty-text="emptyText"
    :size="size"
    :columns="1"
  />
</template>

<style scoped>
.zn-data-grid-cell {
  width: 100%;
  min-width: 0;
}

/* The column header already labels the value. */
.zn-data-grid-cell :deep(.zn-field-label) {
  display: none;
}

.zn-data-grid-cell--with-label :deep(.zn-field-label) {
  display: block;
}

.zn-data-grid-cell :deep(.zn-field-description) {
  display: none;
}
</style>
