<template>
  <DemoView view="input-select">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Menú desplegable con posición fija (no lo recorta el scroll del contenedor). Se
        limita a <code>maxVisibleItems</code> elementos (6 por defecto) antes de mostrar la
        barra de desplazamiento.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnSelect v-model="outlined" label="País" :options="paises" />
        <span class="helper-text">Seleccionado: {{ outlined || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnSelect v-model="filled" label="País" variant="filled" :options="paises" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Menú con scroll y opciones" collapsible :columns="2">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">maxVisibleItems = 4</span>
        <ZnSelect
          v-model="limitado"
          label="Ciudad"
          :options="ciudades"
          :max-visible-items="4"
          hint="La lista tiene 9 elementos"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Opciones deshabilitadas</span>
        <ZnSelect v-model="conDeshabilitadas" label="Plan" :options="planes" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Selección múltiple" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Con <code>multiple</code>, el <code>v-model</code> es un array y la selección se
        muestra como chips removibles.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined múltiple</span>
        <ZnSelect v-model="etiquetas" label="Etiquetas" :options="etiquetasDisponibles" multiple />
        <span class="helper-text">{{ etiquetas.length }} seleccionadas</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled múltiple</span>
        <ZnSelect
          v-model="etiquetasFilled"
          label="Etiquetas"
          variant="filled"
          :options="etiquetasDisponibles"
          multiple
        />
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error</span>
        <ZnSelect v-model="conError" label="Requerido" :options="paises" error="Selecciona un país" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado</span>
        <ZnSelect model-value="es" label="Bloqueado" :options="paises" disabled />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta</span>
        <ZnSelect
          v-model="sinEtiqueta"
          aria-label="Filtrar por país"
          placeholder="Filtrar…"
          :options="paises"
        />
      </ZnBox>
    </ZnSection>
    <ZnSection title="5. Tamaños MD3" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> ajusta el campo y sus chips (<code>small</code> 48/24px,
        <code>medium</code> 56/32px, <code>large</code> 64/40px). Los chips de la
        selección múltiple usan <code>ZnChip</code>, por lo que heredan el tamaño.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · campo 48px / chip 24px</span>
        <ZnSelect
          v-model="etiquetasSmall"
          label="Etiquetas"
          :options="etiquetasDisponibles"
          multiple
          variant="filled"
          size="small"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · campo 56px / chip 32px</span>
        <ZnSelect
          v-model="etiquetasMedium"
          label="Etiquetas"
          :options="etiquetasDisponibles"
          multiple
          variant="filled"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · campo 64px / chip 40px</span>
        <ZnSelect
          v-model="etiquetasLarge"
          label="Etiquetas"
          :options="etiquetasDisponibles"
          multiple
          variant="filled"
          size="large"
        />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnSelect } from '@zn-apps/ui-core'

const paises = [
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'es', label: 'España' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú' },
  { value: 'uy', label: 'Uruguay' }
]

const ciudades = ['Bogotá', 'Buenos Aires', 'Lima', 'Madrid', 'Ciudad de México', 'Montevideo', 'Santiago', 'Quito', 'Caracas']

const planes = [
  { value: 'free', label: 'Gratis' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Equipo (no disponible)', disabled: true }
]

const etiquetasDisponibles = ['Trabajo', 'Personal', 'Urgente', 'Archivado', 'Compartido']

const outlined = ref(null)
const filled = ref(null)
const limitado = ref(null)
const conDeshabilitadas = ref('free')
const etiquetas = ref(['Trabajo'])
const etiquetasFilled = ref([])
const conError = ref(null)
const sinEtiqueta = ref(null)
const etiquetasSmall = ref(['Trabajo', 'Urgente'])
const etiquetasMedium = ref(['Trabajo', 'Urgente'])
const etiquetasLarge = ref(['Trabajo', 'Urgente'])
</script>
