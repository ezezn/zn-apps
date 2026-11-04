import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ZnDialog from '../ZnDialog.vue'

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

describe('ZnDialog', () => {
  it('renders a native dialog with title and content', () => {
    const wrapper = mount(ZnDialog, {
      props: { title: 'Confirm action' },
      slots: { default: '<p>Dialog content</p>' }
    })

    expect(wrapper.element.tagName).toBe('DIALOG')
    expect(wrapper.text()).toContain('Confirm action')
    expect(wrapper.text()).toContain('Dialog content')
  })

  it('opens and closes with its v-model value', async () => {
    const wrapper = mount(ZnDialog, { props: { modelValue: true, title: 'Open' } })
    await nextTick()

    expect(showModalSpy).toHaveBeenCalled()
    expect(wrapper.element.open).toBe(true)

    await wrapper.setProps({ modelValue: false })

    expect(closeSpy).toHaveBeenCalled()
    expect(wrapper.element.open).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('closes when the backdrop is clicked', async () => {
    const wrapper = mount(ZnDialog, {
      props: { modelValue: true, closeOnBackdrop: true }
    })
    await nextTick()

    await wrapper.trigger('click')

    expect(wrapper.element.open).toBe(false)
    expect(wrapper.emitted('close')).toEqual([['backdrop']])
  })

  it('keeps open when backdrop closing is disabled', async () => {
    const wrapper = mount(ZnDialog, {
      props: { modelValue: true, closeOnBackdrop: false }
    })
    await nextTick()

    await wrapper.trigger('click')

    expect(wrapper.element.open).toBe(true)
    expect(closeSpy).not.toHaveBeenCalled()
  })
})
