<template>
  <DemoView view="calendar-day">
    <ZnSection title="1. Vista de día" collapsible>
      <p class="section-desc">
        <code>type-view="day"</code> muestra la agenda del día. El campo de fecha
        integrado y las flechas cambian el día visible; el encabezado del día es el
        control que lo selecciona.
      </p>

      <div class="calendar-controls">
        <ZnSwitch v-model="showEventDetails" label-right="Detalle de eventos" />
        <ZnSwitch v-model="showEvents" label-right="Mostrar eventos" />
        <ZnSwitch v-model="showToday" label-right="Marcar la fecha de hoy" />
        <ZnSelect
          v-model="eventVariant"
          class="calendar-controls__select"
          size="small"
          label="Estilo de evento"
          :options="variantOptions"
        />
      </div>

      <ZnCalendar
        v-model="selected"
        type-view="day"
        :events="events"
        :show-event-details="showEventDetails"
        :show-events="showEvents"
        :show-today="showToday"
        :event-variant="eventVariant"
        :labels="calendarDemoLabels"
        locale="es"
        @event-click="lastEvent = $event"
      />

      <p class="calendar-value">
        Día seleccionado: <code>{{ selected || 'sin selección' }}</code>
      </p>
      <p v-if="lastEvent" class="calendar-value">
        Último evento: <code>{{ lastEvent.title }}</code>
      </p>
    </ZnSection>

    <ZnSection title="2. Un día sin eventos" collapsible>
      <p class="section-desc">
        Cuando el día no tiene eventos se muestra el texto vacío; si
        <code>show-events</code> está desactivado la vista queda solo como selector
        de días.
      </p>

      <ZnCalendar
        v-model="emptyDay"
        type-view="day"
        :events="events"
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
import { ZnSection, ZnSelect, ZnSwitch } from '@zn-apps/ui-core'
import { calendarDemoEvents, calendarDemoLabels } from '../../data/calendar-demo.js'

const events = calendarDemoEvents
const selected = ref('2026-11-18')
const emptyDay = ref('2026-11-20')
const lastEvent = ref(null)
const showEventDetails = ref(true)
const showEvents = ref(true)
const showToday = ref(true)
const eventVariant = ref('accent')

const variantOptions = [
  { value: 'accent', label: 'Muesca de color' },
  { value: 'filled', label: 'Fondo de color' }
]
</script>

<style scoped>
.calendar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.calendar-controls__select {
  min-width: 190px;
}

.calendar-value {
  margin: 12px 0 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}
</style>
