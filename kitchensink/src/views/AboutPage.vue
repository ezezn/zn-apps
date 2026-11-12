<template>
  <DemoView view="about">
    <ZnSection title="About panel from package.json">
      <p class="section-desc">
        <code>getAppMetadata</code> maps this app's package metadata to the props expected by
        <code>ZnAbout</code>. The component now has two tabs: <strong>Credits</strong> (app
        metadata) and <strong>Changelog</strong> (text loaded from a URL or passed inline).
      </p>
      <ZnAbout
        v-bind="appMetadata"
        icon="widgets"
        :changelog="sampleChangelog"
        :credits-label="t('aboutTabs.credits')"
        :changelog-label="t('aboutTabs.changelog')"
        :loading-text="t('aboutTabs.loading')"
        :empty-text="t('aboutTabs.empty')"
        :error-text="t('aboutTabs.error')"
      />
    </ZnSection>

    <ZnSection title="Usage">
      <pre class="usage"><code>import packageJson from './package.json'
import { getAppMetadata, ZnAbout } from '@zn-apps/ui-about'

const appMetadata = getAppMetadata(packageJson)

// Option A: the component fetches the changelog lazily when the tab opens.
&lt;ZnAbout
  v-bind="appMetadata"
  changelog-url="/CHANGELOG.md"
/&gt;

// Option B: pass the text already loaded (e.g. `import text from '../CHANGELOG.md?raw'`).
&lt;ZnAbout v-bind="appMetadata" :changelog="text" /&gt;</code></pre>
      <p class="section-desc section-desc--spaced">
        Both apps expose their <code>CHANGELOG.md</code> with
        <code>changelogPlugin()</code> (dev server and <code>dist/</code>), so the URL variant
        works in development and production.
      </p>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import packageJson from '../../package.json'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import { ZnSection } from '@zn-apps/ui-core'
import DemoView from '../components/DemoView.vue'
import { i18n } from '../i18n.js'

const appMetadata = getAppMetadata(packageJson)
const t = (...args) => i18n.global.t(...args)

// Ejemplo para probar la pestaña Changelog sin un CHANGELOG.md propio.
const sampleChangelog = `# Changelog

## [0.3.0] - 2026-11-12

### Español
- Pestañas Créditos y Changelog en ZnAbout.
- Carga diferida del changelog con scrollbar.

### English
- Credits and Changelog tabs in ZnAbout.
- Lazy changelog loading with a scrollbar.

## [0.2.0] - 2026-11-04

### Español
- Nuevos componentes de entrada MD3.

### English
- New MD3 input components.`
</script>

<style scoped>
.usage {
  overflow-x: auto;
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.section-desc--spaced {
  margin-top: 12px;
}
</style>
