/**
 * Carga bajo demanda de los sprites de iconos Material Design.
 *
 * Cada proyecto (app o librería) genera su propio chunk filtrado en
 * `public/icons/sprite-<familia>.svg` (publicado en `dist/icons/` al compilar).
 * `ZnIcon` descarga el sprite de una familia la primera vez que aparece un icono
 * de esa familia, lo inyecta una única vez en un contenedor oculto y lo reutiliza
 * en todos los `<use href="#…">` del documento.
 *
 * La URL se resuelve con `import.meta.env.BASE_URL`, así que funciona igual en
 * desarrollo que desplegado bajo `/zn-apps/<app>/`.
 */

export const ICON_FAMILIES = ['filled', 'outlined', 'round', 'sharp', 'two-tone']

export const DEFAULT_ICON_FAMILY = 'filled'

/** Contenedor oculto donde se inyectan los sprites. */
const SPRITE_HOST_ID = 'zn-icon-sprite-host'

/** Carpeta (dentro del proyecto) donde viven los chunks de iconos. */
const SPRITE_DIR = 'icons'

/** familia → Promise<Set<nombres disponibles>> */
const loadedFamilies = new Map()

/** Familias cuyo sprite no se pudo descargar (para avisar una sola vez). */
const failedFamilies = new Set()

/** Devuelve la familia válida más cercana (por defecto `filled`). */
export function normalizeFamily(family) {
  return ICON_FAMILIES.includes(family) ? family : DEFAULT_ICON_FAMILY
}

/** Id del `<symbol>` correspondiente a un icono. */
export function iconSymbolId(family, name) {
  return `zn-icon-${normalizeFamily(family)}-${name}`
}

/** URL del chunk de la familia, relativa al base del proyecto consumidor. */
export function iconSpriteUrl(family) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${SPRITE_DIR}/sprite-${normalizeFamily(family)}.svg`
}

function getSpriteHost() {
  if (typeof document === 'undefined' || !document.body) return null

  let host = document.getElementById(SPRITE_HOST_ID)
  if (!host) {
    host = document.createElement('div')
    host.id = SPRITE_HOST_ID
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText =
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    document.body.prepend(host)
  }
  return host
}

function injectSprite(family, sprite) {
  const host = getSpriteHost()
  if (!host) return
  if (document.getElementById(`zn-icon-sprite-${family}`)) return

  host.insertAdjacentHTML('beforeend', sprite)
}

/** Nombres de iconos disponibles en un sprite ya inyectado. */
function readSpriteNames(family) {
  if (typeof document === 'undefined') return new Set()

  const sprite = document.getElementById(`zn-icon-sprite-${family}`)
  if (!sprite) return new Set()

  const prefix = `zn-icon-${family}-`
  const names = new Set()
  for (const symbol of sprite.querySelectorAll('symbol[id]')) {
    if (symbol.id.startsWith(prefix)) names.add(symbol.id.slice(prefix.length))
  }
  return names
}

async function fetchSprite(family) {
  const url = iconSpriteUrl(family)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} en ${url}`)
  }
  return response.text()
}

/**
 * Asegura que el sprite de una familia esté cargado e inyectado en el documento.
 * Si el chunk no existe (proyecto que no lo ha generado) devuelve un conjunto
 * vacío y avisa una sola vez, sin romper el render.
 *
 * @param {string} family
 * @returns {Promise<Set<string>>} nombres de iconos disponibles en la familia
 */
export function loadIconFamily(family) {
  const key = normalizeFamily(family)

  if (loadedFamilies.has(key)) return loadedFamilies.get(key)

  const promise = (async () => {
    // Ya inyectado por otro bundle/montaje: no volvemos a descargarlo.
    const injected = readSpriteNames(key)
    if (injected.size > 0) return injected

    try {
      injectSprite(key, await fetchSprite(key))
      return readSpriteNames(key)
    } catch (error) {
      // Permite reintentar en el siguiente montaje.
      loadedFamilies.delete(key)
      if (!failedFamilies.has(key)) {
        failedFamilies.add(key)
        console.warn(
          `[ZnIcon] No se pudo cargar el sprite "${key}" (${iconSpriteUrl(key)}). ` +
            'Ejecuta "npm run icons" en el proyecto para generarlo.',
          error?.message || error
        )
      }
      return new Set()
    }
  })()

  loadedFamilies.set(key, promise)
  return promise
}

/**
 * Indica si un icono existe en una familia.
 * @param {string} family
 * @param {string} name
 * @returns {Promise<boolean>}
 */
export async function iconExists(family, name) {
  const names = await loadIconFamily(family)
  return names.has(name)
}

/**
 * Lista ordenada con todos los nombres de iconos de una familia.
 * @param {string} family
 * @returns {Promise<string[]>}
 */
export async function iconNames(family) {
  const names = await loadIconFamily(family)
  return [...names].sort()
}
