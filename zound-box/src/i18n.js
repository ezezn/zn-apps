import { createI18n } from 'vue-i18n'
import { createSettings } from '@zn-apps/settings-core'

export const messages = {
  en: {
    app: { title: 'Zound Box', about: 'About Zound Box', close: 'Close' },
    actions: { lightMode: 'Light mode', darkMode: 'Dark mode', play: 'Play', pause: 'Pause', volume100: 'Volume at 100%', volume10: 'Reduce volume to 10%', restoreVolume: 'Restore volume to 100%' },
    playback: { playing: 'Playing', paused: 'Paused', reduced: 'Volume reduced to 10%', full: 'Volume at 100%', error: 'Could not start a sound', aria: 'Playback controls' },
    channels: { background: 'Background sounds', hiss: 'Hissing sounds' },
    sounds: {
      'white-noise': { label: 'White noise', description: 'A constant sound to cover ambient noise.' }, rain: { label: 'Rain', description: 'Soft and continuous rain.' }, wind: { label: 'Wind', description: 'A calm breeze in the background.' }, lullaby: { label: 'Lullaby', description: 'A soft melody to relax.' },
      'hiss-x2': { label: 'Hissing', description: 'Hissing sound, ×2 variant.' }, 'hiss-x3': { label: 'Hissing', description: 'Hissing sound, ×3 variant.' }, 'hiss-x5': { label: 'Hissing', description: 'Hissing sound, ×5 variant.' }
    }
  },
  es: {
    app: { title: 'Zound Box', about: 'Acerca de Zound Box', close: 'Cerrar' },
    actions: { lightMode: 'Modo claro', darkMode: 'Modo oscuro', play: 'Reproducir', pause: 'Pausar', volume100: 'Volumen al 100%', volume10: 'Reducir volumen al 10%', restoreVolume: 'Restaurar volumen al 100%' },
    playback: { playing: 'Reproduciendo', paused: 'En pausa', reduced: 'Volumen reducido al 10%', full: 'Volumen al 100%', error: 'No se pudo iniciar un sonido', aria: 'Controles de reproducción' },
    channels: { background: 'Sonidos de fondo', hiss: 'Sonidos de seseo' },
    sounds: {
      'white-noise': { label: 'Ruido blanco', description: 'Un sonido constante para cubrir el ruido ambiente.' }, rain: { label: 'Lluvia', description: 'Lluvia suave y continua.' }, wind: { label: 'Viento', description: 'Una brisa tranquila de fondo.' }, lullaby: { label: 'Canción de cuna', description: 'Una melodía suave para relajarse.' },
      'hiss-x2': { label: 'Seseo', description: 'Sonido de seseo, variante ×2.' }, 'hiss-x3': { label: 'Seseo', description: 'Sonido de seseo, variante ×3.' }, 'hiss-x5': { label: 'Seseo', description: 'Sonido de seseo, variante ×5.' }
    }
  }
}

function systemLocale() {
  const language = typeof navigator !== 'undefined' ? navigator.language : ''
  return language.toLowerCase().split('-')[0] === 'es' ? 'es' : 'en'
}

export const settings = createSettings({ namespace: 'zound-box' })
settings.define('i18n', { locale: null })
const configuredLocale = settings.i18n.locale
export const initialLocale = configuredLocale === 'es' || configuredLocale === 'en' ? configuredLocale : systemLocale()
export const i18n = createI18n({ legacy: false, locale: initialLocale, fallbackLocale: 'en', messages })
