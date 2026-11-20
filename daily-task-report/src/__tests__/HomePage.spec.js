import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import HomePage from '../views/HomePage.vue'
import DailyTaskList from '../components/DailyTaskList.vue'
import { i18n } from '../i18n.js'
import { pinia } from '../stores/index.js'
import { toDateInputValue } from '../helpers/dates.js'

function mountHome() {
  return mount(HomePage, { global: { plugins: [i18n, pinia] } })
}

describe('Home page', () => {
  it('starts on today with the week view and a single selection', () => {
    const wrapper = mountHome()
    const calendar = wrapper.findComponent(ZnCalendar)

    expect(calendar.props('typeView')).toBe('week')
    expect(calendar.props('selectionMode')).toBe('single')
    expect(calendar.props('modelValue')).toBe(toDateInputValue())

    wrapper.unmount()
  })

  it('renders the current, previous and pending lists', () => {
    const wrapper = mountHome()

    expect(wrapper.findAll('.daily-list')).toHaveLength(3)

    wrapper.unmount()
  })

  it('starts with the first two lists open and toggles them', async () => {
    const wrapper = mountHome()
    // Loading finishes after mount and re-creates the list block: settle first.
    await flushPromises()
    const list = (index) => wrapper.findAllComponents(DailyTaskList)[index]
    const header = (index) => list(index).find('.daily-list__header--toggle')
    const hidden = (index) =>
      (list(index).find('.daily-list__content').attributes('style') || '').includes('display: none')

    expect(header(0).attributes('aria-expanded')).toBe('true')
    expect(header(1).attributes('aria-expanded')).toBe('true')
    expect(header(2).attributes('aria-expanded')).toBe('false')
    expect(hidden(0)).toBe(false)
    expect(hidden(2)).toBe(true)

    await header(2).trigger('click')
    expect(header(2).attributes('aria-expanded')).toBe('true')
    expect(hidden(2)).toBe(false)

    await header(0).trigger('click')
    expect(header(0).attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })
})
