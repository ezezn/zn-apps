const DEFAULT_NAMESPACE = 'zn-apps'
const DEFAULT_KEY = 'settings'

function defaultBackend() {
  try {
    return typeof globalThis !== 'undefined' && globalThis.localStorage
      ? globalThis.localStorage
      : null
  } catch {
    return null
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone)
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]))
  }
  return value
}

function merge(base, override) {
  if (!isObject(base)) return clone(override)
  const result = clone(base)
  if (!isObject(override)) return result

  for (const [key, value] of Object.entries(override)) {
    result[key] = isObject(result[key]) && isObject(value)
      ? merge(result[key], value)
      : clone(value)
  }
  return result
}

function pathParts(path) {
  if (Array.isArray(path)) return path.map(String).filter(Boolean)
  if (typeof path !== 'string') throw new TypeError('Settings paths must be strings')
  return path.split('.').map((part) => part.trim()).filter(Boolean)
}

function readAt(object, parts) {
  return parts.reduce((value, part) => value == null ? undefined : value[part], object)
}

function writeAt(object, parts, value) {
  if (!parts.length) return clone(value)
  let cursor = object
  parts.slice(0, -1).forEach((part) => {
    if (!isObject(cursor[part])) cursor[part] = {}
    cursor = cursor[part]
  })
  cursor[parts.at(-1)] = clone(value)
  return object
}

function deleteAt(object, parts) {
  if (!parts.length) return {}
  const parent = readAt(object, parts.slice(0, -1))
  if (isObject(parent)) delete parent[parts.at(-1)]
  return object
}

function readDocument(backend, key) {
  if (!backend) return {}
  try {
    const raw = backend.getItem(key)
    if (raw === null) return {}
    const parsed = JSON.parse(raw)
    return isObject(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Creates a JSON settings document backed by localStorage and exposed through
 * a deep property proxy.
 *
 * @param {object} options
 * @param {string} [options.namespace='zn-apps'] Storage key namespace.
 * @param {string} [options.key='settings'] Document key inside the namespace.
 * @param {Storage|null} [options.storage] Web Storage compatible backend.
 * @param {object} [options.defaults] Initial setting definitions.
 */
export function createSettings(options = {}) {
  const {
    namespace = DEFAULT_NAMESPACE,
    key = DEFAULT_KEY,
    storage
  } = options
  const backend = storage === undefined ? defaultBackend() : storage
  const storageKey = namespace ? `${namespace}:${key}` : key
  let definitions = isObject(options.defaults) ? clone(options.defaults) : {}

  function current() {
    return merge(definitions, readDocument(backend, storageKey))
  }

  function persist(document) {
    if (!backend) return false
    try {
      backend.setItem(storageKey, JSON.stringify(document))
      return true
    } catch {
      return false
    }
  }

  function define(pathOrDefinitions, definition) {
    if (typeof pathOrDefinitions === 'string') {
      const parts = pathParts(pathOrDefinitions)
      definitions = writeAt(definitions, parts, isObject(definition) ? definition : {})
    } else if (isObject(pathOrDefinitions)) {
      definitions = merge(definitions, pathOrDefinitions)
    } else {
      throw new TypeError('A settings definition must be an object or a path plus object')
    }
    return persist(current())
  }

  function get(path, fallback) {
    const value = readAt(current(), pathParts(path))
    return value === undefined ? fallback : clone(value)
  }

  function set(path, value) {
    const document = current()
    persist(writeAt(document, pathParts(path), value))
    return value
  }

  function has(path) {
    return readAt(current(), pathParts(path)) !== undefined
  }

  function reset(path) {
    const document = current()
    if (path === undefined) return persist(clone(definitions))
    return persist(deleteAt(document, pathParts(path)))
  }

  function toJSON() {
    return clone(current())
  }

  const api = { define, get, set, has, reset, toJSON }
  const proxies = new Map()

  function proxyFor(parts) {
    const cacheKey = parts.join('.')
    if (proxies.has(cacheKey)) return proxies.get(cacheKey)

    const proxy = new Proxy({}, {
      get(_target, property) {
        if (property === Symbol.toPrimitive) return undefined
        if (property === 'toJSON') return () => readAt(current(), parts)
        if (property === Symbol.iterator) return undefined
        const value = readAt(current(), parts.concat(String(property)))
        return isObject(value) || Array.isArray(value)
          ? proxyFor(parts.concat(String(property)))
          : value
      },
      set(_target, property, value) {
        set(parts.concat(String(property)).join('.'), value)
        return true
      },
      deleteProperty(_target, property) {
        const document = current()
        persist(deleteAt(document, parts.concat(String(property))))
        return true
      },
      has(_target, property) {
        return readAt(current(), parts.concat(String(property))) !== undefined
      },
      ownKeys() {
        const value = readAt(current(), parts)
        return isObject(value) || Array.isArray(value) ? Reflect.ownKeys(value) : []
      },
      getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true }
      }
    })
    proxies.set(cacheKey, proxy)
    return proxy
  }

  return new Proxy(api, {
    get(target, property) {
      if (property in target) return target[property]
      const value = readAt(current(), [String(property)])
      return isObject(value) || Array.isArray(value) ? proxyFor([String(property)]) : value
    },
    set(_target, property, value) {
      set(String(property), value)
      return true
    },
    deleteProperty(_target, property) {
      persist(deleteAt(current(), [String(property)]))
      return true
    },
    has(target, property) {
      return property in target || readAt(current(), [String(property)]) !== undefined
    },
    ownKeys(target) {
      return [...new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(current())])]
    },
    getOwnPropertyDescriptor(target, property) {
      if (property in target) return { enumerable: false, configurable: true, value: target[property] }
      return { enumerable: true, configurable: true }
    }
  })
}

export { DEFAULT_KEY, DEFAULT_NAMESPACE }
