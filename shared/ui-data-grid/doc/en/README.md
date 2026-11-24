# @zn-apps/ui-data-grid — user manual

`ZnDataGrid` is a Material Design 3 data table. It renders an array of objects as paginated rows, formats each cell with the same field types as `ui-data-*`, sorts columns and composes a filter bar. The grid, the filter bar and the pagination are separate components that can share one state, so each one can sit in a different container.

- Package: `@zn-apps/ui-data-grid` · Folder: `shared/ui-data-grid/`
- Spanish: [Leer en español](../es/README.md)

## Quick start

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataGrid } from '@zn-apps/ui-data-grid'
import '@zn-apps/ui-data-grid/dist/ui-data-grid.css'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const rows = ref([
  { name: 'Ada', status: 'admin', createdAt: '2026-11-10' },
  { name: 'Grace', status: 'editor', createdAt: '2026-11-12' }
])

const columns = [
  { key: 'name', label: 'Name', type: 'text', sortable: true },
  {
    key: 'status',
    label: 'Role',
    type: 'select',
    sortable: true,
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'editor', label: 'Editor' }
    ]
  },
  { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
]
</script>

<template>
  <ZnDataGrid :data="rows" :columns="columns" />
</template>
```

With `data` and `columns`, the grid owns its state and composes its own filter bar (when `filters` is provided) and pagination.

## Grid, filters and pagination separately

Create the shared state with `useDataGrid`, then place each piece wherever you need it:

```vue
<script setup>
import { ref } from 'vue'
import {
  ZnDataGrid,
  ZnDataGridFilters,
  ZnDataGridPagination,
  useDataGrid
} from '@zn-apps/ui-data-grid'

const rows = ref(/* ... */)
const columns = [/* ... */]
const filters = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'status',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'editor', label: 'Editor' }
    ]
  },
  { key: 'createdAt', label: 'Created', type: 'date-range', startLabel: 'From', endLabel: 'To' }
]

const grid = useDataGrid({ data: rows, columns, filters, pageSize: 10 })
const view = ref('table')
</script>

<template>
  <ZnCard>
    <ZnDataGridFilters
      :grid="grid"
      show-view-switch
      v-model:view="view"
    />
  </ZnCard>

  <ZnCard>
    <ZnDataGrid
      :grid="grid"
      :show-view-switch="false"
      v-model:view="view"
      editable
      edit-label="Edit"
      save-label="Save"
      cancel-label="Cancel"
      @update:data="rows = $event"
    />
  </ZnCard>

  <ZnCard>
    <ZnDataGridPagination :grid="grid" />
  </ZnCard>
</template>
```

When `grid` is passed, `ZnDataGrid` ignores `data`, `columns`, `filters` and `pageSize`, and does not render the filter bar or pagination itself.

## Columns

| Option | Description |
|---|---|
| `key` | Path of the value inside the row; supports nested paths (`meta.priority`) |
| `label` | Already-translated header label |
| `type` | A `ui-data-core` field type (`text`, `number`, `date`, `select`, `list`, `textarea`, …) or `custom-render` |
| `sortable` | Renders a sortable header (ascending → descending → original order) |
| `options` | Options for `select` / `multi-select` cells and filters |
| `editable` | Set to `false` to keep one column read-only |
| `render` | Custom cell renderer: `row => content` or `(row, { column, rowIndex, value }) => content` |
| `width` | Optional column width |

A custom column can also use `DataGridColumnTypes.CUSTOM_RENDER` (`'custom-render'`). The renderer may return a VNode, text or number:

```vue
<script setup>
import { h } from 'vue'
import { ZnChip } from '@zn-apps/ui-core'

const columns = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'custom-render',
    render: (row) => h(ZnChip, { label: row.status, size: 'small', variant: 'suggestion' })
  }
]
</script>
```

## Filters

| Type | Control |
|---|---|
| `text` | Contains, case-insensitive; searches select labels too |
| `select` | Exact value from `options` |
| `date` | Same day (date part of the value) |
| `date-range` | Inclusive range; either end may be empty |

Each filter definition has `key`, `label` and `type` (default `text`); `select` needs `options`, `date-range` accepts `startLabel`/`endLabel`, and all accept `placeholder`. Use `filter.match(query, row)` for a custom predicate.

The filter fields are compact (`size="xsmall"` by default) and grow to fill the remaining width. `ZnDataGridFilters` also renders the clear action and the table/card switch inline with the fields, as icon-only text buttons:

```vue
<ZnDataGridFilters
  :grid="grid"
  show-view-switch
  :show-clear="false"
  v-model:view="view"
  clear-label="Limpiar filtros"
  table-view-label="Vista de tabla"
  card-view-label="Vista de tarjetas"
/>
```

| Prop | Default | Description |
|---|---|---|
| `showClear` | `true` | Shows the clear icon while at least one filter exists |
| `showViewSwitch` | `false` | Shows the inline table/card switch |
| `view` | `'table'` | Selected view; use `v-model:view` to share it with the grid |
| `size` | `'xsmall'` | Field density; a filter's own `size` wins |
| `clearLabel`, `viewSwitchLabel`, `tableViewLabel`, `cardViewLabel` | English | Accessible labels, translated by the app |

When the filter bar owns the switch, set `:show-view-switch="false"` on `ZnDataGrid` to avoid a second switch.

## Editing

Set `editable` on the grid to turn non-custom cells into triggers. Clicking a cell (or pressing Enter/Space) opens a dialog with the input for that field type, then emits the updated array:

```vue
<ZnDataGrid v-model:data="rows" :columns="columns" editable />
```

Events: `update:data(rows)` and `cell-change({ row, rowIndex, key, value })`. The row array is replaced copy-on-write, so existing row objects are not mutated. `readonly`/`disabled` columns and `custom-render` columns are never editable.

## Empty state

`emptyText` covers a source with no rows; `noResultsText` covers filters that hide every row. Both use `emptyIcon` (`inbox` by default) and are announced with `role="status"`.

```vue
<ZnDataGrid
  :data="rows"
  :columns="columns"
  empty-text="No tasks yet"
  no-results-text="No tasks match the filters"
/>
```

## Main props

| Prop | Default | Description |
|---|---|---|
| `data` | `[]` | Rows (standalone mode) |
| `columns` | `[]` | Column definitions |
| `filters` | `[]` | Predefined filters (standalone mode) |
| `grid` | `null` | State from `useDataGrid`; enables the separated layout |
| `pageSize` | `10` | Rows per page |
| `showFilters` / `showPagination` | `true` | Standalone composition |
| `editable` | `false` | Dialog editing per cell |
| `cellSize` | `small` | Cell text scale |
| `emptyText` / `noResultsText` | `'No data'` / `'No results match the filters'` | Empty messages |
| `emptyIcon` | `inbox` | Empty icon |
| `label` | `Data grid` | Accessible table name |
| `editLabel`, `editTitle`, `saveLabel`, `cancelLabel` | `Edit`, `''`, `Save`, `Cancel` | Editing dialog texts |

## Demo and tests

Kitchensink `/data/grid`. Tests: `npx vitest run --project ui-data-grid`.
