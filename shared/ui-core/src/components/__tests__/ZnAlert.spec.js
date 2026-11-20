import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import ZnAlert from '../feedback/ZnAlert.vue'
import ZnButton from '../controls/ZnButton.vue'

describe('ZnAlert', () => {
  it('renders an informational status by default', () => {
    const wrapper = mount(ZnAlert, { props: { modelValue: true }, slots: { default: 'Saved locally.' } })

    expect(wrapper.classes()).toContain('zn-alert--info')
    expect(wrapper.classes()).toContain('zn-alert--size-medium')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('Saved locally.')

    wrapper.unmount()
  })

  it('uses an alert role for warning and error variants', () => {
    const warning = mount(ZnAlert, { props: { modelValue: true, variant: 'warning' } })
    const error = mount(ZnAlert, { props: { modelValue: true, variant: 'error' } })

    expect(warning.attributes('role')).toBe('alert')
    expect(warning.classes()).toContain('zn-alert--warning')
    expect(error.attributes('role')).toBe('alert')
    expect(error.classes()).toContain('zn-alert--error')

    warning.unmount()
    error.unmount()
  })

  it('applies the requested size scale', () => {
    const wrapper = mount(ZnAlert, { props: { modelValue: true, size: 'small' } })

    expect(wrapper.classes()).toContain('zn-alert--size-small')

    wrapper.unmount()
  })

  it('renders the action slot', () => {
    const wrapper = mount(ZnAlert, {
      props: { modelValue: true, variant: 'success' },
      slots: {
        default: 'Report ready.',
        actions: '<button type="button">Open report</button>'
      }
    })

    expect(wrapper.find('.zn-alert__actions').text()).toContain('Open report')

    wrapper.unmount()
  })

  it('dismisses with the X and emits false', async () => {
    const wrapper = mount(ZnAlert, {
      props: { modelValue: true, dismissLabel: 'Dismiss' },
      slots: { default: 'Message' }
    })

    const close = wrapper.find('.zn-alert__dismiss')
    expect(close.attributes('aria-label')).toBe('Dismiss')
    await close.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('dismiss')).toHaveLength(1)

    wrapper.unmount()
  })

  it('hides itself when modelValue is false and hides the X when not dismissible', () => {
    const hidden = mount(ZnAlert, { props: { modelValue: false } })
    const notDismissible = mount(ZnAlert, { props: { modelValue: true, dismissible: false } })

    expect(hidden.find('.zn-alert').exists()).toBe(false)
    expect(notDismissible.find('.zn-alert__dismiss').exists()).toBe(false)

    hidden.unmount()
    notDismissible.unmount()
  })

  it('accepts an action component in the slot', () => {
    const wrapper = mount(ZnAlert, {
      props: { modelValue: true },
      slots: {
        default: 'Message',
        actions: () => h(ZnButton, { variant: 'text' }, () => 'Open')
      }
    })

    expect(wrapper.find('.zn-alert__actions .zn-button').exists()).toBe(true)

    wrapper.unmount()
  })
})
