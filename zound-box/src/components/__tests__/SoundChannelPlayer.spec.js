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
})
