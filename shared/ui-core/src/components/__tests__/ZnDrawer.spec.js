import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDrawer from '../navigation/ZnDrawer.vue'

describe('ZnDrawer', () => {
  it('renders a modal drawer with scrim, hidden until open', () => {
    const wrapper = mount(ZnDrawer, {
      props: { modelValue: false, label: 'Navegación' },
      slots: { default: '<a href="/tasks">Tasks</a>' }
    })

    expect(wrapper.find('.zn-drawer__scrim').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer').attributes('role')).toBe('dialog')
    expect(wrapper.find('.zn-drawer').attributes('aria-modal')).toBe('true')
    expect(wrapper.find('.zn-drawer').attributes('aria-label')).toBe('Navegación')
    expect(wrapper.find('.zn-drawer').classes()).not.toContain('zn-drawer--open')
    expect(wrapper.find('.zn-drawer').text()).toContain('Tasks')
    wrapper.unmount()
  })

  it('closes on Escape and on scrim click', async () => {
    const wrapper = mount(ZnDrawer, {
      props: { modelValue: true },
      slots: { default: '<a href="/tasks">Tasks</a>' }
    })

    expect(wrapper.find('.zn-drawer').classes()).toContain('zn-drawer--open')
    expect(wrapper.emitted('open')).toHaveLength(1)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['escape'])

    await wrapper.find('.zn-drawer__scrim').trigger('click')
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['scrim'])
    wrapper.unmount()
  })

  it('closes from the header button and can hide it', async () => {
    const wrapper = mount(ZnDrawer, { props: { modelValue: true } })
    await wrapper.find('.zn-drawer__close').trigger('click')
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['close-button'])
    wrapper.unmount()

    const withoutButton = mount(ZnDrawer, { props: { modelValue: true, closeButton: false } })
    expect(withoutButton.find('.zn-drawer__close').exists()).toBe(false)
    withoutButton.unmount()
  })

  it('renders a docked drawer without scrim in the standard variant', () => {
    const wrapper = mount(ZnDrawer, {
      props: { variant: 'standard', label: 'Navegación' },
      slots: { default: '<a href="/tasks">Tasks</a>' }
    })

    expect(wrapper.find('.zn-drawer--standard').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer__scrim').exists()).toBe(false)
    expect(wrapper.find('.zn-drawer').attributes('aria-modal')).toBeUndefined()
    wrapper.unmount()
  })

  it('supports the end side', () => {
    const wrapper = mount(ZnDrawer, {
      props: { modelValue: true, side: 'end' }
    })
    expect(wrapper.find('.zn-drawer').classes()).toContain('zn-drawer--end')
    wrapper.unmount()
  })
})
