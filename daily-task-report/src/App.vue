<template>
  <ZnApp :mode="preference">
    <ZnMasterSlaveLayout :view-key="$route.fullPath">
      <template #master>
        <ZnScreen :title="t('app.title')" :subtitle="plural">
          <nav :aria-label="t('nav.navigation')">
            <div class="nav-group">
              <router-link to="/" class="nav-link">
                <ZnIcon name="home" :size="20" />
                <span>{{ t('nav.home') }}</span>
              </router-link>
              <router-link to="/tasks" class="nav-link">
                <ZnIcon name="task_alt" :size="20" />
                <span>{{ plural }}</span>
              </router-link>
              <router-link to="/updates" class="nav-link">
                <ZnIcon name="system_update" :size="20" />
                <span>{{ t('nav.updates') }}</span>
              </router-link>
              <router-link to="/reports" class="nav-link">
                <ZnIcon name="description" :size="20" />
                <span>{{ t('nav.reports') }}</span>
              </router-link>
              <router-link to="/days-off" class="nav-link">
                <ZnIcon name="event_busy" :size="20" />
                <span>{{ t('nav.daysOff') }}</span>
              </router-link>
            </div>

            <!-- Opciones secundarias: ancladas al final del panel visible. -->
            <div class="nav-group nav-group--secondary">
              <router-link to="/settings" class="nav-link">
                <ZnIcon name="settings" :size="20" />
                <span>{{ t('nav.settings') }}</span>
              </router-link>
              <router-link to="/about" class="nav-link">
                <ZnIcon name="info" :size="20" />
                <span>{{ t('nav.about') }}</span>
              </router-link>
            </div>
          </nav>
        </ZnScreen>
      </template>

      <router-view />
    </ZnMasterSlaveLayout>

    <ZnDialogHost />

    <!-- Popups de PWA: hijos directos de ZnApp (position: fixed). -->
    <ZnPwaInstallPrompt
      :title="t('pwa.installTitle')"
      :message="t('pwa.installMessage')"
      :image="pwaIconUrl"
      :delay-ms="2000"
    />
    <ZnPwaUpdatePrompt
      :title="t('pwa.updateTitle')"
      :message="t('pwa.updateMessage')"
      :update-text="t('pwa.updateText')"
      :dismiss-text="t('pwa.dismissUpdate')"
    />
  </ZnApp>
</template>

<script setup>
import '@zn-apps/ui-core/dist/ui-core.css'
import {
  ZnApp,
  ZnDialogHost,
  ZnIcon,
  ZnMasterSlaveLayout,
  ZnScreen
} from '@zn-apps/ui-core'
import { ZnPwaInstallPrompt, ZnPwaUpdatePrompt } from '@zn-apps/pwa-integration'
import { i18n } from './i18n.js'
import { useAppTheme } from './composables/useAppTheme.js'
import { useEntityLabels } from './composables/useEntityLabels.js'

const t = (...args) => i18n.global.t(...args)
const { preference } = useAppTheme()
const { plural } = useEntityLabels()

const pwaIconUrl = `${import.meta.env.BASE_URL}pwa-icon.svg`
</script>

<style scoped>
.nav-link {
  gap: 12px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ui-core estira el <nav> para llenar el panel; el margen automático empuja
   Configuración y Acerca de al borde inferior. */
.nav-group--secondary {
  margin-top: auto;
  padding-top: 8px;
}
</style>
