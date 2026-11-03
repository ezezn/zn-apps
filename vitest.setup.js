import { vi } from 'vitest'

// Mock matchMedia para happy-dom / jsdom
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock IntersectionObserver usando clase constructible
  class MockIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback
      this.options = options
    }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn().mockReturnValue([])
  }

  global.IntersectionObserver = MockIntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver

  // ZnIcon descarga los chunks de sprites con fetch. En tests devolvemos un
  // sprite vacío (sin red) para que los componentes puedan montarse sin un
  // servidor que sirva public/icons/.
  globalThis.fetch = vi.fn(async (url) => {
    const family = String(url).match(/sprite-([a-z-]+)\.svg$/)?.[1]
    return {
      ok: Boolean(family),
      status: family ? 200 : 404,
      text: async () =>
        `<svg xmlns="http://www.w3.org/2000/svg" id="zn-icon-sprite-${family}" aria-hidden="true"></svg>`,
    }
  })
}
