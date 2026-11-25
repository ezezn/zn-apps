<template>
  <ZnScreen :title="t('daysOff.title')" :subtitle="subtitle">
    <template #actions>
      <ZnButton variant="filled" @click="openCreate">
        <template #icon>
          <ZnIcon name="event_busy" :size="20" />
        </template>
        <span class="days-off__add-label">{{ t('daysOff.add') }}</span>
      </ZnButton>
    </template>

    <div class="days-off-page">
      <p class="days-off-hint">{{ t('daysOff.hint') }}</p>

      <ZnCalendar
        v-model="selectedDate"
        type-view="month"
        selection-mode="single"
        :locale="locale"
        :labels="calendarLabels"
        :events="events"
        @cursor-change="onCursorChange"
      />

      <section class="days-off-list">
        <header class="days-off-list__header">
          <h2 class="days-off-list__title">
            {{ t('daysOff.listTitle', { month: monthLabel }) }}
          </h2>
          <span class="days-off-list__count">{{ entriesInMonth.length }}</span>
        </header>

        <p v-if="entriesInMonth.length === 0" class="days-off-list__empty">
          {{ t('daysOff.emptyMonth', { month: monthLabel }) }}
        </p>

        <ul v-else class="days-off-list__items">
          <DayOffItem
            v-for="entry in entriesInMonth"
            :key="entry.id"
            :entry="entry"
            :label="labelFor(entry.type)"
            :range="rangeLabel(entry)"
            @edit="openEdit(entry)"
            @delete="removeEntry(entry)"
          />
        </ul>
      </section>

      <section class="days-off-list">
        <header class="days-off-list__header">
          <h2 class="days-off-list__title">{{ t('daysOff.upcomingTitle') }}</h2>
          <span class="days-off-list__count">{{ upcomingEntries.length }}</span>
        </header>

        <p v-if="upcomingEntries.length === 0" class="days-off-list__empty">
          {{ t('daysOff.emptyUpcoming') }}
        </p>

        <ul v-else class="days-off-list__items">
          <DayOffItem
            v-for="entry in upcomingEntries"
            :key="entry.id"
            :entry="entry"
            :label="labelFor(entry.type)"
            :range="rangeLabel(entry)"
            @edit="openEdit(entry)"
            @delete="removeEntry(entry)"
          />
        </ul>
      </section>
    </div>

    <DayOffDialog
      v-model="isDialogOpen"
      :day-off="editing"
      :default-date="selectedDate"
      @submit="submitEntry"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnButton, ZnIcon, ZnScreen, useDialogs } from '@zn-apps/ui-core'
import { ZnCalendar, formatMonthYear } from '@zn-apps/ui-calendar'
import { i18n } from '../i18n.js'
import { dayOffsInMonth, upcomingDayOffs } from '../helpers/days-off.js'
import {
  dayCountBetween,
  durationParts,
  formatTaskDate,
  toDateInputValue
} from '../helpers/dates.js'
import { removeDayOff, saveDayOff, useDaysOff } from '../composables/useDaysOff.js'
import DayOffDialog from '../components/DayOffDialog.vue'
import DayOffItem from '../components/DayOffItem.vue'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const { sorted, events, labelFor } = useDaysOff()

/** Selected day in the calendar; starts on today. */
const selectedDate = ref(toDateInputValue())
/** First day of the month shown below the calendar. */
const monthValue = ref(firstOfMonth(selectedDate.value))

const isDialogOpen = ref(false)
const editing = ref(null)

const locale = computed(() => i18n.global.locale.value)
const monthLabel = computed(() => formatMonthYear(monthValue.value, locale.value))
const entriesInMonth = computed(() => {
  const [year, month] = monthValue.value.split('-').map(Number)
  return dayOffsInMonth(sorted.value, { year, month: month - 1 })
})
/** Non-working days from today onward, whatever month is on screen. */
const upcomingEntries = computed(() => upcomingDayOffs(sorted.value, toDateInputValue()))
const summary = computed(() =>
  t('daysOff.summary', { count: entriesInMonth.value.length, month: monthLabel.value })
)
/**
 * The subtitle announces the next absence as a readable distance
 * (“Next non-working day in 3 months and 6 days”); without upcoming entries
 * it falls back to the month summary.
 */
const subtitle = computed(() => {
  const next = upcomingEntries.value[0]
  if (!next) return summary.value

  const today = toDateInputValue()
  const date = next.start < today ? today : next.start
  const days = dayCountBetween(today, date)
  if (days === null) return summary.value
  if (days <= 0) return t('daysOff.nextToday')
  return t('daysOff.nextIn', { distance: formatDuration(days) })
})

/** “3 months and 6 days”; zero units are skipped and the last one joins with “and”. */
function formatDuration(days) {
  const parts = durationParts(days).map(({ unit, value }) =>
    i18n.global.t(`daysOff.duration.${unit}`, value, { count: value })
  )
  if (parts.length === 0) return ''

  const last = parts[parts.length - 1]
  const leading = parts.slice(0, -1)
  if (leading.length === 0) return last
  return `${leading.join(', ')} ${t('daysOff.duration.and')} ${last}`
}

const calendarLabels = computed(() => ({
  today: t('home.today'),
  previous: t('home.previous'),
  next: t('home.next'),
  month: t('home.month'),
  year: t('home.year'),
  date: t('home.date')
}))

function firstOfMonth(dateValue) {
  const [year, month] = String(dateValue ?? '').split('-').map(Number)
  if (!year || !month) return toDateInputValue()
  return toDateInputValue(new Date(year, month - 1, 1))
}

/** The calendar owns the navigation, so its cursor drives the month below. */
function onCursorChange(value) {
  const month = firstOfMonth(value)
  if (month) monthValue.value = month
}

function rangeLabel(entry) {
  const start = formatTaskDate(entry.start, locale.value)
  const end = formatTaskDate(entry.end, locale.value)
  if (!end || entry.end === entry.start) return start
  return `${start} – ${end}`
}

function openCreate() {
  editing.value = null
  isDialogOpen.value = true
}

function openEdit(entry) {
  editing.value = entry
  isDialogOpen.value = true
}

function submitEntry(payload) {
  const saved = saveDayOff(payload, { originalId: editing.value?.id ?? null })
  if (saved) isDialogOpen.value = false
}

async function removeEntry(entry) {
  const accepted = await confirm(
    t('daysOff.deleteMessage', {
      name: labelFor(entry.type),
      range: rangeLabel(entry)
    }),
    {
      title: t('daysOff.deleteTitle'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel')
    }
  )
  if (!accepted) return
  removeDayOff(entry.id)
}
</script>

<style scoped>
.days-off-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.days-off-hint {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}

.days-off-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.days-off-list__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.days-off-list__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
  text-transform: capitalize;
}

.days-off-list__count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.days-off-list__empty {
  margin: 0;
  padding: 20px 16px;
  border-radius: 12px;
  background: var(--md-surface-container-low, var(--md-surface-variant));
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  text-align: center;
}

.days-off-list__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 720px) {
  .days-off__add-label {
    display: none;
  }
}
</style>
