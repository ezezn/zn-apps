import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SoundToggle from '../SoundToggle.vue'

describe('SoundToggle', () => {
  it('renders inactive as outlined and toggles to filled', async () => {
    const wrapper = mount(SoundToggle, {
      props: { title: 'Lluvia', modelValue: false }
    })

    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('.zn-card--outlined').exists()).toBe(true)

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('renders an active value as filled and displays its indicator', () => {
    const wrapper = mount(SoundToggle, {
      props: { title: 'Seseo', indicator: '×3', modelValue: true }
    })

    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('.zn-card--filled').exists()).toBe(true)
    expect(wrapper.text()).toContain('×3')
    expect(wrapper.text()).toContain('Seleccionado')
  })

  it('marks image cards for grayscale inactive and full-color active styling', async () => {
    const wrapper = mount(SoundToggle, {
      props: {
        title: 'Lluvia',
        image: '/assets/rain.jpg',
        modelValue: false
      }
    })

    expect(wrapper.find('.sound-toggle__card--image').exists()).toBe(true)
    expect(wrapper.find('.sound-toggle__card--active').exists()).toBe(false)

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.find('.sound-toggle__card--active').exists()).toBe(true)
  })
})
