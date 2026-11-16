<template>
  <ZnScreen :title="t('nav.about')">
    <div class="about-page">
      <ZnSection :columns="1">
        <ZnAbout
          v-bind="appMetadata"
          :image="appIconUrl"
          :changelog-url="changelogUrl"
          :credits-label="t('aboutTabs.credits')"
          :changelog-label="t('aboutTabs.changelog')"
          :loading-text="t('aboutTabs.loading')"
          :empty-text="t('aboutTabs.empty')"
          :error-text="t('aboutTabs.error')"
        />
      </ZnSection>
    </div>
  </ZnScreen>
</template>

<script setup>
import packageJson from '../../package.json'
import { ZnScreen, ZnSection } from '@zn-apps/ui-core'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import { i18n } from '../i18n.js'

const t = (...args) => i18n.global.t(...args)

const appMetadata = getAppMetadata(packageJson)
const appIconUrl = `${import.meta.env.BASE_URL}pwa-icon.svg`
const changelogUrl = `${import.meta.env.BASE_URL}CHANGELOG.md`
</script>

<style scoped>
.about-page {
  width: min(100%, 880px);
  margin: 0 auto;
}
</style>
