import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { beforeAll, describe, expect, it } from 'vitest'
import ZnDataGrid from '../ZnDataGrid.vue'
import ZnDataGridFilters from '../ZnDataGridFilters.vue'
import ZnDataGridPagination from '../ZnDataGridPagination.vue'
import { useDataGrid } from '../../composables/useDataGrid.js'
import { DataGridColumnTypes, DataGridFilterTypes } from '../../constants.js'

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
  }
]

const rows = [
  { id: 1, name: 'Beta', status: 'open' },
  { id: 2, name: 'Alpha', status: 'done' },
  { id: 3, name: 'Gamma', status: 'open' }
]

function mountShared({ data = rows, gridColumns = columns, filters = [], pageSize = 2, editable = false } = {}) {
  const current = ref(data)
  const grid = useDataGrid({ data: current, columns: gridColumns, filters, pageSize })

  const Harness = defineComponent({
    setup() {
      return () =>
        h('div', [
          h(ZnDataGridFilters, { grid }),
          h(ZnDataGrid, {
            grid,
            editable,
            onUpdateData: (next) => {
              current.value = next
            }
          }),
          h(ZnDataGridPagination, { grid })
        ])
    }
  })

  return { wrapper: mount(Harness), grid, current }
}

beforeAll(() => {
  const proto = window.HTMLDialogElement?.prototype
  if (proto && typeof proto.showModal !== 'function') {
    proto.showModal = function showModal() {
      this.open = true
    }
    proto.close = function close(value) {
      this.open = false
      this.returnValue = value ?? ''
      this.dispatchEvent(new Event('close'))
    }
  }
})

describe('ZnDataGrid', () => {
  it('renders the column headers and formatted cells', () => {
    const wrapper = mount(ZnDataGrid, { props: { data: rows, columns } })

    const headers = wrapper.findAll('th').map((header) => header.text())
    expect(headers).toEqual(['Name', 'Status'])

    const firstRow = wrapper.findAll('.zn-data-grid__row')[0]
    expect(firstRow.text()).toContain('Beta')
    expect(firstRow.text()).toContain('Open')
    expect(wrapper.find('table').attributes('aria-label')).toBe('Data grid')
  })

  it('sorts from a sortable header and reports aria-sort', async () => {
    const wrapper = mount(ZnDataGrid, { props: { data: rows, columns } })
    const header = wrapper.findAll('th')[0]

    await header.find('button').trigger('click')
    expect(wrapper.findAll('.zn-data-grid__row')[0].text()).toContain('Alpha')
    expect(header.attributes('aria-sort')).toBe('ascending')

    await header.find('button').trigger('click')
    expect(wrapper.findAll('.zn-data-grid__row')[0].text()).toContain('Gamma')
    expect(header.attributes('aria-sort')).toBe('descending')

    await header.find('button').trigger('click')
    expect(wrapper.findAll('.zn-data-grid__row')[0].text()).toContain('Beta')
    expect(header.attributes('aria-sort')).toBe('none')
  })

  it('shares filters and pagination through useDataGrid', async () => {
    const { wrapper, grid } = mountShared({
      filters: [
        {
          key: 'status',
          label: 'Status',
          type: DataGridFilterTypes.SELECT,
          options: columns[1].options
        }
      ]
    })

    expect(wrapper.find('.zn-data-grid-pagination__range').text()).toBe('1–2 of 3')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(2)

    await wrapper.find('.zn-data-grid-pagination button[aria-label="Next page"]').trigger('click')
    expect(wrapper.find('.zn-data-grid-pagination__range').text()).toBe('3–3 of 3')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)

    grid.setFilter('status', 'done')
    await nextTick()
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.find('.zn-data-grid-pagination__range').text()).toBe('1–1 of 1')
  })

  it('updates a text filter from the filter bar', async () => {
    const { wrapper } = mountShared({
      filters: [{ key: 'name', label: 'Name', type: DataGridFilterTypes.TEXT }]
    })

    const input = wrapper.find('.zn-data-grid-filters input')
    await input.setValue('amm')

    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('Gamma')
  })

  it('renders a custom cell with the row and context', () => {
    const customColumns = [
      ...columns,
      {
        key: 'actions',
        label: 'Actions',
        type: DataGridColumnTypes.CUSTOM_RENDER,
        render: (row, context) =>
          h('span', { class: 'custom-cell' }, `${row.name}:${context.rowIndex}`)
      }
    ]

    const wrapper = mount(ZnDataGrid, { props: { data: rows, columns: customColumns } })
    const cells = wrapper.findAll('.custom-cell')

    expect(cells).toHaveLength(3)
    expect(cells[1].text()).toBe('Alpha:1')
  })

  it('shows the empty state with an icon and a different message when filters hide everything', async () => {
    const empty = mount(ZnDataGrid, {
      props: { data: [], columns, emptyText: 'Nothing here' }
    })

    expect(empty.find('.zn-data-grid__empty').exists()).toBe(true)
    expect(empty.text()).toContain('Nothing here')
    expect(empty.find('.zn-data-grid__empty use').attributes('href')).toContain('inbox')

    const { wrapper } = mountShared({
      filters: [{ key: 'name', label: 'Name', type: DataGridFilterTypes.TEXT }]
    })
    await wrapper.find('.zn-data-grid-filters input').setValue('zzz')

    expect(wrapper.find('.zn-data-grid__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No results match the filters')
  })

  it('edits a cell through the dialog and emits the updated array', async () => {
    const wrapper = mount(ZnDataGrid, {
      props: { data: rows, columns, editable: true }
    })

    await wrapper.findAll('.zn-data-grid__cell--editable')[0].trigger('click')
    await nextTick()
    await nextTick()

    const dialog = wrapper.find('dialog')
    expect(dialog.element.open).toBe(true)
    expect(dialog.text()).toContain('Edit Name')

    await dialog.find('input').setValue('Beta updated')
    await dialog.findAll('button').find((button) => button.text() === 'Save').trigger('click')

    const update = wrapper.emitted('update:data')[0][0]
    expect(update[0]).toMatchObject({ name: 'Beta updated', status: 'open' })
    expect(update).toHaveLength(3)

    const change = wrapper.emitted('cell-change')[0][0]
    expect(change).toMatchObject({ rowIndex: 0, key: 'name', value: 'Beta updated' })
    expect(dialog.element.open).toBe(false)
  })

  it('renders the card view with title, labelled body and footer', () => {
    const cardColumns = [
      { key: 'name', label: 'Name', type: 'text', primary: true },
      { ...columns[1] },
      {
        key: 'actions',
        label: 'Actions',
        type: DataGridColumnTypes.CUSTOM_RENDER,
        footer: true,
        render: (row) => h('button', { class: 'card-action' }, `Open ${row.name}`)
      }
    ]

    const wrapper = mount(ZnDataGrid, {
      props: { data: rows, columns: cardColumns, view: 'card', editable: true }
    })

    const cards = wrapper.findAll('.zn-data-grid__card')
    expect(cards).toHaveLength(3)
    expect(cards[0].find('.zn-data-grid__card-header').text()).toBe('Beta')

    const body = cards[0].find('.zn-data-grid__card-body')
    expect(body.text()).toContain('Status')
    expect(body.text()).toContain('Open')
    expect(body.text()).not.toContain('Name')

    const footer = cards[0].find('.zn-data-grid__card-footer')
    expect(footer.find('.card-action').text()).toBe('Open Beta')
    expect(wrapper.find('.zn-data-grid__table').exists()).toBe(false)
  })

  it('switches between table and cards and emits the chosen view', async () => {
    const wrapper = mount(ZnDataGrid, { props: { data: rows, columns } })

    const [tableButton, cardButton] = wrapper.findAll('.zn-data-grid__view-button')
    expect(tableButton.attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('.zn-data-grid__table').exists()).toBe(true)

    await cardButton.trigger('click')

    expect(wrapper.emitted('update:view')[0]).toEqual(['card'])
    expect(cardButton.attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('.zn-data-grid__cards').exists()).toBe(true)
    expect(wrapper.find('.zn-data-grid__table').exists()).toBe(false)

    await tableButton.trigger('click')
    expect(wrapper.find('.zn-data-grid__table').exists()).toBe(true)
  })

  it('builds the filter form from column definitions and clears it', async () => {
    const filteredColumns = [
      { ...columns[0], filter: true },
      { ...columns[1], filter: true }
    ]

    const { wrapper, grid } = mountShared({ gridColumns: filteredColumns })

    expect(wrapper.findAll('.zn-data-grid-filters .zn-field')).toHaveLength(2)
    const clear = () =>
      wrapper.findAll('.zn-data-grid-filters button').find((button) =>
        button.text().includes('Clear filters')
      )

    expect(clear().attributes('disabled')).toBeDefined()

    await wrapper.find('.zn-data-grid-filters input').setValue('Beta')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)
    expect(clear().attributes('disabled')).toBeUndefined()

    await clear().trigger('click')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(2)
    expect(grid.filterValues.name).toBe('')
  })

  it('supports an extra keywords filter across several row properties', async () => {
    const { wrapper } = mountShared({
      filters: [
        {
          key: 'keywords',
          label: 'Search',
          type: DataGridFilterTypes.TEXT,
          keys: ['name', 'status']
        }
      ],
      pageSize: 10
    })

    const input = wrapper.find('.zn-data-grid-filters input')
    await input.setValue('done')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpha')

    await input.setValue('gam')
    expect(wrapper.findAll('.zn-data-grid__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('Gamma')
  })

  it('does not make custom or readonly columns editable', async () => {
    const readonlyColumns = [
      { ...columns[0], readonly: true },
      {
        key: 'actions',
        label: 'Actions',
        type: DataGridColumnTypes.CUSTOM_RENDER,
        render: () => 'view'
      }
    ]

    const wrapper = mount(ZnDataGrid, {
      props: { data: rows, columns: readonlyColumns, editable: true }
    })

    expect(wrapper.findAll('.zn-data-grid__cell--editable')).toHaveLength(0)
  })
})
