import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

let pwaUpdate
let registration
let controllerChangeListeners

function setupServiceWorker(waiting = null) {
  registration = {
    waiting,
    active: { state: 'activated' },
    installing: null,
    update: vi.fn(async () => {}),
    addEventListener: vi.fn()
  }

  const serviceWorker = {
    controller: { state: 'activated' },
    ready: Promise.resolve(registration),
    addEventListener: vi.fn((type, listener) => {
      if (type === 'controllerchange') controllerChangeListeners.push(listener)
    }),
    register: vi.fn()
  }

  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: serviceWorker
  })

  return serviceWorker
}

describe('pwaUpdate utils', () => {
  beforeEach(async () => {
    vi.resetModules()
    controllerChangeListeners = []
    pwaUpdate = await import('../utils/pwaUpdate.js')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('detects an already waiting service worker on init', async () => {
    setupServiceWorker({ postMessage: vi.fn(), state: 'installed' })
    const seen = []
    pwaUpdate.onPwaUpdateChange((state) => seen.push(state.updateAvailable))

    await vi.waitFor(() => expect(pwaUpdate.isPwaUpdateAvailable()).toBe(true))
    expect(seen).toContain(true)
  })

  it('checks for updates when the waiting worker is installed', async () => {
    const serviceWorker = setupServiceWorker(null)
    const installingListeners = []
    registration.installing = { state: 'installing', addEventListener: (type, listener) => installingListeners.push(listener) }

    pwaUpdate.onPwaUpdateChange(() => {})
    await vi.waitFor(() => expect(serviceWorker.addEventListener).toHaveBeenCalled())
    await vi.waitFor(() => expect(registration.addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function)))

    const updateFound = registration.addEventListener.mock.calls.find(([type]) => type === 'updatefound')[1]
    updateFound()
    registration.installing.state = 'installed'
    installingListeners.forEach((listener) => listener())

    expect(pwaUpdate.isPwaUpdateAvailable()).toBe(true)
  })

  it('activates the waiting worker and reloads the page', async () => {
    const waiting = {
      state: 'installed',
      postMessage: vi.fn(() => {
        registration.waiting = null
      })
    }
    setupServiceWorker(waiting)
    const reload = vi.fn()
    vi.spyOn(window.location, 'reload').mockImplementation(reload)

    pwaUpdate.onPwaUpdateChange(() => {})
    await vi.waitFor(() => expect(pwaUpdate.isPwaUpdateAvailable()).toBe(true))

    const applied = await pwaUpdate.updatePwa()

    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    expect(applied).toBe(true)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('returns false when there is no waiting worker', async () => {
    setupServiceWorker(null)
    pwaUpdate.onPwaUpdateChange(() => {})
    await vi.waitFor(() => expect(registration).toBeTruthy())

    await expect(pwaUpdate.updatePwa()).resolves.toBe(false)
  })
})
