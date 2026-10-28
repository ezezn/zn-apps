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
}
