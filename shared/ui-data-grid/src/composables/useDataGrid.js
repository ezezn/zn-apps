import { computed, reactive, ref, toValue, watch } from 'vue'
import { FieldTypes, formatFieldValue, optionLabel, readAt } from '@zn-apps/ui-data-core'
import {
  DataGridColumnTypes,
  DataGridFilterTypes,
  DEFAULT_DATA_GRID_PAGE_SIZE
} from '../constants.js'

function isEmptyValue(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.filter(Boolean).length === 0)
  )
}

/** `YYYY-MM-DD` part of a date/date-time value, or the whole string. */
function datePart(value) {
  const text = String(value ?? '')
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text
}

function inferFilterType(column) {
  if (column?.type === FieldTypes.SELECT) return DataGridFilterTypes.SELECT
  if (column?.type === FieldTypes.DATE || column?.type === FieldTypes.DATETIME) {
    return DataGridFilterTypes.DATE
  }
  return DataGridFilterTypes.TEXT
}

function defaultFilterValue(filter) {
  if (filter.defaultValue !== undefined) {
    return Array.isArray(filter.defaultValue) ? [...filter.defaultValue] : filter.defaultValue
  }
  return filter.type === DataGridFilterTypes.DATE_RANGE ? ['', ''] : ''
}

/**
 * Shared state for the three grid pieces. `ZnDataGrid`, `ZnDataGridFilters`
 * and `ZnDataGridPagination` receive this object through their `grid` prop, so
 * each can live in a different container while reading and writing the same
 * filter, sort and page state.
 *
 * Options accept plain values, refs or getters: `data`, `columns`, `filters`,
 * `pageSize`, `initialSort`.
 */
export function useDataGrid(options = {}) {
  const data = computed(() => {
    const value = toValue(options.data)
    return Array.isArray(value) ? value : []
  })

  const columns = computed(() => {
    const value = toValue(options.columns)
    return Array.isArray(value) ? value.filter(Boolean) : []
  })

  /**
   * Filter definitions: every column with `filter` contributes one, and the
   * `filters` option adds extras (for example a `keywords` search across
   * several row properties). Extras win when they repeat a column key.
   */
  const filters = computed(() => {
    const merged = new Map()

    for (const column of columns.value) {
      if (!column.key || !column.filter) continue
      const config = column.filter === true ? {} : column.filter
      if (config === false) continue

      merged.set(column.key, {
        key: column.key,
        label: column.label,
        type: inferFilterType(column),
        options: column.options,
        ...config
      })
    }

    const extras = toValue(options.filters)
    for (const filter of Array.isArray(extras) ? extras : []) {
      if (!filter?.key) continue
      const existing = merged.get(filter.key)
      merged.set(filter.key, {
        ...(existing ?? { key: filter.key, label: filter.label }),
        ...filter,
        type: filter.type || existing?.type || DataGridFilterTypes.TEXT
      })
    }

    return [...merged.values()]
  })

  const pageSize = computed(() => {
    const size = Math.round(Number(toValue(options.pageSize)))
    return Number.isFinite(size) && size > 0 ? size : DEFAULT_DATA_GRID_PAGE_SIZE
  })

  const filterValues = reactive({})

  /** Keeps filter values in sync with the definitions, without losing input. */
  watch(
    filters,
    (definitions) => {
      const keys = new Set(definitions.map((filter) => filter.key))
      for (const key of Object.keys(filterValues)) {
        if (!keys.has(key)) delete filterValues[key]
      }
      for (const filter of definitions) {
        if (!(filter.key in filterValues)) {
          filterValues[filter.key] = defaultFilterValue(filter)
        }
      }
    },
    { immediate: true, deep: true }
  )

  function isFilterEmpty(filter, value) {
    if (filter.type === DataGridFilterTypes.DATE_RANGE) {
      const range = Array.isArray(value) ? value : []
      return !range[0] && !range[1]
    }
    return isEmptyValue(value)
  }

  function filterText(value, column) {
    if (Array.isArray(value)) {
      if (column?.type === FieldTypes.MULTI_SELECT) {
        return value.map((item) => optionLabel(column.options, item)).join(' ')
      }
      return value.map((item) => String(item)).join(' ')
    }
    if (column) {
      return formatFieldValue(column, value, { emptyText: '' })
    }
    return String(value ?? '')
  }

  function matchesFilter(filter, row) {
    const query = filterValues[filter.key]
    if (isFilterEmpty(filter, query)) return true

    if (typeof filter.match === 'function') {
      return Boolean(filter.match(query, row))
    }

    const column = columns.value.find((item) => item.key === filter.key)
    const value = readAt(row, filter.key)

    switch (filter.type) {
      case DataGridFilterTypes.SELECT:
        return String(value) === String(query)
      case DataGridFilterTypes.DATE:
        return datePart(value) === datePart(query)
      case DataGridFilterTypes.DATE_RANGE: {
        const [from, to] = Array.isArray(query) ? query : []
        const current = datePart(value)
        if (!current) return false
        if (from && current < from) return false
        if (to && current > to) return false
        return true
      }
      case DataGridFilterTypes.TEXT:
      default: {
        const needle = String(query).trim().toLowerCase()
        // `filter.keys` searches several properties of the row (keywords).
        const keys = Array.isArray(filter.keys) && filter.keys.length ? filter.keys : [filter.key]
        return keys.some((key) => {
          const keyColumn = columns.value.find((item) => item.key === key)
          return filterText(readAt(row, key), keyColumn).toLowerCase().includes(needle)
        })
      }
    }
  }

  const indexedRows = computed(() => data.value.map((row, index) => ({ row, index })))

  const filteredEntries = computed(() =>
    indexedRows.value.filter((entry) =>
      filters.value.every((filter) => matchesFilter(filter, entry.row))
    )
  )

  const hasActiveFilters = computed(() =>
    filters.value.some((filter) => !isFilterEmpty(filter, filterValues[filter.key]))
  )

  const sortKey = ref(toValue(options.initialSort)?.key ?? '')
  const sortDirection = ref(toValue(options.initialSort)?.direction === 'desc' ? 'desc' : 'asc')

  function sortValue(entry, column) {
    return readAt(entry.row, column.key)
  }

  function compareRows(left, right, column) {
    const a = sortValue(left, column)
    const b = sortValue(right, column)

    if (isEmptyValue(a) && isEmptyValue(b)) return 0
    if (isEmptyValue(a)) return 1
    if (isEmptyValue(b)) return -1

    const type = column.type

    if (type === FieldTypes.NUMBER || (typeof a === 'number' && typeof b === 'number')) {
      return Number(a) - Number(b)
    }

    if (
      type === FieldTypes.DATE ||
      type === FieldTypes.TIME ||
      type === FieldTypes.DATETIME
    ) {
      return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0
    }

    if (type === FieldTypes.SELECT || type === FieldTypes.MULTI_SELECT) {
      return String(optionLabel(column.options, a)).localeCompare(
        String(optionLabel(column.options, b)),
        undefined,
        { numeric: true, sensitivity: 'base' }
      )
    }

    if (type === FieldTypes.SWITCH || type === FieldTypes.CHECKBOX) {
      return Number(Boolean(a)) - Number(Boolean(b))
    }

    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  }

  const sortedEntries = computed(() => {
    if (!sortKey.value) return filteredEntries.value

    const column = columns.value.find((item) => item.key === sortKey.value)
    if (!column) return filteredEntries.value

    const direction = sortDirection.value === 'desc' ? -1 : 1
    return [...filteredEntries.value].sort(
      (left, right) => compareRows(left, right, column) * direction
    )
  })

  const page = ref(1)
  const total = computed(() => sortedEntries.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  const pageEntries = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return sortedEntries.value.slice(start, start + pageSize.value)
  })

  const rangeStart = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
  const rangeEnd = computed(() => Math.min(page.value * pageSize.value, total.value))

  watch([filterValues, pageSize], () => {
    page.value = 1
  }, { deep: true, flush: 'sync' })

  watch(pageCount, (count) => {
    if (page.value > count) page.value = count
  }, { flush: 'sync' })

  function setSort(key, direction = 'asc') {
    if (!key) return
    sortKey.value = key
    sortDirection.value = direction === 'desc' ? 'desc' : 'asc'
  }

  /** Always starts a new sort ascending; calling it again toggles. */
  function toggleSort(key) {
    if (!key) return
    if (sortKey.value !== key) {
      sortKey.value = key
      sortDirection.value = 'asc'
      return
    }
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
      return
    }
    sortKey.value = ''
    sortDirection.value = 'asc'
  }

  function setFilter(key, value) {
    if (!key) return
    filterValues[key] = value
  }

  function clearFilters() {
    for (const filter of filters.value) {
      filterValues[filter.key] = defaultFilterValue(filter)
    }
    page.value = 1
  }

  function goToPage(next) {
    const target = Math.round(Number(next))
    if (!Number.isFinite(target)) return
    page.value = Math.min(pageCount.value, Math.max(1, target))
  }

  function nextPage() {
    goToPage(page.value + 1)
  }

  function previousPage() {
    goToPage(page.value - 1)
  }

  return {
    data,
    columns,
    filters,
    pageSize,
    filterValues,
    indexedRows,
    filteredEntries,
    sortedEntries,
    pageEntries,
    hasActiveFilters,
    total,
    page,
    pageCount,
    rangeStart,
    rangeEnd,
    sortKey,
    sortDirection,
    setSort,
    toggleSort,
    setFilter,
    clearFilters,
    goToPage,
    nextPage,
    previousPage,
    isCustomColumn: (column) =>
      column?.type === DataGridColumnTypes.CUSTOM_RENDER || typeof column?.render === 'function'
  }
}
