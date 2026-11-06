<template>
  <DemoView view="pwa-color-scheme">
    <ZnSection title="1. Detección del tema del sistema" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        <code>useColorScheme()</code> detecta <code>prefers-color-scheme</code> en tiempo real
        y resuelve el tema activo según la preferencia elegida: <code>system</code>,
        <code>light</code> u <code>dark</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Tema del sistema</span>
        <span class="state-chip">{{ systemColorScheme }}</span>
        <span class="showcase-label">Preferencia actual</span>
        <span class="state-chip">{{ preference }}</span>
        <span class="showcase-label">Tema resuelto</span>
        <span class="state-chip">{{ resolvedTheme }}</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Cambiar la preferencia" collapsible :columns="1">
      <ZnRow padding="0" gap="8px">
        <ZnButton
          :variant="preference === 'system' ? 'filled' : 'outlined'"
          @click="setPreference('system')"
        >Sistema</ZnButton>
        <ZnButton
          :variant="preference === 'light' ? 'filled' : 'outlined'"
          @click="setPreference('light')"
        >Claro</ZnButton>
        <ZnButton
          :variant="preference === 'dark' ? 'filled' : 'outlined'"
          @click="setPreference('dark')"
        >Oscuro</ZnButton>
      </ZnRow>

      <p class="helper-text">
        El tema resuelto por este composable controla también el modo de <code>ZnApp</code>
        desde el menú lateral.
      </p>
    </ZnSection>

    <ZnSection title="3. Uso" collapsible :expanded="false" :columns="1">
      <pre class="code-block"><code>import { useColorScheme } from '@zn-apps/pwa-integration'
import { ZnApp } from '@zn-apps/ui-core'

const { resolvedTheme, preference, setPreference } = useColorScheme()

// &lt;ZnApp :mode="resolvedTheme"&gt; ... &lt;/ZnApp&gt;
// setPreference('system' | 'light' | 'dark')</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRow, ZnButton } from '@zn-apps/ui-core'
import { useColorScheme } from '@zn-apps/pwa-integration'

const { systemColorScheme, resolvedTheme, preference, setPreference } = useColorScheme()
</script>
