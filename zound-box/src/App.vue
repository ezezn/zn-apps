<template>
  <ZnApp :mode="appMode">
    <ZnScreen :title="t('app.title')">
      <template #icon>
        <div class="zn-image-wrapper" style="width: 48px; height: 48px;">
          <ZnImage
            :src="appLogo"
            alt="Zound Box"
            :width="48"
            :height="48"
            fit="contain"
          />
        </div>
      </template>

      <template #actions>
        <ZnButton
          variant="text"
          iconOnly
          :aria-label="t('app.settings')"
          :title="t('app.settings')"
          @click="isSettingsOpen = true"
        >
          <ZnIcon name="settings" :label="t('app.settings')" />
        </ZnButton>
        <ZnButton
          variant="text"
          iconOnly
          :aria-label="t('app.about')"
          :title="t('app.about')"
          @click="isAboutOpen = true"
        >
          <ZnIcon name="info" :label="t('app.about')" />
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
          :loop-start="channel.loopStartSeconds"
          :loop-end="channel.loopEndSeconds"
          @source-change="channel.currentSource = $event.source"
          @error="onPlaybackError"
        />

        <ZnSection>
        <ZnCard class="playback-card" variant="elevated" :aria-label="t('playback.aria')">
            <div class="playback-card__controls">
              <ZnButton
                class="playback-card__play"
                variant="filled"
                iconOnly
                :aria-label="isPlaying ? t('actions.pause') : t('actions.play')"
                :title="isPlaying ? t('actions.pause') : t('actions.play')"
                @click="isPlaying = !isPlaying"
              >
                <ZnIcon :name="isPlaying ? 'pause' : 'play_arrow'" :size="40" />
              </ZnButton>
              <div class="playback-card__status" aria-live="polite">
                <span class="playback-card__title">{{ isPlaying ? t('playback.playing') : t('playback.paused') }}</span>
                <span class="playback-card__subtitle">
                  {{ hasPlaybackError ? t('playback.error') : isMuted ? t('playback.reduced') : t('playback.full') }}
                </span>
              </div>
              <ZnButton
                class="playback-card__mute"
                variant="tonal"
                iconOnly
                :aria-label="isMuted ? t('actions.restoreVolume') : t('actions.volume10')"
                :title="isMuted ? t('actions.restoreVolume') : t('actions.volume10')"
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
            :title="t(`channels.${channel.id}`)"
        >
          <div class="sound-grid" :class="`sound-grid--${channel.id}`">
            <SoundToggle
              v-for="sound in channel.sounds"
              :key="sound.id"
              v-model="sound.enabled"
              :title="t(`sounds.${sound.id}.label`)"
              :description="t(`sounds.${sound.id}.description`)"
              :indicator="sound.indicator"
              :image="sound.image"
              :playing="isPlaying && sound.enabled"
              @change="toggleSound(channel, sound, $event)"
            />
          </div>
        </ZnSection>
      </div>
    </ZnScreen>

    <ZnDialog v-model="isAboutOpen" :title="t('app.about')">
      <ZnAbout v-bind="appMetadata" :image="appLogo" />
      <template #actions>
        <ZnButton variant="text" @click="isAboutOpen = false">{{ t('app.close') }}</ZnButton>
      </template>
    </ZnDialog>

    <ZnDialog v-model="isSettingsOpen" :title="t('settings.title')">
      <div class="settings-modal">
        <!-- Sección Idioma -->
        <div class="settings-section">
          <h3 class="settings-section__title">{{ t('settings.languageSection') }}</h3>
          <div class="settings-modal__row">
            <ZnSwitch
              :model-value="useSystemLanguage"
              :label-left="t('settings.systemLanguage')"
              @update:model-value="onToggleSystemLanguage"
            />
          </div>

          <div v-if="!useSystemLanguage" class="settings-modal__row settings-modal__row--select">
            <label class="settings-modal__label" for="setting-lang-select">{{ t('settings.language') }}</label>
            <select
              id="setting-lang-select"
              class="settings-modal__select"
              :value="selectedLanguage"
              @change="onChangeLanguage"
            >
              <option value="es">{{ t('settings.spanish') }}</option>
              <option value="en">{{ t('settings.english') }}</option>
            </select>
          </div>
        </div>

        <!-- Sección Audio -->
        <div class="settings-section">
          <h3 class="settings-section__title">{{ t('settings.audioSection') }}</h3>
          <div class="settings-modal__row">
            <ZnSwitch
              :model-value="startLowVolume"
              :label-left="t('settings.startLowVolume')"
              @update:model-value="onToggleStartLowVolume"
            />
          </div>

          <div class="settings-modal__row">
            <ZnSwitch
              :model-value="rememberSounds"
              :label-left="t('settings.rememberCombination')"
              @update:model-value="onToggleRememberSounds"
            />
          </div>
        </div>

        <!-- Sección Esquema de Colores -->
        <div class="settings-section">
          <h3 class="settings-section__title">{{ t('settings.themeSection') }}</h3>
          <div class="settings-modal__row">
            <ZnSwitch
              :model-value="followSystemTheme"
              :label-left="t('settings.systemTheme')"
              @update:model-value="onToggleFollowSystemTheme"
            />
          </div>

          <div v-if="!followSystemTheme" class="settings-modal__row">
            <ZnSwitch
              :model-value="isDarkMode"
              :label-left="t('settings.customTheme')"
              @update:model-value="onToggleCustomTheme"
            >
              <template #iconOff>
                <ZnIcon name="light_mode" :label="t('actions.lightMode')" />
              </template>
              <template #iconOn>
                <ZnIcon name="dark_mode" :label="t('actions.darkMode')" />
              </template>
            </ZnSwitch>
          </div>
        </div>
      </div>
      <template #actions>
        <ZnButton variant="text" @click="isSettingsOpen = false">{{ t('app.close') }}</ZnButton>
      </template>
    </ZnDialog>
  </ZnApp>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import packageJson from '../package.json'
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnSwitch, ZnIcon, ZnButton, ZnCard, ZnImage, ZnDialog } from '@zn-apps/ui-core'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import SoundToggle from './components/SoundToggle.vue'
import SoundChannelPlayer from './components/SoundChannelPlayer.vue'
import { i18n, settings, systemLocale } from './i18n.js'
import soundChannelData from './data/sound-channels.json'
import appLogo from './assets/logo.svg'

const soundAssets = import.meta.glob('./assets/sounds/*', {
  eager: true,
  import: 'default',
  query: '?url'
})

const isPlaying = ref(false)
const isAboutOpen = ref(false)
const isSettingsOpen = ref(false)

// Configuración de tema desde settings
const followSystemTheme = ref(settings.theme?.followSystem ?? true)
const isDarkMode = ref(settings.theme?.mode === 'dark')

const appMode = computed(() => {
  if (followSystemTheme.value) return 'system'
  return isDarkMode.value ? 'dark' : 'light'
})

function onToggleFollowSystemTheme(value) {
  followSystemTheme.value = value
  settings.theme.followSystem = value
}

function onToggleCustomTheme(value) {
  isDarkMode.value = value
  settings.theme.mode = value ? 'dark' : 'light'
}

// Configuración de audio desde settings
const startLowVolume = ref(Boolean(settings.audio.startLowVolume))
const isMuted = ref(startLowVolume.value)
const rememberSounds = ref(Boolean(settings.audio.rememberSounds))

// Configuración de idioma desde settings
const useSystemLanguage = ref(Boolean(settings.i18n.useSystem))
const selectedLanguage = ref(settings.i18n.locale || (i18n.global.locale.value || 'es'))

function applyLocale() {
  const targetLocale = useSystemLanguage.value ? systemLocale() : selectedLanguage.value
  i18n.global.locale.value = targetLocale
}

function onToggleSystemLanguage(value) {
  useSystemLanguage.value = value
  settings.i18n.useSystem = value
  if (value) {
    settings.i18n.locale = null
  } else {
    settings.i18n.locale = selectedLanguage.value
  }
  applyLocale()
}

function onChangeLanguage(event) {
  const value = event.target.value
  selectedLanguage.value = value
  settings.i18n.locale = value
  applyLocale()
}

function onToggleStartLowVolume(value) {
  startLowVolume.value = value
  settings.audio.startLowVolume = value
}

function onToggleRememberSounds(value) {
  rememberSounds.value = value
  settings.audio.rememberSounds = value
}

function saveSelectedSounds() {
  const current = {}
  for (const channel of channels) {
    const active = channel.sounds.find((s) => s.enabled)
    current[channel.id] = active ? active.id : null
  }
  settings.audio.selectedSounds = current
}

const appMetadata = getAppMetadata(packageJson)
const t = (...args) => i18n.global.t(...args)

// Cargar sonidos iniciales si hay algo guardado en settings.audio.selectedSounds
const savedSounds = settings.audio.selectedSounds || {}

const channels = reactive(soundChannelData.map((channel) => {
  const rememberedSoundId = savedSounds[channel.id] || null
  const sounds = channel.sounds.map((sound) => {
    const isSelected = Boolean(rememberedSoundId && sound.id === rememberedSoundId)
    return {
      ...sound,
      image: sound.cardType === 'imagen' && sound.image
        ? soundAssets[`./assets/sounds/${sound.image}`]
        : '',
      audio: soundAssets[`./assets/sounds/${sound.audio}`],
      enabled: isSelected
    }
  })

  const selectedSound = sounds.find((s) => s.enabled)

  return {
    ...channel,
    audioSource: selectedSound ? selectedSound.audio : '',
    currentSource: '',
    loopStartSeconds: selectedSound ? (selectedSound.fadeInEndSeconds ?? 0) : 0,
    loopEndSeconds: selectedSound ? (selectedSound.fadeOutStartSeconds ?? null) : null,
    playbackError: false,
    sounds
  }
}))

const orderedChannels = computed(() => [...channels].sort((a, b) => a.order - b.order))
const hasPlaybackError = computed(() => channels.some((channel) => channel.playbackError))

function toggleSound(channel, selectedSound, enabled) {
  for (const sound of channel.sounds) {
    sound.enabled = enabled && sound.id === selectedSound.id
  }

  channel.audioSource = enabled ? selectedSound.audio : ''
  if (enabled) {
    channel.loopStartSeconds = selectedSound.fadeInEndSeconds ?? 0
    channel.loopEndSeconds = selectedSound.fadeOutStartSeconds ?? null
  }
  channel.playbackError = false

  saveSelectedSounds()
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

.settings-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section:not(:last-child) {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--md-surface-variant);
}

.settings-section__title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-primary);
}

.settings-modal__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-height: 40px;
}

.settings-modal__row :deep(.zn-switch-wrapper) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.settings-modal__row :deep(.zn-switch__label--left) {
  font-size: 0.95rem;
  color: var(--md-on-surface);
}

.settings-modal__row--select {
  justify-content: space-between;
}

.settings-modal__label {
  font-size: 0.95rem;
  color: var(--md-on-surface);
}

.settings-modal__select {
  padding: 8px 12px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
}

.settings-modal__select:focus-visible {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 1px var(--md-primary);
}
</style>
