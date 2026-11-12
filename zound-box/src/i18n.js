import { createI18n } from 'vue-i18n'
import { createSettings } from '@zn-apps/settings-core'

export const messages = {
  en: {
    app: { title: 'Zound Box', about: 'About Zound Box', close: 'Close', settings: 'Settings' },
    aboutTabs: { credits: 'Credits', changelog: 'Changelog', loading: 'Loading changelog…', empty: 'No changelog available.', error: 'Could not load the changelog.' },
    pwa: {
      installTitle: 'Install Zound Box',
      installMessage: 'Install it on your device to open it quickly and use it offline.',
      updateTitle: 'Update available',
      updateMessage: 'A new version of the app is ready. Update now to get the latest fixes.',
      updateText: 'Update',
      dismissUpdate: 'Later'
    },
    actions: { lightMode: 'Light mode', darkMode: 'Dark mode', play: 'Play', pause: 'Pause', volume100: 'Volume at 100%', volume10: 'Reduce volume to 10%', restoreVolume: 'Restore volume to 100%' },
    playback: { playing: 'Playing', paused: 'Paused', reduced: 'Volume reduced to 10%', full: 'Volume at 100%', error: 'Could not start a sound', aria: 'Playback controls' },
    channels: { background: 'Background sounds', hiss: 'Hissing sounds' },
    sounds: {
      'white-noise': { label: 'White noise', description: 'A constant sound to cover ambient noise.' }, rain: { label: 'Rain', description: 'Soft and continuous rain.' }, wind: { label: 'Wind', description: 'A calm breeze in the background.' }, lullaby: { label: 'Lullaby', description: 'A soft melody to relax.' },
      'hiss-x2': { label: 'Hissing', description: 'Hissing sound, ×2 variant.' }, 'hiss-x3': { label: 'Hissing', description: 'Hissing sound, ×3 variant.' }, 'hiss-x5': { label: 'Hissing', description: 'Hissing sound, ×5 variant.' }
    },
    settings: {
      title: 'Settings',
      languageSection: 'Language',
      systemLanguage: 'Use system language',
      language: 'Language',
      spanish: 'Spanish',
      english: 'English',
      audioSection: 'Audio',
      startLowVolume: 'Start with low volume (10%)',
      rememberCombination: 'Remember last sound combination',
      themeSection: 'Color Scheme',
      systemTheme: 'Follow system theme',
      customTheme: 'Theme'
    }
  },
  es: {
    app: { title: 'Zound Box', about: 'Acerca de Zound Box', close: 'Cerrar', settings: 'Configuración' },
    aboutTabs: { credits: 'Créditos', changelog: 'Changelog', loading: 'Cargando changelog…', empty: 'No hay changelog disponible.', error: 'No se pudo cargar el changelog.' },
    pwa: {
      installTitle: 'Instalar Zound Box',
      installMessage: 'Instálala en tu dispositivo para abrirla rápido y usarla sin conexión.',
      updateTitle: 'Actualización disponible',
      updateMessage: 'Hay una nueva versión de la app. Actualiza para recibir las últimas mejoras.',
      updateText: 'Actualizar',
      dismissUpdate: 'Ahora no'
    },
    actions: { lightMode: 'Modo claro', darkMode: 'Modo oscuro', play: 'Reproducir', pause: 'Pausar', volume100: 'Volumen al 100%', volume10: 'Reducir volumen al 10%', restoreVolume: 'Restaurar volumen al 100%' },
    playback: { playing: 'Reproduciendo', paused: 'En pausa', reduced: 'Volumen reducido al 10%', full: 'Volumen al 100%', error: 'No se pudo iniciar un sonido', aria: 'Controles de reproducción' },
    channels: { background: 'Sonidos de fondo', hiss: 'Sonidos de seseo' },
    sounds: {
      'white-noise': { label: 'Ruido blanco', description: 'Un sonido constante para cubrir el ruido ambiente.' }, rain: { label: 'Lluvia', description: 'Lluvia suave y continua.' }, wind: { label: 'Viento', description: 'Una brisa tranquila de fondo.' }, lullaby: { label: 'Canción de cuna', description: 'Una melodía suave para relajarse.' },
      'hiss-x2': { label: 'Seseo', description: 'Sonido de seseo, variante ×2.' }, 'hiss-x3': { label: 'Seseo', description: 'Sonido de seseo, variante ×3.' }, 'hiss-x5': { label: 'Seseo', description: 'Sonido de seseo, variante ×5.' }
    },
    settings: {
      title: 'Configuración',
      languageSection: 'Idioma',
      systemLanguage: 'Usar idioma del sistema',
      language: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      audioSection: 'Audio',
      startLowVolume: 'Iniciar con volumen bajo (10%)',
      rememberCombination: 'Recordar última combinación de sonidos',
      themeSection: 'Esquema de colores',
      systemTheme: 'Seguir tema del sistema',
      customTheme: 'Tema'
    }
  }
}

export function systemLocale() {
  const language = typeof navigator !== 'undefined' ? navigator.language : ''
  return language.toLowerCase().split('-')[0] === 'es' ? 'es' : 'en'
}

export const settings = createSettings({ namespace: 'zound-box' })
settings.define({
  i18n: {
    useSystem: true,
    locale: null
  },
  theme: {
    followSystem: true,
    mode: 'light'
  },
  audio: {
    startLowVolume: false,
    rememberSounds: false,
    selectedSounds: {
      background: null,
      hiss: null
    }
  }
})

export function resolveInitialLocale() {
  const useSystem = settings.i18n.useSystem ?? (settings.i18n.locale === null)
  if (useSystem) {
    return systemLocale()
  }
  const configured = settings.i18n.locale
  return configured === 'es' || configured === 'en' ? configured : systemLocale()
}

export const initialLocale = resolveInitialLocale()
export const i18n = createI18n({ legacy: false, locale: initialLocale, fallbackLocale: 'en', messages })

