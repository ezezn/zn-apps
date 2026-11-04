<template>
  <DemoView view="about">
    <ZnSection title="About panel from package.json">
      <p class="section-desc">
        <code>getAppMetadata</code> maps this app's package metadata to the props expected by
        <code>ZnAbout</code>.
      </p>
      <ZnAbout v-bind="appMetadata" icon="widgets" />
    </ZnSection>

    <ZnSection title="Usage">
      <pre class="usage"><code>import packageJson from './package.json'
import { getAppMetadata, ZnAbout } from '@zn-apps/ui-about'

const appMetadata = getAppMetadata(packageJson)

// Optional: set icon="widgets"; defaults to the info icon.</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import packageJson from '../../package.json'
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import { ZnSection } from '@zn-apps/ui-core'
import DemoView from '../components/DemoView.vue'

const appMetadata = getAppMetadata(packageJson)
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
</style>
