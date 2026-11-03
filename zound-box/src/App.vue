<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">
    <ZnScreen title="Zound Box">
      <template #icon>
        <ZnIcon name="music_note" label="Zound Box" />
      </template>

      <template #actions>
        <ZnSwitch v-model="isDarkMode" labelRight="Modo oscuro" />
      </template>

      <div class="sound-page">
        <header class="page-intro">
          <p class="eyebrow">Tu espacio de sonido</p>
          <h2>Arma tu ambiente</h2>
          <p>Activa un sonido principal y combínalo con sonidos de fondo.</p>
        </header>

        <ZnSection title="Sonido en primer plano">
          <ZnCard class="foreground-card" variant="elevated">
            <div class="foreground-card__icon" aria-hidden="true">
              <ZnIcon name="music_note" :size="32" />
            </div>
            <div class="foreground-card__details">
              <p class="sound-kicker">Sonido principal</p>
              <h3>Piano suave</h3>
              <p class="sound-description">Una melodía tranquila para acompañar tu momento.</p>
            </div>
            <ZnSwitch
              v-model="foregroundEnabled"
              :labelRight="foregroundEnabled ? 'Activado' : 'Desactivado'"
              class="sound-toggle"
            />
          </ZnCard>
        </ZnSection>

        <ZnSection title="Sonidos de fondo">
          <p class="section-intro">
            Combina sonidos ambientales. Puedes activar varios al mismo tiempo.
          </p>
          <div class="background-list">
            <ZnCard
              v-for="sound in backgroundSounds"
              :key="sound.id"
              class="background-card"
              variant="outlined"
            >
              <div class="background-card__icon" aria-hidden="true">
                <ZnIcon :name="sound.icon" />
              </div>
              <div class="background-card__details">
                <h3>{{ sound.name }}</h3>
                <p>{{ sound.description }}</p>
              </div>
              <ZnSwitch
                v-model="sound.enabled"
                :labelRight="sound.enabled ? 'Activado' : 'Desactivado'"
                class="sound-toggle"
              />
            </ZnCard>
          </div>
          <p class="active-summary" aria-live="polite">
            {{ activeBackgroundCount }} {{ activeBackgroundCount === 1 ? 'sonido de fondo activo' : 'sonidos de fondo activos' }}
          </p>
        </ZnSection>
      </div>
    </ZnScreen>
  </ZnApp>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnSwitch, ZnIcon } from '@zn-apps/ui-core'

const isDarkMode = ref(false)
const foregroundEnabled = ref(false)
const backgroundSounds = reactive([
  { id: 'rain', name: 'Lluvia suave', description: 'Lluvia constante contra la ventana.', icon: 'water_drop', enabled: false },
  { id: 'forest', name: 'Bosque', description: 'Aves y hojas entre los árboles.', icon: 'forest', enabled: false },
  { id: 'fire', name: 'Chimenea', description: 'El crepitar cálido de un fuego tranquilo.', icon: 'local_fire_department', enabled: false },
  { id: 'waves', name: 'Olas del mar', description: 'El ritmo pausado de las olas en la costa.', icon: 'waves', enabled: false }
])

const activeBackgroundCount = computed(
  () => backgroundSounds.filter((sound) => sound.enabled).length
)
</script>

<style scoped>
.sound-page {
  width: min(100%, 880px);
  margin: 0 auto;
}

.page-intro {
  padding: 24px 16px 32px;
}

.page-intro h2 {
  margin: 4px 0 8px;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-intro p:last-child,
.section-intro,
.sound-description,
.background-card__details p {
  margin: 0;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.eyebrow,
.sound-kicker {
  margin: 0;
  color: var(--md-primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.foreground-card,
.background-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.foreground-card__icon,
.background-card__icon {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.foreground-card__icon {
  flex-basis: 64px;
  width: 64px;
  height: 64px;
  border-radius: 18px;
}

.foreground-card__details,
.background-card__details {
  flex: 1;
  min-width: 0;
}

.foreground-card h3,
.background-card h3 {
  margin: 3px 0 4px;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
}

.foreground-card h3 {
  font-size: 1.25rem;
}

.sound-kicker {
  font-size: 0.68rem;
}

.foreground-card .sound-description,
.background-card__details p {
  font-size: 0.875rem;
}

.section-intro {
  margin-bottom: 16px;
}

.background-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.background-card {
  gap: 14px;
  padding: 16px;
}

.sound-toggle {
  flex: 0 0 auto;
}

.active-summary {
  margin: 16px 0 0;
  color: var(--md-outline);
  font-size: 0.8rem;
  text-align: right;
}

@media (max-width: 680px) {
  .page-intro {
    padding: 12px 8px 24px;
  }

  .background-list {
    grid-template-columns: 1fr;
  }

  .foreground-card {
    flex-wrap: wrap;
  }

  .foreground-card__details {
    flex-basis: calc(100% - 90px);
  }

  .foreground-card .sound-toggle {
    margin-left: auto;
  }
}
</style>
