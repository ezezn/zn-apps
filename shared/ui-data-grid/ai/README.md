# @zn-apps/ui-data-grid — AI context

`ZnDataGrid` is an MD3 data table over `ui-data-core` `FieldTypes`. Cells render like `ZnDataViewField`; editable cells open one `ZnDialog` with `ZnDataField`, the same trigger/dialog split as `ui-data-editor`. Filters, sorting and pagination share one reactive state created by `useDataGrid`, so the three pieces can live in different containers.

Location: `shared/ui-data-grid/`.

## Components

| Component | Role |
|---|---|
| `ZnDataGrid` | Semantic `<table>` + standalone composition (filter bar, pagination) + the cell-edit dialog |
| `ZnDataGridCell` | One cell: `ZnDataViewField` or `column.render(row, context)` |
| `ZnDataGridFilters` | Predefined filter bar bound to `grid` |
| `ZnDataGridPagination` | Range + previous/next controls bound to `grid` |

## `useDataGrid(options)`

Options accept values, refs or getters: `data`, `columns`, `filters`, `pageSize` (10), `initialSort` (`{ key, direction }`).

Returns refs unless noted: `data`, `columns`, `filters`, `pageSize`, `indexedRows` (`{ row, index }`), `filteredEntries`, `sortedEntries`, `pageEntries`, `hasActiveFilters`, `total`, `page`, `pageCount`, `rangeStart`, `rangeEnd`, `sortKey`, `sortDirection`; `filterValues` is a reactive object. Actions: `setSort(key, dir)`, `toggleSort(key)` (asc → desc → none), `setFilter(key, value)`, `clearFilters()`, `goToPage(n)`, `nextPage()`, `previousPage()`.

Rules:
- Filtering runs before sorting and pagination; `pageEntries` are `{ row, index }` and `index` is the row position in the original `data`, used by cell editing.
- Changing filters or `pageSize` resets to page 1; a shrinking result set clamps the page. Watchers use `flush: 'sync'` so state is consistent immediately.
- `readAt(row, key)` supports nested paths (`meta.priority`).
- Text filter matches the formatted value (select labels included); select/date compare raw values; date-range is inclusive and accepts open ends; `filter.match(query, row)` overrides matching.
- Sorting: numbers numeric, date/time/datetime lexicographic, select by option label, booleans false→true, empty values last.

## Columns

```js
{ key: 'name', label: 'Name', type: 'text', sortable: true }
{ key: 'status', label: 'Status', type: 'select', options: [...] }
{ key: 'actions', label: '', type: 'custom-render', render: (row, { column, rowIndex, value }) => vnode }
```

- `key` is the `readAt` path; `label` is already translated.
- `type` is any `FieldTypes` value or `DataGridColumnTypes.CUSTOM_RENDER` (`'custom-render'`); a `render` function also turns the column into a custom cell.
- `render` may return a VNode, array, string or number. It is a functional renderer, so it re-reads the row on every render.
- Other field props (`options`, `min`, `max`, `step`, `width`) pass through to the renderer.
- `column.editable: false` opts out of editing; `readonly`/`disabled` columns and custom-render columns are never editable.

## Filters

```js
{ key: 'name', label: 'Name', type: 'text', placeholder: 'Search' }
{ key: 'status', label: 'Status', type: 'select', options: [...] }
{ key: 'createdAt', label: 'Created', type: 'date' }
{ key: 'createdAt', label: 'Created', type: 'date-range', startLabel: 'From', endLabel: 'To' }
```

`DataGridFilterTypes` = `text | select | date | date-range`; `text` is the default. Filters render with `ZnSingleLineText`, `ZnSelect`, `ZnDateInput`, `ZnDateRangeInput` at `size="xsmall"` (compact) and wrap inline sharing the remaining width (`flex: 1 1 150px`; ranges `1 1 280px`). Each definition may override `size`.

`ZnDataGridFilters` can also render the clear action and the table/card switch inside the same row, after the fields (`margin-left: auto`). Both are `ZnButton variant="text" icon-only`: `filter_alt_off` for clear and `table_rows`/`view_agenda` for the switch. The bar renders when there are fields or `showViewSwitch` is on; the clear action only appears when `showClear` and at least one filter exist.

## `ZnDataGrid` props

| Prop | Default | Notes |
|---|---|---|
| `grid` | `null` | Shared state. When set, `data`/`columns`/`filters`/`pageSize` are ignored and filters/pagination are not composed |
| `data` / `columns` | `[]` | Standalone mode |
| `filters` | `[]` | Standalone filter bar |
| `pageSize` | `10` | Standalone |
| `showFilters` / `showPagination` | `true` | Standalone only |
| `view` | `'auto'` | `auto|table|card`; `auto` uses cards below `cardBreakpoint` (720) |
| `showViewSwitch` | `true` | Standalone with filters: the switch lives in the filter bar. Shared or `showFilters=false`: the grid renders its own toolbar. Set it to `false` on the grid when an external `ZnDataGridFilters` owns the switch |
| `viewSwitchLabel` / `tableViewLabel` / `cardViewLabel` | `'View'` / `'Table view'` / `'Card view'` | Switch labels (translated by the app) |
| `editable` | `false` | Opens the dialog on non-custom columns |
| `emptyText` | `'No data'` | No rows |
| `noResultsText` | `'No results match the filters'` | Filters hide every row |
| `emptyIcon` | `'inbox'` | Material icon |
| `cellSize` | `'small'` | `xsmall|small|medium|large` |
| `label` | `'Data grid'` | Table accessible name |
| `editLabel` / `editTitle` | `'Edit'` / `''` | Title defaults to `Edit <column label>` |
| `saveLabel` / `cancelLabel` | `'Save'` / `'Cancel'` | Dialog actions |

Events: `update:data(rows)` after a confirmed edit (new array, `writeAt` copy-on-write), `cell-change({ row, rowIndex, key, value })`, `update:view('table'|'card')`.

## `ZnDataGridFilters` props

| Prop | Default | Notes |
|---|---|---|
| `grid` | required | State from `useDataGrid` |
| `size` | `'xsmall'` | Field density; a filter's own `size` wins |
| `showClear` | `true` | Icon-only clear action, disabled without active filters; needs at least one filter |
| `showViewSwitch` | `false` | Inline table/card icon switch |
| `view` | `'table'` | Selected view for the switch; pair with `update:view` / `v-model:view` |
| `clearLabel`, `viewSwitchLabel`, `tableViewLabel`, `cardViewLabel` | English defaults | Translated by the app |

`ZnDataGridFilters` and `ZnDataGridPagination` require `grid`; pagination labels: `previousLabel`, `nextLabel`, `ofLabel`, `pageLabel`.

## Layout & styling

- Transparent background, no outer margin/radius: fits `ZnCard`, `ZnSection`, `ZnBox` and any `ui-core` container.
- Uses `--md-on-background`, `--md-on-surface-variant`, `--md-outline` (mixed), `--md-surface-container-highest`, `--md-primary`; header 52px, body `bodyMedium`.
- Horizontal overflow scrolls inside the grid; below 600px paddings shrink. The empty state is a centered icon + message (`role="status"`).
- Filter bar: below 720px the date range takes a full row and fields may shrink to 0; below 480px every filter stacks full width and the icon actions move to their own right-aligned row.
- The card view has `padding-top: 12px`, which keeps it separated from the filter bar both in standalone composition and when `ZnDataGridFilters` is a sibling container.
- One `ZnDialog` per grid (not per cell) to avoid hundreds of dialog nodes.

## Imports

```vue
<ZnDataGrid :data="rows" :columns="columns" />
```

```js
import { ZnDataGrid, ZnDataGridFilters, ZnDataGridPagination, useDataGrid } from '@zn-apps/ui-data-grid'
import '@zn-apps/ui-data-grid/dist/ui-data-grid.css'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'
```

The grid does not import form/view CSS; the app imports all three, like `ui-data-editor`.

Icons: `inbox`, `arrow_upward`, `arrow_downward`, `unfold_more`, `chevron_left`, `chevron_right`, `edit` in `icon-profile.json`; `generate-icons` merges library profiles into app chunks.

Demo: Kitchensink `/data/grid`. Tests: `src/**/__tests__/*.spec.js` → `npx vitest run --project ui-data-grid`.
