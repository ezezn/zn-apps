<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">
    <ZnScreen title="Zound Box">
      <template #icon>
        <ZnIcon name="music_note" label="Zound Box" />
      </template>

      <template #actions>
        <ZnSwitch v-model="isDarkMode" labelRight="Modo oscuro" />
        <ZnButton
          variant="text"
          iconOnly
          aria-label="Acerca de Zound Box"
          title="Acerca de Zound Box"
          @click="isAboutOpen = true"
        >
          <ZnIcon name="info" label="Acerca de Zound Box" />
        </ZnButton>
      </template>

      <div class="sound-page">
        <ZnSection title="Sonidos de fondo">
          <div class="sound-grid sound-grid--background">
            <SoundToggle
              v-for="sound in backgroundSounds"
              :key="sound.id"
              v-model="sound.enabled"
              :title="sound.name"
              :description="sound.description"
              :image="sound.image"
            />
          </div>
        </ZnSection>

        <ZnSection title="Sonidos de seseo">
          <div class="sound-grid sound-grid--hiss">
            <SoundToggle
              v-for="sound in hissSounds"
              :key="sound.id"
              v-model="sound.enabled"
              :title="sound.name"
              :indicator="sound.indicator"
            />
          </div>
        </ZnSection>
      </div>
    </ZnScreen>

    <ZnDialog v-model="isAboutOpen" title="Acerca de Zound Box">
      <ZnAbout v-bind="appMetadata" icon="music_note" />
      <template #actions>
        <ZnButton variant="text" @click="isAboutOpen = false">Cerrar</ZnButton>
      </template>
    </ZnDialog>
  </ZnApp>
</template>

<script setup>
import { reactive, ref } from 'vue'
import packageJson from '../package.json'
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnSwitch, ZnIcon, ZnButton, ZnDialog } from '@zn-apps/ui-core'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import SoundToggle from './components/SoundToggle.vue'
import whiteNoiseImage from './assets/sounds/white-noise.jpg'
import rainImage from './assets/sounds/rain.jpg'
import windImage from './assets/sounds/wind.jpg'
import lullabyImage from './assets/sounds/lullaby.jpg'

const isDarkMode = ref(false)
const isAboutOpen = ref(false)
const appMetadata = getAppMetadata(packageJson)
const backgroundSounds = reactive([
  { id: 'white-noise', name: 'Ruido blanco', description: 'Un sonido constante para cubrir el ruido ambiente.', image: whiteNoiseImage, enabled: false },
  { id: 'rain', name: 'Lluvia', description: 'Lluvia suave y continua.', image: rainImage, enabled: false },
  { id: 'wind', name: 'Viento', description: 'Una brisa tranquila de fondo.', image: windImage, enabled: false },
  { id: 'lullaby', name: 'Canción de cuna', description: 'Una melodía suave para relajarse.', image: lullabyImage, enabled: false }
])
const hissSounds = reactive([
  { id: 'hiss-x2', name: 'Seseo', indicator: '×2', enabled: false },
  { id: 'hiss-x3', name: 'Seseo', indicator: '×3', enabled: false },
  { id: 'hiss-x5', name: 'Seseo', indicator: '×5', enabled: false }
])
</script>

<style scoped>
.sound-page {
  width: min(100%, 880px);
  margin: 0 auto;
}

.sound-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.sound-grid--hiss {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 680px) {
  .sound-grid,
  .sound-grid--hiss {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .sound-grid,
  .sound-grid--hiss {
    grid-template-columns: 1fr;
  }
}
</style>
