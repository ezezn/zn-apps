<template>
  <div class="zn-calendar-month">
    <div class="zn-calendar-month__weekdays">
      <span
        v-for="label in weekdayLabels"
        :key="label"
        class="zn-calendar-month__weekday"
      >{{ label }}</span>
    </div>

    <div class="zn-calendar-month__grid" role="grid">
      <div
        v-for="(week, weekIndex) in weeks"
        :key="toISODate(week[0])"
        class="zn-calendar-month__week"
        :class="`zn-calendar-month__week--${eventsPosition}`"
        role="row"
      >
        <div
          v-if="showEvents && weekBars(week).bars.length"
          class="zn-calendar-month__bars"
        >
          <button
            v-for="bar in weekBars(week).bars"
            :key="`${bar.event.id}-${weekIndex}`"
            type="button"
            :class="[
              'zn-calendar-month__bar',
              `zn-calendar-month__bar--${eventVariant}`,
              {
                'zn-calendar-month__bar--line': !showEventDetails,
                'zn-calendar-month__bar--continues-start': bar.continuesStart,
                'zn-calendar-month__bar--continues-end': bar.continuesEnd
              }
            ]"
            :style="barStyle(bar)"
            :title="bar.event.title"
            :aria-label="bar.event.title"
            @click.stop="$emit('event-click', bar.event)"
          >
            <span v-if="showEventDetails" class="zn-calendar-month__bar-title">
              {{ bar.event.title }}
            </span>
          </button>

          <span
            v-if="weekBars(week).hiddenCount"
            class="zn-calendar-month__more"
          >+{{ weekBars(week).hiddenCount }}</span>
        </div>

        <div class="zn-calendar-month__cells">
          <div class="zn-calendar-month__range-layer" aria-hidden="true">
            <span
              v-for="segment in weekRangeSegments(week)"
              :key="segment.key"
              :class="[
                'zn-calendar-month__range',
                {
                  'zn-calendar-month__range--start': !segment.continuesStart,
                  'zn-calendar-month__range--end': !segment.continuesEnd
                }
              ]"
              :style="rangeStyle(segment)"
            />
          </div>

          <div
            v-for="day in week"
            :key="toISODate(day)"
            role="gridcell"
            :class="['zn-calendar-month__cell', cellClasses(day)]"
          >
            <button
              type="button"
              :class="['zn-calendar-month__day', dayClasses(day)]"
              :aria-label="dayLabel(day)"
              :aria-selected="isSelected(day) ? 'true' : 'false'"
              :aria-current="isToday(day) ? 'date' : undefined"
              @click="$emit('select', day)"
            >
              <span class="zn-calendar-month__number">{{ day.getDate() }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  calendarEventStyle,
  formatDayLong,
  isMultiDayEvent,
  isSameDay,
  isWithinRange,
  toISODate
} from '../utils/calendar.js'

const props = defineProps({
  weeks: { type: Array, default: () => [] },
  month: { type: Number, default: null },
  weekdayLabels: { type: Array, default: () => [] },
  selectedStart: { type: Date, default: null },
  selectedEnd: { type: Date, default: null },
  today: { type: Date, default: null },
  showToday: { type: Boolean, default: true },
  events: { type: Array, default: () => [] },
  showEvents: { type: Boolean, default: true },
  showEventDetails: { type: Boolean, default: true },
  /**
   * Where the single event band sits relative to the day numbers: `below`
   * (default) keeps every event under its week, `above` puts it before the
   * numbers. All events share the same band, so they never alternate sides.
   */
  eventsPosition: {
    type: String,
    default: 'below',
    validator: (value) => ['above', 'below'].includes(value)
  },
  eventVariant: { type: String, default: 'accent' },
  locale: { type: String, default: 'en' },
  labels: { type: Object, default: () => ({}) }
})

defineEmits(['select', 'event-click'])

const maxLanes = 2

function isToday(day) {
  return props.showToday && isSameDay(day, props.today)
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

function cellClasses(day) {
  return {
    'zn-calendar-month__cell--outside': props.month !== null && day.getMonth() !== props.month,
    'zn-calendar-month__cell--in-range': isInRange(day),
    'zn-calendar-month__cell--range-start': isInRange(day) && isSameDay(day, props.selectedStart),
    'zn-calendar-month__cell--range-end': isInRange(day) && isSameDay(day, props.selectedEnd)
  }
}

function dayClasses(day) {
  return {
    'zn-calendar-month__day--today': isToday(day),
    'zn-calendar-month__day--selected': isSelected(day),
    'zn-calendar-month__day--in-range': isInRange(day)
  }
}

function dayLabel(day) {
  const label = props.labels.selectDay || 'Select {date}'
  return label.replace('{date}', formatDayLong(day, props.locale))
}

/**
 * Selection range segments for a week, one continuous pill per contiguous run.
 * A segment that comes from the previous or continues into the next week keeps
 * square edges, so only the real first and last day are rounded.
 */
function weekRangeSegments(week) {
  const { selectedStart, selectedEnd } = props
  if (!selectedStart || !selectedEnd || isSameDay(selectedStart, selectedEnd)) return []

  const segments = []
  let current = null

  week.forEach((day, index) => {
    if (isWithinRange(day, selectedStart, selectedEnd)) {
      if (current) {
        current.to = index
        current.span += 1
      } else {
        current = { from: index, to: index, span: 1, key: toISODate(day) }
      }
      return
    }

    if (current) {
      segments.push(current)
      current = null
    }
  })

  if (current) segments.push(current)

  const weekStart = week[0]
  const weekEnd = week[week.length - 1]

  return segments.map((segment) => ({
    ...segment,
    continuesStart: segment.from === 0 && !isSameDay(weekStart, selectedStart),
    continuesEnd:
      segment.to === week.length - 1 && !isSameDay(weekEnd, selectedEnd)
  }))
}

function rangeStyle(segment) {
  const cell = 100 / 7
  const leftPercent = segment.continuesStart
    ? segment.from * cell
    : segment.from * cell + cell / 2
  const leftPx = segment.continuesStart ? 0 : -15
  const rightPercent = segment.continuesEnd
    ? (segment.to + 1) * cell
    : segment.to * cell + cell / 2
  const rightPx = segment.continuesEnd ? 0 : 15

  return {
    left:
      leftPx < 0
        ? `calc(${leftPercent}% - ${-leftPx}px)`
        : `calc(${leftPercent}% + ${leftPx}px)`,
    width: `calc(${rightPercent - leftPercent}% + ${rightPx - leftPx}px)`
  }
}

/**
 * Every event of the week lives in the same band, packed into lanes by
 * column: multi-day events become one continuous bar (from the start or the
 * first visible day to the end or the last day) and single-day events occupy
 * their own column. Sharing the band keeps all events on the same line, so a
 * chip never jumps above the day number while the next one sits below it.
 */
function weekBars(week) {
  if (!week.length) return { bars: [], hiddenCount: 0 }

  const weekStart = week[0]
  const weekEnd = week[week.length - 1]
  const entries = []

  for (const event of props.events) {
    if (isMultiDayEvent(event)) {
      if (
        event.startDate.getTime() > weekEnd.getTime() ||
        event.endDate.getTime() < weekStart.getTime()
      ) {
        continue
      }
      const from = Math.max(0, week.findIndex((day) => isSameDay(day, event.startDate)))
      const endIndex = week.findIndex((day) => isSameDay(day, event.endDate))
      const to = endIndex === -1 ? week.length - 1 : endIndex
      if (to < from) continue

      entries.push({
        event,
        from,
        to,
        span: to - from + 1,
        multiDay: true,
        continuesStart: event.startDate.getTime() < weekStart.getTime(),
        continuesEnd: event.endDate.getTime() > weekEnd.getTime()
      })
      continue
    }

    const index = week.findIndex((day) => isSameDay(day, event.startDate))
    if (index === -1) continue
    entries.push({
      event,
      from: index,
      to: index,
      span: 1,
      multiDay: false,
      continuesStart: false,
      continuesEnd: false
    })
  }

  // Long bars first so the short chips fill the gaps they leave behind.
  entries.sort((a, b) => {
    if (a.multiDay !== b.multiDay) return a.multiDay ? -1 : 1
    if (a.multiDay) return a.from - b.from || b.span - a.span
    return a.from - b.from
  })

  const laneEnds = []
  const bars = []

  for (const entry of entries) {
    let lane = laneEnds.findIndex((lastColumn) => lastColumn < entry.from)
    if (lane === -1) lane = laneEnds.length
    if (lane >= maxLanes) continue

    laneEnds[lane] = entry.to
    bars.push({ ...entry, lane })
  }

  return { bars, hiddenCount: entries.length - bars.length }
}

function barStyle(bar) {
  return {
    gridColumn: `${bar.from + 1} / span ${bar.span}`,
    gridRow: String(bar.lane + 1),
    ...calendarEventStyle(bar.event, props.eventVariant)
  }
}
</script>

<style scoped>
.zn-calendar-month {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zn-calendar-month__weekdays,
.zn-calendar-month__cells {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.zn-calendar-month__cells {
  position: relative;
}

.zn-calendar-month__weekday {
  padding: 8px 4px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
}

.zn-calendar-month__grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zn-calendar-month__week {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* The band is rendered once; its order decides whether it sits below or above
   the day numbers, so every event always shares the same line. */
.zn-calendar-month__week--below .zn-calendar-month__cells {
  order: 1;
}

.zn-calendar-month__week--below .zn-calendar-month__bars {
  order: 2;
  padding: 0 2px 2px;
}

.zn-calendar-month__bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 18px;
  gap: 2px 4px;
  padding: 2px 2px 0;
}

.zn-calendar-month__bar {
  height: 18px;
  padding: 0 6px;
  overflow: hidden;
  border: 0;
  border-radius: 4px;
  font: inherit;
  font-size: 0.6875rem;
  line-height: 18px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.zn-calendar-month__bar--accent {
  border-left: 3px solid var(--zn-calendar-event-color, var(--md-primary));
  background: color-mix(in srgb, var(--zn-calendar-event-color, var(--md-primary)) 18%, transparent);
  color: var(--md-on-surface);
}

.zn-calendar-month__bar--filled {
  background: var(--zn-calendar-event-color, var(--md-primary));
  color: var(--zn-calendar-event-text, var(--md-on-primary));
}

.zn-calendar-month__bar--line {
  height: 4px;
  margin: 7px 0;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: var(--zn-calendar-event-color, var(--md-primary));
  line-height: 4px;
}

.zn-calendar-month__bar--continues-start {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.zn-calendar-month__bar--continues-end {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.zn-calendar-month__bar-title {
  pointer-events: none;
}

.zn-calendar-month__more {
  grid-column: 1 / -1;
  padding-left: 4px;
  color: var(--md-on-surface-variant);
  font-size: 0.6875rem;
  line-height: 14px;
}

.zn-calendar-month__cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 64px;
  padding: 2px;
  border-radius: 8px;
}

/* Range: one continuous primary pill behind the day markers, never a shaded cell. */
.zn-calendar-month__range-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Same 30px box as the day marker, aligned to its top edge. */
.zn-calendar-month__range {
  position: absolute;
  top: 2px;
  height: 30px;
  background: var(--md-primary);
}

.zn-calendar-month__range--start {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.zn-calendar-month__range--end {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.zn-calendar-month__day {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  line-height: 1;
  align-self: flex-start;
  margin: 0 auto;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--md-on-surface);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.zn-calendar-month__day:hover {
  background: var(--md-surface-container-highest);
}

.zn-calendar-month__day:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.zn-calendar-month__cell--outside .zn-calendar-month__day {
  color: var(--md-on-surface-variant);
  opacity: 0.55;
}

.zn-calendar-month__day--today {
  border-color: var(--md-primary);
  color: var(--md-primary);
  font-weight: 500;
}

.zn-calendar-month__day--selected,
.zn-calendar-month__day--selected:hover {
  background: var(--md-primary);
  border-color: var(--md-primary);
  color: var(--md-on-primary);
  font-weight: 500;
}

/* Today inside a range sits on the primary line: use an inverted ring. */
.zn-calendar-month__day--in-range.zn-calendar-month__day--today:not(.zn-calendar-month__day--selected) {
  border-color: var(--md-on-primary);
  color: var(--md-on-primary);
}

.zn-calendar-month__day--in-range:not(.zn-calendar-month__day--selected) {
  background: transparent;
  color: var(--md-on-primary);
}

.zn-calendar-month__day--in-range:not(.zn-calendar-month__day--selected):hover {
  background: color-mix(in srgb, var(--md-on-surface) 16%, transparent);
}

@media (max-width: 600px) {
  .zn-calendar-month__cell {
    min-height: 52px;
  }

  .zn-calendar-month__day {
    width: 26px;
    height: 26px;
  }

  .zn-calendar-month__bar {
    font-size: 0.625rem;
  }
}
</style>
