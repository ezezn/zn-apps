import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZnAbout from '../ZnAbout.vue'

describe('ZnAbout', () => {
  it('renders metadata in two rows without imposing a card style', () => {
    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps'
      }
    })

    expect(wrapper.find('.zn-card').exists()).toBe(false)
    expect(wrapper.findAll('.zn-about__primary, .zn-about__secondary')).toHaveLength(2)
    expect(wrapper.find('.zn-about__primary').element.nextElementSibling)
      .toBe(wrapper.find('.zn-about__secondary').element)
    expect(wrapper.find('use').attributes('href')).toBe('#zn-icon-filled-info')
    expect(wrapper.text()).toContain('Zound Box')
    expect(wrapper.text()).toContain('v2.1.0')
    expect(wrapper.text()).toContain('A soundboard app')
    expect(wrapper.text()).toContain('ZN Apps')
  })

  it('uses the provided app icon when specified', () => {
    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps',
        icon: 'music_note'
      }
    })

    expect(wrapper.find('use').attributes('href')).toBe('#zn-icon-filled-music_note')
  })

  it('uses the app image instead of an icon when an image is provided', () => {
    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps',
        icon: 'music_note',
        image: '/app-icon.png'
      }
    })

    expect(wrapper.find('img').attributes('src')).toBe('/app-icon.png')
    expect(wrapper.find('img').attributes('alt')).toBe('Zound Box')
    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
