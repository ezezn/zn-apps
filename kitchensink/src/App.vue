<template>
  <ZnApp :mode="resolvedTheme">

    <ZnMasterSlaveLayout :view-key="$route.fullPath">
      <template #master>
        <ZnScreen :title="t('shell.title')" :subtitle="t('shell.subtitle')">
          <nav :aria-label="t('shell.navigation')">
            <section
              v-for="group in navGroups"
              :key="group.key"
              class="nav-group"
            >
              <button
                type="button"
                class="nav-group-header"
                :aria-expanded="expandedGroups[group.key] ? 'true' : 'false'"
                @click="toggleGroup(group.key)"
              >
                <ZnIcon :name="group.icon" :size="20" />
                <span class="nav-group-label">{{ group.label }}</span>
                <ZnIcon
                  class="nav-group-chevron"
                  :name="expandedGroups[group.key] ? 'expand_less' : 'expand_more'"
                  :size="18"
                />
              </button>

              <div v-show="expandedGroups[group.key]" class="nav-group-body">
                <template v-for="section in group.sections" :key="section.key">
                  <span class="nav-section-label">{{ navLabel('section', section.key, section.label) }}</span>
                  <router-link
                    v-for="item in section.items"
                    :key="item.key"
                    :to="item.to"
                  >{{ navLabel('item', item.key, item.label) }}</router-link>
                </template>
              </div>
            </section>

            <div class="nav-footer">
                  <span class="nav-section-label">{{ t('shell.theme') }}</span>
              <div class="nav-theme-options">
                <ZnButton
                  v-for="option in themeOptions"
                  :key="option.value"
                  type="button"
                  :variant="preference === option.value ? 'filled' : 'text'"
                  @click="setPreference(option.value)"
                >
                  <template #icon>
                    <ZnIcon :name="option.icon" :size="18" />
                  </template>
                  {{ option.label }}
                </ZnButton>
              </div>
            </div>
          </nav>
        </ZnScreen>
      </template>

      <router-view />
    </ZnMasterSlaveLayout>

    <ZnDialogHost />

    <!-- Popup de instalación PWA (persistencia de descarte por sesión) -->
    <ZnPwaInstallPrompt
      :title="t('shell.installTitle')"
      :message="t('shell.installMessage')"
      :image="pwaIconUrl"
      :delay-ms="2000"
    />

  </ZnApp>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import '../../shared/ui-core/src/assets/css/global.css'
import { ZnApp, ZnScreen, ZnMasterSlaveLayout, ZnButton, ZnIcon, ZnDialogHost } from '@zn-apps/ui-core'
import { ZnPwaInstallPrompt, useColorScheme } from '@zn-apps/pwa-integration'
import { navGroups, findGroupByPath } from './data/nav-groups.js'
import { i18n } from './i18n.js'

const route = useRoute()
const t = (...args) => i18n.global.t(...args)

const navTranslationKeys = {
  section: { navigation: 'nav.navigation', layout: 'nav.layout', controls: 'nav.controls', resources: 'nav.resources', about: 'nav.application', 'pwa-theme': 'nav.themeBars', 'pwa-install': 'nav.installation' },
  item: { tabs: 'nav.tabs', 'navigation-layout': 'nav.navigationLayout', layout: 'nav.layoutView', sections: 'nav.sections', screen: 'nav.screen', buttons: 'nav.buttons', cards: 'nav.cards', switches: 'nav.switches', dialogs: 'nav.dialogs', icons: 'nav.icons', legacy: 'nav.utilities', about: 'nav.about', 'pwa-color-scheme': 'nav.colorScheme', 'pwa-bar-styling': 'nav.barStyling', 'pwa-install': 'nav.pwaInstall' }
}

function navLabel(type, key, fallback) {
  const translationKey = navTranslationKeys[type]?.[key]
  return translationKey ? t(translationKey) : fallback
}

// Estado colapsable de cada grupo del menú (todos abiertos por defecto)
const expandedGroups = reactive(
  Object.fromEntries(navGroups.map((group) => [group.key, true]))
)

function toggleGroup(key) {
  expandedGroups[key] = !expandedGroups[key]
}

// Garantiza que el grupo de la vista activa esté siempre expandido
watch(
  () => route.path,
  (path) => {
    const activeGroup = findGroupByPath(navGroups, path)
    if (activeGroup) {
      expandedGroups[activeGroup.key] = true
    }
  },
  { immediate: true }
)

// Tema de la app gestionado por @zn-apps/pwa-integration
const { resolvedTheme, preference, setPreference } = useColorScheme({ defaultPreference: 'system' })

const themeOptions = computed(() => [
  { value: 'system', label: t('shell.system'), icon: 'contrast' },
  { value: 'light', label: t('shell.light'), icon: 'light_mode' },
  { value: 'dark', label: t('shell.dark'), icon: 'dark_mode' }
])

// Ruta al icono de la PWA resuelta con el base path de la app
const pwaIconUrl = `${import.meta.env.BASE_URL}pwa-icon.svg`
</script>

<style>
/* Navegación estilo MD3 Navigation Drawer, agrupada y colapsable */
.nav-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% - 16px);
  margin: 12px 8px 0 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 100px;
  background: transparent;
  font-family: 'Roboto', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-align: left;
  color: var(--md-on-surface);
  cursor: pointer;
}

.nav-group-header:hover {
  background-color: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}

.nav-group-chevron {
  margin-left: auto;
  color: var(--md-outline);
}

.nav-section-label {
  display: block;
  padding: 16px 16px 4px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--md-outline);
}

.nav-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--md-surface-variant);
}

.nav-theme-options {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
