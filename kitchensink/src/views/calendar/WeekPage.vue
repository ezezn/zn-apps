<template>
  <DemoView view="calendar-week">
    <ZnSection title="1. Vista de semana" collapsible>
      <p class="section-desc">
        <code>type-view="week"</code> muestra una tira horizontal de días, como
        pestañas: al elegir uno se muestra su agenda debajo. Las flechas avanzan o
        retroceden una semana y los selectores de mes y año saltan a la semana que
        contiene el día 1 de ese mes. La selección sigue siendo de días.
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
        type-view="week"
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

    <ZnSection title="2. Semana con campos de selección" collapsible>
      <p class="section-desc">
        Los campos opcionales (<code>show-fields</code>) permiten escribir el día
        seleccionado sin salir del calendario.
      </p>

      <ZnCalendar
        v-model="fieldDay"
        type-view="week"
        :events="events"
        show-fields
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
const selected = ref('2026-11-11')
const fieldDay = ref('2026-11-18')
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
