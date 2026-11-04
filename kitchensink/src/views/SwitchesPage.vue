<template>
  <DemoView view="switches">

    <!-- SECCIÓN 1: INTERRUPTORES ESTÁNDAR (SIN TEXTO DENTRO) -->
    <ZnSection title="1. Interruptores Estándar (Sin texto dentro)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        Configuración clásica de Material Design 3. El actuador (thumb) mide 16px en reposo y se expande a 24px al activarse. Puede usarse de forma independiente (sin texto) o acompañado de etiquetas exteriores.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Puro / Standalone (sin texto)</span>
        <div class="showcase-inline">
          <ZnSwitch v-model="switchPuro" />
          <span class="state-chip">{{ switchPuro ? 'ON' : 'OFF' }}</span>
        </div>
        <span class="helper-text">Ideal para celdas de tablas o listas compactas.</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con etiqueta a la derecha</span>
        <ZnSwitch v-model="switchLabelRight" labelRight="Notificaciones push" />
        <span class="helper-text">Patrón estándar para formularios y configuraciones.</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con etiquetas bilaterales</span>
        <ZnSwitch v-model="switchBilateral" labelLeft="Silencio" labelRight="Sonido" />
        <span class="helper-text">Útil para selectores de modo o polaridad.</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 2: INTERRUPTORES CON TEXTO DENTRO -->
    <ZnSection title="2. Interruptores con Texto Dentro (Props: textOn / textOff)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        Permite incrustar texto conciso directamente dentro del actuador mediante <code>textOn</code> y <code>textOff</code>. El actuador mantiene el tamaño expandido (24px) para garantizar la legibilidad.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Binario internacional (ON / OFF)</span>
        <ZnSwitch v-model="switchTextoOnOff" textOn="ON" textOff="OFF" labelRight="Estado del servicio" />
        <span class="helper-text">Props: <code>textOn="ON" textOff="OFF"</code></span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Español (SÍ / NO)</span>
        <ZnSwitch v-model="switchTextoSiNo" textOn="SÍ" textOff="NO" labelRight="Confirmar cambios" />
        <span class="helper-text">Props: <code>textOn="SÍ" textOff="NO"</code></span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Simbólico IEC (I / O)</span>
        <ZnSwitch v-model="switchTextoIO" textOn="I" textOff="O" labelRight="Alimentación eléctrica" />
        <span class="helper-text">Norma internacional de encendido/apagado.</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 3: INTERRUPTORES CON ICONOS (SLOTS: #iconOn / #iconOff) -->
    <ZnSection title="3. Interruptores con Iconos (Slots: #iconOn / #iconOff)" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        De acuerdo a las guías de Material Design 3, el actuador puede contener iconos para reforzar visualmente el estado del control: basta con pasar un <code>ZnIcon</code> a los slots.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Normativo MD3 (check / cruz)</span>
        <ZnSwitch v-model="switchIconCheck" labelRight="Permisos de cámara">
          <template #iconOn>
            <ZnIcon name="check" />
          </template>
          <template #iconOff>
            <ZnIcon name="close" />
          </template>
        </ZnSwitch>
        <span class="helper-text">Indicador binario inequívoco según MD3.</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Temático (sol / luna)</span>
        <ZnSwitch v-model="switchIconTheme" labelLeft="Claro" labelRight="Oscuro">
          <template #iconOff>
            <ZnIcon name="light_mode" />
          </template>
          <template #iconOn>
            <ZnIcon name="dark_mode" />
          </template>
        </ZnSwitch>
        <span class="helper-text">Selector de tema con retroalimentación visual.</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 4: ESTADOS DESHABILITADOS -->
    <ZnSection title="4. Estados Deshabilitados (Prop: disabled)" collapsible :expanded="false" :columns="3">
      <p class="section-desc section-desc--full">
        Aplica una opacidad del 38% y desactiva las interacciones del puntero de forma nativa y accesible.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado (apagado)</span>
        <ZnSwitch :model-value="false" disabled labelRight="Función no disponible" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado (encendido)</span>
        <ZnSwitch :model-value="true" disabled labelRight="Bloqueado por administrador" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado con texto interno</span>
        <ZnSwitch :model-value="true" disabled textOn="ON" textOff="OFF" labelRight="Modo forzado" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ref } from 'vue'
import { ZnSection, ZnBox, ZnSwitch, ZnIcon } from '@zn-apps/ui-core'

// Estados reactivos individuales para cada ejemplo
const switchPuro = ref(false)
const switchLabelRight = ref(true)
const switchBilateral = ref(false)

const switchTextoOnOff = ref(true)
const switchTextoSiNo = ref(false)
const switchTextoIO = ref(true)

const switchIconCheck = ref(true)
const switchIconTheme = ref(false)
</script>
