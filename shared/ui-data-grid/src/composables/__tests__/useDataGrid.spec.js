import { describe, expect, it } from 'vitest'
import { useDataGrid } from '../useDataGrid.js'
import { DataGridFilterTypes } from '../../constants.js'

const columns = [
  { key: 'name', label: 'Name', type: 'text', sortable: true },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    sortable: true,
    options: [
      { value: 'open', label: 'Open' },
      { value: 'done', label: 'Done' }
    ]
  },
  { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  { key: 'meta.priority', label: 'Priority', type: 'number', sortable: true }
]

const rows = [
  { id: 1, name: 'Beta', status: 'open', createdAt: '2026-11-10', meta: { priority: 2 } },
  { id: 2, name: 'Alpha', status: 'done', createdAt: '2026-11-08', meta: { priority: 10 } },
  { id: 3, name: 'Gamma', status: 'open', createdAt: '2026-11-12', meta: { priority: 1 } },
  { id: 4, name: 'Delta', status: 'done', createdAt: '', meta: { priority: 4 } }
]

describe('useDataGrid', () => {
  it('paginates the rows and exposes the visible range', () => {
    const grid = useDataGrid({ data: rows, columns, pageSize: 2 })

    expect(grid.total.value).toBe(4)
    expect(grid.pageCount.value).toBe(2)
    expect(grid.rangeStart.value).toBe(1)
    expect(grid.rangeEnd.value).toBe(2)
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual(['Beta', 'Alpha'])

    grid.nextPage()
    expect(grid.page.value).toBe(2)
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual(['Gamma', 'Delta'])
    expect(grid.rangeStart.value).toBe(3)
    expect(grid.rangeEnd.value).toBe(4)

    grid.nextPage()
    expect(grid.page.value).toBe(2)
  })

  it('filters by text, select label and nested date range', () => {
    const grid = useDataGrid({
      data: rows,
      columns,
      filters: [
        { key: 'name', label: 'Name', type: DataGridFilterTypes.TEXT },
        { key: 'status', label: 'Status', type: DataGridFilterTypes.SELECT, options: columns[1].options },
        { key: 'createdAt', label: 'Created', type: DataGridFilterTypes.DATE_RANGE }
      ]
    })

    grid.setFilter('name', 'amm')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Gamma'])

    grid.setFilter('name', '')
    grid.setFilter('status', 'done')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Alpha', 'Delta'])

    grid.setFilter('status', '')
    grid.setFilter('createdAt', ['2026-11-08', '2026-11-10'])
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Beta', 'Alpha'])
    expect(grid.hasActiveFilters.value).toBe(true)

    grid.clearFilters()
    expect(grid.filteredEntries.value).toHaveLength(4)
    expect(grid.page.value).toBe(1)
  })

  it('sorts by text, numbers and dates, keeping empty values last', () => {
    const grid = useDataGrid({ data: rows, columns, pageSize: 10 })

    grid.toggleSort('name')
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual([
      'Alpha', 'Beta', 'Delta', 'Gamma'
    ])

    grid.toggleSort('name')
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual([
      'Gamma', 'Delta', 'Beta', 'Alpha'
    ])

    grid.toggleSort('name')
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual([
      'Beta', 'Alpha', 'Gamma', 'Delta'
    ])

    grid.toggleSort('meta.priority')
    grid.toggleSort('meta.priority')
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual([
      'Alpha', 'Delta', 'Beta', 'Gamma'
    ])

    grid.toggleSort('createdAt')
    expect(grid.pageEntries.value.map((entry) => entry.row.name)).toEqual([
      'Alpha', 'Beta', 'Gamma', 'Delta'
    ])
  })

  it('clamps the page when filters reduce the result set', () => {
    const grid = useDataGrid({
      data: rows,
      columns,
      pageSize: 2,
      filters: [{ key: 'status', label: 'Status', type: DataGridFilterTypes.SELECT }]
    })

    grid.goToPage(2)
    expect(grid.page.value).toBe(2)

    grid.setFilter('status', 'done')
    expect(grid.pageCount.value).toBe(1)
    expect(grid.page.value).toBe(1)
  })

  it('derives filters from columns and searches extra keys', () => {
    const grid = useDataGrid({
      data: rows,
      columns: [
        { ...columns[0], filter: { placeholder: 'Search' } },
        { ...columns[1], filter: true },
        { ...columns[2], filter: { type: DataGridFilterTypes.DATE_RANGE } }
      ],
      filters: [
        { key: 'keywords', label: 'Search all', type: DataGridFilterTypes.TEXT, keys: ['name', 'status'] }
      ]
    })

    expect(grid.filters.value.map((filter) => filter.key)).toEqual([
      'name', 'status', 'createdAt', 'keywords'
    ])
    expect(grid.filters.value[0].type).toBe(DataGridFilterTypes.TEXT)
    expect(grid.filters.value[1].type).toBe(DataGridFilterTypes.SELECT)
    expect(grid.filters.value[1].options).toEqual(columns[1].options)
    expect(grid.filters.value[2].type).toBe(DataGridFilterTypes.DATE_RANGE)

    grid.setFilter('keywords', 'done')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Alpha', 'Delta'])

    grid.setFilter('keywords', 'gamma')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Gamma'])

    grid.setFilter('keywords', '')
    grid.setFilter('status', 'open')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Beta', 'Gamma'])

    grid.clearFilters()
    expect(grid.filteredEntries.value).toHaveLength(4)
  })

  it('initialises filter defaults and accepts refs and getters', () => {
    const grid = useDataGrid({
      data: () => rows,
      columns,
      filters: [
        { key: 'createdAt', label: 'Created', type: DataGridFilterTypes.DATE_RANGE },
        { key: 'name', label: 'Name', type: DataGridFilterTypes.TEXT, defaultValue: 'Beta' }
      ]
    })

    expect(grid.filterValues.createdAt).toEqual(['', ''])
    expect(grid.filterValues.name).toBe('Beta')
    expect(grid.filteredEntries.value.map((entry) => entry.row.name)).toEqual(['Beta'])
  })
})
