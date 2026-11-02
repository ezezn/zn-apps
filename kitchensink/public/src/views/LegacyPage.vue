<template>
  <ZnScreen title="Legacy y utilidades">
    <template #title>
      <div>
        <h1 class="screen-heading">Legacy y utilidades</h1>
        <span class="screen-subtitle">CustomButton (legacy) · useOnlineStatus · formatDate</span>
      </div>
    </template>

    <ZnSection title="1. CustomButton (Legacy)" :columns="1">
      <p class="section-desc section-desc--full">
        <code>CustomButton</code> es el botón original de la librería y conserva su estilo propio (verde <code>#42b883</code>), ajeno a los tokens MD3. Se mantiene por compatibilidad: en código nuevo usa <code>ZnButton</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Label por defecto y evento click</span>
        <div class="showcase-inline">
          <CustomButton @click="legacyClicks += 1" />
          <CustomButton label="Con label propio" @click="legacyClicks += 1" />
          <span class="state-chip">clics: {{ legacyClicks }}</span>
        </div>
        <span class="helper-text">También admite contenido por slot: <code>&lt;CustomButton&gt;Texto&lt;/CustomButton&gt;</code>.</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Composable useOnlineStatus()" collapsible :columns="1">
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

    <ZnSection title="3. Utilidad formatDate()" collapsible :columns="2">
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
  </ZnScreen>
</template>

<script setup>
import { ref } from 'vue'
import {
  ZnScreen,
  ZnSection,
  ZnBox,
  CustomButton,
  useOnlineStatus,
  formatDate
} from '@zn-apps/ui-core'

const legacyClicks = ref(0)
const { isOnline } = useOnlineStatus()

const formattedIsoDate = formatDate('2024-01-15')
const formattedLocalDate = formatDate(new Date(2026, 9, 28))
</script>
