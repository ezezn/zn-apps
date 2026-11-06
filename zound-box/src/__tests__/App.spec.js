import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('Zound Box App', () => {
  it('renderiza correctamente el título de la aplicación', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Zound Box')
  })

  it('muestra las dos secciones con cuatro sonidos de fondo y tres variantes de seseo', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Background sounds')
    expect(wrapper.text()).toContain('Hissing sounds')
    expect(wrapper.text()).toContain('White noise')
    expect(wrapper.text()).toContain('Rain')
    expect(wrapper.text()).toContain('Wind')
    expect(wrapper.text()).toContain('Lullaby')
    expect(wrapper.findAll('[aria-pressed]')).toHaveLength(7)
    expect(wrapper.findAll('.sound-toggle__card--image')).toHaveLength(4)
    expect(wrapper.text()).toContain('×2')
    expect(wrapper.text()).toContain('×3')
    expect(wrapper.text()).toContain('×5')
  })

  it('permite alternar el estado del switch de modo oscuro', async () => {
    const wrapper = mount(App)
    const switchInput = wrapper.find('input[type="checkbox"]')
    expect(switchInput.exists()).toBe(true)

    expect(switchInput.element.checked).toBe(false)
    await switchInput.setValue(true)
    expect(switchInput.element.checked).toBe(true)
  })

  it('alterna de forma independiente sonidos de fondo y variantes de seseo', async () => {
    const wrapper = mount(App)
    const sounds = wrapper.findAll('[aria-pressed]')

    expect(sounds).toHaveLength(7)
    expect(sounds[0].attributes('aria-pressed')).toBe('false')
    expect(sounds[6].attributes('aria-pressed')).toBe('false')

    await sounds[0].trigger('click')
    await sounds[6].trigger('click')

    expect(wrapper.findAll('[aria-pressed="true"]')).toHaveLength(2)
    expect(wrapper.findAll('.zn-card--filled')).toHaveLength(2)
    expect(wrapper.findAll('.zn-card--outlined')).toHaveLength(5)
  })

  it('mantiene un solo sonido seleccionado por canal y asigna la nueva fuente', async () => {
    const wrapper = mount(App)
    const sounds = wrapper.findAll('[aria-pressed]')
    const players = wrapper.findAll('audio')

    expect(players).toHaveLength(2)
    expect(players.every((player) => player.attributes('loop') !== undefined)).toBe(true)
    expect(players.every((player) => player.attributes('preload') === 'auto')).toBe(true)

    await sounds[0].trigger('click')
    await sounds[1].trigger('click')

    expect(sounds[0].attributes('aria-pressed')).toBe('false')
    expect(sounds[1].attributes('aria-pressed')).toBe('true')
    expect(players[0].attributes('src')).toContain('rain.ogg')
  })

  it('inicia y pausa los canales y aplica el volumen reducido al 10%', async () => {
    const wrapper = mount(App)
    await wrapper.findAll('[aria-pressed]')[0].trigger('click')
    await wrapper.get('[aria-label="Play"]').trigger('click')

    expect(wrapper.get('[aria-label="Pause"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Reduce volume to 10%"]').trigger('click')
    expect(wrapper.get('.playback-card__subtitle').text()).toBe('Volume reduced to 10%')
    expect(wrapper.findComponent({ name: 'SoundChannelPlayer' }).props('volume')).toBe(0.1)

    await wrapper.get('[aria-label="Pause"]').trigger('click')
    expect(wrapper.get('[aria-label="Play"]').exists()).toBe(true)
  })

  it('shows ambient sound images in grayscale until the sound is activated', async () => {
    const wrapper = mount(App)
    const imageCards = wrapper.findAll('.sound-toggle__card--image')

    expect(imageCards).toHaveLength(4)
    expect(imageCards[0].classes()).not.toContain('sound-toggle__card--active')

    await imageCards[0].trigger('click')

    expect(wrapper.findAll('.sound-toggle__card--image.sound-toggle__card--active')).toHaveLength(1)
  })

  it('opens the about dialog with metadata from package.json', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          ZnDialog: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue" role="dialog"><h2>{{ title }}</h2><slot /></section>'
          }
        }
      }
    })

    await wrapper.get('[aria-label="About Zound Box"]').trigger('click')

    expect(wrapper.get('[role="dialog"]').text()).toContain('Zound Box')
    expect(wrapper.get('[role="dialog"]').text()).toContain('0.0.0')
    expect(wrapper.get('[role="dialog"]').text()).toContain('Combina sonidos ambientales y sonidos de seseo para relajarse.')
    expect(wrapper.get('[role="dialog"]').text()).toContain('ZN Apps')
  })
})
