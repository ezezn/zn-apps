import { describe, expect, it } from 'vitest'
import { createSettings } from '../index.js'

function memoryStorage() {
  const values = new Map()
  return {
    get length() { return values.size },
    key(index) { return [...values.keys()][index] ?? null },
    getItem(key) { return values.get(key) ?? null },
    setItem(key, value) { values.set(key, String(value)) },
    removeItem(key) { values.delete(key) }
  }
}

describe('createSettings', () => {
  it('reads definitions through a deep proxy and persists nested assignments', () => {
    const storage = memoryStorage()
    const settings = createSettings({ namespace: 'app', storage })

    expect(settings.define('pwa', { installDismissed: false })).toBe(true)
    expect(settings.pwa.installDismissed).toBe(false)
    settings.pwa.installDismissed = true

    expect(settings.get('pwa.installDismissed')).toBe(true)
    expect(JSON.parse(storage.getItem('app:settings'))).toEqual({
      pwa: { installDismissed: true }
    })
  })

  it('keeps persisted values when definitions are registered again', () => {
    const storage = memoryStorage()
    const first = createSettings({ namespace: 'app', storage })
    first.define({ audio: { volume: 0.5 } })
    first.audio.volume = 0.8

    const second = createSettings({ namespace: 'app', storage, defaults: { audio: { volume: 0.1, muted: false } } })
    expect(second.audio.volume).toBe(0.8)
    expect(second.audio.muted).toBe(false)
  })

  it('supports explicit paths, reset and storage isolation', () => {
    const storage = memoryStorage()
    const settings = createSettings({ namespace: 'one', storage })
    settings.set('ui.theme.mode', 'dark')
    expect(settings.has('ui.theme.mode')).toBe(true)
    expect(settings.toJSON()).toEqual({ ui: { theme: { mode: 'dark' } } })
    settings.reset('ui.theme.mode')
    expect(settings.get('ui.theme.mode', 'system')).toBe('system')
    expect(storage.getItem('one:settings')).not.toBeNull()
    expect(storage.getItem('two:settings')).toBeNull()
  })
})
