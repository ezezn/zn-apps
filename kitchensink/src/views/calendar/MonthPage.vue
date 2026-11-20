<template>
  <DemoView view="calendar-month">
    <ZnSection title="1. Selección de un día" collapsible>
      <p class="section-desc">
        Con <code>type-view="month"</code> y la selección por defecto
        (<code>single</code>), <code>v-model</code> guarda un único día en formato ISO
        (<code>YYYY-MM-DD</code>). <code>show-fields</code> agrega un campo de fecha
        integrado para escribir el día directamente.
      </p>

      <div class="calendar-controls">
        <ZnSwitch v-model="showToday" label-right="Marcar la fecha de hoy" />
        <ZnSwitch v-model="showFields" label-right="Mostrar campo de fecha" />
      </div>

      <ZnCalendar
        v-model="selected"
        type-view="month"
        :events="events"
        :show-today="showToday"
        :show-fields="showFields"
        :labels="calendarDemoLabels"
        locale="es"
        @event-click="lastEvent = $event"
      />

      <p class="calendar-value">
        Valor: <code>{{ selected || 'sin selección' }}</code>
      </p>
      <p v-if="lastEvent" class="calendar-value">
        Último evento: <code>{{ lastEvent.title }}</code>
      </p>
    </ZnSection>

    <ZnSection title="2. Eventos en el mes" collapsible>
      <p class="section-desc">
        Los eventos con hora se muestran con su título y los de varios días se dibujan
        como una barra continua por semana. <code>event-variant</code> alterna entre la
        muesca de color y el fondo de color con texto de contraste automático. Con
        <code>show-event-details="false"</code> se reducen a puntos y líneas, y con
        <code>show-events="false"</code> el calendario vuelve a ser solo un selector.
      </p>

      <div class="calendar-controls">
        <ZnSwitch v-model="showEventDetails" label-right="Detalle de eventos" />
        <ZnSwitch v-model="showEvents" label-right="Mostrar eventos" />
        <ZnSelect
          v-model="eventVariant"
          class="calendar-controls__select"
          size="small"
          label="Estilo de evento"
          :options="variantOptions"
        />
      </div>

      <ZnCalendar
        v-model="eventDay"
        type-view="month"
        :events="events"
        :show-event-details="showEventDetails"
        :show-events="showEvents"
        :event-variant="eventVariant"
        :labels="calendarDemoLabels"
        locale="es"
      />

      <p class="calendar-value">
        Día marcado: <code>{{ eventDay || 'sin selección' }}</code>
      </p>
    </ZnSection>

    <ZnSection title="3. Eventos de la demo" collapsible>
      <ul class="calendar-events">
        <li v-for="event in events" :key="event.id">
          <span class="calendar-events__dot" :style="{ background: event.color }" />
          <code>{{ event.start }}</code>
          <span v-if="event.end"> → <code>{{ event.end }}</code></span>
          · {{ event.title }}
        </li>
      </ul>
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
const eventDay = ref('2026-11-12')
const lastEvent = ref(null)
const showToday = ref(true)
const showFields = ref(true)
const showEventDetails = ref(true)
const showEvents = ref(true)
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

.calendar-events {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.calendar-events__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
}
</style>
