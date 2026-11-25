import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import { routes } from '../router/index.js'
import DaysOffPage from '../views/DaysOffPage.vue'
import DayOffDialog from '../components/DayOffDialog.vue'
import { i18n, settings } from '../i18n.js'
import { pinia } from '../stores/index.js'
import { daysOff } from '../composables/useDaysOff.js'
import { toDateInputValue } from '../helpers/dates.js'

function monthDate(offset, day) {
  const today = new Date()
  return toDateInputValue(new Date(today.getFullYear(), today.getMonth() + offset, day))
}

function daysFromToday(amount) {
  const today = new Date()
  return toDateInputValue(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + amount)
  )
}

function mountPage() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(DaysOffPage, { global: { plugins: [i18n, pinia, router] } })
}

describe('Non-working days page', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
    settings.set('daysOff', [])
    daysOff.value = []
  })

  it('shows a month calendar with the entries as events', () => {
    daysOff.value = [
      { id: 'a', type: 'vacation', start: monthDate(0, 5), end: monthDate(0, 9), note: 'Beach' }
    ]

    const wrapper = mountPage()
    const calendar = wrapper.findComponent(ZnCalendar)

    expect(calendar.props('typeView')).toBe('month')
    // El evento se etiqueta con la nota (título), no con el tipo de día.
    expect(calendar.props('events')).toEqual([
      expect.objectContaining({ id: 'a', title: 'Beach', start: monthDate(0, 5) })
    ])

    wrapper.unmount()
  })

  it('lists only the non-working days of the shown month', () => {
    daysOff.value = [
      { id: 'a', type: 'vacation', start: monthDate(0, 5), end: monthDate(0, 9), note: 'Beach' },
      { id: 'b', type: 'nationalHoliday', start: monthDate(0, 20), end: monthDate(0, 20), note: '' },
      { id: 'c', type: 'sick', start: monthDate(1, 3), end: monthDate(1, 3), note: 'Later' }
    ]

    const wrapper = mountPage()
    const [monthList, upcomingList] = wrapper.findAll('.days-off-list')

    expect(monthList.findAll('.day-off')).toHaveLength(2)
    expect(monthList.text()).toContain('Vacation')
    expect(monthList.text()).toContain('Beach')
    expect(monthList.text()).toContain('National holiday')
    expect(monthList.text()).not.toContain('Later')
    expect(upcomingList.text()).toContain('Later')

    wrapper.unmount()
  })

  it('lists the upcoming entries from today onward below the month list', () => {
    daysOff.value = [
      { id: 'past', type: 'moving', start: monthDate(-2, 10), end: monthDate(-2, 10), note: 'Old' },
      { id: 'next', type: 'sick', start: monthDate(1, 3), end: monthDate(1, 3), note: 'Later' }
    ]

    const wrapper = mountPage()
    const [monthList, upcomingList] = wrapper.findAll('.days-off-list')

    expect(upcomingList.text()).toContain('Upcoming days')
    expect(upcomingList.findAll('.day-off')).toHaveLength(1)
    expect(upcomingList.text()).toContain('Later')
    expect(upcomingList.text()).not.toContain('Old')
    expect(monthList.text()).not.toContain('Old')
    expect(monthList.text()).not.toContain('Later')

    wrapper.unmount()
  })

  it('shows an empty state for a month without entries', () => {
    const wrapper = mountPage()
    const [monthList, upcomingList] = wrapper.findAll('.days-off-list')

    expect(wrapper.findAll('.day-off')).toHaveLength(0)
    expect(monthList.text()).toContain('No non-working days in')
    expect(upcomingList.text()).toContain('No upcoming non-working days.')

    wrapper.unmount()
  })

  it('announces the next non-working day as a readable distance', () => {
    daysOff.value = [
      { id: 'a', type: 'nationalHoliday', start: daysFromToday(10), end: daysFromToday(10) }
    ]

    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Next non-working day in 1 week and 3 days')

    wrapper.unmount()
  })

  it('announces a running absence as today', () => {
    daysOff.value = [
      { id: 'a', type: 'vacation', start: daysFromToday(-2), end: daysFromToday(2) }
    ]

    const wrapper = mountPage()

    expect(wrapper.text()).toContain('Next non-working day: today')

    wrapper.unmount()
  })

  it('falls back to the month summary without upcoming entries', () => {
    const wrapper = mountPage()

    expect(wrapper.text()).not.toContain('Next non-working day')

    wrapper.unmount()
  })

  it('opens the dialog to add an entry', async () => {
    const wrapper = mountPage()
    const addButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Add day'))

    expect(addButton).toBeTruthy()
    await addButton.trigger('click')

    expect(wrapper.findComponent(DayOffDialog).props('modelValue')).toBe(true)

    wrapper.unmount()
  })
})
