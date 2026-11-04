<template>
  <DemoView view="legacy">

    <ZnSection title="1. Composable useOnlineStatus()" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        Detecta la conectividad del navegador en tiempo real escuchando los eventos <code>online</code> y <code>offline</code> de <code>window</code>. Devuelve la ref <code>isOnline</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Estado actual</span>
        <div class="showcase-inline">
          <span class="state-chip">{{ isOnline ? 'ONLINE' : 'OFFLINE' }}</span>
          <span class="helper-text">Desconecta la red para ver el cambio.</span>
        </div>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Utilidad formatDate()" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Formatea una fecha en español con <code>toLocaleDateString('es-ES')</code>. Devuelve una cadena vacía si el valor es falsy.
      </p>

      <ZnBox variant="filled" class="showcase-stack">
        <span class="showcase-label">Entrada: '2024-01-15'</span>
        <span class="state-chip">{{ formattedIsoDate }}</span>
      </ZnBox>

      <ZnBox variant="filled" class="showcase-stack">
        <span class="showcase-label">Entrada: new Date(2026, 9, 28)</span>
        <span class="state-chip">{{ formattedLocalDate }}</span>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import {
  ZnSection,
  ZnBox,
  useOnlineStatus,
  formatDate
} from '@zn-apps/ui-core'

const { isOnline } = useOnlineStatus()

const formattedIsoDate = formatDate('2024-01-15')
const formattedLocalDate = formatDate(new Date(2026, 9, 28))
</script>
