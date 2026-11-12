import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

  it('shows the credits tab by default and the changelog tab on demand', async () => {
    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps',
        changelog: '# Changelog\n\n## [2.1.0]\n- Fixes'
      }
    })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs).toHaveLength(2)
    expect(tabs[0].text()).toBe('Créditos')
    expect(tabs[1].text()).toBe('Changelog')
    expect(wrapper.find('.zn-about__credits').exists()).toBe(true)
    const panels = wrapper.findAll('[role="tabpanel"]')
    expect(panels[0].attributes('hidden')).toBeUndefined()
    expect(panels[1].attributes('hidden')).toBeDefined()

    await tabs[1].trigger('click')

    const container = wrapper.find('.zn-about__changelog')
    expect(container.exists()).toBe(true)
    expect(wrapper.findAll('[role="tabpanel"]')[1].attributes('hidden')).toBeUndefined()
    expect(container.find('.zn-about__changelog-text').text()).toContain('# Changelog')
  })

  it('loads the changelog from changelogUrl only when the tab is opened', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '## [2.1.0]\n- Remote changelog'
    })

    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps',
        changelogUrl: '/CHANGELOG.md'
      }
    })

    expect(fetchMock).not.toHaveBeenCalled()

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('/CHANGELOG.md', expect.any(Object))
    expect(wrapper.find('.zn-about__changelog-text').text()).toContain('Remote changelog')

    // Al volver a la pestaña no se repite la descarga.
    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await flushPromises()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shows the error state when the changelog cannot be loaded', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404 })

    const wrapper = mount(ZnAbout, {
      props: {
        name: 'Zound Box',
        version: '2.1.0',
        description: 'A soundboard app',
        author: 'ZN Apps',
        changelogUrl: '/CHANGELOG.md'
      }
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await flushPromises()

    const error = wrapper.find('.zn-about__changelog-state--error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('No se pudo cargar el changelog.')
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
