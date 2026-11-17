import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../components/TaskCard.vue'
import { i18n } from '../i18n.js'

const task = {
  id: 1,
  name: 'Árbol caído',
  externalId: 'EXT-9',
  description: 'Retirar las ramas de la acera.',
  taskDate: '2026-11-02',
  addedAt: '2026-11-05T09:00',
  externalUrl: 'example.com/task/9',
  status: 'active',
  externalStatus: 'Open'
}

function mountCard(overrides = {}) {
  return mount(TaskCard, { props: { task: { ...task, ...overrides } } })
}

function findButton(wrapper, text) {
  return wrapper.findAll('button').find((button) => button.text().includes(text))
}

describe('TaskCard', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('shows the name, external id and both statuses while collapsed', () => {
    const wrapper = mountCard()

    expect(wrapper.find('.zn-card').classes()).toContain('zn-card--filled')
    expect(wrapper.find('.task-card__header .task-card__actions').exists()).toBe(true)
    expect(wrapper.text()).toContain('Árbol caído')
    expect(wrapper.text()).toContain('EXT-9')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Open')
    expect(wrapper.find('.task-card__details').exists()).toBe(false)
    expect(findButton(wrapper, 'Show details').attributes('aria-expanded')).toBe('false')
  })

  it('expands the remaining information and the external link', async () => {
    const wrapper = mountCard()

    await findButton(wrapper, 'Show details').trigger('click')

    expect(wrapper.find('.task-card__details').exists()).toBe(true)
    expect(wrapper.text()).toContain('Retirar las ramas de la acera.')
    expect(wrapper.text()).toContain('2026')
    expect(findButton(wrapper, 'Hide details').attributes('aria-expanded')).toBe('true')

    const link = wrapper.find('.task-card__link')
    expect(link.attributes('href')).toBe('https://example.com/task/9')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('turns the title into a link to the external app when there is a URL', () => {
    const wrapper = mountCard()
    const title = wrapper.find('.task-card__name a')

    expect(title.text()).toBe('Árbol caído')
    expect(title.attributes('href')).toBe('https://example.com/task/9')
    expect(title.attributes('target')).toBe('_blank')
    expect(title.attributes('rel')).toContain('noopener')
  })

  it('keeps the title as plain text when the task has no external URL', () => {
    const wrapper = mountCard({ externalUrl: '' })

    expect(wrapper.find('.task-card__name a').exists()).toBe(false)
    expect(wrapper.find('.task-card__name').text()).toBe('Árbol caído')
  })

  it('hides the external status chip when there is none', () => {
    const wrapper = mountCard({ externalStatus: '' })
    const chips = wrapper.findAll('.zn-chip')

    expect(chips).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Open')
  })

  it('emits edit and delete with the task', async () => {
    const wrapper = mountCard()

    await wrapper.find('button[aria-label="Edit"]').trigger('click')
    await wrapper.find('button[aria-label="Delete"]').trigger('click')

    expect(wrapper.emitted('edit')?.[0]).toEqual([expect.objectContaining({ id: 1 })])
    expect(wrapper.emitted('delete')?.[0]).toEqual([expect.objectContaining({ id: 1 })])
  })

  it('lists the updates of the task newest first and emits edit-update', async () => {
    const updates = [
      { id: 3, taskId: 1, description: 'Revisión inicial', createdAt: '2026-11-02T09:00' },
      { id: 8, taskId: 1, description: 'Cierre del caso', createdAt: '2026-11-09T15:30' }
    ]
    const wrapper = mount(TaskCard, { props: { task, updates } })

    await findButton(wrapper, 'Show details').trigger('click')

    const dates = wrapper.findAll('.task-card__update-date')
    expect(dates.map((node) => node.attributes('datetime'))).toEqual(['2026-11-09T15:30', '2026-11-02T09:00'])
    expect(wrapper.findAll('.task-card__update-description').map((node) => node.text()))
      .toEqual(['Cierre del caso', 'Revisión inicial'])

    await wrapper.find('.task-card__update-edit').trigger('click')
    expect(wrapper.emitted('edit-update')?.[0]).toEqual([expect.objectContaining({ id: 8 })])
  })

  it('tells the user when the task has no updates', async () => {
    const wrapper = mountCard()

    await findButton(wrapper, 'Show details').trigger('click')

    expect(wrapper.find('.task-card__updates-list').exists()).toBe(false)
    expect(wrapper.text()).toContain('No updates recorded for this task.')
  })

  it('omits the link button when the task has no external URL', async () => {
    const wrapper = mountCard({ externalUrl: '' })

    await findButton(wrapper, 'Show details').trigger('click')

    expect(wrapper.find('.task-card__link').exists()).toBe(false)
    expect(wrapper.find('.task-card__link').exists()).toBe(false)
  })
})
