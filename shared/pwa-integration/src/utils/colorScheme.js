/**
 * Utilidades para detección del esquema de colores del sistema (modo claro / oscuro).
 * Compatible con entornos móviles y escritorio (Android, iOS, macOS, Windows, Linux).
 */

/**
 * Obtiene el esquema de color actual configurado en el sistema operativo o navegador.
 *
 * @returns {'dark' | 'light'} 'dark' si el sistema prefiere modo oscuro, 'light' en caso contrario.
 */
export function getSystemColorScheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

/**
 * Suscribe un callback a los cambios de esquema de color del sistema en tiempo real.
 *
 * @param {(scheme: 'dark' | 'light') => void} callback Función que recibe el nuevo esquema.
 * @returns {() => void} Función de limpieza para desuscribir el listener.
 */
export function onSystemColorSchemeChange(callback) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  let mediaQuery
  try {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    return () => {}
  }

  const handler = (event) => {
    callback(event.matches ? 'dark' : 'light')
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }

  return () => {}
}
