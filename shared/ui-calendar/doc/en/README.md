# @zn-apps/ui-calendar — user manual

Material Design 3 calendars built on `@zn-apps/ui-core`: display days, pick a single date, pick a range and paint events. Optional integrated fields let users type the selection instead of tapping the grid.

- Package: `@zn-apps/ui-calendar` · Folder: `shared/ui-calendar/`
- Spanish: [Leer en español](../es/README.md)

## Installation

```js
import { ZnCalendar } from '@zn-apps/ui-calendar'
import '@zn-apps/ui-calendar/dist/ui-calendar.css'
```

The app must already use `@zn-apps/ui-core` (tokens, fonts and theme). If your build aliases shared sources, alias `@zn-apps/ui-calendar` to `shared/ui-calendar/src/index.js` in `vite.config.js` and `vitest.config.js`.

## Quick start

```vue
<script setup>
import { ref } from 'vue'
import { ZnCalendar } from '@zn-apps/ui-calendar'

const day = ref('2026-11-18')
const range = ref({ start: '2026-11-10', end: '2026-11-14' })

const events = [
  { id: 1, title: 'Review', start: '2026-11-18T09:00', end: '2026-11-18T10:00', color: '#6750A4' },
  { id: 2, title: 'Conference', start: '2026-11-12', end: '2026-11-14' }
]
</script>

<template>
  <ZnCalendar v-model="day" type-view="month" :events="events" show-fields />
  <ZnCalendar v-model="range" type-view="month" selection-mode="range" />
</template>
```

## Views

| `type-view` | What it shows | Selection |
|---|---|---|
| `month` | Six-week grid with day numbers and event badges | Click a day |
| `week` | Compact horizontal day tabs plus the agenda of the selected day (the agenda disappears with `show-events="false"`) | Click a day tab |
| `day` | Agenda for one day, ordered by start time | Click the day header |

Navigation follows the view: arrows move one month, one week or one day. `month` and `week` include month and year selectors; `day` includes a date field. `show-navigation="false"` hides all of them.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type-view` | String | `'month'` | `month`, `week` or `day` |
| `selection-mode` | String | `'single'` | `single` or `range` |
| `model-value` / `v-model` | String \| Object | `null` | `YYYY-MM-DD` for single, `{ start, end }` for range |
| `events` | Array | `[]` | `{ id?, title, start, end?, color? }` |
| `show-today` | Boolean | `true` | Marks today and shows the "Today" button |
| `show-navigation` | Boolean | `true` | Arrows, month/year selects or date field |
| `show-fields` | Boolean | `false` | Optional fields to type the selection |
| `show-events` | Boolean | `true` | `false` turns the calendar into a day picker |
| `show-event-details` | Boolean | `true` | `false` draws single-day events as dots and multi-day events as lines |
| `event-variant` | String | `'accent'` | `accent` uses a colored notch over a tinted surface; `filled` paints the event with its color and picks black or white text automatically |
| `locale` | String | system | BCP 47 locale for month, weekday and time text |
| `week-starts-on` | Number | `1` | 0 = Sunday … 6 = Saturday |
| `labels` | Object | `{}` | Overrides the English UI captions (`today`, `previous`, `next`, `month`, `year`, `date`, `startDate`, `endDate`, `noEvents`, `allDay`, `selectDay`) |
| `today` | String \| Date | real today | Overrides the reference date (tests, previews) |

Events: `start` with a time (`2026-11-18T09:00`) is a timed event; without a time it covers the whole day. `end` is optional and makes the event span several days (inclusive); in the month view a multi-day event is drawn once per week as a continuous bar. `color` accepts any CSS color and is used for the badge, bar or dot.

The optional selection fields and the month/year pickers use the compact `xsmall` field size (40px) by design: they support the grid without taking visual prominence. On narrow screens (≤600px) the title and the navigation buttons stay on one line and the fields split the available width evenly, so the calendar header remains a single compact strip.

Emits: `update:model-value`, `select`, `event-click` (with the normalized event) and `cursor-change` (the visible day as `YYYY-MM-DD` after navigating, using the month/year pickers or setting the value from outside; handy to render a list for the shown month).

## Selection rules

- **Single**: the value is an ISO day; every click replaces it.
- **Range**: the first click sets the start, the second sets the end and the range is stored ordered even if you pick backwards. A third click starts a new range. Selected days keep the same circular marker as today, filled with the primary color, and a single continuous primary line joins them instead of shading the cells: it is rounded only at the first and last day, and stays solid across every day in between.
- With `show-fields`, single mode shows one date field and range mode shows start and end fields. Editing a field updates the calendar and vice versa.
- When the value changes from outside, the calendar navigates to the selected date.

## Labels and locale

Month names, weekday names and times come from `Intl`, so `locale="es"` is enough for Spanish dates. The few UI captions default to English; pass `labels` from your app's i18n when needed:

```vue
<ZnCalendar v-model="day" locale="es" :labels="{ today: 'Hoy', previous: 'Anterior', next: 'Siguiente', month: 'Mes', year: 'Año', date: 'Fecha', startDate: 'Fecha inicial', endDate: 'Fecha final', noEvents: 'Sin eventos', allDay: 'Todo el día', selectDay: 'Seleccionar {date}' }" />
```

## Individual views and helpers

`ZnCalendarMonth`, `ZnCalendarWeek` and `ZnCalendarDay` are exported for custom layouts; they take precomputed days plus the selection bounds and emit `select`. Date helpers (`buildMonthMatrix`, `normalizeEvents`, `toISODate`, `formatRangeLabel`, …) are exported from the package too.

## Demo and tests

Kitchensink: `/calendar/month`, `/calendar/range`, `/calendar/week`, `/calendar/day`. Tests: `npx vitest run --project ui-calendar`.
