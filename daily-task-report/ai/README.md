# Daily Task Report — AI context

Local PWA to track the tasks reported from an external work system, with editable cards in a master-slave layout.
Location: `daily-task-report/`, base `/zn-apps/daily-task-report/`.

## Architecture decisions

| Decision | Implementation | Reason |
|---|---|---|
| Router | `createRouter` + `createWebHistory(import.meta.env.BASE_URL)` | `/tasks`, `/settings`, `/about` under the deploy subpath; `/` and any unknown path (including the PWA `start_url` `index.html`) redirect to `/tasks` |
| Layout | `ZnMasterSlaveLayout` with `#master` nav + default `<router-view>` | master-slave shell, same as Kitchensink. `/` redirects to `/tasks`, so mobile starts **content-first**: the page keeps the focus and the hamburger opens the nav drawer (provided by ui-core). `main.js` mounts after `router.isReady()`, otherwise the first mobile frame would focus an empty slot. The `#master` nav separates the main `/tasks` entry from the secondary `/settings` and `/about` links, which are pushed to the bottom of the panel with `margin-top: auto` (ui-core stretches the `nav` to fill the visible drawer) |
| Page state | Pinia (`src/stores/tasks.js`) | filters/sort/CRUD state lives per page, never cross-app |
| Persistence | Dexie (IndexedDB, db `daily-task-report`, table `tasks`) | local-only user data; settings must **not** hold task data |
| Settings | `settings-core`, namespace `daily-task-report` | locale, theme preference and entity naming |
| Data UI | `ZnDataForm` (create/edit dialog) + `ZnDataView` (expanded card) | one schema per presentation, shared Task DTO |
| i18n | Vue I18n `en`/`es`; locale from `settings.i18n.locale` → system → `en` | every user-facing string |

## Routes (`src/router/index.js`)

| Path | Name | View |
|---|---|---|
| `/` | — | redirects to `/tasks` |
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
  externalStatus: string // free text read from the external app
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
| `src/stores/tasks.js` | `tasks`, `loaded`, `loading`, `saving`, `error` (i18n key suffix), `filters`, `visibleTasks`, `total`, `shown`, `isEmpty`, `hasActiveFilters`, CRUD, `resetFilters`, `setSortBy`, `toggleDirection` |
| `src/helpers/tasks.js` | `TASK_STATUSES`, `normalizeTask`, `createTaskDraft`, `validateTask`, `filterTasks`, `sortTasks`, `absoluteUrl` |
| `src/helpers/dates.js` | local `date`/`datetime-local` values, parsing and display formatting |
| `src/helpers/backup.js` | `buildBackup`, `serializeBackup`, `parseBackup`, `backupFileName` for the JSON backup |
| `src/helpers/merge.js` | `taskKey` (external id, case-insensitive) and `planMerge` → `entries[{task,status:'new'|'update'|'unchanged',existingId?}]` + counts |
| `src/components/TaskImportDialog.vue` | import review window: merge summary, state per row, confirm/cancel |
| `src/data/task-schema.js` | `taskFormSchema` (dialog), `taskViewSchema` (expanded card), `statusOptions` |

## Business rules

1. `name`, `externalId` and `addedAt` are required; the dialog validates before persisting and shows `errors.required` per field.
2. On create, `addedAt` is prefilled with the current local datetime and stays editable.
3. Search matches `name` and `externalId`, case- and diacritic-insensitive; the status filter accepts `all`. The internal status is restricted to `active` | `inactive` (`TASK_STATUSES`); `normalizeTask` falls back to `active` for anything else. The external status is free text and independent.
4. Sorting supports `name`, `taskDate`, `addedAt` and `asc`/`desc`; entries without a value always go last. Default: `addedAt desc`.
5. Delete asks for confirmation (`useDialogs().confirm`) and removes the row from Dexie and the store.
6. The collapsed card shows name, external id, internal status and external status; the name is an `<a target="_blank" rel="noopener noreferrer">` to the external app when `absoluteUrl(externalUrl)` resolves. The `Show details` toggle shares the status row (`.task-card__meta`) pushed right with `margin-left: auto`; expanding shows the remaining fields through `ZnDataView` plus an external-link button.
7. Data never leaves the device: no network calls for task data. Settings offers a JSON backup (`export`) and a `restore`, both client-side. The backup still covers tasks only; extending it to updates needs a merge key (task external id + createdAt) — do it as a single change in `helpers/backup.js` + `planMerge`.
8. Import validates the file (`app: 'daily-task-report'`, `tasks` array) and **merges by external id** (case-insensitive): matching rows are updated with the imported values, otherwise they are added. Duplicated ids inside the file keep the last occurrence; entries without an external id are added. The repository applies it in one Dexie transaction (`mergeAll`) and reports `{added, updated, unchanged}`.
9. Before merging, `TaskImportDialog` shows the plan (`planMerge`) row by row and the confirm button stays disabled when nothing would change.
10. "Delete all data" asks for confirmation
11. External statuses can be configured in Settings (Manage, Add, Edit, Delete). When no statuses are configured, the field shows 'No external statuses configured'. Imported values are validated against the configured list., then clears the table (`tasksRepository.clearAll`).
12. Every task can have a log of updates (`taskId`, `description`, `createdAt`). Both the Updates section and the expanded card show it newest first; each entry can be edited (task, description and date) and deleted from the section.
13. Deleting a task deletes its updates in the same Dexie transaction; deleting all data clears both tables. The store mirrors that cascade with `forgetTask` / `forgetAll`.

## Settings shape

```js
settings.define({
  i18n: { useSystem: true, locale: null },
  theme: { preference: 'system' },   // system | light | dark
  entity: { names: { en: { singular, plural }, es: { singular, plural } } }
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
| `router.spec.js` | route table |
| `updates.spec.js` | update DTO, draft, validation, newest-first sort and per-task filter |
| `updates-store.spec.js` | load/force reload, per-task getter, CRUD, cascade sync |
| `UpdateDialog.spec.js` | create/edit modes, required validation, normalized payload |
| `UpdatesPage.spec.js` | newest-first list, task names, edit dialog, empty state |

The Dexie repository needs IndexedDB, so it is exercised through the mocked store integration, not directly.

```bash
npm run test:daily-task-report
npm run build:daily-task-report
```
