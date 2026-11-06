<template>
  <DemoView view="pwa-bar-styling">
    <ZnSection title="1. Estado actual de las barras" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        <code>usePwaMeta()</code> gestiona reactivamente la barra superior del sistema
        (<code>&lt;meta name="theme-color"&gt;</code>) y el fondo del documento
        (barra inferior y overscroll).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">theme-color</span>
        <span class="state-chip">{{ themeColor || '—' }}</span>
        <span class="showcase-label">Fondo del documento</span>
        <span class="state-chip">{{ backgroundColor || '—' }}</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Aplicar colores" collapsible :columns="1">
      <ZnRow padding="0" gap="8px">
        <ZnButton
          v-for="preset in presets"
          :key="preset.value"
          type="button"
          variant="outlined"
          @click="applyColor(preset.value)"
        >{{ preset.label }}</ZnButton>
      </ZnRow>

      <ZnRow padding="0" gap="8px">
        <ZnButton type="button" variant="filled" @click="syncWithScreenHeading()">
          Sincronizar con la pantalla
        </ZnButton>
        <ZnButton type="button" variant="text" @click="restoreDefaults()">
          Restaurar valores por defecto
        </ZnButton>
      </ZnRow>

      <p class="helper-text">
        «Sincronizar» toma el color computado del header de <code>ZnScreen</code>
        (clase <code>.zn-screen__header</code>) y lo aplica a las barras del sistema.
      </p>
    </ZnSection>

    <ZnSection title="3. Uso" collapsible :expanded="false" :columns="1">
      <pre class="code-block"><code>import { usePwaMeta } from '@zn-apps/pwa-integration'

const { setAppMetaColors, syncWithScreenHeading } = usePwaMeta()

onMounted(() =&gt; {
  syncWithScreenHeading()
})

// setAppMetaColors({ themeColor: '#2563eb', backgroundColor: '#ffffff' })</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRow, ZnButton } from '@zn-apps/ui-core'
import { usePwaMeta } from '@zn-apps/pwa-integration'

const { themeColor, backgroundColor, setAppMetaColors, syncWithScreenHeading } = usePwaMeta()

const presets = [
  { label: 'Azul', value: '#2563eb' },
  { label: 'Verde', value: '#2e7d32' },
  { label: 'Violeta', value: '#7b1fa2' }
]

function applyColor(color) {
  setAppMetaColors({
    themeColor: color,
    backgroundColor: color,
    statusBarStyle: 'default'
  })
}

function restoreDefaults() {
  setAppMetaColors({
    themeColor: '#2563eb',
    backgroundColor: '#ffffff'
  })
}
</script>
