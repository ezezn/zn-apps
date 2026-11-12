import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnImage from '../components/media/ZnImage.vue'

describe('ZnImage', () => {
  it('renders an <img> with src and alt', () => {
    const wrapper = mount(ZnImage, { props: { src: '/logo.svg', alt: 'Zound Box logo' } })
    expect(wrapper.find('img').attributes('src')).toBe('/logo.svg')
    expect(wrapper.find('img').attributes('alt')).toBe('Zound Box logo')
    wrapper.unmount()
  })

  it('applies fit, crop, width and height', () => {
    const wrapper = mount(ZnImage, { props: { src: '/logo.svg', fit: 'cover', crop: true, width: 120, height: 80 } })
    expect(wrapper.find('.zn-image--cover').exists()).toBe(true)
    expect(wrapper.find('.zn-image--crop').exists()).toBe(true)
    expect(wrapper.find('img').attributes('width')).toBe('120')
    expect(wrapper.find('img').attributes('height')).toBe('80')
    wrapper.unmount()
  })
})
