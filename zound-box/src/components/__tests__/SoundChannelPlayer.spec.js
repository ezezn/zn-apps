import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SoundChannelPlayer from '../SoundChannelPlayer.vue'

describe('SoundChannelPlayer', () => {
  afterEach(() => vi.restoreAllMocks())

  it('configura el loop, precarga y emite los cambios de fuente', async () => {
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    const wrapper = mount(SoundChannelPlayer, {
      props: { channelId: 'background' }
    })

    await wrapper.setProps({ source: '/sounds/rain.ogg' })
    await flushPromises()

    expect(wrapper.get('audio').attributes('loop')).toBeDefined()
    expect(wrapper.get('audio').attributes('preload')).toBe('auto')
    expect(load).toHaveBeenCalled()
    expect(wrapper.emitted('source-change')).toContainEqual([
      { channelId: 'background', source: '/sounds/rain.ogg' }
    ])
  })

  it('inicia, pausa y ajusta el volumen del elemento de audio', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

    const wrapper = mount(SoundChannelPlayer, {
      props: { channelId: 'hiss', source: '/sounds/shh.ogg', volume: 0.1 }
    })
    expect(wrapper.get('audio').element.volume).toBe(0.1)

    await wrapper.setProps({ playing: true })
    await flushPromises()
    expect(play).toHaveBeenCalled()
    expect(wrapper.emitted('play')).toEqual([['hiss']])

    await wrapper.setProps({ playing: false })
    expect(pause).toHaveBeenCalled()
    expect(wrapper.emitted('pause')).toEqual([['hiss']])
  })

  it('repite la sección estable desde el final del fade in', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

    const wrapper = mount(SoundChannelPlayer, {
      props: {
        channelId: 'background',
        source: '/sounds/rain.ogg',
        playing: true,
        loopStart: 3,
        loopEnd: 18.5
      }
    })
    await flushPromises()

    const audio = wrapper.get('audio')
    expect(audio.attributes('loop')).toBeUndefined()
    audio.element.currentTime = 18.6
    await audio.trigger('timeupdate')
    expect(audio.element.currentTime).toBe(3)
  })

  it('reproduce la cola de fade out al deseleccionar un sonido', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

    const wrapper = mount(SoundChannelPlayer, {
      props: {
        channelId: 'background',
        source: '/sounds/rain.ogg',
        playing: true,
        loopStart: 3,
        loopEnd: 18.5
      }
    })
    await flushPromises()

    await wrapper.setProps({ source: '', playing: false })
    await flushPromises()

    expect(play).toHaveBeenCalledTimes(2)
    expect(wrapper.get('audio').element.currentTime).toBe(18.5)
    expect(wrapper.get('audio').attributes('src')).toBe('/sounds/rain.ogg')

    await wrapper.get('audio').trigger('ended')
    expect(wrapper.get('audio').attributes('src')).toBeUndefined()
    expect(wrapper.emitted('stop')).toEqual([['background']])
  })
})
