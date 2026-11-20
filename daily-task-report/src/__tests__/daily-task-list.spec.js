import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DailyTaskList from '../components/DailyTaskList.vue'
import UpdateDialog from '../components/UpdateDialog.vue'
import { i18n } from '../i18n.js'

const task = { id: 7, name: 'Revisar pedido', externalId: 'EXT-7', status: 'active' }
const update = {
  id: 11,
  taskId: 7,
  description: 'Se revisó el pedido con el cliente.',
  createdAt: '2026-11-18T09:30'
}

describe('DailyTaskList actions', () => {
  it('emits create-update with the task and edit-update with the update', async () => {
    const wrapper = mount(DailyTaskList, {
      props: {
        title: 'Hoy',
        entries: [{ task, updates: [update] }],
        collapsible: true,
        expanded: true
      },
      global: { plugins: [i18n] }
    })

    await wrapper.find('.daily-task__new-update').trigger('click')
    await wrapper.find('.daily-task__update-edit').trigger('click')

    expect(wrapper.emitted('create-update')?.[0]).toEqual([task])
    expect(wrapper.emitted('edit-update')?.[0]).toEqual([update])
  })
})

describe('UpdateDialog previous update', () => {
  it('moves the previous description into the new update', async () => {
    const wrapper = mount(UpdateDialog, {
      props: {
        modelValue: true,
        taskId: 7,
        previousUpdate: update,
        tasks: [task]
      },
      global: { plugins: [i18n] }
    })

    const useButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes(i18n.global.t('updates.usePrevious')))

    expect(wrapper.text()).toContain(update.description)
    expect(useButton).toBeTruthy()

    await useButton.trigger('click')

    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes(i18n.global.t('common.save')))

    await saveButton.trigger('click')

    expect(wrapper.emitted('submit')?.[0][0].description).toBe(update.description)
  })
})
