<template>
  <div v-if="showEvents" class="zn-calendar-agenda">
    <ul v-if="dayEvents.length" class="zn-calendar-agenda__list">
      <li v-for="event in dayEvents" :key="event.id" class="zn-calendar-agenda__row">
        <span class="zn-calendar-agenda__time">
          {{ event.allDay ? labels.allDay : formatTime(event.start, locale) }}
        </span>

        <button
          type="button"
          :class="['zn-calendar-agenda__event', `zn-calendar-agenda__event--${variant}`]"
          :style="eventStyle(event)"
          :title="event.title"
          :aria-label="eventTitle(event)"
          @click="$emit('event-click', event)"
        >
          <template v-if="showEventDetails">
            <span class="zn-calendar-agenda__title">{{ event.title }}</span>
            <span class="zn-calendar-agenda__range">{{ eventTime(event) }}</span>
          </template>
        </button>
      </li>
    </ul>

    <p v-else class="zn-calendar-agenda__empty">{{ labels.noEvents }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  calendarEventStyle,
  eventsForDay,
  formatTime,
  parseDate
} from '../utils/calendar.js'

const props = defineProps({
  day: { type: Date, default: null },
  events: { type: Array, default: () => [] },
  showEvents: { type: Boolean, default: true },
  showEventDetails: { type: Boolean, default: true },
  variant: { type: String, default: 'accent' },
  locale: { type: String, default: 'en' },
  labels: { type: Object, default: () => ({}) }
})

defineEmits(['event-click'])

const dayEvents = computed(() =>
  eventsForDay(props.events, props.day).slice().sort((a, b) => a.start - b.start)
)

function eventStyle(event) {
  return calendarEventStyle(event, props.variant)
}

function eventTime(event) {
  if (event.allDay) return props.labels.allDay || 'All day'
  const start = formatTime(event.start, props.locale)
  const end = parseDate(event.end)
  if (end && end.getTime() !== parseDate(event.start).getTime()) {
    return `${start} – ${formatTime(end, props.locale)}`
  }
  return start
}

function eventTitle(event) {
  return event.allDay ? event.title : `${eventTime(event)} · ${event.title}`
}
</script>

<style scoped>
.zn-calendar-agenda {
  display: flex;
  flex-direction: column;
}

.zn-calendar-agenda__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.zn-calendar-agenda__row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: stretch;
  gap: 8px;
}

.zn-calendar-agenda__time {
  padding-top: 9px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  text-align: right;
}

.zn-calendar-agenda__event {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 36px;
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.zn-calendar-agenda__event--accent {
  border-left: 4px solid var(--zn-calendar-event-color, var(--md-primary));
  background: color-mix(in srgb, var(--zn-calendar-event-color, var(--md-primary)) 14%, transparent);
  color: var(--md-on-surface);
}

.zn-calendar-agenda__event--accent:hover {
  background: color-mix(in srgb, var(--zn-calendar-event-color, var(--md-primary)) 24%, transparent);
}

.zn-calendar-agenda__event--filled {
  background: var(--zn-calendar-event-color, var(--md-primary));
  color: var(--zn-calendar-event-text, var(--md-on-primary));
}

.zn-calendar-agenda__event--filled:hover {
  background: color-mix(in srgb, var(--zn-calendar-event-color, var(--md-primary)) 88%, #000);
}

.zn-calendar-agenda__title {
  font-size: 0.875rem;
}

.zn-calendar-agenda__range {
  color: inherit;
  font-size: 0.6875rem;
  opacity: 0.8;
}

.zn-calendar-agenda__empty {
  margin: 0;
  padding: 16px;
  border: 1px dashed var(--md-outline);
  border-radius: 12px;
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  text-align: center;
}

@media (max-width: 480px) {
  .zn-calendar-agenda__row {
    grid-template-columns: 56px minmax(0, 1fr);
  }
}
</style>
