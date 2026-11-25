import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import { routes } from '../router/index.js'
import HomePage from '../views/HomePage.vue'
import DailyTaskList from '../components/DailyTaskList.vue'
import { i18n, settings } from '../i18n.js'
import { pinia } from '../stores/index.js'
import { useReportsStore } from '../stores/reports.js'
import { daysOff } from '../composables/useDaysOff.js'
import { toDateInputValue } from '../helpers/dates.js'

function mountHome() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(HomePage, { global: { plugins: [i18n, pinia, router] } })
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

  it('shows an info report banner above the calendar and can dismiss it', async () => {
    i18n.global.locale.value = 'en'
    settings.set('daysOff', [])
    daysOff.value = []
    const wrapper = mountHome()
    await flushPromises()

    const reportsStore = useReportsStore(pinia)
    reportsStore.reports = []
    reportsStore.loaded = true
    await flushPromises()

    const alert = wrapper.find('.zn-alert')
    expect(alert.classes()).toContain('zn-alert--info')
    expect(alert.text()).toContain('Report not created yet.')
    expect(wrapper.find('.zn-alert__actions').exists()).toBe(false)

    // El banner va encima del calendario, dentro de la misma columna.
    const firstChild = wrapper.find('.home-page').element.firstElementChild
    expect(firstChild.classList.contains('zn-alert')).toBe(true)
    expect(firstChild.compareDocumentPosition(wrapper.find('.home-calendar').element) & 4).toBe(4)

    reportsStore.reports = [
      {
        id: 12,
        createdAt: `${toDateInputValue()}T09:00`,
        sections: { yesterday: [], today: [], finish: [], blockers: [] }
      }
    ]
    await flushPromises()

    const ready = wrapper.find('.zn-alert')
    expect(ready.classes()).toContain('zn-alert--info')
    expect(ready.text()).toContain('Open report')

    await ready.find('.zn-alert__dismiss').trigger('click')
    expect(wrapper.find('.zn-alert').exists()).toBe(false)

    wrapper.unmount()
  })

  it('does not pass events to the calendar', async () => {
    const wrapper = mountHome()
    await flushPromises()

    expect(wrapper.findComponent(ZnCalendar).props('events')).toEqual([])

    wrapper.unmount()
  })

  it('announces the next non-working day with its title', async () => {
    i18n.global.locale.value = 'en'
    const today = new Date()
    const inThreeDays = toDateInputValue(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
    )
    settings.set('daysOff', [])
    daysOff.value = [
      { id: 'off-1', type: 'nationalHoliday', start: inThreeDays, end: inThreeDays, note: 'Year end' }
    ]

    const wrapper = mountHome()
    await flushPromises()
    const reportsStore = useReportsStore(pinia)
    reportsStore.reports = []
    reportsStore.loaded = true
    await flushPromises()

    expect(wrapper.find('.zn-alert').text()).toContain(
      'Next non-working day in 3 days (Year end)'
    )

    wrapper.unmount()
    daysOff.value = []
    settings.set('daysOff', [])
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
