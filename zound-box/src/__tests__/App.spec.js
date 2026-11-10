import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { settings } from '../i18n.js'

describe('Zound Box App', () => {
  beforeEach(() => {
    settings.reset()
  })

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

  it('permite alternar el estado del switch de modo oscuro desde settings', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          ZnDialog: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue" role="dialog" class="dialog-stub"><h2>{{ title }}</h2><slot /></section>'
          }
        }
      }
    })

    // Abrir settings
    await wrapper.get('[aria-label="Settings"]').trigger('click')
    const dialog = wrapper.find('.dialog-stub')

    // Switches en el modal
    const checkboxes = dialog.findAll('input[type="checkbox"]')
    // Index 0: idioma del sistema, 1: volumen bajo, 2: recordar sonidos, 3: seguir tema sistema
    const followSystemSwitch = checkboxes[3]
    expect(followSystemSwitch).toBeDefined()
    expect(followSystemSwitch.element.checked).toBe(true)

    // Desactivar "Seguir tema del sistema"
    await followSystemSwitch.setValue(false)

    // Al desactivarlo se renderiza el switch de custom theme (quinto checkbox)
    const updatedCheckboxes = dialog.findAll('input[type="checkbox"]')
    const themeSwitch = updatedCheckboxes[4]
    expect(themeSwitch).toBeDefined()
    expect(themeSwitch.element.checked).toBe(false)

    await themeSwitch.setValue(true)
    expect(themeSwitch.element.checked).toBe(true)
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

  it('abre el diálogo de configuración con secciones y permite cambiar idioma y opciones', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          ZnDialog: {
            props: ['modelValue', 'title'],
            template: '<section v-if="modelValue" role="dialog" class="dialog-stub"><h2>{{ title }}</h2><slot /></section>'
          }
        }
      }
    })

    const settingsButton = wrapper.find('[aria-label="Settings"]')
    expect(settingsButton.exists()).toBe(true)
    await settingsButton.trigger('click')

    const dialog = wrapper.find('.dialog-stub')
    expect(dialog.exists()).toBe(true)
    expect(dialog.text()).toContain('Settings')
    expect(dialog.text()).toContain('Language')
    expect(dialog.text()).toContain('Audio')
    expect(dialog.text()).toContain('Color Scheme')
    expect(dialog.text()).toContain('Use system language')
    expect(dialog.text()).toContain('Start with low volume (10%)')
    expect(dialog.text()).toContain('Remember last sound combination')
    expect(dialog.text()).toContain('Follow system theme')

    // Desactivar el uso de idioma del sistema para mostrar el selector
    const systemLangSwitch = dialog.findAll('input[type="checkbox"]')[0]
    await systemLangSwitch.setValue(false)

    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    await select.setValue('es')

    // Comprobar que cambia a español
    expect(dialog.text()).toContain('Configuración')
    expect(dialog.text()).toContain('Idioma')
    expect(dialog.text()).toContain('Esquema de colores')
  })

  it('persiste la selección de sonidos en settings y la restaura al inicializar', async () => {
    const wrapper = mount(App)
    const sounds = wrapper.findAll('[aria-pressed]')

    // Activar primer sonido de fondo (white-noise) y primer seseo (hiss-x2)
    await sounds[0].trigger('click')
    await sounds[4].trigger('click')

    expect(settings.audio.selectedSounds.background).toBe('white-noise')
    expect(settings.audio.selectedSounds.hiss).toBe('hiss-x2')

    // Montar una nueva instancia de la app; debe recuperar los sonidos seleccionados
    const newWrapper = mount(App)
    expect(newWrapper.findAll('[aria-pressed="true"]')).toHaveLength(2)
    expect(newWrapper.findAll('[aria-pressed]')[0].attributes('aria-pressed')).toBe('true')
    expect(newWrapper.findAll('[aria-pressed]')[4].attributes('aria-pressed')).toBe('true')
  })
})
