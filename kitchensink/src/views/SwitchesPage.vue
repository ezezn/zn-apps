<template>
  <ZnScreen title="Componente: ZnSwitch">
    <ZnSection title="1. Interruptor Básico e Iconográfico">
      <p class="section-desc">El componente <code>ZnSwitch</code> procesa un modelo reactivo bidireccional (<code>v-model</code>) y soporta etiquetas personalizadas a la izquierda y derecha junto con iconos de estado.</p>
      
      <div class="switches-container">
        <div class="switch-card">
          <span class="state-indicator">Estado Actual: <strong>{{ switchState ? 'ACTIVO' : 'INACTIVO' }}</strong></span>
          
          <ZnSwitch 
            v-model="switchState" 
            labelLeft="Modo Claro"
            labelRight="Modo Oscuro"
          >
            <template #iconOff>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280Z"/></svg>
            </template>
            <template #iconOn>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T440-660q0 90 63 153t153 63q52 0 99-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
            </template>
          </ZnSwitch>
        </div>
      </div>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ref } from 'vue'
import { ZnScreen, ZnSection, ZnSwitch } from '@zn-apps/shared'

const switchState = ref(false)
</script>

<style scoped>
.section-desc {
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: var(--md-on-background);
  opacity: 0.7;
  margin-bottom: 20px;
}

.switches-container {
  padding: 24px;
  background-color: var(--md-surface);
  border: 1px solid var(--md-surface-variant);
  border-radius: 16px;
  max-width: 450px;
}

.switch-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.state-indicator {
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  color: var(--md-on-surface);
}
</style>