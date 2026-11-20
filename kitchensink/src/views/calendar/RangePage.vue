<template>
  <DemoView view="calendar-range">
    <ZnSection title="1. Rango de fechas" collapsible>
      <p class="section-desc">
        Con <code>selection-mode="range"</code> el valor es
        <code>{ start, end }</code>: el primer clic fija el inicio, el segundo el fin
        y un tercer clic empieza un rango nuevo. Los días seleccionados se marcan con
        el color principal y se unen con una línea gruesa, sin sombrear las celdas. El
        rango se conserva ordenado aunque se elija al revés.
      </p>

      <div class="calendar-controls">
        <ZnSwitch v-model="showFields" label-right="Mostrar campos de inicio y fin" />
        <ZnSwitch v-model="showToday" label-right="Marcar la fecha de hoy" />
      </div>

      <ZnCalendar
        v-model="range"
        type-view="month"
        selection-mode="range"
        :events="events"
        :show-fields="showFields"
        :show-today="showToday"
        :labels="calendarDemoLabels"
        locale="es"
      />

      <p class="calendar-value">
        Inicio: <code>{{ range.start || '—' }}</code> ·
        Fin: <code>{{ range.end || '—' }}</code>
      </p>
    </ZnSection>

    <ZnSection title="2. Rangos predefinidos" collapsible>
      <p class="section-desc">
        Al ser un <code>v-model</code> normal, el rango se puede fijar desde fuera del
        calendario (por ejemplo, con accesos rápidos) y el calendario navega a la
        fecha seleccionada.
      </p>

      <div class="calendar-controls">
        <ZnButton
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          variant="tonal"
          @click="range = { ...preset.value }"
        >{{ preset.label }}</ZnButton>
        <ZnButton type="button" variant="text" @click="range = { start: null, end: null }">
          Limpiar
        </ZnButton>
      </div>

      <ZnCalendar
        v-model="range"
        type-view="month"
        selection-mode="range"
        :events="events"
        :show-fields="showFields"
        :labels="calendarDemoLabels"
        locale="es"
      />
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import { ZnButton, ZnSection, ZnSwitch } from '@zn-apps/ui-core'
import { calendarDemoEvents, calendarDemoLabels } from '../../data/calendar-demo.js'

const events = calendarDemoEvents
const range = ref({ start: '2026-11-10', end: '2026-11-14' })
const showFields = ref(true)
const showToday = ref(true)

const presets = [
  { label: 'Conferencia (12–14)', value: { start: '2026-11-12', end: '2026-11-14' } },
  { label: 'Semana del 9', value: { start: '2026-11-09', end: '2026-11-15' } },
  { label: 'Un solo día', value: { start: '2026-11-18', end: '2026-11-18' } }
]
</script>

<style scoped>
.calendar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.calendar-value {
  margin: 12px 0 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}
</style>
