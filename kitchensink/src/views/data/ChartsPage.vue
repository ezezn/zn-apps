<template>
  <DemoView view="data-charts">
    <ZnSection title="1. Barras verticales" collapsible>
      <p class="section-desc">
        Un único valor por categoría. <code>ZnChart</code> recibe los datos y un
        <code>config</code> que indica qué propiedad es la categoría
        (<code>category</code>) y cuál el valor (<code>value</code>). Haz clic en una
        barra (o pulsa Intro con el foco en ella) para fijar su detalle.
      </p>

      <ZnChart :data="monthlySales" :config="barConfig" @point-click="selection = $event" />

      <p class="chart-value">
        Última selección:
        <code>{{ selection ? `${selection.category} · ${selection.value}` : 'ninguna' }}</code>
      </p>
    </ZnSection>

    <ZnSection title="2. Barras agrupadas y apiladas" collapsible>
      <p class="section-desc">
        Con <code>series: ['online', 'store']</code> cada columna del dato se dibuja
        como una serie. <code>bar-grouped</code> las coloca una al lado de otra y
        <code>bar-stacked</code> las acumula; los valores totales también alimentan
        el eje Y y el detalle al hacer clic.
      </p>

      <div class="chart-controls">
        <ZnSelect
          v-model="barsType"
          class="chart-controls__select"
          label="Tipo de barras"
          size="small"
          :options="barsTypeOptions"
        />
        <ZnSwitch v-model="showBarLegend" label-right="Mostrar leyenda" />
      </div>

      <ZnChart :data="channelSales" :config="barsConfig" />
    </ZnSection>

    <ZnSection title="3. Líneas" collapsible>
      <p class="section-desc">
        <code>line</code> y <code>line-multi</code> comparten la misma configuración:
        si hay varias series se dibuja una línea por serie. Activa la curva suave o
        los puntos, y observa en el segundo gráfico cómo <code>series: 'channel'</code>
        extrae las series del formato largo sin transformar los datos.
      </p>

      <div class="chart-controls">
        <ZnSwitch v-model="smooth" label-right="Curva suave" />
        <ZnSwitch v-model="showPoints" label-right="Mostrar puntos" />
      </div>

      <h3 class="chart-subtitle">Series en columnas</h3>
      <ZnChart :data="channelSales" :config="lineConfig" />

      <h3 class="chart-subtitle">Series extraídas de una columna</h3>
      <ZnChart :data="trafficRows" :config="longSeriesConfig" />
    </ZnSection>

    <ZnSection title="4. Áreas" collapsible>
      <p class="section-desc">
        <code>area</code> rellena bajo cada línea y <code>area-stacked</code> apila las
        series. El área usa el mismo color de la serie con opacidad reducida y conserva
        los puntos interactivos del gráfico de líneas.
      </p>

      <div class="chart-controls">
        <ZnSelect
          v-model="areaType"
          class="chart-controls__select"
          label="Tipo de área"
          size="small"
          :options="areaTypeOptions"
        />
      </div>

      <ZnChart :data="channelSales" :config="areaConfig" />
    </ZnSection>

    <ZnSection title="5. Pie y donut" collapsible>
      <p class="section-desc">
        Los gráficos circulares usan una sola serie de valores y colorean por categoría.
        El donut puede mostrar el total en el centro con
        <code>donut.totalLabel</code>, y <code>colors</code> reemplaza la paleta MD3
        por cualquier color CSS.
      </p>

      <div class="chart-controls">
        <ZnSelect
          v-model="circularType"
          class="chart-controls__select"
          label="Tipo circular"
          size="small"
          :options="circularTypeOptions"
        />
      </div>

      <div class="chart-circular">
        <ZnChart :data="visitsByChannel" :config="circularConfig" @point-click="selection = $event" />
      </div>
    </ZnSection>

    <ZnSection title="6. Miniaturas (ZnChartShape)" collapsible>
      <p class="section-desc">
        <code>ZnChartShape</code> recibe los mismos <code>data</code> y
        <code>config</code> pero dibuja una versión reducida: sin ejes, etiquetas,
        leyenda ni interacción. Sirve como icono o vista previa dentro de una tarjeta
        de resumen; <code>width</code> y <code>height</code> fijan el tamaño en píxeles.
      </p>

      <div class="chart-shapes">
        <div v-for="shape in shapeExamples" :key="shape.key" class="chart-shape-card">
          <ZnChartShape
            :data="shape.data"
            :config="shape.config"
            :width="96"
            :height="48"
            :aria-label="shape.label"
          />
          <span class="chart-shape-card__label">{{ shape.label }}</span>
        </div>
      </div>

      <h3 class="chart-subtitle">Tamaño icono</h3>
      <div class="chart-shape-icons">
        <ZnChartShape
          v-for="shape in shapeExamples"
          :key="`icon-${shape.key}`"
          :data="shape.data"
          :config="shape.config"
          :width="32"
          :height="32"
          :aria-label="shape.label"
        />
      </div>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnSelect, ZnSwitch } from '@zn-apps/ui-core'
import { ZnChart, ZnChartShape } from '@zn-apps/ui-data-charts'
import {
  channelSales,
  chartExamples,
  monthlySales,
  shapeExamples,
  trafficRows,
  visitsByChannel,
} from '../../data/charts-demo.js'

const selection = ref(null)
const showBarLegend = ref(true)
const smooth = ref(true)
const showPoints = ref(true)
const barsType = ref('bar-grouped')
const areaType = ref('area')
const circularType = ref('donut')

const barsTypeOptions = [
  { value: 'bar-grouped', label: 'Agrupadas' },
  { value: 'bar-stacked', label: 'Apiladas' },
]

const areaTypeOptions = [
  { value: 'area', label: 'Área simple' },
  { value: 'area-stacked', label: 'Área apilada' },
]

const circularTypeOptions = [
  { value: 'pie', label: 'Pie' },
  { value: 'donut', label: 'Donut' },
]

// La galería parte de los payloads publicados en la vista de datos y sólo
// cambia lo que controlan los interruptores.
const exampleConfig = (key) => chartExamples.find((entry) => entry.key === key).config

const barConfig = exampleConfig('bar')

const barsConfig = computed(() => ({
  ...exampleConfig('bars'),
  type: barsType.value,
  legend: showBarLegend.value,
}))

const lineConfig = computed(() => ({
  ...exampleConfig('line'),
  curve: smooth.value ? 'smooth' : 'linear',
  points: showPoints.value,
}))

const longSeriesConfig = computed(() => ({
  ...exampleConfig('line-long'),
  curve: smooth.value ? 'smooth' : 'linear',
  points: showPoints.value,
}))

const areaConfig = computed(() => ({
  ...exampleConfig('area'),
  type: areaType.value,
  curve: smooth.value ? 'smooth' : 'linear',
  points: showPoints.value,
}))

const circularConfig = computed(() => ({
  ...exampleConfig('circular'),
  type: circularType.value,
}))
</script>

<style scoped>
.chart-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.chart-controls__select {
  min-width: 190px;
}

.chart-subtitle {
  margin: 16px 0 8px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 500;
}

.chart-value {
  margin: 12px 0 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.chart-circular {
  max-width: 460px;
}

.chart-shapes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.chart-shape-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background: var(--md-surface-container-low);
}

.chart-shape-card__label {
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.chart-shape-icons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
</style>
