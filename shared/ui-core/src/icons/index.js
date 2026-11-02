/**
 * Registro y carga bajo demanda de los sprites de iconos Material Design.
 *
 * Cada familia (`filled`, `outlined`, `round`, `sharp`, `two-tone`) se genera en
 * `sprite-<familia>.svg` y se importa como texto crudo (`?raw`). El sprite se
 * inyecta una sola vez en el documento, dentro de un contenedor oculto, para que
 * cualquier `<ZnIcon>` pueda referenciarlo con `<use href="#…">`.
 *
 * La carga es diferida: el sprite de una familia solo se descarga y se inyecta
 * cuando aparece el primer icono de esa familia.
 */

export const ICON_FAMILIES = ['filled', 'outlined', 'round', 'sharp', 'two-tone']

export const DEFAULT_ICON_FAMILY = 'filled'

/** Contenedor oculto donde viven los sprites inyectados. */
const SPRITE_HOST_ID = 'zn-icon-sprite-host'

const spriteLoaders = {
  filled: () => import('./zn-icon-filled.svg?raw'),
  outlined: () => import('./zn-icon-outlined.svg?raw'),
  round: () => import('./zn-icon-round.svg?raw'),
  sharp: () => import('./zn-icon-sharp.svg?raw'),
  'two-tone': () => import('./zn-icon-two-tone.svg?raw'),
}

const namesLoaders = {
  filled: () => import('./zn-icon-names-filled.js'),
  outlined: () => import('./zn-icon-names-outlined.js'),
  round: () => import('./zn-icon-names-round.js'),
  sharp: () => import('./zn-icon-names-sharp.js'),
  'two-tone': () => import('./zn-icon-names-two-tone.js'),
}

/** familia → Promise<Set<nombres de iconos disponibles>> */
const loadedFamilies = new Map()

/** Devuelve la familia válida más cercana (por defecto `filled`). */
export function normalizeFamily(family) {
  return ICON_FAMILIES.includes(family) ? family : DEFAULT_ICON_FAMILY
}

/** Id del `<symbol>` correspondiente a un icono. */
export function iconSymbolId(family, name) {
  return `zn-icon-${normalizeFamily(family)}-${name}`
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

  // El sprite generado ya lleva id="zn-icon-sprite-<familia>", lo usamos para
  // no duplicar símbolos si la familia se inyecta desde otro punto de la app.
  if (document.getElementById(`zn-icon-sprite-${family}`)) return

  host.insertAdjacentHTML('beforeend', sprite)
}

/**
 * Asegura que el sprite de una familia esté cargado e inyectado en el documento.
 * @param {string} family
 * @returns {Promise<Set<string>>} nombres de iconos disponibles en la familia
 */
export function loadIconFamily(family) {
  const key = normalizeFamily(family)

  if (!loadedFamilies.has(key)) {
    loadedFamilies.set(
      key,
      Promise.all([spriteLoaders[key](), namesLoaders[key]()])
        .then(([spriteModule, namesModule]) => {
          injectSprite(key, spriteModule.default)
          return new Set(namesModule.default)
        })
        .catch((error) => {
          // Permite reintentar en el siguiente montaje.
          loadedFamilies.delete(key)
          throw error
        })
    )
  }

  return loadedFamilies.get(key)
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
