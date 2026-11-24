<script setup>
import { computed } from 'vue'
import { ZnIcon } from '@zn-apps/ui-core'
import ZnDataGridCell from './ZnDataGridCell.vue'

const props = defineProps({
  row: { type: Object, required: true },
  column: { type: Object, required: true },
  rowIndex: { type: Number, default: 0 },
  editable: { type: Boolean, default: false },
  editLabel: { type: String, default: 'Edit' },
  size: { type: String, default: 'small' },
  showLabel: { type: Boolean, default: false }
})

const emit = defineEmits(['edit'])

const ariaLabel = computed(
  () => `${props.editLabel} ${props.column.label || ''}`.trim()
)

function startEdit() {
  if (!props.editable) return
  emit('edit', {
    row: props.row,
    rowIndex: props.rowIndex,
    column: props.column
  })
}

function onKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  startEdit()
}
</script>

<template>
  <div
    v-if="editable"
    :class="['zn-data-grid-cell-trigger', 'zn-data-grid__cell--editable']"
    role="button"
    tabindex="0"
    :aria-label="ariaLabel"
    @click="startEdit"
    @keydown="onKeydown"
  >
    <ZnDataGridCell
      :row="row"
      :column="column"
      :row-index="rowIndex"
      :size="size"
      :show-label="showLabel"
    />
    <ZnIcon name="edit" :size="16" class="zn-data-grid-cell-trigger__icon" />
  </div>

  <div v-else class="zn-data-grid-cell-trigger zn-data-grid-cell-trigger--static">
    <ZnDataGridCell
      :row="row"
      :column="column"
      :row-index="rowIndex"
      :size="size"
      :show-label="showLabel"
    />
  </div>
</template>

<style scoped>
.zn-data-grid-cell-trigger {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
}

.zn-data-grid-cell-trigger:not(.zn-data-grid-cell-trigger--static) {
  cursor: pointer;
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.zn-data-grid-cell-trigger:not(.zn-data-grid-cell-trigger--static):hover,
.zn-data-grid-cell-trigger:not(.zn-data-grid-cell-trigger--static):focus-visible {
  background-color: var(--md-surface-container-highest);
  outline: none;
}

.zn-data-grid-cell-trigger:not(.zn-data-grid-cell-trigger--static):focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -2px;
}

.zn-data-grid-cell-trigger__icon {
  flex: 0 0 auto;
  color: var(--md-primary);
  opacity: 0;
  transition: opacity 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.zn-data-grid-cell-trigger:hover .zn-data-grid-cell-trigger__icon,
.zn-data-grid-cell-trigger:focus-visible .zn-data-grid-cell-trigger__icon {
  opacity: 1;
}

/* Card body: label above value, like a view field. */
.zn-data-grid-cell-trigger--static {
  align-items: flex-start;
  padding: 0;
}
</style>
