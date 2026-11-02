/**
 * @zn-apps/storage
 *
 * Utilidades de persistencia compartidas, independientes de Vue y del DOM.
 * Por defecto usan `localStorage`, pero aceptan cualquier backend con la
 * interfaz de Web Storage (getItem / setItem / removeItem / key / length).
 */

export const DEFAULT_NAMESPACE = 'zn-apps'

function defaultBackend() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage
    }
  } catch {
    // Acceder a localStorage puede lanzar en algunos modos de privacidad.
  }
  return null
}

/**
 * Crea un almacén con claves serializadas en JSON y namespacing opcional.
 *
 * @param {Object} [options]
 * @param {string} [options.namespace='zn-apps'] Prefijo aplicado a cada clave.
 * @param {Storage} [options.storage] Backend compatible con Web Storage.
 * @returns {{
 *   get: (key: string, fallback?: any) => any,
 *   set: (key: string, value: any) => boolean,
 *   remove: (key: string) => boolean,
 *   has: (key: string) => boolean,
 *   clear: () => boolean
 * }}
 */
export function createStorage(options = {}) {
  const { namespace = DEFAULT_NAMESPACE, storage } = options
  const prefix = namespace ? `${namespace}:` : ''
  const backend = storage === undefined ? defaultBackend() : storage

  const resolveKey = (key) => `${prefix}${key}`

  return {
    get(key, fallback = null) {
      if (!backend) return fallback

      const raw = backend.getItem(resolveKey(key))
      if (raw === null) return fallback

      try {
        return JSON.parse(raw)
      } catch {
        // Valores escritos fuera de esta librería se devuelven tal cual.
        return raw
      }
    },

    set(key, value) {
      if (!backend) return false

      try {
        backend.setItem(resolveKey(key), JSON.stringify(value))
        return true
      } catch {
        return false
      }
    },

    remove(key) {
      if (!backend) return false

      try {
        backend.removeItem(resolveKey(key))
        return true
      } catch {
        return false
      }
    },

    has(key) {
      return backend ? backend.getItem(resolveKey(key)) !== null : false
    },

    clear() {
      if (!backend) return false

      try {
        const keys = []
        for (let i = 0; i < backend.length; i += 1) {
          keys.push(backend.key(i))
        }

        keys
          .filter((key) => key !== null && key.startsWith(prefix))
          .forEach((key) => backend.removeItem(key))

        return true
      } catch {
        return false
      }
    }
  }
}
