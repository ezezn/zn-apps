# @zn-apps/ui-calendar — AI context

Material Design 3 calendars for showing, picking a day and picking a date range, with optional events. Composes `@zn-apps/ui-core` (`ZnButton`, `ZnIcon`, `ZnSelect`, `ZnDateInput`) — the only allowed library edge is `ui-calendar → ui-core`.
Location: `shared/ui-calendar/`. Apps import `@zn-apps/ui-calendar` and `@zn-apps/ui-calendar/dist/ui-calendar.css` (or alias the package to `src/index.js` for source builds).

## Exports

| Export | Purpose |
|---|---|
| `ZnCalendar` | Orchestrator: header, navigation, optional selection fields, active view |
| `ZnCalendarMonth` | 6×7 month grid; day selection, bars for multi-day events and chips for single-day events |
| `ZnCalendarWeek` | Compact horizontal day tabs (one selected day) + that day's agenda |
| `ZnCalendarDay` | Single-day agenda; day selection + events |
| utils | `parseDate`, `toISODate`, `toISODateTime`, `addDays`, `addMonths`, `startOfWeek`, `startOfMonth`, `buildMonthMatrix`, `buildWeek`, `normalizeEvents`, `eventsForDay`, `readSelection`, `orderRange`, `format*`, `monthOptions`, `yearOptions`, `weekdayLabels` |

Views are presentational: they receive precomputed `weeks`/`days`/`day`, the normalized selection (`selectedStart`/`selectedEnd`) and emit `select`/`event-click`. Only `ZnCalendar` owns navigation and emits `update:modelValue`.

## `ZnCalendar` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `typeView` | String | `'month'` | `month` \| `week` \| `day` |
| `selectionMode` | String | `'single'` | `single` \| `range` |
| `modelValue` | String \| Object \| Array | `null` | single → `YYYY-MM-DD`; range → `{ start, end }`; a one-element array is read too |
| `events` | Array | `[]` | `{ id?, title, start, end?, color? }` |
| `showToday` | Boolean | `true` | Today marker (`aria-current="date"`) + "Today" button |
| `showNavigation` | Boolean | `true` | Prev/next arrows and month+year (or date) pickers |
| `showFields` | Boolean | `false` | Optional selection fields above the grid |
| `showEvents` | Boolean | `true` | `false` → calendar only selects days |
| `showEventDetails` | Boolean | `true` | `false` → events render as color dots and lines |
| `eventVariant` | String | `'accent'` | `accent` (colored notch over a tinted surface) \| `filled` (event color background, automatic contrast text) |
| `locale` | String | `''` | `''` → `navigator.language` → `en`; drives `Intl` month/weekday/time text |
| `weekStartsOn` | Number | `1` | 0 = Sunday … 6 = Saturday |
| `labels` | Object | `{}` | Merged over English defaults: `today`, `previous`, `next`, `month`, `year`, `date`, `startDate`, `endDate`, `noEvents`, `allDay`, `selectDay` (`{date}` placeholder) |
| `today` | String \| Date | `null` | Overrides the reference "today" (tests, SSR) |

Emits: `update:modelValue`, `select` (same payload as the model), `event-click` (normalized event).

## Behavior rules

1. Values are local ISO strings. `YYYY-MM-DD` for days, `YYYY-MM-DDTHH:mm` for timed events; `end` without a time means the event covers whole days (inclusive).
2. Range: first click sets `start` (and clears `end`), second click completes the range ordered (`start <= end`), a click on a full range starts a new one. Range days are joined by one continuous primary pill per week, exactly the same 30px box as the day markers and aligned to the same top offset (the day button uses `box-sizing: border-box` so its 1px border does not make the circle 2px taller); it spans from the first marker's left edge to the last marker's right edge and only the real range start/end get rounded caps, so weeks in between stay square (`weekRangeSegments`). Cells are not shaded; intermediate day numbers use `on-primary` for contrast.
3. Month grid is always 42 days (six weeks) starting on `weekStartsOn`; leading/trailing days are still selectable but dimmed.
4. Single-day events render as chips under the day number (up to 2, then `+N`). Multi-day events render once per week as a continuous bar spanning their columns, with two lanes per week before collapsing into `+N`.
5. `eventVariant` applies to chips, bars and agenda rows. `filled` uses `contrastTextColor()` (WCAG relative luminance) to set `--zn-calendar-event-text` to black or white.
6. Navigation unit follows `typeView`: month → month, week → week, day → day. Month/year selects jump to the first day of the chosen month; day view replaces them with a date field. All navigation and selection fields use `size="xsmall"` (40px) and never stretch to the full container width. Below 600px the header keeps title and actions on one line (wrapping only if they cannot fit) and the fields share the row evenly (`flex: 1 1`), so the compact 40px height keeps the header to a single strip on phones.
7. Week view is a horizontal tab strip of the 7 days plus the agenda of the active day; clicking a tab selects that day and moves the agenda.
8. The cursor follows an external selection change, so setting the value from outside navigates the visible period.
9. `showEvents=false` hides all event markup; `showEventDetails=false` keeps colored dots (month) and lines (multi-day bars). In the week view `showEvents=false` also removes the day panel (header + agenda), so a selection-only calendar ends at the day strip instead of reserving empty agenda space.
10. No i18n dependency: month/weekday/time labels come from `Intl`, UI captions from `labels`. Apps with `vue-i18n` should pass translated `labels`.
11. Icons used: `chevron_left`, `chevron_right` (declared in `icon-profile.json`).

## Integration

```vue
<script setup>
import { ref } from 'vue'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import '@zn-apps/ui-calendar/dist/ui-calendar.css'

const day = ref('2026-11-18')
const range = ref({ start: '2026-11-10', end: '2026-11-14' })
const events = [{ id: 1, title: 'Review', start: '2026-11-18T09:00', end: '2026-11-18T10:00', color: '#6750A4' }]
</script>

<template>
  <ZnCalendar v-model="day" type-view="month" :events="events" show-fields />
  <ZnCalendar v-model="range" type-view="month" selection-mode="range" />
</template>
```

Apps that alias shared sources in `vite.config.js` should add `'@zn-apps/ui-calendar': resolve(__dirname, '../shared/ui-calendar/src/index.js')` (and the same alias in `vitest.config.js`); importing the built package needs the `dist/ui-calendar.css` import. The library build externalizes `vue` and `@zn-apps/ui-core`.

## Tests

`src/utils/__tests__/calendar.spec.js`, `src/components/__tests__/ZnCalendar.spec.js` → `npx vitest run --project ui-calendar`.
Kitchensink demos: `/calendar/month`, `/calendar/range`, `/calendar/week`, `/calendar/day`.
