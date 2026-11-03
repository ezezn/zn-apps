import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnIcon from '../ZnIcon.vue'
import { ICON_FAMILIES, iconNames, iconSymbolId, iconSpriteUrl } from '../../icons/index.js'

/** Sprites de prueba: simulan el chunk generado en public/icons/sprite-<familia>.svg. */
function buildSprite(family, names) {
  const symbols = names
    .map(
      (name) =>
        `<symbol id="zn-icon-${family}-${name}" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></symbol>`
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" id="zn-icon-sprite-${family}" aria-hidden="true">${symbols}</svg>`
}

const SPRITES = {
  filled: buildSprite('filled', ['home', 'delete', 'play_arrow']),
  outlined: buildSprite('outlined', ['home']),
  round: buildSprite('round', ['home']),
  sharp: buildSprite('sharp', ['home']),
  'two-tone': buildSprite('two-tone', ['home'])
}

const fetchMock = vi.fn(async (url) => {
  const family = String(url).match(/sprite-([a-z-]+)\.svg$/)?.[1]
  return {
    ok: Boolean(SPRITES[family]),
    status: SPRITES[family] ? 200 : 404,
    text: async () => SPRITES[family] || ''
  }
})

beforeAll(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** Espera a que se cumpla una condición (la carga del sprite es asíncrona). */
async function waitFor(predicate, timeout = 3000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (predicate()) return true
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return predicate()
}

describe('ZnIcon Component', () => {
  it('descarga el chunk de la familia desde <base>/icons y lo inyecta una sola vez', async () => {
    mount(ZnIcon, { props: { name: 'home' } })
    mount(ZnIcon, { props: { name: 'delete' } })
    mount(ZnIcon, { props: { name: 'play_arrow' } })

    await waitFor(() => document.getElementById('zn-icon-sprite-filled'))

    expect(fetchMock).toHaveBeenCalledWith(iconSpriteUrl('filled'))
    expect(iconSpriteUrl('filled')).toBe('/icons/sprite-filled.svg')
    expect(document.querySelectorAll('#zn-icon-sprite-filled')).toHaveLength(1)
    expect(document.querySelectorAll('#zn-icon-sprite-host')).toHaveLength(1)

    const symbol = document.getElementById('zn-icon-filled-home')
    expect(symbol?.tagName.toLowerCase()).toBe('symbol')
    // El viewBox original de Material Icons se conserva en el <symbol>.
    expect(symbol?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  it('renderiza un <svg> que referencia el símbolo de la familia filled por defecto', () => {
    const wrapper = mount(ZnIcon, { props: { name: 'home' } })

    expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.classes()).toContain('zn-icon')
    expect(wrapper.classes()).toContain('zn-icon--filled')
    expect(wrapper.find('use').attributes('href')).toBe('#zn-icon-filled-home')
  })

  it('usa el tamaño 24px por defecto y permite sobrescribirlo', () => {
    const wrapper = mount(ZnIcon, { props: { name: 'home' } })
    expect(wrapper.attributes('width')).toBe('24px')
    expect(wrapper.attributes('height')).toBe('24px')

    const custom = mount(ZnIcon, { props: { name: 'home', size: 32 } })
    expect(custom.attributes('width')).toBe('32px')

    const cssSize = mount(ZnIcon, { props: { name: 'home', size: '1.5rem' } })
    expect(cssSize.attributes('height')).toBe('1.5rem')
  })

  it('es decorativo por defecto y accesible cuando recibe label', () => {
    const decorative = mount(ZnIcon, { props: { name: 'home' } })
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(decorative.attributes('role')).toBeUndefined()

    const labelled = mount(ZnIcon, { props: { name: 'home', label: 'Inicio' } })
    expect(labelled.attributes('role')).toBe('img')
    expect(labelled.attributes('aria-label')).toBe('Inicio')
    expect(labelled.attributes('aria-hidden')).toBeUndefined()
  })

  it('soporta todas las familias de Material Icons en el href', () => {
    for (const family of ICON_FAMILIES) {
      const wrapper = mount(ZnIcon, { props: { name: 'home', family } })
      expect(wrapper.classes()).toContain(`zn-icon--${family}`)
      expect(wrapper.find('use').attributes('href')).toBe(`#${iconSymbolId(family, 'home')}`)
    }
  })

  it('normaliza una familia desconocida a filled', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(ZnIcon, { props: { name: 'home', family: 'no-existe' } })
    expect(wrapper.classes()).toContain('zn-icon--filled')
    expect(wrapper.find('use').attributes('href')).toBe('#zn-icon-filled-home')

    warn.mockRestore()
  })

  it('expone los nombres del sprite cargado mediante iconNames()', async () => {
    const names = await iconNames('filled')
    expect(names).toContain('home')
    expect(names).toContain('play_arrow')
    expect(names).not.toContain('icono_que_no_existe')
  })

  it('avisa por consola cuando el icono no existe en la familia', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(ZnIcon, { props: { name: 'icono_que_no_existe' } })
    await waitFor(() => warn.mock.calls.length > 0)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('icono_que_no_existe'))

    warn.mockRestore()
  })
})
