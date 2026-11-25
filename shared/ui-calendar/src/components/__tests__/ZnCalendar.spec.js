import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnCalendar from '../ZnCalendar.vue'

const EVENTS = [
  { id: 1, title: 'Kickoff', start: '2026-11-10T09:00', end: '2026-11-10T10:00', color: '#ff8800' },
  { id: 2, title: 'Trip', start: '2026-11-12', end: '2026-11-14' }
]

function mountCalendar(props = {}) {
  return mount(ZnCalendar, {
    props: { locale: 'en', today: '2026-11-18', ...props }
  })
}

function findDay(wrapper, label) {
  return wrapper
    .findAll('.zn-calendar-month__day')
    .find((button) => (button.attributes('aria-label') || '').includes(label))
}

function findButton(wrapper, text) {
  return wrapper.findAll('button').find((button) => button.text().trim() === text)
}

describe('ZnCalendar', () => {
  it('renders the month grid, the title and the today marker', () => {
    const wrapper = mountCalendar()

    expect(wrapper.find('.zn-calendar__title').text()).toBe('November 2026')
    expect(wrapper.findAll('.zn-calendar-month__day')).toHaveLength(42)

    const today = wrapper.find('.zn-calendar-month__day[aria-current="date"]')
    expect(today.text()).toBe('18')
    expect(findButton(wrapper, 'Today')).toBeTruthy()
  })

  it('selects a single day and emits an ISO date', async () => {
    const wrapper = mountCalendar()

    await findDay(wrapper, 'November 10, 2026').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-10'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['2026-11-10'])
  })

  it('builds a range with two clicks and starts over after a full range', async () => {
    const wrapper = mountCalendar({
      selectionMode: 'range',
      modelValue: { start: '2026-11-10', end: null }
    })

    await findDay(wrapper, 'November 14, 2026').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      { start: '2026-11-10', end: '2026-11-14' }
    ])

    const full = mountCalendar({
      selectionMode: 'range',
      modelValue: { start: '2026-11-10', end: '2026-11-14' }
    })
    await findDay(full, 'November 20, 2026').trigger('click')

    expect(full.emitted('update:modelValue')?.[0]).toEqual([
      { start: '2026-11-20', end: null }
    ])
  })

  it('marks every day inside a range', () => {
    const wrapper = mountCalendar({
      selectionMode: 'range',
      modelValue: { start: '2026-11-10', end: '2026-11-14' }
    })

    expect(wrapper.findAll('.zn-calendar-month__cell--in-range')).toHaveLength(5)
    expect(wrapper.findAll('.zn-calendar-month__cell--range-start')).toHaveLength(1)
    expect(wrapper.findAll('.zn-calendar-month__cell--range-end')).toHaveLength(1)

    const pill = wrapper.find('.zn-calendar-month__range')
    expect(pill.exists()).toBe(true)
    expect(pill.classes()).toContain('zn-calendar-month__range--start')
    expect(pill.classes()).toContain('zn-calendar-month__range--end')
    expect(pill.attributes('style')).toContain('width')
  })

  it('splits a range that crosses weeks into one pill per week', () => {
    const wrapper = mountCalendar({
      selectionMode: 'range',
      modelValue: { start: '2026-11-12', end: '2026-11-20' }
    })

    const pills = wrapper.findAll('.zn-calendar-month__range')
    expect(pills).toHaveLength(2)
    expect(pills[0].classes()).toContain('zn-calendar-month__range--start')
    expect(pills[0].classes()).not.toContain('zn-calendar-month__range--end')
    expect(pills[1].classes()).not.toContain('zn-calendar-month__range--start')
    expect(pills[1].classes()).toContain('zn-calendar-month__range--end')
  })

  it('keeps single-day and multi-day events on the same band', () => {
    const detailed = mountCalendar({ modelValue: '2026-11-10', events: EVENTS })

    const bars = detailed.findAll('.zn-calendar-month__bar')
    expect(bars.map((node) => node.text())).toEqual(['Trip', 'Kickoff'])
    expect(bars[0].attributes('style')).toContain('span 3')

    // Una sola banda por semana: ningún evento queda dentro de la celda del día.
    const band = detailed.find('.zn-calendar-month__bars')
    expect(band.exists()).toBe(true)
    expect(band.findAll('.zn-calendar-month__bar')).toHaveLength(2)
    expect(detailed.findAll('.zn-calendar-month__cell .zn-calendar-month__bar')).toHaveLength(0)
  })

  it('places the event band above or below the day numbers', () => {
    const below = mountCalendar({ modelValue: '2026-11-10', events: EVENTS })
    expect(below.findAll('.zn-calendar-month__week--below').length).toBeGreaterThan(0)
    expect(below.find('.zn-calendar-month__week--above').exists()).toBe(false)

    const above = mountCalendar({
      modelValue: '2026-11-10',
      events: EVENTS,
      eventsPosition: 'above'
    })
    expect(above.findAll('.zn-calendar-month__week--above').length).toBeGreaterThan(0)
    expect(above.find('.zn-calendar-month__week--below').exists()).toBe(false)
    // La banda sigue siendo una sola y contiene todos los eventos.
    expect(above.find('.zn-calendar-month__bars').findAll('.zn-calendar-month__bar')).toHaveLength(2)
  })

  it('renders every event as a line when details are hidden', () => {
    const dots = mountCalendar({
      modelValue: '2026-11-10',
      events: EVENTS,
      showEventDetails: false
    })

    expect(dots.findAll('.zn-calendar-month__bar--line')).toHaveLength(2)
    expect(dots.text()).not.toContain('Kickoff')

    const hidden = mountCalendar({
      modelValue: '2026-11-10',
      events: EVENTS,
      showEvents: false
    })
    expect(hidden.find('.zn-calendar-month__bars').exists()).toBe(false)
  })

  it('supports the filled event variant with contrast text', () => {
    const wrapper = mountCalendar({
      modelValue: '2026-11-10',
      events: EVENTS,
      eventVariant: 'filled'
    })

    expect(wrapper.findAll('.zn-calendar-month__bar--filled')).toHaveLength(2)
    expect(wrapper.find('.zn-calendar-month__bar').attributes('style')).toContain(
      '--zn-calendar-event-text'
    )
  })

  it('offers optional selection fields', async () => {
    const wrapper = mountCalendar({
      modelValue: '2026-11-10',
      showFields: true
    })

    const field = wrapper.find('.zn-calendar__fields input[type="date"]')
    expect(field.element.value).toBe('2026-11-10')

    await field.setValue('2026-11-12')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-12'])
  })

  it('exposes range fields for start and end', async () => {
    const wrapper = mountCalendar({
      selectionMode: 'range',
      modelValue: { start: '2026-11-10', end: '2026-11-14' },
      showFields: true
    })

    const fields = wrapper.findAll('.zn-calendar__fields input[type="date"]')
    expect(fields).toHaveLength(2)
    expect(fields[0].element.value).toBe('2026-11-10')
    expect(fields[1].element.value).toBe('2026-11-14')

    await fields[1].setValue('2026-11-20')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      { start: '2026-11-10', end: '2026-11-20' }
    ])
  })

  it('navigates months and returns to today', async () => {
    const wrapper = mountCalendar()

    await wrapper.find('button[aria-label="Next"]').trigger('click')
    expect(wrapper.find('.zn-calendar__title').text()).toBe('December 2026')

    await findButton(wrapper, 'Today').trigger('click')
    expect(wrapper.find('.zn-calendar__title').text()).toBe('November 2026')
  })

  it('renders the week view as a horizontal day strip plus the active day agenda', async () => {
    const wrapper = mountCalendar({
      typeView: 'week',
      modelValue: '2026-11-10',
      events: EVENTS
    })

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(7)
    expect(wrapper.find('.zn-calendar-week__strip').exists()).toBe(true)
    expect(wrapper.find('.zn-calendar__title').text()).toBe('9 – 15 November 2026')
    expect(wrapper.find('.zn-calendar-week__day-title').text()).toContain('Tuesday, November 10, 2026')
    expect(wrapper.text()).toContain('Kickoff')
    expect(wrapper.text()).not.toContain('Trip')
    expect(wrapper.findAll('.zn-calendar-week__dot:not(.zn-calendar-week__dot--empty)')).toHaveLength(4)

    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-09'])
  })

  it('shows a multi-day event in the agenda of its active day', () => {
    const wrapper = mountCalendar({
      typeView: 'week',
      modelValue: '2026-11-13',
      events: EVENTS
    })

    expect(wrapper.find('.zn-calendar-week__day-title').text()).toContain('Friday, November 13, 2026')
    expect(wrapper.findAll('.zn-calendar-agenda__event')).toHaveLength(1)
    expect(wrapper.find('.zn-calendar-agenda__event').text()).toContain('Trip')
    expect(wrapper.find('.zn-calendar-agenda__time').text()).toBe('All day')
  })

  it('renders the day view with the agenda and a selectable header', async () => {
    const wrapper = mountCalendar({
      typeView: 'day',
      modelValue: '2026-11-10',
      events: EVENTS
    })

    expect(wrapper.find('.zn-calendar-day__header').text()).toContain('Tuesday')
    expect(wrapper.find('.zn-calendar__title').text()).toContain('November 10, 2026')
    expect(wrapper.findAll('.zn-calendar-agenda__event')).toHaveLength(1)
    expect(wrapper.text()).toContain('Kickoff')

    await wrapper.find('.zn-calendar-day__header').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-10'])
  })
})
