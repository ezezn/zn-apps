/** Column types understood by `ZnDataGrid` on top of `ui-data-core` FieldTypes. */
export const DataGridColumnTypes = Object.freeze({
  /** `column.render(row, context)` returns the cell content (VNode, text or number). */
  CUSTOM_RENDER: 'custom-render'
})

/** Filter controls rendered by `ZnDataGridFilters`. */
export const DataGridFilterTypes = Object.freeze({
  TEXT: 'text',
  SELECT: 'select',
  DATE: 'date',
  DATE_RANGE: 'date-range'
})

export const DEFAULT_DATA_GRID_PAGE_SIZE = 10
