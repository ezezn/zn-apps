<template>
  <DemoView view="pwa-install">
    <ZnSection title="1. Estado de instalación" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        <code>usePwaInstall()</code> detecta si la app ya se ejecuta en modo standalone
        (instalada) y expone cuándo el navegador permite mostrar el diálogo nativo
        de instalación.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">¿Instalada como PWA?</span>
        <span class="state-chip">{{ isInstalled ? 'SÍ' : 'NO' }}</span>
        <span class="showcase-label">¿Puede instalarse?</span>
        <span class="state-chip">{{ canInstall ? 'SÍ' : 'NO' }}</span>
      </ZnBox>

      <ZnRow padding="0" gap="8px">
        <ZnButton type="button" variant="filled" :disabled="isInstalling" @click="install">
          Instalar ahora
        </ZnButton>
      </ZnRow>

      <p class="helper-text" v-if="lastOutcome">
        Último resultado del diálogo nativo: <code>{{ lastOutcome }}</code>
      </p>
    </ZnSection>

    <ZnSection title="2. Popup de instalación ZnPwaInstallPrompt" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        El popup aparece tras un retardo cuando la app no está instalada. Esta demo usa
        <code>storage-type="none"</code> para que puedas descartarlo y verlo de nuevo al
        regresar a la vista. En el resto de la aplicación el descarte se recuerda durante
        la sesión.
      </p>

      <ZnPwaInstallPrompt
        title="Instalar Kitchensink (demo)"
        message="Lleva el catálogo de componentes a tu escritorio o móvil y consúltalo sin conexión."
        :image="pwaIconUrl"
        :delay-ms="500"
        storage-type="none"
        @install="logEvent('install')"
        @installed="logEvent('installed')"
        @dismiss="logEvent('dismiss')"
      />

      <p class="helper-text" v-if="lastEvent">
        Último evento emitido: <code>{{ lastEvent }}</code>
      </p>
    </ZnSection>

    <ZnSection title="3. Uso" collapsible :expanded="false" :columns="1">
      <pre class="code-block"><code>import { usePwaInstall, ZnPwaInstallPrompt } from '@zn-apps/pwa-integration'

const { isInstalled, canInstall, promptInstall } = usePwaInstall()

async function install() {
  const result = await promptInstall()
  if (result?.outcome === 'accepted') { /* ... */ }
}

// &lt;ZnPwaInstallPrompt
//   title="Instalar mi app"
//   image="pwa-icon.svg"
//   :delay-ms="1500"
//   storage-type="session"
//   @install @installed @dismiss /&gt;</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRow, ZnButton } from '@zn-apps/ui-core'
import { usePwaInstall, ZnPwaInstallPrompt } from '@zn-apps/pwa-integration'

const { isInstalled, canInstall, promptInstall } = usePwaInstall()

// Ruta al icono de la PWA resuelta con el base path de la app.
const pwaIconUrl = `${import.meta.env.BASE_URL}pwa-icon.svg`

const isInstalling = ref(false)
const lastOutcome = ref('')
const lastEvent = ref('')

async function install() {
  isInstalling.value = true
  try {
    const result = await promptInstall()
    lastOutcome.value = result ? result.outcome : 'no disponible'
  } finally {
    isInstalling.value = false
  }
}

function logEvent(name) {
  lastEvent.value = name
}
</script>
