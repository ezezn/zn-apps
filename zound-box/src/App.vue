<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">
    <ZnScreen title="Zound Box">
      <template #icon>
        <ZnIcon name="music_note" label="Zound Box" />
      </template>

      <template #actions>
        <ZnSwitch v-model="isDarkMode">
          <template #iconOff>
            <ZnIcon name="light_mode" label="Modo claro" />
          </template>
          <template #iconOn>
            <ZnIcon name="dark_mode" label="Modo oscuro" />
          </template>
        </ZnSwitch>
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
        <SoundChannelPlayer
          v-for="channel in orderedChannels"
          :key="`player-${channel.id}`"
          :channel-id="channel.id"
          :source="channel.audioSource"
          :playing="isPlaying && Boolean(channel.audioSource)"
          :volume="isMuted ? 0.1 : 1"
          @source-change="channel.currentSource = $event.source"
          @error="onPlaybackError"
        />

        <ZnSection>
          <ZnCard class="playback-card" variant="elevated" aria-label="Controles de reproducción">
            <div class="playback-card__controls">
              <ZnButton
                class="playback-card__play"
                variant="filled"
                iconOnly
                :aria-label="isPlaying ? 'Pausar reproducción' : 'Iniciar reproducción'"
                :title="isPlaying ? 'Pausar' : 'Reproducir'"
                @click="isPlaying = !isPlaying"
              >
                <ZnIcon :name="isPlaying ? 'pause' : 'play_arrow'" :size="40" />
              </ZnButton>
              <div class="playback-card__status" aria-live="polite">
                <span class="playback-card__title">{{ isPlaying ? 'Reproduciendo' : 'En pausa' }}</span>
                <span class="playback-card__subtitle">
                  {{ hasPlaybackError ? 'No se pudo iniciar un sonido' : isMuted ? 'Volumen reducido al 10%' : 'Volumen al 100%' }}
                </span>
              </div>
              <ZnButton
                class="playback-card__mute"
                variant="tonal"
                iconOnly
                :aria-label="isMuted ? 'Restaurar volumen al 100%' : 'Reducir volumen al 10%'"
                :title="isMuted ? 'Volumen al 100%' : 'Volumen al 10%'"
                @click="isMuted = !isMuted"
              >
                <ZnIcon :name="isMuted ? 'volume_off' : 'volume_up'" :size="28" />
              </ZnButton>
            </div>
          </ZnCard>
        </ZnSection>

        <ZnSection
          v-for="channel in orderedChannels"
          :key="channel.id"
          :title="channel.title"
        >
          <div class="sound-grid" :class="`sound-grid--${channel.id}`">
            <SoundToggle
              v-for="sound in channel.sounds"
              :key="sound.id"
              v-model="sound.enabled"
              :title="sound.label"
              :description="sound.description"
              :indicator="sound.indicator"
              :image="sound.image"
              :playing="isPlaying && sound.enabled"
              @change="toggleSound(channel, sound, $event)"
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
import { computed, reactive, ref } from 'vue'
import packageJson from '../package.json'
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnSwitch, ZnIcon, ZnButton, ZnCard, ZnDialog } from '@zn-apps/ui-core'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import SoundToggle from './components/SoundToggle.vue'
import SoundChannelPlayer from './components/SoundChannelPlayer.vue'
import soundChannelData from './data/sound-channels.json'

const soundAssets = import.meta.glob('./assets/sounds/*', {
  eager: true,
  import: 'default',
  query: '?url'
})

const isDarkMode = ref(false)
const isPlaying = ref(false)
const isMuted = ref(false)
const isAboutOpen = ref(false)
const appMetadata = getAppMetadata(packageJson)
const channels = reactive(soundChannelData.map((channel) => ({
  ...channel,
  audioSource: '',
  currentSource: '',
  playbackError: false,
  sounds: channel.sounds.map((sound) => ({
    ...sound,
    image: sound.cardType === 'imagen' && sound.image
      ? soundAssets[`./assets/sounds/${sound.image}`]
      : '',
    audio: soundAssets[`./assets/sounds/${sound.audio}`],
    enabled: false
  }))
})))
const orderedChannels = computed(() => [...channels].sort((a, b) => a.order - b.order))
const hasPlaybackError = computed(() => channels.some((channel) => channel.playbackError))

function toggleSound(channel, selectedSound, enabled) {
  for (const sound of channel.sounds) {
    sound.enabled = enabled && sound.id === selectedSound.id
  }

  channel.audioSource = enabled ? selectedSound.audio : ''
  channel.playbackError = false
}

function onPlaybackError({ channelId }) {
  const channel = channels.find((item) => item.id === channelId)
  if (channel) channel.playbackError = true
}
</script>

<style scoped>
.sound-page {
  width: min(100%, 880px);
  margin: 0 auto;
}

.playback-card {
  background: var(--md-surface-container-low);
}

.playback-card :deep(.zn-card__content) {
  padding: 24px;
}

.playback-card__controls {
  display: grid;
  grid-template-columns: 88px 1fr 64px;
  align-items: center;
  gap: 20px;
  max-width: 560px;
  margin: 0 auto;
}

.playback-card__controls :deep(.playback-card__play) {
  width: 88px;
  height: 88px;
  min-width: 88px;
  min-height: 88px;
}

.playback-card__controls :deep(.playback-card__mute) {
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
}

.playback-card__status {
  display: grid;
  gap: 4px;
}

.playback-card__title {
  color: var(--md-on-background);
  font-size: 1.25rem;
  font-weight: 500;
}

.playback-card__subtitle {
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
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
  .playback-card :deep(.zn-card__content) {
    padding: 20px 16px;
  }

  .playback-card__controls {
    grid-template-columns: 72px 1fr 56px;
    gap: 14px;
  }

  .playback-card__controls :deep(.playback-card__play) {
    width: 72px;
    height: 72px;
    min-width: 72px;
    min-height: 72px;
  }

  .playback-card__controls :deep(.playback-card__mute) {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }

  .playback-card__title {
    font-size: 1.05rem;
  }

  .sound-grid,
  .sound-grid--hiss {
    grid-template-columns: 1fr;
  }
}
</style>
