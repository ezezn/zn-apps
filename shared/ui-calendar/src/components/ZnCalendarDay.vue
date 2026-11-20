<template>
  <div class="zn-calendar-day">
    <button
      type="button"
      :class="['zn-calendar-day__header', headerClasses]"
      :aria-label="dayLabel"
      :aria-selected="isSelected ? 'true' : 'false'"
      :aria-current="isToday ? 'date' : undefined"
      @click="$emit('select', day)"
    >
      <span class="zn-calendar-day__weekday">{{ weekdayLabel }}</span>
      <span class="zn-calendar-day__number">{{ day.getDate() }}</span>
      <span class="zn-calendar-day__month">{{ monthLabel }}</span>
    </button>

    <ZnCalendarAgenda
      :day="day"
      :events="events"
      :show-events="showEvents"
      :show-event-details="showEventDetails"
      :variant="eventVariant"
      :locale="locale"
      :labels="labels"
      @event-click="$emit('event-click', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatDayLong,
  isSameDay,
  isWithinRange
} from '../utils/calendar.js'
import ZnCalendarAgenda from './ZnCalendarAgenda.vue'

const props = defineProps({
  day: { type: Date, default: null },
  selectedStart: { type: Date, default: null },
  selectedEnd: { type: Date, default: null },
  today: { type: Date, default: null },
  showToday: { type: Boolean, default: true },
  events: { type: Array, default: () => [] },
  showEvents: { type: Boolean, default: true },
  showEventDetails: { type: Boolean, default: true },
  eventVariant: { type: String, default: 'accent' },
  locale: { type: String, default: 'en' },
  labels: { type: Object, default: () => ({}) }
})

defineEmits(['select', 'event-click'])

const isToday = computed(() => props.showToday && isSameDay(props.day, props.today))

const isSelected = computed(
  () =>
    isSameDay(props.day, props.selectedStart) ||
    (props.selectedEnd && isSameDay(props.day, props.selectedEnd))
)

const isInRange = computed(() => {
  if (!props.selectedEnd || isSameDay(props.selectedStart, props.selectedEnd)) return false
  return isWithinRange(props.day, props.selectedStart, props.selectedEnd)
})

const headerClasses = computed(() => ({
  'zn-calendar-day__header--today': isToday.value,
  'zn-calendar-day__header--selected': isSelected.value,
  'zn-calendar-day__header--in-range': isInRange.value
}))

const weekdayLabel = computed(() =>
  new Intl.DateTimeFormat(props.locale, { weekday: 'long' }).format(props.day)
)

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(props.day)
)

const dayLabel = computed(() => {
  const label = props.labels.selectDay || 'Select {date}'
  return label.replace('{date}', formatDayLong(props.day, props.locale))
})
</script>

<style scoped>
.zn-calendar-day {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.zn-calendar-day__header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 16px 20px;
  border: 1px solid var(--md-outline);
  border-radius: 12px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.zn-calendar-day__header:hover {
  background: var(--md-surface-container-highest);
}

.zn-calendar-day__header:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.zn-calendar-day__header--in-range {
  background: var(--md-primary-container);
}

.zn-calendar-day__header--today {
  border-color: var(--md-primary);
}

.zn-calendar-day__header--selected {
  background: var(--md-primary);
  border-color: var(--md-primary);
  color: var(--md-on-primary);
}

.zn-calendar-day__weekday {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.zn-calendar-day__number {
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1;
}

.zn-calendar-day__month {
  margin-left: auto;
  font-size: 0.8125rem;
  text-transform: capitalize;
}
</style>
