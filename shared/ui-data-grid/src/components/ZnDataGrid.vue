<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ZnButton, ZnDialog, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { ZnDataField } from '@zn-apps/ui-data-form'
import { readAt, writeAt } from '@zn-apps/ui-data-core'
import { useDataGrid } from '../composables/useDataGrid.js'
import {
  DataGridColumnTypes,
  DEFAULT_DATA_GRID_PAGE_SIZE
} from '../constants.js'
import ZnDataGridCellTrigger from './ZnDataGridCellTrigger.vue'
import ZnDataGridFilters from './ZnDataGridFilters.vue'
import ZnDataGridPagination from './ZnDataGridPagination.vue'

const props = defineProps({
  /**
   * Shared state created with `useDataGrid`. When provided, `data`, `columns`,
   * `filters` and `pageSize` are ignored, so the grid can sit in any container
   * next to `ZnDataGridFilters` and `ZnDataGridPagination`.
   */
  grid: { type: Object, default: null },

  /* Standalone mode: the grid owns its state. */
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  filters: { type: Array, default: () => [] },
  pageSize: { type: Number, default: DEFAULT_DATA_GRID_PAGE_SIZE },

  /** Standalone mode only: compose the filter bar and pagination. */
  showFilters: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },

  /** `auto` falls back to cards below `cardBreakpoint`. */
  view: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'table', 'card'].includes(value)
  },
  cardBreakpoint: { type: Number, default: 720 },
  showViewSwitch: { type: Boolean, default: true },
  viewSwitchLabel: { type: String, default: 'View' },
  tableViewLabel: { type: String, default: 'Table view' },
  cardViewLabel: { type: String, default: 'Card view' },

  /** Opens a dialog over any non-custom column when a cell is activated. */
  editable: { type: Boolean, default: false },

  emptyText: { type: String, default: 'No data' },
  noResultsText: { type: String, default: 'No results match the filters' },
  emptyIcon: { type: String, default: 'inbox' },
  clearFiltersLabel: { type: String, default: 'Clear filters' },

  /** Accessible name of the table. */
  label: { type: String, default: 'Data grid' },
  cellSize: {
    type: String,
    default: 'small',
    validator: (value) => ['xsmall', 'small', 'medium', 'large'].includes(value)
  },

  editLabel: { type: String, default: 'Edit' },
  /** Dialog title; defaults to `Edit <column label>`. */
  editTitle: { type: String, default: '' },
  saveLabel: { type: String, default: 'Save' },
  cancelLabel: { type: String, default: 'Cancel' }
})

const emit = defineEmits(['update:data', 'cell-change', 'update:view'])

const localGrid = useDataGrid({
  data: () => props.data,
  columns: () => props.columns,
  filters: () => props.filters,
  pageSize: () => props.pageSize
})

const grid = computed(() => props.grid || localGrid)
const isShared = computed(() => Boolean(props.grid))

const columns = computed(() => grid.value.columns.value ?? [])
const entries = computed(() => grid.value.pageEntries.value ?? [])
const total = computed(() => grid.value.total.value)

const emptyMessage = computed(() =>
  grid.value.hasActiveFilters.value ? props.noResultsText : props.emptyText
)

const sortKey = computed(() => grid.value.sortKey.value)
const sortDirection = computed(() => grid.value.sortDirection.value)

/* --------------------------------------------------------------------------
   Table / card view (auto below the breakpoint)
   -------------------------------------------------------------------------- */
const rootRef = ref(null)
const viewMode = ref(props.view)
const autoView = ref('table')
let resizeObserver = null

watch(
  () => props.view,
  (value) => {
    viewMode.value = value
  }
)

const effectiveView = computed(() =>
  viewMode.value === 'auto' ? autoView.value : viewMode.value
)

function setView(view) {
  viewMode.value = view
  emit('update:view', view)
}

onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !rootRef.value) return

  resizeObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect?.width ?? 0
    if (width > 0) autoView.value = width < props.cardBreakpoint ? 'card' : 'table'
  })
  resizeObserver.observe(rootRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

/** First `primary` column (or the first column) becomes the card title. */
const titleColumn = computed(
  () => columns.value.find((column) => column.primary) ?? columns.value[0] ?? null
)

const footerColumns = computed(() =>
  columns.value.filter((column) => column.footer && column !== titleColumn.value)
)

const bodyColumns = computed(() =>
  columns.value.filter(
    (column) => column !== titleColumn.value && !column.footer
  )
)

/* --------------------------------------------------------------------------
   Sorting
   -------------------------------------------------------------------------- */
function sortIcon(column) {
  if (sortKey.value !== column.key) return 'unfold_more'
  return sortDirection.value === 'desc' ? 'arrow_downward' : 'arrow_upward'
}

function ariaSort(column) {
  if (!column.sortable) return undefined
  if (sortKey.value !== column.key) return 'none'
  return sortDirection.value === 'desc' ? 'descending' : 'ascending'
}

function onSort(column) {
  if (column.sortable) grid.value.toggleSort(column.key)
}

/* --------------------------------------------------------------------------
   Cell editing (one dialog for the whole grid)
   -------------------------------------------------------------------------- */
function canEdit(column) {
  return (
    props.editable &&
    Boolean(column?.key) &&
    column.type !== DataGridColumnTypes.CUSTOM_RENDER &&
    typeof column.render !== 'function' &&
    column.editable !== false &&
    !column.disabled &&
    !column.readonly
  )
}

const editing = ref(null)
const draft = ref(null)

const editingColumn = computed(() =>
  editing.value ? columns.value.find((column) => column.key === editing.value.key) ?? null : null
)

const editingField = computed(() => {
  if (!editingColumn.value) return null
  const { render, sortable, editable, width, align, primary, footer, filter, ...field } =
    editingColumn.value
  return { ...field, label: editingColumn.value.label }
})

const isEditing = computed({
  get: () => editing.value !== null,
  set: (open) => {
    if (!open) cancelEdit()
  }
})

const dialogTitle = computed(() => {
  if (props.editTitle) return props.editTitle
  return editingColumn.value?.label
    ? `${props.editLabel} ${editingColumn.value.label}`
    : props.editLabel
})

function startEdit({ row, rowIndex, column }) {
  if (!canEdit(column)) return
  editing.value = { index: rowIndex, key: column.key }
  draft.value = readAt(row, column.key) ?? null
}

function cancelEdit() {
  editing.value = null
  draft.value = null
}

function saveEdit() {
  if (!editing.value) return
  const { index, key } = editing.value
  const rows = grid.value.data.value.map((row, rowIndex) =>
    rowIndex === index ? writeAt(row, key, draft.value) : row
  )
  const row = rows[index]

  emit('update:data', rows)
  emit('cell-change', { row, rowIndex: index, key, value: readAt(row, key) })
  cancelEdit()
}
</script>

<template>
  <div ref="rootRef" class="zn-data-grid">
    <ZnDataGridFilters
      v-if="!isShared && showFilters"
      class="zn-data-grid__filters"
      :grid="localGrid"
      :view="effectiveView"
      :show-view-switch="showViewSwitch"
      :clear-label="clearFiltersLabel"
      :view-switch-label="viewSwitchLabel"
      :table-view-label="tableViewLabel"
      :card-view-label="cardViewLabel"
      @update:view="setView"
    />

    <div v-if="showViewSwitch && (isShared || !showFilters)" class="zn-data-grid__toolbar">
      <div
        class="zn-data-grid__view-switch"
        role="group"
        :aria-label="viewSwitchLabel"
      >
        <button
          type="button"
          :class="[
            'zn-data-grid__view-button',
            { 'zn-data-grid__view-button--selected': effectiveView === 'table' }
          ]"
          :aria-pressed="effectiveView === 'table'"
          :aria-label="tableViewLabel"
          :title="tableViewLabel"
          @click="setView('table')"
        >
          <ZnIcon name="table_rows" :size="20" />
        </button>

        <button
          type="button"
          :class="[
            'zn-data-grid__view-button',
            { 'zn-data-grid__view-button--selected': effectiveView === 'card' }
          ]"
          :aria-pressed="effectiveView === 'card'"
          :aria-label="cardViewLabel"
          :title="cardViewLabel"
          @click="setView('card')"
        >
          <ZnIcon name="view_agenda" :size="20" />
        </button>
      </div>
    </div>

    <div
      v-if="entries.length && effectiveView === 'table'"
      class="zn-data-grid__scroll"
    >
      <table class="zn-data-grid__table" :aria-label="label">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="ariaSort(column)"
              :style="column.width ? { width: column.width } : undefined"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="zn-data-grid__sort"
                @click="onSort(column)"
              >
                <span>{{ column.label }}</span>
                <ZnIcon :name="sortIcon(column)" :size="16" class="zn-data-grid__sort-icon" />
              </button>
              <span v-else class="zn-data-grid__heading">{{ column.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="entry in entries" :key="entry.index" class="zn-data-grid__row">
            <td v-for="column in columns" :key="column.key">
              <ZnDataGridCellTrigger
                :row="entry.row"
                :column="column"
                :row-index="entry.index"
                :editable="canEdit(column)"
                :edit-label="editLabel"
                :size="cellSize"
                @edit="startEdit"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="entries.length"
      class="zn-data-grid__cards"
      role="list"
    >
      <article
        v-for="entry in entries"
        :key="entry.index"
        class="zn-data-grid__card"
        role="listitem"
      >
        <header v-if="titleColumn" class="zn-data-grid__card-header">
          <ZnDataGridCellTrigger
            :row="entry.row"
            :column="titleColumn"
            :row-index="entry.index"
            :editable="canEdit(titleColumn)"
            :edit-label="editLabel"
            :size="cellSize"
            @edit="startEdit"
          />
        </header>

        <div v-if="bodyColumns.length" class="zn-data-grid__card-body">
          <div
            v-for="column in bodyColumns"
            :key="column.key"
            class="zn-data-grid__card-field"
          >
            <ZnDataGridCellTrigger
              :row="entry.row"
              :column="column"
              :row-index="entry.index"
              :editable="canEdit(column)"
              :edit-label="editLabel"
              :size="cellSize"
              show-label
              @edit="startEdit"
            />
          </div>
        </div>

        <footer v-if="footerColumns.length" class="zn-data-grid__card-footer">
          <ZnDataGridCellTrigger
            v-for="column in footerColumns"
            :key="column.key"
            :row="entry.row"
            :column="column"
            :row-index="entry.index"
            :editable="canEdit(column)"
            :edit-label="editLabel"
            :size="cellSize"
            @edit="startEdit"
          />
        </footer>
      </article>
    </div>

    <div v-else class="zn-data-grid__empty" role="status">
      <ZnIcon :name="emptyIcon" :size="40" class="zn-data-grid__empty-icon" />
      <p class="zn-data-grid__empty-text">{{ emptyMessage }}</p>
    </div>

    <ZnDataGridPagination
      v-if="!isShared && showPagination && total > 0"
      class="zn-data-grid__pagination"
      :grid="localGrid"
    />

    <ZnDialog v-model="isEditing" :title="dialogTitle" @close="cancelEdit">
      <ZnRow
        v-if="editingField"
        class="zn-data-grid__dialog-content"
        direction="column"
        padding="8px 0"
        gap="0"
      >
        <ZnDataField v-model="draft" :field="editingField" size="small" />
      </ZnRow>

      <template #actions>
        <ZnButton variant="text" @click="cancelEdit">{{ cancelLabel }}</ZnButton>
        <ZnButton variant="filled" @click="saveEdit">{{ saveLabel }}</ZnButton>
      </template>
    </ZnDialog>
  </div>
</template>

<style scoped>
.zn-data-grid {
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
  color: var(--md-on-background);
}

.zn-data-grid__filters {
  padding-bottom: 12px;
}

/* View switcher */
.zn-data-grid__toolbar {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
}

.zn-data-grid__view-switch {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--md-outline);
  border-radius: 20px;
}

.zn-data-grid__view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1),
    color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.zn-data-grid__view-button:hover {
  background-color: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-data-grid__view-button:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -2px;
}

.zn-data-grid__view-button--selected {
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

/* Table */
.zn-data-grid__scroll {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.zn-data-grid__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.zn-data-grid__table th {
  padding: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline) 38%, transparent);
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.1px;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
}

.zn-data-grid__heading,
.zn-data-grid__sort {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-align: left;
}

.zn-data-grid__sort {
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.zn-data-grid__sort:hover {
  background-color: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}

.zn-data-grid__sort:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -2px;
}

.zn-data-grid__sort-icon {
  flex: 0 0 auto;
  color: var(--md-on-surface-variant);
}

.zn-data-grid__table td {
  padding: 2px 4px;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline) 20%, transparent);
  color: var(--md-on-background);
  font-size: 0.875rem;
  line-height: 20px;
  vertical-align: middle;
}

.zn-data-grid__row:hover {
  background-color: color-mix(in srgb, var(--md-on-surface) 4%, transparent);
}

.zn-data-grid__row:last-child td {
  border-bottom: 0;
}

/* Cards */
.zn-data-grid__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 12px;
  width: 100%;
  min-width: 0;
  /* Keeps the card view separated from the filters, also when they are siblings. */
  padding-top: 12px;
}

.zn-data-grid__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--md-outline) 38%, transparent);
  border-radius: 12px;
  background: transparent;
}

.zn-data-grid__card-header :deep(.zn-data-grid-cell-trigger) {
  align-items: flex-start;
  padding: 0;
}

.zn-data-grid__card-header :deep(.zn-field-value) {
  color: var(--md-on-background);
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;
}

.zn-data-grid__card-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.zn-data-grid__card-field {
  min-width: 0;
}

.zn-data-grid__card-field :deep(.zn-data-grid-cell-trigger) {
  align-items: flex-start;
  padding: 0;
}

.zn-data-grid__card-field :deep(.zn-data-grid-cell-trigger:not(.zn-data-grid-cell-trigger--static)) {
  padding: 6px;
  margin: -6px;
}

.zn-data-grid__card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--md-outline) 24%, transparent);
}

.zn-data-grid__card-footer :deep(.zn-data-grid-cell-trigger) {
  width: auto;
  align-items: center;
  padding: 0;
}

/* Empty, pagination, dialog */
.zn-data-grid__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 16px;
  color: var(--md-on-surface-variant);
  text-align: center;
}

.zn-data-grid__empty-icon {
  color: var(--md-outline);
}

.zn-data-grid__empty-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 20px;
}

.zn-data-grid__dialog-content {
  min-width: min(320px, 70vw);
}

@media (max-width: 600px) {
  .zn-data-grid__heading,
  .zn-data-grid__sort {
    min-height: 44px;
    padding: 0 12px;
  }

  .zn-data-grid__table td {
    padding: 2px;
  }
}
</style>
