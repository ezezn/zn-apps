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

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://example.com/task/9')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
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

  it('omits the link button when the task has no external URL', async () => {
    const wrapper = mountCard({ externalUrl: '' })

    await findButton(wrapper, 'Show details').trigger('click')

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('.task-card__link').exists()).toBe(false)
  })
})
