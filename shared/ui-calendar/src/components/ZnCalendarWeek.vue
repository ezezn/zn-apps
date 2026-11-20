<template>
  <div class="zn-calendar-week">
    <div
      class="zn-calendar-week__strip"
      role="tablist"
      :aria-label="labels.week"
    >
      <button
        v-for="(day, index) in days"
        :key="toISODate(day)"
        type="button"
        role="tab"
        :class="['zn-calendar-week__tab', tabClasses(day)]"
        :aria-selected="isActive(day) ? 'true' : 'false'"
        :aria-label="dayLabel(day)"
        :aria-current="isToday(day) ? 'date' : undefined"
        @click="$emit('select', day)"
      >
        <span class="zn-calendar-week__weekday">{{ weekdayLabels[index] }}</span>
        <span class="zn-calendar-week__number">{{ day.getDate() }}</span>
        <span
          class="zn-calendar-week__dot"
          :class="{ 'zn-calendar-week__dot--empty': !dayEvents(day).length }"
          :style="dotStyle(day)"
        />
      </button>
    </div>

    <!-- The day panel only exists to host events; selection-only calendars
         (no events) end at the day strip instead of leaving a blank block. -->
    <section v-if="showEvents" class="zn-calendar-week__day" role="tabpanel">
      <header class="zn-calendar-week__day-header">
        <span class="zn-calendar-week__day-title">{{ activeDayLabel }}</span>
        <span
          v-if="showEvents && dayEvents(activeDay).length"
          class="zn-calendar-week__count"
        >{{ dayEvents(activeDay).length }}</span>
      </header>

      <ZnCalendarAgenda
        :day="activeDay"
        :events="events"
        :show-events="showEvents"
        :show-event-details="showEventDetails"
        :variant="eventVariant"
        :locale="locale"
        :labels="labels"
        @event-click="$emit('event-click', $event)"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  eventsForDay,
  formatDayLong,
  isSameDay,
  isWithinRange,
  toISODate
} from '../utils/calendar.js'
import ZnCalendarAgenda from './ZnCalendarAgenda.vue'

const props = defineProps({
  days: { type: Array, default: () => [] },
  weekdayLabels: { type: Array, default: () => [] },
  activeDay: { type: Date, default: null },
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

const activeDay = computed(() => props.activeDay || props.days[0] || null)

const activeDayLabel = computed(() =>
  activeDay.value ? formatDayLong(activeDay.value, props.locale) : ''
)

function isToday(day) {
  return props.showToday && isSameDay(day, props.today)
}

function isActive(day) {
  return isSameDay(day, activeDay.value)
}

function isSelected(day) {
  return (
    isSameDay(day, props.selectedStart) ||
    (props.selectedEnd && isSameDay(day, props.selectedEnd))
  )
}

function isInRange(day) {
  if (!props.selectedEnd || isSameDay(props.selectedStart, props.selectedEnd)) return false
  return isWithinRange(day, props.selectedStart, props.selectedEnd)
}

function tabClasses(day) {
  return {
    'zn-calendar-week__tab--active': isActive(day),
    'zn-calendar-week__tab--selected': isSelected(day),
    'zn-calendar-week__tab--range': isInRange(day),
    'zn-calendar-week__tab--today': isToday(day)
  }
}

function dayLabel(day) {
  const label = props.labels.selectDay || 'Select {date}'
  return label.replace('{date}', formatDayLong(day, props.locale))
}

function dayEvents(day) {
  return eventsForDay(props.events, day)
}

function dotStyle(day) {
  const first = dayEvents(day)[0]
  return first?.color ? { background: first.color } : {}
}
</script>

<style scoped>
.zn-calendar-week {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Compact day tabs: the week view selects a day instead of drawing 7 columns. */
.zn-calendar-week__strip {
  display: flex;
  gap: 2px;
  padding: 2px;
  overflow-x: auto;
  border-radius: 12px;
  background: var(--md-surface-container-low);
  scrollbar-width: none;
}

.zn-calendar-week__strip::-webkit-scrollbar {
  display: none;
}

.zn-calendar-week__tab {
  display: flex;
  flex: 1 0 44px;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  min-width: 44px;
  padding: 6px 4px 5px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--md-on-surface-variant);
  font: inherit;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.zn-calendar-week__tab:hover {
  background: var(--md-surface-container-highest);
}

.zn-calendar-week__tab:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -2px;
}

.zn-calendar-week__weekday {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  overflow: hidden;
  max-width: 100%;
}

.zn-calendar-week__number {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 50%;
  font-size: 0.8125rem;
}

.zn-calendar-week__tab--today:not(.zn-calendar-week__tab--selected) .zn-calendar-week__number {
  border-color: var(--md-primary);
  color: var(--md-primary);
}

.zn-calendar-week__tab--selected .zn-calendar-week__number {
  background: var(--md-primary);
  border-color: var(--md-primary);
  color: var(--md-on-primary);
  font-weight: 500;
}

/* Range days use the primary marker, never a shaded tab. */
.zn-calendar-week__tab--range .zn-calendar-week__number {
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.zn-calendar-week__tab--active {
  color: var(--md-on-secondary-container);
  background: var(--md-secondary-container);
}

.zn-calendar-week__tab--active:not(.zn-calendar-week__tab--selected) .zn-calendar-week__number {
  font-weight: 500;
}

.zn-calendar-week__dot {
  width: 4px;
  height: 4px;
  margin-top: 2px;
  border-radius: 50%;
  background: var(--md-primary);
}

.zn-calendar-week__dot--empty {
  background: transparent;
}

.zn-calendar-week__day {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 180px;
}

.zn-calendar-week__day-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.zn-calendar-week__day-title {
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: capitalize;
}

.zn-calendar-week__count {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: 0.6875rem;
}

@media (max-width: 480px) {
  .zn-calendar-week__weekday {
    font-size: 0.625rem;
  }

  .zn-calendar-week__number {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }
}
</style>
