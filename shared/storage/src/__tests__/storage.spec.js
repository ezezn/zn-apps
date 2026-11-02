import { beforeEach, describe, it, expect } from 'vitest'
import { createStorage, DEFAULT_NAMESPACE } from '../index.js'

function createMemoryBackend() {
  const map = new Map()

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size
    }
  }
}

describe('createStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('serializa y recupera valores complejos con el namespace por defecto', () => {
    const storage = createStorage()

    expect(storage.set('prefs', { theme: 'dark', volume: 8 })).toBe(true)
    expect(storage.get('prefs')).toEqual({ theme: 'dark', volume: 8 })
    expect(localStorage.getItem(`${DEFAULT_NAMESPACE}:prefs`)).toBe(
      JSON.stringify({ theme: 'dark', volume: 8 })
    )
  })

  it('devuelve el fallback cuando la clave no existe', () => {
    const storage = createStorage()

    expect(storage.get('missing')).toBeNull()
    expect(storage.get('missing', 'default')).toBe('default')
  })

  it('devuelve el valor crudo si no es JSON válido', () => {
    localStorage.setItem(`${DEFAULT_NAMESPACE}:raw`, 'no-json')
    const storage = createStorage()

    expect(storage.get('raw')).toBe('no-json')
  })

  it('reporta existencia y elimina claves', () => {
    const storage = createStorage()

    storage.set('flag', true)
    expect(storage.has('flag')).toBe(true)

    expect(storage.remove('flag')).toBe(true)
    expect(storage.has('flag')).toBe(false)
  })

  it('clear() solo elimina las claves del namespace', () => {
    localStorage.setItem('otra-app:keep', '1')
    const storage = createStorage({ namespace: 'demo' })

    storage.set('a', 1)
    storage.set('b', 2)
    storage.clear()

    expect(storage.has('a')).toBe(false)
    expect(storage.has('b')).toBe(false)
    expect(localStorage.getItem('otra-app:keep')).toBe('1')
  })

  it('aísla namespaces distintos', () => {
    const first = createStorage({ namespace: 'first' })
    const second = createStorage({ namespace: 'second' })

    first.set('key', 'valor-1')
    second.set('key', 'valor-2')

    expect(first.get('key')).toBe('valor-1')
    expect(second.get('key')).toBe('valor-2')
  })

  it('acepta un backend personalizado', () => {
    const backend = createMemoryBackend()
    const storage = createStorage({ namespace: 'memory', storage: backend })

    storage.set('item', [1, 2, 3])

    expect(storage.get('item')).toEqual([1, 2, 3])
    expect(storage.has('item')).toBe(true)
    expect(backend.getItem('memory:item')).toBe('[1,2,3]')
  })

  it('no falla cuando no hay backend disponible', () => {
    const storage = createStorage({ storage: null })

    expect(storage.get('key', 'fallback')).toBe('fallback')
    expect(storage.set('key', 'value')).toBe(false)
    expect(storage.remove('key')).toBe(false)
    expect(storage.has('key')).toBe(false)
    expect(storage.clear()).toBe(false)
  })
})
