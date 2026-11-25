<template>
  <div :class="['zn-calendar', `zn-calendar--${typeView}`]">
    <header class="zn-calendar__header">
      <div class="zn-calendar__heading">
        <p class="zn-calendar__title">{{ headerTitle }}</p>
        <p v-if="selectionLabel" class="zn-calendar__selection">{{ selectionLabel }}</p>
      </div>

      <div class="zn-calendar__actions">
        <ZnButton
          v-if="showToday"
          type="button"
          variant="text"
          @click="goToday"
        >{{ labels.today }}</ZnButton>
        <template v-if="showNavigation">
          <ZnButton
            type="button"
            variant="text"
            icon-only
            :aria-label="labels.previous"
            @click="shift(-1)"
          >
            <ZnIcon name="chevron_left" :size="24" />
          </ZnButton>
          <ZnButton
            type="button"
            variant="text"
            icon-only
            :aria-label="labels.next"
            @click="shift(1)"
          >
            <ZnIcon name="chevron_right" :size="24" />
          </ZnButton>
        </template>
      </div>
    </header>

    <div v-if="showNavigation" class="zn-calendar__pickers">
      <template v-if="typeView === 'day'">
        <ZnDateInput
          class="zn-calendar__field"
          size="xsmall"
          :label="labels.date"
          :model-value="toISODate(cursor)"
          @update:model-value="onDateFieldChange"
        />
      </template>
      <template v-else>
        <ZnSelect
          class="zn-calendar__field"
          size="xsmall"
          :label="labels.month"
          :model-value="cursor.getMonth()"
          :options="monthOptionList"
          @update:model-value="onMonthChange"
        />
        <ZnSelect
          class="zn-calendar__field zn-calendar__field--year"
          size="xsmall"
          :label="labels.year"
          :model-value="cursor.getFullYear()"
          :options="yearOptionList"
          @update:model-value="onYearChange"
        />
      </template>
    </div>

    <div v-if="showFields" class="zn-calendar__fields">
      <ZnDateInput
        v-if="selectionMode === 'single'"
        class="zn-calendar__field"
        size="xsmall"
        :label="labels.date"
        :model-value="selectedStart ? toISODate(selectedStart) : ''"
        @update:model-value="onSingleFieldChange"
      />
      <template v-else>
        <ZnDateInput
          class="zn-calendar__field"
          size="xsmall"
          :label="labels.startDate"
          :model-value="selectedStart ? toISODate(selectedStart) : ''"
          @update:model-value="onStartFieldChange"
        />
        <ZnDateInput
          class="zn-calendar__field"
          size="xsmall"
          :label="labels.endDate"
          :model-value="selectedEnd ? toISODate(selectedEnd) : ''"
          @update:model-value="onEndFieldChange"
        />
      </template>
    </div>

    <div class="zn-calendar__body">
      <ZnCalendarMonth
        v-if="typeView === 'month'"
        :weeks="weeks"
        :month="cursor.getMonth()"
        :weekday-labels="weekdayLabelList"
        :selected-start="selectedStart"
        :selected-end="selectedEnd"
        :today="resolvedToday"
        :show-today="showToday"
        :events="normalizedEvents"
        :show-events="showEvents"
        :show-event-details="showEventDetails"
        :event-variant="eventVariant"
        :events-position="eventsPosition"
        :locale="resolvedLocale"
        :labels="labels"
        @select="handleSelect"
        @event-click="$emit('event-click', $event)"
      />

      <ZnCalendarWeek
        v-else-if="typeView === 'week'"
        :days="weekDaysList"
        :weekday-labels="weekWeekdayLabels"
        :active-day="activeWeekDay"
        :selected-start="selectedStart"
        :selected-end="selectedEnd"
        :today="resolvedToday"
        :show-today="showToday"
        :events="normalizedEvents"
        :show-events="showEvents"
        :show-event-details="showEventDetails"
        :event-variant="eventVariant"
        :locale="resolvedLocale"
        :labels="labels"
        @select="handleSelect"
        @event-click="$emit('event-click', $event)"
      />

      <ZnCalendarDay
        v-else
        :day="cursor"
        :selected-start="selectedStart"
        :selected-end="selectedEnd"
        :today="resolvedToday"
        :show-today="showToday"
        :events="normalizedEvents"
        :show-events="showEvents"
        :show-event-details="showEventDetails"
        :event-variant="eventVariant"
        :locale="resolvedLocale"
        :labels="labels"
        @select="handleSelect"
        @event-click="$emit('event-click', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  addDays,
  addMonths,
  buildMonthMatrix,
  buildWeek,
  formatDayLong,
  formatMonthYear,
  formatRangeLabel,
  monthOptions,
  normalizeEvents,
  orderRange,
  parseDate,
  readSelection,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toISODate,
  weekdayLabels,
  yearOptions
} from '../utils/calendar.js'
import { ZnButton, ZnDateInput, ZnIcon, ZnSelect } from '@zn-apps/ui-core'
import ZnCalendarMonth from './ZnCalendarMonth.vue'
import ZnCalendarWeek from './ZnCalendarWeek.vue'
import ZnCalendarDay from './ZnCalendarDay.vue'

const DEFAULT_LABELS = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  month: 'Month',
  year: 'Year',
  date: 'Date',
  startDate: 'Start date',
  endDate: 'End date',
  noEvents: 'No events',
  allDay: 'All day',
  selectDay: 'Select {date}'
}

const props = defineProps({
  /** Visible view: `month`, `week` or `day`. */
  typeView: {
    type: String,
    default: 'month',
    validator: (value) => ['month', 'week', 'day'].includes(value)
  },
  /** `single` → ISO date string; `range` → `{ start, end }`. */
  selectionMode: {
    type: String,
    default: 'single',
    validator: (value) => ['single', 'range'].includes(value)
  },
  modelValue: { type: [String, Array, Object], default: null },
  /** `{ id, title, start, end, color }`; `end` is optional. */
  events: { type: Array, default: () => [] },
  /** Shows the day marker for today (and the "Today" button). */
  showToday: { type: Boolean, default: true },
  /** Enables prev/next navigation and the month/year/day pickers. */
  showNavigation: { type: Boolean, default: true },
  /** Shows the optional selection fields above the grid. */
  showFields: { type: Boolean, default: false },
  /** Renders events on the grid; when false the calendar only selects days. */
  showEvents: { type: Boolean, default: true },
  /** Shows event titles; when false the month band draws thin color lines. */
  showEventDetails: { type: Boolean, default: true },
  /**
   * Month view: where the single event band sits relative to the day numbers.
   * Every event (single- or multi-day) shares that band, so events never
   * alternate between above and below the numbers.
   */
  eventsPosition: {
    type: String,
    default: 'below',
    validator: (value) => ['above', 'below'].includes(value)
  },
  /** `accent` = colored notch over a tinted surface; `filled` = event color background. */
  eventVariant: {
    type: String,
    default: 'accent',
    validator: (value) => ['accent', 'filled'].includes(value)
  },
  /** BCP 47 locale for month, weekday and time formatting. */
  locale: { type: String, default: '' },
  /** 0 = Sunday … 6 = Saturday. */
  weekStartsOn: { type: Number, default: 1 },
  /** Overrides the English default labels (aria labels and field captions). */
  labels: { type: Object, default: () => ({}) },
  /** Overrides "today" (useful for tests or server-rendered dates). */
  today: { type: [String, Date], default: null }
})

const emit = defineEmits(['update:modelValue', 'select', 'event-click', 'cursor-change'])

const labels = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))
const resolvedLocale = computed(
  () => props.locale || (typeof navigator !== 'undefined' && navigator.language) || 'en'
)

const resolvedToday = computed(() => parseDate(props.today) || startOfDay(new Date()))

const selection = computed(() => readSelection(props.modelValue, props.selectionMode))
const selectedStart = computed(() => selection.value.start)
const selectedEnd = computed(() => selection.value.end)

const cursor = ref(startOfDay(selection.value.start || resolvedToday.value))

// The visible period is owned here (navigation, pickers, external selection).
// Consumers that render something for the shown month can follow `cursor`
// instead of duplicating the navigation.
watch(cursor, (value) => emit('cursor-change', toISODate(value)))

watch(
  () => [selectedStart.value?.getTime(), props.typeView],
  () => {
    if (selectedStart.value) cursor.value = selectedStart.value
  }
)

const normalizedEvents = computed(() => normalizeEvents(props.events))

const weeks = computed(() => {
  const days = buildMonthMatrix(cursor.value, props.weekStartsOn)
  return Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7))
})

const weekDaysList = computed(() => buildWeek(cursor.value, props.weekStartsOn))

const activeWeekDay = computed(() => selectedStart.value || startOfDay(cursor.value))

const weekdayLabelList = computed(() =>
  weekdayLabels(resolvedLocale.value, props.weekStartsOn)
)

const weekWeekdayLabels = computed(() => {
  const formatter = new Intl.DateTimeFormat(resolvedLocale.value, { weekday: 'short' })
  return weekDaysList.value.map((day) => formatter.format(day))
})

const monthOptionList = computed(() => monthOptions(resolvedLocale.value))

const yearOptionList = computed(() => yearOptions(cursor.value.getFullYear()))

const headerTitle = computed(() => {
  if (props.typeView === 'week' && weekDaysList.value.length === 7) {
    return formatRangeLabel(weekDaysList.value[0], weekDaysList.value[6], resolvedLocale.value)
  }
  if (props.typeView === 'day') {
    return formatDayLong(cursor.value, resolvedLocale.value)
  }
  return formatMonthYear(cursor.value, resolvedLocale.value)
})

const selectionLabel = computed(() => {
  if (!selectedStart.value) return ''
  return formatRangeLabel(selectedStart.value, selectedEnd.value, resolvedLocale.value)
})

function emitSingle(day) {
  const value = toISODate(day)
  emit('update:modelValue', value)
  emit('select', value)
}

function emitRange(start, end) {
  const value = {
    start: start ? toISODate(start) : null,
    end: end ? toISODate(end) : null
  }
  emit('update:modelValue', value)
  emit('select', value)
}

function handleSelect(day) {
  if (props.selectionMode !== 'range') {
    emitSingle(day)
    return
  }

  if (selectedStart.value && !selectedEnd.value) {
    const { start, end } = orderRange(selectedStart.value, day)
    emitRange(start, end)
    return
  }

  emitRange(day, null)
}

function onSingleFieldChange(value) {
  const day = parseDate(value)
  if (day) emitSingle(day)
}

function onStartFieldChange(value) {
  const { start, end } = orderRange(value, selectedEnd.value)
  emitRange(start, end)
}

function onEndFieldChange(value) {
  const end = parseDate(value)
  emitRange(selectedStart.value, end)
}

function shift(amount) {
  if (props.typeView === 'month') {
    cursor.value = startOfMonth(addMonths(startOfMonth(cursor.value), amount))
  } else if (props.typeView === 'week') {
    cursor.value = addDays(startOfWeek(cursor.value, props.weekStartsOn), amount * 7)
  } else {
    cursor.value = addDays(cursor.value, amount)
  }
}

function goToday() {
  cursor.value = startOfDay(resolvedToday.value)
}

function onMonthChange(value) {
  const base = startOfMonth(cursor.value)
  cursor.value = new Date(base.getFullYear(), Number(value), 1)
}

function onYearChange(value) {
  const base = startOfMonth(cursor.value)
  cursor.value = new Date(Number(value), base.getMonth(), 1)
}

function onDateFieldChange(value) {
  const day = parseDate(value)
  if (day) cursor.value = startOfDay(day)
}

defineExpose({ goToday, shift })
</script>

<style scoped>
.zn-calendar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: var(--md-surface);
  color: var(--md-on-surface);
}

.zn-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.zn-calendar__heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.zn-calendar__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  text-transform: capitalize;
}

.zn-calendar__selection {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  text-transform: capitalize;
}

.zn-calendar__actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.zn-calendar__pickers,
.zn-calendar__fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Compact selectors: they support the calendar without competing with the grid. */
.zn-calendar__field {
  flex: 0 1 180px;
  min-width: 150px;
}

.zn-calendar__field--year {
  flex: 0 1 120px;
  min-width: 104px;
}

.zn-calendar__body {
  margin-top: 4px;
}

@media (max-width: 600px) {
  .zn-calendar {
    gap: 8px;
    padding: 8px;
  }

  /* Compact header: title and actions share a line and wrap only when they
     truly do not fit, instead of always stacking two rows. */
  .zn-calendar__header {
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .zn-calendar__actions {
    margin-left: auto;
  }

  .zn-calendar__title {
    font-size: 1rem;
  }

  .zn-calendar__field {
    flex: 1 1 132px;
  }

  .zn-calendar__field--year {
    flex: 1 1 104px;
    min-width: 96px;
  }
}
</style>
