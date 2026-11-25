# Daily Task Report — AI context

Local PWA to track the tasks reported from an external work system, with editable cards in a master-slave layout.
Location: `daily-task-report/`, base `/zn-apps/daily-task-report/`.

## Architecture decisions

| Decision | Implementation | Reason |
|---|---|---|
| Router | `createRouter` + `createWebHistory(import.meta.env.BASE_URL)` | `/` is the Home page (`home`); `/tasks`, `/updates`, `/settings`, `/about` under the deploy subpath; any unknown path (including the PWA `start_url` `index.html`) redirects to `/` |
| Layout | `ZnMasterSlaveLayout` with `#master` nav + default `<router-view>` | master-slave shell, same as Kitchensink. `/` is the Home page and the entry point, so mobile starts **content-first**: the page keeps the focus and the hamburger opens the nav drawer (provided by ui-core). `main.js` mounts after `router.isReady()`, otherwise the first mobile frame would focus an empty slot. The `#master` nav separates the main `/`, `/tasks`, `/updates`, `/reports` and `/days-off` entries from the secondary `/settings` and `/about` links, which are pushed to the bottom of the panel with `margin-top: auto` (ui-core stretches the `nav` to fill the visible drawer) |
| Page state | Pinia (`src/stores/tasks.js`) | filters/sort/CRUD state lives per page, never cross-app |
| Persistence | Dexie (IndexedDB, db `daily-task-report`, tables `tasks`, `updates`, `reports`) | local-only user data; settings must **not** hold task data |
| Settings | `settings-core`, namespace `daily-task-report` | locale, theme preference, entity naming, business days, external statuses and report export templates |
| Data UI | `ZnDataForm` (create/edit dialog) + `ZnDataView` (expanded card) | one schema per presentation, shared Task DTO |
| i18n | Vue I18n `en`/`es`; locale from `settings.i18n.locale` → system → `en` | every user-facing string |

## Routes (`src/router/index.js`)

| Path | Name | View |
|---|---|---|
| `/` | `home` | `HomePage.vue` (calendar + daily report) |
| `/tasks` | `tasks` | `TasksPage.vue` |
| `/updates` | `updates` | `UpdatesPage.vue` (full change log) |
| `/reports` | `reports` | `ReportsPage.vue` (report documents, date-range filter, export, copy/delete) |
| `/days-off` | `daysOff` | `DaysOffPage.vue` (month calendar + editable non-working days of the shown month) |
| `/settings` | `settings` | `SettingsPage.vue` |
| `/about` | `about` | `AboutPage.vue` |

## Entity naming (core decision)

`Task` is the internal, public-repo name. The user-facing singular/plural is configurable per locale in Settings and persisted at `settings.entity.names.{en,es}.{singular,plural}`. Never hardcode a work-specific vocabulary in code, i18n defaults, fixtures or docs.

```js
const { singular, plural } = useEntityLabels() // reactive, falls back per locale
```

Defaults: `Task/Tasks` (en), `Tarea/Tareas` (es). Empty values fall back to the defaults. Use the labels in titles, buttons, empty states and navigation; keep `Task` in code, ids, DB and file names.

## DTO (`src/helpers/tasks.js`)

```ts
interface Task {
  id: number            // Dexie autoincrement
  externalId: string    // required
  name: string          // required
  description: string
  taskDate: string      // 'YYYY-MM-DD' or ''
  addedAt: string       // required, 'YYYY-MM-DDTHH:mm' (local, prefilled with now)
  externalUrl: string
  status: 'active' | 'inactive'   // the only two internal statuses
  externalStatus: string // `value` of a configured external status
}

interface ExternalStatus {
  value: string                  // auto-generated unique id, hidden from the UI
  labels: { en: string, es: string } // en required, es optional (falls back to en)
}
```

Dates are stored as local input strings (`YYYY-MM-DD` / `YYYY-MM-DDTHH:mm`) so they bind directly to `ZnDateInput` / `ZnDateTimeInput`; formatting happens at render time.

## Update DTO (`src/helpers/updates.js`)

```ts
interface TaskUpdate {
  id: number        // Dexie autoincrement
  taskId: number    // FK tasks.id, required
  description: string // what changed, required
  createdAt: string // required, 'YYYY-MM-DDTHH:mm' (local)
}
```

The update log lives in its own table (`db.version(3)`), never inside the task row. Ordering is `createdAt desc` with `id desc` as tiebreaker, so the newest entry is always first.

## Report DTO (`src/helpers/reports.js`)

```ts
interface Report {
  id: number                 // Dexie autoincrement
  createdAt: string          // 'YYYY-MM-DDTHH:mm' (local), also the report name
  sections: {
    yesterday: ReportItem[]  // what I did on the previous business day
    today: ReportItem[]      // what I am working on
    finish: ReportItem[]     // what I could finish today
    blockers: ReportItem[]
  }
}

interface ReportItem {
  kind: 'update' | 'text'
  taskId: number | null      // null for plain notes
  updateId: number | null    // reference to the source update
  taskName: string           // snapshot; keeps the report readable after deletion
  description: string        // editable copy of the update text, or the note
}
```

`REPORT_SECTION_KEYS` is the single ordered list of sections. Reports are **immutable snapshots**: creating only happens from Home, there is no edit screen, and deleting a task or an update never rewrites a report. Copying duplicates the four sections and stamps a new `createdAt`. Reports live in their own table (`db.version(4)`), not inside a task.

## Data flow

```
Dexie db  →  tasksRepository (src/db/)  →  useTasksStore (Pinia)  →  TasksPage
              │                               │                        ├── TaskCard (ZnCard + ZnDataView + updates)
              │                               │                        ├── TaskDialog
              │                               │                        └── UpdateDialog
              │                               └── helpers (filter/sort/validate/normalize)
              └──  updatesRepository  →  useUpdatesStore  →  UpdatesPage / TaskCard
                                              └── helpers/updates.js (normalize/validate/sort)

reportsRepository  →  useReportsStore  →  ReportsPage
                        │                    └── helpers/reports.js (filter/sort/duplicate)
                        └── HomePage → ReportCreateDialog (createReportDraft from today + previous days)
```

`HomePage` reuses both stores and derives its three lists with `helpers/daily-report.js` (pure function, no repository calls), so navigating between Home, Tasks and Updates keeps a single in-memory copy of each collection.

| File | Role |
|---|---|
| `src/db/database.js` | `new Dexie('daily-task-report')`, v1 stores `tasks: '++id, externalId, name, status, taskDate, addedAt'`; v2 `upgrade()` maps legacy statuses to `active`/`inactive`; v3 adds `updates: '++id, taskId, createdAt'`; v4 adds `reports: '++id, createdAt'`; evolve with a new `version(n).upgrade()` |
| `src/db/tasksRepository.js` | `list`, `create`, `update`, `remove`, `mergeAll`, `clearAll`; normalizes the DTO; `remove`/`clearAll` also delete the task's updates in the same transaction |
| `src/db/updatesRepository.js` | `list`, `listByTask`, `create`, `update`, `remove`, `removeByTask`, `clearAll`; normalizes the update DTO |
| `src/stores/updates.js` | `updates`, `loaded`, `loading`, `saving`, `error`, `sortedUpdates`, `total`, `isEmpty`, load/CRUD, `forTask(taskId)`, `forgetTask`, `forgetAll` (memory-only sync after a cascade) |
| `src/db/reportsRepository.js` | `list`, `create`, `remove`, `clearAll` over the `reports` table; stores normalized document snapshots |
| `src/stores/reports.js` | `reports`, `loaded`, `loading`, `saving`, `error`, `sortedReports`, `total`, `isEmpty`, `load`, `createReport`, `copyReport`, `deleteReport`, `forgetAll` |
| `src/helpers/reports.js` | `REPORT_SECTION_KEYS`, `normalizeReport(Item)`, `createReportDraft` (seeds yesterday/today from updates), `createTextReportItem`, `createReportTaskItem` (task reference without an existing update), `pruneEmptyReportItems`, `reportItemCount`, `filterReports`, `sortReportsDesc`, `duplicateReport` |
| `src/views/ReportsPage.vue` | report list newest first with two `ZnDateInput` filters (from/to, inclusive), four-section document view, export, copy and delete; **no create action**. When both filters select the same day and a report exists, an informational alert links to that card (anchor `#report-<id>`) |
| `src/components/ReportCreateDialog.vue` | Home creation dialog: seeded sections, editable item descriptions, remove items, add notes to any section, save-time `createdAt` |
| `src/helpers/report-export.js` | `renderReportItem` (`[name](url) -> text`, name-only without link, text-only for unknown task), `renderReportSection` (`* ` bullets, `No` when empty), `renderReportTemplate` (`{yesterday}`/`{today}`/`{finish}`/`{blockers}`, unknown tokens kept), `reportExportFileName` |
| `src/composables/useReportTemplates.js` | `DEFAULT_REPORT_TEMPLATE`, reactive `reportTemplates` from `settings.reportTemplates`, `normalizeReportTemplate`, `validateReportTemplate`, `saveReportTemplate`, `removeReportTemplate`, `setLastReportTemplateId`/`rememberedReportTemplateId` (`settings.lastReportTemplateId`, falls back to the default when deleted), `useReportTemplates` (default template first) |
| `src/components/ReportExportDialog.vue` | Export dialog: template selector, live markdown preview, clipboard copy (with `execCommand` fallback), `.md` download |
| `src/components/ReportTemplateDialog.vue` + `src/data/report-template-schema.js` | Settings dialog to create/edit a template (`name` + markdown `body`) through `ZnDataForm` |
| `src/helpers/updates.js` | `normalizeUpdate`, `createUpdateDraft`, `validateUpdate`, `sortUpdatesDesc`, `updatesForTask` |
| `src/data/update-schema.js` | `updateFormSchema` for `ZnDataForm` (task select, datetime, description) |
| `src/components/UpdateDialog.vue` | create/edit dialog shared by the Updates page and the expanded card |
| `src/views/UpdatesPage.vue` | full change log newest first, with task name, edit and delete |
| `src/views/HomePage.vue` | Entry point: `ZnCalendar` (week by default, month on demand, single selection that starts on today) + the three report lists; loads tasks, updates and reports on mount and passes the configured `workDays` and the non-working dates to the report. The calendar **receives no `events`**: it is a pure date selector, so the selected day's events are never drawn. Above the calendar, a single `ZnAlert variant="info"` reports whether the selected date has a report (`home.reportReady` with **Open report** when it exists, `home.reportNotCreated` for today without one, `home.reportMissing` for other dates) and appends the countdown to the next configured non-working day with its title in parentheses (`home.nextDayOff` / `home.nextDayOffToday`, built with `upcomingDayOffs` + `formatDuration`). The banner can be dismissed per `date:reportId` key and reappears when the date or report changes; **Open report** navigates to `/reports#report-<id>` |
| `src/components/DailyTaskList.vue` | One Home list: title, count, empty state and `{ task, updates }` entries with the day's updates (newest first); `collapsible` + `expanded` drive the header toggle (`aria-expanded`/`aria-controls`) |
| `src/helpers/daily-report.js` | `buildDailyReport({ tasks, updates, date })` → `{ current, previous, pending }`, `previousDateValue`, `updateDateValue` |
| `src/stores/tasks.js` | `tasks`, `loaded`, `loading`, `saving`, `error` (i18n key suffix), `filters`, `visibleTasks`, `total`, `shown`, `isEmpty`, `hasActiveFilters`, CRUD, `resetFilters`, `setSortBy`, `toggleDirection` |
| `src/helpers/tasks.js` | `TASK_STATUSES`, `normalizeTask`, `createTaskDraft`, `validateTask`, `filterTasks`, `sortTasks`, `absoluteUrl` |
| `src/helpers/dates.js` | local `date`/`datetime-local` values, parsing and display formatting; `dayCountBetween` (whole calendar days, UTC midnights so DST never shifts the result) and `durationParts` (readable split into months of 30 days, weeks of 7 and days) |
| `src/helpers/backup.js` | v2 JSON backup: `buildBackup({tasks,updates,reports})`, `serializeBackup`, `parseBackup` → `{tasks,updates,reports}`, `backupFileName`; each task gets a stable `ref` (`externalId`, else `task-<id>`) that updates and report items point to |
| `src/db/backupRepository.js` | `importBackup` in one Dexie transaction: tasks merge by external id, `ref` → local id, updates deduped by `taskId+createdAt+description`, reports deduped by `createdAt` + item contents (ids stripped from the dedupe key) |
| `src/helpers/merge.js` | `taskKey` (external id, case-insensitive) and `planMerge` → `entries[{task,status:'new'|'update'|'unchanged',existingId?}]` + counts |
| `src/components/TaskImportDialog.vue` | import review window: task merge summary, updates/reports counts, state per row, confirm/cancel |
| `src/data/task-schema.js` | `taskFormSchema` (dialog), `taskViewSchema` (expanded card), `statusOptions` |
| `src/composables/useBusinessDays.js` | `workDays` (settings mirror, JS day numbers, Monday–Friday by default), `WEEK_DAYS` (Monday first), `normalizeWorkDays`, `setWorkDays`, `setWorkDay`, `useBusinessDays` → `days`, `isWorkDay`, `isLastWorkDay`. The list never stays empty: disabling the last day is rejected and an empty stored value falls back to the defaults |
| `src/helpers/days-off.js` | `DAY_OFF_TYPES` (`sick`, `moving`, `marriage`, `unpaid`, `vacation`, `birthday`, `nationalHoliday`, `nonWorking`), `DAY_OFF_COLORS`, `normalizeDayOff` (`{ id, type, start, end, note }`, single-day when `end` is empty or equal, reversed ranges swapped), `validateDayOff`, `createDayOffId`, `dayOffCovers`, `dayOffDates` (Set of covered `YYYY-MM-DD`), `dayOffsInMonth` (overlap, oldest first), `upcomingDayOffs` (still running or starting after today, soonest first), `formatDuration` (months/weeks/days with the localized conjunction), `dayOffCalendarEvent` (`ZnCalendar` shape with the type color) |
| `src/composables/useDaysOff.js` | `daysOff` (settings mirror of `settings.daysOff`), `saveDayOff` (create/replace, id generated and preserved on edit), `removeDayOff`, `useDaysOff` → `entries`, `sorted`, `dates` (covered days), `events` (calendar-ready, **note as title**), `typeOptions`, `labelFor`, `titleFor` (note, falling back to the localized type) |
| `src/views/DaysOffPage.vue` | Month `ZnCalendar` with events (each labeled by the entry note, never by its type) + month/year navigation; the month shown comes from the calendar `cursor-change` event (never duplicated navigation) and drives the list of entries overlapping that month; below it, **Upcoming days** lists the entries still running or starting from today (independent of the shown month). Add (header), edit and delete actions |
| `src/components/DayOffItem.vue` | One row of both lists: type color marker, localized type and range, optional note, edit/delete icon buttons (emits `edit`/`delete`) |
| `src/components/DayOffDialog.vue` + `src/data/day-off-schema.js` | Create/edit dialog (type select, start date required, optional end date, note) through `ZnDataForm`; a new entry starts on the calendar's selected day |
| `src/composables/useExternalStatuses.js` | `externalStatuses` (settings mirror), `normalizeExternalStatus`, `validateExternalStatus`, `saveExternalStatus`, `removeExternalStatus`, `externalStatusLabel`; `useExternalStatuses` → localized `options`, `labelFor`, `optionsWithCurrent` |
| `src/data/external-status-schema.js` | `externalStatusFormSchema` for the external status dialog |
| `src/components/ExternalStatusDialog.vue` | create/edit dialog for one external status (value locked when editing) |

## Business rules

1. `name`, `externalId` and `addedAt` are required; the dialog validates before persisting and shows `errors.required` per field.
2. On create, `addedAt` is prefilled with the current local datetime and stays editable.
3. Search matches `name` and `externalId`, case- and diacritic-insensitive; the internal and external status filters accept `all` and combine with the search. The internal status is restricted to `active` | `inactive` (`TASK_STATUSES`); `normalizeTask` falls back to `active` for anything else. The external status stores the `value` of one configured external status and is independent from the internal one; the form, card and view resolve its label through `useExternalStatuses`. A value that is no longer configured is preserved and shown as written.
4. Sorting supports `name`, `taskDate`, `addedAt` and `asc`/`desc`; entries without a value always go last. Default: `addedAt desc`.
5. Delete asks for confirmation (`useDialogs().confirm`) and removes the row from Dexie and the store.
6. The collapsed card shows name, external id, internal status and external status; the name is an `<a target="_blank" rel="noopener noreferrer">` to the external app when `absoluteUrl(externalUrl)` resolves. The `Show details` toggle shares the status row (`.task-card__meta`) pushed right with `margin-left: auto`; expanding shows the remaining fields through `ZnDataView` plus an external-link button.
7. Data never leaves the device: no network calls for task data. Settings offers a JSON backup (v2) and a restore, both client-side and covering everything Dexie stores: `tasks`, `updates` and `reports`. Local ids are dropped; the linkage uses a per-file task `ref` (`externalId` when present, otherwise `task-<id>`), which updates carry and report items reference.
8. Import validates the file (`app: 'daily-task-report'`, `tasks` array; `updates`/`reports` optional for v1 files) and **merges tasks by external id** (case-insensitive): matching rows are updated with the imported values, otherwise they are added. Duplicated ids inside the file keep the last occurrence; entries without an external id are added. `backupRepository.importBackup` applies all three tables in one transaction: it resolves each `ref` to the resulting local id and reports `{added, updated, unchanged, updatesAdded, updatesSkipped, reportsAdded, reportsSkipped}`. Repeated imports are safe: updates are skipped when `taskId+createdAt+description` already exists and reports when `createdAt` plus their item contents match an existing one. Updates whose `ref` matches no task in the file or the DB are skipped; report items keep their `taskName` snapshot and get `taskId: null` when the case no longer exists.
9. Before merging, `TaskImportDialog` shows the task plan (`planMerge`) row by row plus the number of updates and reports; the confirm button stays enabled when any of the three would be restored.
10. "Delete all data" asks for confirmation
11. External statuses are configurable in Settings → External statuses: list, add, edit and delete entries `{ value, labels: { en, es } }`. `value` is an automatic, hidden unique id that never changes; only labels are shown. The English label is required; Spanish is optional and falls back to English (then to the id). With no configured statuses the task field is a disabled selector showing `tasks.noExternalStatuses`. Editing or deleting a status never rewrites existing tasks.
12. Every task can have a log of updates (`taskId`, `description`, `createdAt`). Both the Updates section and the expanded card show it newest first; each entry can be edited (task, description and date) and deleted from the section.
13. Deleting a task deletes its updates in the same Dexie transaction; reports are snapshots and survive. Deleting all data clears tasks, updates and reports. The stores mirror that cascade with `forgetTask` / `forgetAll`.
14. Home reports on the selected calendar day (`YYYY-MM-DD`, initially today): **Current work** = tasks with at least one update whose `createdAt` day matches; **Previous day** = the same for the nearest **business day** before it; **Pending** = `active` tasks that appear in neither list (no updates on either day). Business days are `settings.workDays` (JS day numbers, Monday–Friday by default) and are configured per weekday in Settings → Business days; `previousDateValue` skips weekends or any other unchecked day and also every date in `nonWorkingDates` (the configured non-working days), walking back up to 366 days so a long holiday stretch never falls through; with no business days and no non-working days it returns the plain calendar day. Lists are ordered by name; each entry shows only that day's updates, newest first. Days are compared on the `YYYY-MM-DD` prefix, so the report never mixes time zones. The three lists are collapsible sections: **Current work** and **Previous day** start expanded, **Pending** starts collapsed (each keeps its own state while the page is mounted). `DailyTaskList` emits `create-update(task)` and `edit-update(update)`; HomePage opens the shared `UpdateDialog` for both and writes through the updates store, so the three lists re-derive with no extra reload. When creating from a card, HomePage passes the task's newest update as `previousUpdate`, which `UpdateDialog` renders read-only (date + text) with **copy to clipboard** (`navigator.clipboard`, `execCommand` fallback, 2s “copied” state) and **use this text** (assigns `draft.description`, which the form picks up through its `modelValue` watch).
15. Home's **New report** action opens `ReportCreateDialog` with the selected day and `report.previousDate` (the nearest business day): `createReportDraft` turns the previous-day updates into **yesterday** and the selected day's updates into **today** item-by-item (`{ kind: 'update', taskId, updateId, taskName, description }`). The dialog edits descriptions, removes items and appends `{ kind: 'text' }` notes in any section; **finish** and **blockers** start empty. **Finish** also offers a case selector + **Add case**, which appends `{ kind: 'update', taskId, updateId: null, taskName }` with the task description as text: a reference that simulates an update that does not exist yet. Saving prunes empty plain notes (task references are kept even without text), requires at least one item, stamps `createdAt` with the save time and writes through `useReportsStore`. Reports are listed newest first in `/reports`, filtered inclusively by `from`/`to` `ZnDateInput` values (no calendar); when both filters are the same day, a notice links to the existing report. Only **export**, **copy** (new `createdAt`, same sections) and **delete** are available there. `/reports#report-<id>` scrolls to the matching card after loading, which is how Home's **Open report** action reaches it.

16. **Export** on a report card opens `ReportExportDialog` with the built-in template plus the user templates from Settings (`settings.reportTemplates`, `{ id, name, body }`). The preview re-renders on template change: each item becomes `* ` + text, updates resolve the task's `externalUrl` from `useTasksStore` (the report only snapshots `taskId`/`taskName`), and empty sections render as `No`. Actions copy the text or download `report-YYYY-MM-DD-HHmm.md`. The dialog reopens with the last template used on the device (`settings.lastReportTemplateId`) and saves each new selection.

17. **Non-working days** (`/days-off`) are an editable collection stored in `settings.daysOff`: `{ id, type, start, end, note }` with `start`/`end` as local `YYYY-MM-DD` and an inclusive `end`. `type` is one of `DAY_OFF_TYPES` (sick, moving, marriage, unpaid, vacation, birthday, nationalHoliday, nonWorking; unknown values fall back to `nonWorking`) and only the localized labels are shown (`daysOff.types.*`). An entry with an empty or equal `end` is a single day; a reversed range is swapped when normalized. The page shows a month `ZnCalendar` with the entries as events (one color per type) and lists the entries overlapping the shown month below it; the shown month follows the calendar's `cursor-change`, and its month/year selectors and arrows are the only navigation. A second **Upcoming days** list (`upcomingDayOffs`) shows everything from today onward whatever the month on screen, so the next absences are visible without navigating. The page subtitle announces the next one as a readable distance (`dayCountBetween` + `durationParts` + `daysOff.duration.*` plurals): months of 30 days first, then weeks of 7, then days, joined with the localized “and” (`96` → “3 months and 6 days”, `10` → “1 week and 3 days”); a running absence reads “today”, and with no upcoming entry the subtitle falls back to the month summary. Every covered day is marked on the Home calendar and skipped by **Previous day** (`buildDailyReport({ nonWorkingDates })` → `dayOffDates`). Like external statuses and templates, the collection is configuration stored in settings, not in Dexie (so it is outside the JSON backup).

## Settings shape

```js
settings.define({
  i18n: { useSystem: true, locale: null },
  theme: { preference: 'system' },   // system | light | dark
  entity: { names: { en: { singular, plural }, es: { singular, plural } } },
  externalStatuses: [],              // [{ value, labels: { en, es } }]
  workDays: [1, 2, 3, 4, 5],         // JS day numbers, 0 = Sunday
  daysOff: []                        // [{ id, type, start, end, note }]
})
```

`settings-core` is not reactive: `useAppLocale`, `useAppTheme` and `useEntityLabels` keep module-level refs/reactive mirrors and write through `settings`.

## Icons

`icon-profile.json` scans static names. Dynamic names and the reserved JS word must be declared in `manual`:

```json
["arrow_downward", "arrow_upward", "delete", "expand_less", "expand_more"]
```

After changing icon usage run `cd daily-task-report && npm run scan:icons && npm run generate:icons` and commit the profile + `public/icons/`. Static icons (`download`, `upload`, …) are scanned automatically.

## Tests

| Spec | Covers |
|---|---|
| `tasks.spec.js` | normalization, validation, drafts, filter, sort, URL, dates |
| `tasks-store.spec.js` | Pinia store (load, filters, sort, CRUD, errors) with a mocked repository |
| `backup.spec.js` | v2 export shape, task refs on updates and report items, round-trip, v1 files, invalid files, file name |
| `merge.spec.js` | new/update/unchanged plan, case-insensitive ids, duplicates, missing ids |
| `TaskImportDialog.spec.js` | summary, preview rows, disabled states, confirm/cancel |
| `TaskCard.spec.js` | collapsed/expanded content, external link, edit/delete events |
| `TaskDialog.spec.js` | create/edit mode, required-field errors, normalized payload, cancel |
| `router.spec.js` | route table and Home as the entry point |
| `dates.spec.js` | calendar-day distance and the months/weeks/days decomposition |
| `daily-report.spec.js` | previous-day maths (calendar, business days and non-working days), day grouping, current/previous/pending split, unknown tasks, empty date |
| `business-days.spec.js` | default Monday–Friday, normalization, per-day toggles, persistence, last-day guard |
| `days-off.spec.js` | day-off normalization (single day, swapped range, type fallback), validation, coverage, covered dates, month overlap, upcoming days, calendar event, CRUD persistence and localized labels |
| `DaysOffPage.spec.js` | month calendar with events, entries of the shown month only, upcoming section from today, empty states, add dialog |
| `updates.spec.js` | update DTO, draft, validation, newest-first sort and per-task filter |
| `updates-store.spec.js` | load/force reload, per-task getter, CRUD, cascade sync |
| `UpdateDialog.spec.js` | create/edit modes, required validation, normalized payload |
| `UpdatesPage.spec.js` | newest-first list, task names, edit dialog, empty state |
| `external-statuses.spec.js` | normalization, required/duplicate validation, CRUD persistence, localized labels and options |
| `reports.spec.js` | item/report normalization, draft seeding from updates, pruning, inclusive range filter, sort and duplication |
| `reports-store.spec.js` | load, create, copy, delete, errors and `forgetAll` with a mocked repository |
| `ReportsPage.spec.js` | four-section rendering, date filters, no-results state and copy |
| `ReportCreateDialog.spec.js` | seeded text, edited comments, added blocker note, empty validation and cancel |
| `report-export.spec.js` | update links, name/text fallbacks, empty sections, default-template expansion, unknown tokens, file name |

The Dexie repository needs IndexedDB, so it is exercised through the mocked store integration, not directly.

```bash
npm run test:daily-task-report
npm run build:daily-task-report
```
