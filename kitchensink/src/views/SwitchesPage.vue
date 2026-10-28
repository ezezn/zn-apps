<template>
  <ZnScreen title="Componente: ZnSwitch">
    <!-- SECCIÓN 1: INTERRUPTORES ESTÁNDAR (SIN TEXTO DENTRO) -->
    <ZnSection title="1. Interruptores Estándar (Sin texto dentro)" collapsible>
      <p class="section-desc">
        Configuración clásica de Material Design 3. El actuador (thumb) mide 16px en reposo y se expande a 24px al activarse. Puede usarse de forma independiente (sin texto) o acompañado de etiquetas exteriores.
      </p>

      <div class="switches-grid">
        <!-- Sin texto alguno (Standalone) -->
        <div class="switch-card">
          <span class="showcase-label">Puro / Standalone (Sin texto)</span>
          <div class="switch-row">
            <ZnSwitch v-model="switchPuro" />
            <span class="state-chip">{{ switchPuro ? 'ON' : 'OFF' }}</span>
          </div>
          <span class="helper-text">Ideal para celdas de tablas o listas compactas.</span>
        </div>

        <!-- Con etiqueta a la derecha -->
        <div class="switch-card">
          <span class="showcase-label">Con Etiqueta a la Derecha</span>
          <ZnSwitch 
            v-model="switchLabelRight" 
            labelRight="Notificaciones push" 
          />
          <span class="helper-text">Patrón estándar para formularios y configuraciones.</span>
        </div>

        <!-- Con etiquetas a ambos lados -->
        <div class="switch-card">
          <span class="showcase-label">Con Etiquetas Bilaterales</span>
          <ZnSwitch 
            v-model="switchBilateral" 
            labelLeft="Silencio" 
            labelRight="Sonido" 
          />
          <span class="helper-text">Útil para selectores de modo o polaridad.</span>
        </div>
      </div>
    </ZnSection>

    <!-- SECCIÓN 2: INTERRUPTORES CON TEXTO DENTRO -->
    <ZnSection title="2. Interruptores con Texto Dentro (Props: textOn / textOff)" collapsible>
      <p class="section-desc">
        Permite incrustar texto conciso directamente dentro del actuador (thumb) mediante las props <code>textOn</code> y <code>textOff</code>, o sus respectivos slots. El actuador mantiene el tamaño expandido (24px) para garantizar legibilidad.
      </p>

      <div class="switches-grid">
        <!-- Texto Binario ON / OFF -->
        <div class="switch-card">
          <span class="showcase-label">Binario Internacional (ON / OFF)</span>
          <ZnSwitch 
            v-model="switchTextoOnOff" 
            textOn="ON" 
            textOff="OFF" 
            labelRight="Estado del Servicio"
          />
          <span class="helper-text">Props: <code>textOn="ON" textOff="OFF"</code></span>
        </div>

        <!-- Texto en Español SÍ / NO -->
        <div class="switch-card">
          <span class="showcase-label">Español (SÍ / NO)</span>
          <ZnSwitch 
            v-model="switchTextoSiNo" 
            textOn="SÍ" 
            textOff="NO" 
            labelRight="Confirmar Cambios"
          />
          <span class="helper-text">Props: <code>textOn="SÍ" textOff="NO"</code></span>
        </div>

        <!-- Símbolos Lógicos I / O -->
        <div class="switch-card">
          <span class="showcase-label">Simbólico IEC (I / O)</span>
          <ZnSwitch 
            v-model="switchTextoIO" 
            textOn="I" 
            textOff="O" 
            labelRight="Alimentación Eléctrica"
          />
          <span class="helper-text">Norma internacional de encendido/apagado.</span>
        </div>
      </div>
    </ZnSection>

    <!-- SECCIÓN 3: INTERRUPTORES CON ICONOS (SLOTS: #iconOn / #iconOff) -->
    <ZnSection title="3. Interruptores con Iconos (Slots: #iconOn / #iconOff)" collapsible>
      <p class="section-desc">
        De acuerdo a las guías de Material Design 3, el actuador puede contener iconos vectoriales SVG para reforzar visualmente el estado del control.
      </p>

      <div class="switches-grid">
        <!-- Iconos Normativos M3 (Checkmark y Cruz) -->
        <div class="switch-card">
          <span class="showcase-label">Normativo MD3 (Check / Cruz)</span>
          <ZnSwitch 
            v-model="switchIconCheck" 
            labelRight="Permisos de Cámara"
          >
            <template #iconOn>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </template>
            <template #iconOff>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </template>
          </ZnSwitch>
          <span class="helper-text">Indicador binario inequívoco según MD3.</span>
        </div>

        <!-- Iconos Temáticos (Sol y Luna) -->
        <div class="switch-card">
          <span class="showcase-label">Temático (Sol / Luna)</span>
          <ZnSwitch 
            v-model="switchIconTheme" 
            labelLeft="Claro"
            labelRight="Oscuro"
          >
            <template #iconOff>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280Z"/></svg>
            </template>
            <template #iconOn>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T440-660q0 90 63 153t153 63q52 0 99-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
            </template>
          </ZnSwitch>
          <span class="helper-text">Selector de tema con retroalimentación visual.</span>
        </div>
      </div>
    </ZnSection>

    <!-- SECCIÓN 4: ESTADOS DESHABILITADOS -->
    <ZnSection title="4. Estados Deshabilitados (Prop: disabled)" collapsible>
      <p class="section-desc">
        Aplica un nivel de opacidad reducido al 38% y desactiva las interacciones del puntero de forma nativa y accesible.
      </p>

      <div class="switches-grid">
        <div class="switch-card">
          <span class="showcase-label">Deshabilitado (Apagado)</span>
          <ZnSwitch :modelValue="false" disabled labelRight="Función no disponible" />
        </div>

        <div class="switch-card">
          <span class="showcase-label">Deshabilitado (Encendido)</span>
          <ZnSwitch :modelValue="true" disabled labelRight="Bloqueado por Administrador" />
        </div>

        <div class="switch-card">
          <span class="showcase-label">Deshabilitado con Texto Interno</span>
          <ZnSwitch :modelValue="true" disabled textOn="ON" textOff="OFF" labelRight="Modo Forzado" />
        </div>
      </div>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ref } from 'vue'
import { ZnScreen, ZnSection, ZnSwitch } from '@zn-apps/shared'

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

<style scoped>
.section-desc {
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: var(--md-on-background);
  opacity: 0.75;
  margin-bottom: 20px;
  line-height: 1.5;
}

.switches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.switch-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background-color: var(--md-surface);
  border: 1px solid var(--md-surface-variant);
  border-radius: 16px;
  box-sizing: border-box;
}

.showcase-label {
  font-family: 'Roboto', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-outline);
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.state-chip {
  font-family: 'Roboto', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}

.helper-text {
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: var(--md-outline);
  line-height: 1.4;
}

code {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85em;
}
</style>
