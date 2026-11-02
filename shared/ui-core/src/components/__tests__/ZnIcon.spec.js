import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnIcon from '../ZnIcon.vue'
import { ICON_FAMILIES, iconSymbolId } from '../../icons/index.js'

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

  it('inyecta el sprite de cada familia una sola vez en el documento', async () => {
    mount(ZnIcon, { props: { name: 'home' } })
    mount(ZnIcon, { props: { name: 'delete' } })
    mount(ZnIcon, { props: { name: 'play_arrow' } })
    await waitFor(() => document.getElementById('zn-icon-sprite-filled'))

    expect(document.querySelectorAll('#zn-icon-sprite-filled')).toHaveLength(1)
    expect(document.querySelectorAll('#zn-icon-sprite-host')).toHaveLength(1)

    const symbol = document.getElementById('zn-icon-filled-home')
    expect(symbol?.tagName.toLowerCase()).toBe('symbol')
    expect(symbol?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  it('avisa por consola cuando el icono no existe en la familia', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(ZnIcon, { props: { name: 'icono_que_no_existe' } })
    await waitFor(() => warn.mock.calls.length > 0)

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('icono_que_no_existe')
    )

    warn.mockRestore()
  })
})
