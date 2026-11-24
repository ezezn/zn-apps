<script setup>
import { computed } from 'vue'
import { ZnButton, ZnDateRangeInput, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { ZnDataField } from '@zn-apps/ui-data-form'
import { FieldTypes } from '@zn-apps/ui-data-core'
import { DataGridFilterTypes } from '../constants.js'

const props = defineProps({
  /** Shared state created with `useDataGrid`; its filters come from columns + extras. */
  grid: { type: Object, required: true },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['xsmall', 'small', 'medium', 'large'].includes(value)
  },
  clearLabel: { type: String, default: 'Clear filters' }
})

const filters = computed(() => props.grid.filters.value ?? [])

function filterType(filter) {
  return filter.type || DataGridFilterTypes.TEXT
}

function isRange(filter) {
  return filterType(filter) === DataGridFilterTypes.DATE_RANGE
}

/** Filter definitions become `ZnDataField` fields, reusing the form renderer. */
function fieldFor(filter) {
  const type = filterType(filter)

  return {
    path: filter.key,
    type:
      type === DataGridFilterTypes.SELECT
        ? FieldTypes.SELECT
        : type === DataGridFilterTypes.DATE
          ? FieldTypes.DATE
          : FieldTypes.TEXT,
    label: filter.label,
    placeholder: filter.placeholder,
    options: filter.options,
    size: filter.size ?? props.size,
    min: filter.min,
    max: filter.max,
    step: filter.step
  }
}

function filterValue(filter) {
  const value = props.grid.filterValues[filter.key]
  if (value !== undefined) return value
  return isRange(filter) ? ['', ''] : ''
}

function setFilter(filter, value) {
  props.grid.setFilter(filter.key, value)
}

function clearFilters() {
  props.grid.clearFilters()
}
</script>

<template>
  <ZnRow
    v-if="filters.length"
    class="zn-data-grid-filters"
    padding="0"
    gap="12px"
    wrap
    align="center"
  >
    <div
      v-for="filter in filters"
      :key="filter.key"
      class="zn-data-grid-filters__item"
      :class="`zn-data-grid-filters__item--${filterType(filter)}`"
    >
      <ZnDataField
        v-if="!isRange(filter)"
        :field="fieldFor(filter)"
        :model-value="filterValue(filter)"
        :size="size"
        @update:model-value="setFilter(filter, $event)"
      />

      <ZnDateRangeInput
        v-else
        :model-value="filterValue(filter)"
        :start-label="filter.startLabel || filter.label"
        :end-label="filter.endLabel || ''"
        :size="size"
        :min="filter.min"
        :max="filter.max"
        @update:model-value="setFilter(filter, $event)"
      />
    </div>

    <div class="zn-data-grid-filters__clear">
      <ZnButton
        variant="text"
        :disabled="!grid.hasActiveFilters.value"
        @click="clearFilters"
      >
        <template #icon>
          <ZnIcon name="filter_alt_off" :size="18" />
        </template>
        {{ clearLabel }}
      </ZnButton>
    </div>
  </ZnRow>
</template>

<style scoped>
.zn-data-grid-filters {
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
}

.zn-data-grid-filters__item {
  flex: 1 1 180px;
  min-width: 160px;
  max-width: 320px;
}

.zn-data-grid-filters__item--date-range {
  flex: 1 1 320px;
  max-width: 460px;
}

.zn-data-grid-filters__clear {
  flex: 0 0 auto;
  margin-left: auto;
}
</style>
