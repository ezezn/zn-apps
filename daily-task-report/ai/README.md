# Daily Task Report — AI context

Local PWA to track the tasks reported from an external work system, with editable cards in a master-slave layout.
Location: `daily-task-report/`, base `/zn-apps/daily-task-report/`.

## Architecture decisions

| Decision | Implementation | Reason |
|---|---|---|
| Router | `createRouter` + `createWebHistory(import.meta.env.BASE_URL)` | `/` is the Home page (`home`); `/tasks`, `/updates`, `/settings`, `/about` under the deploy subpath; any unknown path (including the PWA `start_url` `index.html`) redirects to `/` |
| Layout | `ZnMasterSlaveLayout` with `#master` nav + default `<router-view>` | master-slave shell, same as Kitchensink. `/` is the Home page and the entry point, so mobile starts **content-first**: the page keeps the focus and the hamburger opens the nav drawer (provided by ui-core). `main.js` mounts after `router.isReady()`, otherwise the first mobile frame would focus an empty slot. The `#master` nav separates the main `/`, `/tasks` and `/updates` entries from the secondary `/settings` and `/about` links, which are pushed to the bottom of the panel with `margin-top: auto` (ui-core stretches the `nav` to fill the visible drawer) |
| Page state | Pinia (`src/stores/tasks.js`) | filters/sort/CRUD state lives per page, never cross-app |
| Persistence | Dexie (IndexedDB, db `daily-task-report`, table `tasks`) | local-only user data; settings must **not** hold task data |
| Settings | `settings-core`, namespace `daily-task-report` | locale, theme preference and entity naming |
| Data UI | `ZnDataForm` (create/edit dialog) + `ZnDataView` (expanded card) | one schema per presentation, shared Task DTO |
| i18n | Vue I18n `en`/`es`; locale from `settings.i18n.locale` → system → `en` | every user-facing string |

## Routes (`src/router/index.js`)

| Path | Name | View |
|---|---|---|
| `/` | `home` | `HomePage.vue` (calendar + daily report) |
| `/tasks` | `tasks` | `TasksPage.vue` |
| `/updates` | `updates` | `UpdatesPage.vue` (full change log) |
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

## Data flow

```
Dexie db  →  tasksRepository (src/db/)  →  useTasksStore (Pinia)  →  TasksPage
              │                               │                        ├── TaskCard (ZnCard + ZnDataView + updates)
              │                               │                        ├── TaskDialog
              │                               │                        └── UpdateDialog
              │                               └── helpers (filter/sort/validate/normalize)
              └──  updatesRepository  →  useUpdatesStore  →  UpdatesPage / TaskCard
                                              └── helpers/updates.js (normalize/validate/sort)
```

`HomePage` reuses both stores and derives its three lists with `helpers/daily-report.js` (pure function, no repository calls), so navigating between Home, Tasks and Updates keeps a single in-memory copy of each collection.

| File | Role |
|---|---|
| `src/db/database.js` | `new Dexie('daily-task-report')`, v1 stores `tasks: '++id, externalId, name, status, taskDate, addedAt'`; v2 `upgrade()` maps legacy statuses to `active`/`inactive`; v3 adds `updates: '++id, taskId, createdAt'`; evolve with a new `version(n).upgrade()` |
| `src/db/tasksRepository.js` | `list`, `create`, `update`, `remove`, `mergeAll`, `clearAll`; normalizes the DTO; `remove`/`clearAll` also delete the task's updates in the same transaction |
| `src/db/updatesRepository.js` | `list`, `listByTask`, `create`, `update`, `remove`, `removeByTask`, `clearAll`; normalizes the update DTO |
| `src/stores/updates.js` | `updates`, `loaded`, `loading`, `saving`, `error`, `sortedUpdates`, `total`, `isEmpty`, load/CRUD, `forTask(taskId)`, `forgetTask`, `forgetAll` (memory-only sync after a cascade) |
| `src/helpers/updates.js` | `normalizeUpdate`, `createUpdateDraft`, `validateUpdate`, `sortUpdatesDesc`, `updatesForTask` |
| `src/data/update-schema.js` | `updateFormSchema` for `ZnDataForm` (task select, datetime, description) |
| `src/components/UpdateDialog.vue` | create/edit dialog shared by the Updates page and the expanded card |
| `src/views/UpdatesPage.vue` | full change log newest first, with task name, edit and delete |
| `src/views/HomePage.vue` | Entry point: `ZnCalendar` (week by default, month on demand, single selection that starts on today) + the three report lists; loads both stores on mount |
| `src/components/DailyTaskList.vue` | One Home list: title, count, empty state and `{ task, updates }` entries with the day's updates (newest first); `collapsible` + `expanded` drive the header toggle (`aria-expanded`/`aria-controls`) |
| `src/helpers/daily-report.js` | `buildDailyReport({ tasks, updates, date })` → `{ current, previous, pending }`, `previousDateValue`, `updateDateValue` |
| `src/stores/tasks.js` | `tasks`, `loaded`, `loading`, `saving`, `error` (i18n key suffix), `filters`, `visibleTasks`, `total`, `shown`, `isEmpty`, `hasActiveFilters`, CRUD, `resetFilters`, `setSortBy`, `toggleDirection` |
| `src/helpers/tasks.js` | `TASK_STATUSES`, `normalizeTask`, `createTaskDraft`, `validateTask`, `filterTasks`, `sortTasks`, `absoluteUrl` |
| `src/helpers/dates.js` | local `date`/`datetime-local` values, parsing and display formatting |
| `src/helpers/backup.js` | `buildBackup`, `serializeBackup`, `parseBackup`, `backupFileName` for the JSON backup |
| `src/helpers/merge.js` | `taskKey` (external id, case-insensitive) and `planMerge` → `entries[{task,status:'new'|'update'|'unchanged',existingId?}]` + counts |
| `src/components/TaskImportDialog.vue` | import review window: merge summary, state per row, confirm/cancel |
| `src/data/task-schema.js` | `taskFormSchema` (dialog), `taskViewSchema` (expanded card), `statusOptions` |
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
7. Data never leaves the device: no network calls for task data. Settings offers a JSON backup (`export`) and a `restore`, both client-side. The backup still covers tasks only; extending it to updates needs a merge key (task external id + createdAt) — do it as a single change in `helpers/backup.js` + `planMerge`.
8. Import validates the file (`app: 'daily-task-report'`, `tasks` array) and **merges by external id** (case-insensitive): matching rows are updated with the imported values, otherwise they are added. Duplicated ids inside the file keep the last occurrence; entries without an external id are added. The repository applies it in one Dexie transaction (`mergeAll`) and reports `{added, updated, unchanged}`.
9. Before merging, `TaskImportDialog` shows the plan (`planMerge`) row by row and the confirm button stays disabled when nothing would change.
10. "Delete all data" asks for confirmation
11. External statuses are configurable in Settings → External statuses: list, add, edit and delete entries `{ value, labels: { en, es } }`. `value` is an automatic, hidden unique id that never changes; only labels are shown. The English label is required; Spanish is optional and falls back to English (then to the id). With no configured statuses the task field is a disabled selector showing `tasks.noExternalStatuses`. Editing or deleting a status never rewrites existing tasks.
12. Every task can have a log of updates (`taskId`, `description`, `createdAt`). Both the Updates section and the expanded card show it newest first; each entry can be edited (task, description and date) and deleted from the section.
13. Deleting a task deletes its updates in the same Dexie transaction; deleting all data clears both tables. The store mirrors that cascade with `forgetTask` / `forgetAll`.
14. Home reports on the selected calendar day (`YYYY-MM-DD`, initially today): **Current work** = tasks with at least one update whose `createdAt` day matches; **Previous day** = the same for the day before; **Pending** = `active` tasks that appear in neither list (no updates on either day). Lists are ordered by name; each entry shows only that day's updates, newest first. Days are compared on the `YYYY-MM-DD` prefix, so the report never mixes time zones. The three lists are collapsible sections: **Current work** and **Previous day** start expanded, **Pending** starts collapsed (each keeps its own state while the page is mounted). `DailyTaskList` emits `create-update(task)` and `edit-update(update)`; HomePage opens the shared `UpdateDialog` for both and writes through the updates store, so the three lists re-derive with no extra reload. When creating from a card, HomePage passes the task's newest update as `previousUpdate`, which `UpdateDialog` renders read-only (date + text) with **copy to clipboard** (`navigator.clipboard`, `execCommand` fallback, 2s “copied” state) and **use this text** (assigns `draft.description`, which the form picks up through its `modelValue` watch).

## Settings shape

```js
settings.define({
  i18n: { useSystem: true, locale: null },
  theme: { preference: 'system' },   // system | light | dark
  entity: { names: { en: { singular, plural }, es: { singular, plural } } },
  externalStatuses: []               // [{ value, labels: { en, es } }]
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
| `backup.spec.js` | export shape, round-trip, invalid files, file name |
| `merge.spec.js` | new/update/unchanged plan, case-insensitive ids, duplicates, missing ids |
| `TaskImportDialog.spec.js` | summary, preview rows, disabled states, confirm/cancel |
| `TaskCard.spec.js` | collapsed/expanded content, external link, edit/delete events |
| `TaskDialog.spec.js` | create/edit mode, required-field errors, normalized payload, cancel |
| `router.spec.js` | route table and Home as the entry point |
| `daily-report.spec.js` | previous-day maths, day grouping, current/previous/pending split, unknown tasks, empty date |
| `updates.spec.js` | update DTO, draft, validation, newest-first sort and per-task filter |
| `updates-store.spec.js` | load/force reload, per-task getter, CRUD, cascade sync |
| `UpdateDialog.spec.js` | create/edit modes, required validation, normalized payload |
| `UpdatesPage.spec.js` | newest-first list, task names, edit dialog, empty state |
| `external-statuses.spec.js` | normalization, required/duplicate validation, CRUD persistence, localized labels and options |

The Dexie repository needs IndexedDB, so it is exercised through the mocked store integration, not directly.

```bash
npm run test:daily-task-report
npm run build:daily-task-report
```
