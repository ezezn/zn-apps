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
    default: 'xsmall',
    validator: (value) => ['xsmall', 'small', 'medium', 'large'].includes(value)
  },
  /** Shows the icon-only clear action while at least one filter exists. */
  showClear: { type: Boolean, default: true },
  /** Shows the inline table/card switch. */
  showViewSwitch: { type: Boolean, default: false },
  /** Current view, used to mark the switch selection. */
  view: {
    type: String,
    default: 'table',
    validator: (value) => ['table', 'card'].includes(value)
  },
  clearLabel: { type: String, default: 'Clear filters' },
  viewSwitchLabel: { type: String, default: 'View' },
  tableViewLabel: { type: String, default: 'Table view' },
  cardViewLabel: { type: String, default: 'Card view' }
})

const emit = defineEmits(['update:view'])

const filters = computed(() => props.grid.filters.value ?? [])
const showClearAction = computed(() => props.showClear && filters.value.length > 0)
const showActions = computed(() => showClearAction.value || props.showViewSwitch)
const showBar = computed(() => filters.value.length > 0 || props.showViewSwitch)

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

function setView(view) {
  emit('update:view', view)
}
</script>

<template>
  <ZnRow
    v-if="showBar"
    class="zn-data-grid-filters"
    padding="0"
    gap="8px"
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

    <div v-if="showActions" class="zn-data-grid-filters__actions">
      <ZnButton
        v-if="showClearAction"
        class="zn-data-grid-filters__action"
        variant="text"
        icon-only
        :disabled="!grid.hasActiveFilters.value"
        :aria-label="clearLabel"
        :title="clearLabel"
        @click="clearFilters"
      >
        <ZnIcon name="filter_alt_off" :size="20" />
      </ZnButton>

      <div
        v-if="showViewSwitch"
        class="zn-data-grid-filters__view-switch"
        role="group"
        :aria-label="viewSwitchLabel"
      >
        <ZnButton
          class="zn-data-grid-filters__action zn-data-grid-filters__view-button"
          variant="text"
          icon-only
          toggle
          :selected="view === 'table'"
          :aria-label="tableViewLabel"
          :title="tableViewLabel"
          @click="setView('table')"
        >
          <ZnIcon name="table_rows" :size="20" />
        </ZnButton>

        <ZnButton
          class="zn-data-grid-filters__action zn-data-grid-filters__view-button"
          variant="text"
          icon-only
          toggle
          :selected="view === 'card'"
          :aria-label="cardViewLabel"
          :title="cardViewLabel"
          @click="setView('card')"
        >
          <ZnIcon name="view_agenda" :size="20" />
        </ZnButton>
      </div>
    </div>
  </ZnRow>
</template>

<style scoped>
.zn-data-grid-filters {
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
}

/* Filters share the remaining width; the icon actions keep their size. */
.zn-data-grid-filters__item {
  flex: 1 1 150px;
  min-width: 130px;
}

.zn-data-grid-filters__item--date-range {
  flex: 1 1 280px;
  min-width: 240px;
}

.zn-data-grid-filters__actions {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.zn-data-grid-filters__view-switch {
  display: inline-flex;
  align-items: center;
}

.zn-data-grid-filters__action {
  width: 36px;
  min-width: 36px;
  height: 36px;
  min-height: 36px;
}

@media (max-width: 720px) {
  .zn-data-grid-filters__item {
    flex: 1 1 160px;
    min-width: 0;
  }

  .zn-data-grid-filters__item--date-range {
    flex: 1 1 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .zn-data-grid-filters__item,
  .zn-data-grid-filters__item--date-range {
    flex: 1 1 100%;
    min-width: 0;
  }

  .zn-data-grid-filters__actions {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
  }
}
</style>
