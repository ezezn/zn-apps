import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  PWA_THEME_COLORS,
  getAppColorScheme,
  applyPwaThemeColors,
  initPwaThemeSync
} from '../utils/pwaTheme.js'
import { getMetaThemeColor } from '../utils/metaTheme.js'

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('utils/pwaTheme.js', () => {
  let dispose = null

  beforeEach(() => {
    document.body.className = ''
    document.body.style.backgroundColor = ''
    document.documentElement.style.backgroundColor = ''
    document.head.innerHTML = ''
  })

  afterEach(() => {
    if (dispose) {
      dispose()
      dispose = null
    }
    document.body.className = ''
    document.head.innerHTML = ''
  })

  it('falls back to the system color scheme when body has no theme class', () => {
    expect(getAppColorScheme()).toBe('light')
  })

  it('reads the theme resolved by ZnApp from the body classes', () => {
    document.body.classList.add('zn-theme-dark')
    expect(getAppColorScheme()).toBe('dark')

    document.body.classList.remove('zn-theme-dark')
    document.body.classList.add('zn-theme-light')
    expect(getAppColorScheme()).toBe('light')
  })

  it('applies the light and dark palettes to the meta tag and the document background', () => {
    applyPwaThemeColors('light')
    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.light.themeColor)
    expect(document.body.style.backgroundColor).toBe(PWA_THEME_COLORS.light.backgroundColor)

    applyPwaThemeColors('dark')
    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.dark.themeColor)
    expect(document.documentElement.style.backgroundColor).toBe(PWA_THEME_COLORS.dark.backgroundColor)
  })

  it('keeps the system bars in sync when the theme class changes', async () => {
    const stop = initPwaThemeSync()
    dispose = stop

    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.light.themeColor)

    document.body.classList.add('zn-theme-dark')
    await flush()
    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.dark.themeColor)

    document.body.classList.remove('zn-theme-dark')
    document.body.classList.add('zn-theme-light')
    await flush()
    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.light.themeColor)
  })

  it('is idempotent and stops syncing after dispose', async () => {
    const first = initPwaThemeSync()
    const second = initPwaThemeSync()
    expect(second).toBe(first)

    first()

    document.body.classList.add('zn-theme-dark')
    await flush()
    expect(getMetaThemeColor()).toBe(PWA_THEME_COLORS.light.themeColor)
  })

  it('honors custom palettes', () => {
    dispose = initPwaThemeSync({
      colors: {
        light: { themeColor: '#111111', backgroundColor: '#111111' },
        dark: { themeColor: '#222222', backgroundColor: '#222222' }
      }
    })

    expect(getMetaThemeColor()).toBe('#111111')
  })
})
