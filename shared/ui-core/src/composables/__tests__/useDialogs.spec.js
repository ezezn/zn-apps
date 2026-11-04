import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import ZnDialogHost from '../../components/ZnDialogHost.vue'
import { useDialogs } from '../useDialogs.js'

let showModalSpy
let closeSpy

beforeAll(() => {
  showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function () {
    this.setAttribute('open', '')
  })
  closeSpy = vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (value = '') {
    this.returnValue = value
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  })
})

afterAll(() => {
  showModalSpy.mockRestore()
  closeSpy.mockRestore()
})

function createHarness(action) {
  return defineComponent({
    setup() {
      const { alert, confirm, prompt } = useDialogs()
      const result = ref('')
      const run = async () => {
        result.value = String(await action({ alert, confirm, prompt }))
      }
      return () => h('div', [
        h(ZnDialogHost),
        h('button', { class: 'launch-dialog', onClick: run }, 'Open dialog'),
        h('output', { class: 'dialog-result' }, result.value)
      ])
    }
  })
}

describe('useDialogs', () => {
  it('resolves yes/no confirmation with a boolean', async () => {
    const wrapper = mount(createHarness(({ confirm }) => confirm('Stop playback?', { title: 'Confirm' })))
    await wrapper.find('.launch-dialog').trigger('click')
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.text()).toContain('Stop playback?')
    const actions = wrapper.findAll('.zn-dialog__actions button')
    await actions[1].trigger('click')
    await flushPromises()

    expect(wrapper.find('.dialog-result').text()).toBe('true')
    wrapper.unmount()
  })

  it('resolves prompt with the entered text', async () => {
    const wrapper = mount(createHarness(({ prompt }) => prompt('Name this mix', {
      title: 'Save mix',
      placeholder: 'Mix name',
      initialValue: 'Evening',
      required: true
    })))
    await wrapper.find('.launch-dialog').trigger('click')
    await flushPromises()

    const input = wrapper.find('input#zn-dialog-prompt')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('Evening')
    await input.setValue('Evening rain')
    await wrapper.findAll('.zn-dialog__actions button')[1].trigger('click')
    await flushPromises()

    expect(wrapper.find('.dialog-result').text()).toBe('Evening rain')
    wrapper.unmount()
  })

  it('queues dialogs until the active dialog closes', async () => {
    const wrapper = mount(createHarness(async ({ alert, confirm }) => {
      const first = confirm('First question')
      const second = alert('Second message', { title: 'Second dialog' })
      return Promise.all([first, second])
    }))
    await wrapper.find('.launch-dialog').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('First question')
    await wrapper.findAll('.zn-dialog__actions button')[1].trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Second message')
    await wrapper.find('.zn-dialog__actions button').trigger('click')
    await flushPromises()
    expect(wrapper.find('.dialog-result').text()).toBe('true,')
    wrapper.unmount()
  })
})
