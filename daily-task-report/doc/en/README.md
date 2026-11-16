# Daily Task Report — user manual

PWA to keep a local list of the tasks reported from an external work system: search, filter, sort, create, edit and delete them, offline and installable.

- Folder: `daily-task-report/` · Deploy path: `/zn-apps/daily-task-report/`
- Spanish: [Leer en español](../es/README.md)

## What it does

- **Master-slave layout**: the navigation panel on the left (on mobile, a first screen) and the active page on the right.
- **Task list** built with cards: the collapsed card shows the name, external ID, internal status and the status in the external app. Expanding it shows the description, dates and a button to open the external link.
- **Filters** at the top: search by name or external ID, and filter by internal status.
- **Sorting** by name, task date or added date, ascending or descending.
- **Create/edit dialog** with every field of the entity; **delete** with confirmation.
- **Settings**: language, color scheme and the entity naming explained below.
- **About** panel with version, credits and changelog.

All data stays in the browser (IndexedDB). There is no account, server or sync.

## The entity

The code calls the entities **Tasks**. In Settings you can rename how they are shown, in English and Spanish, singular and plural. That keeps the public repository free of work-specific vocabulary while the interface speaks the team's language.

| Field | Required | Notes |
|---|---|---|
| External ID | yes | Identifier in the external system |
| Name | yes | Main title of the card |
| Description | no | Free text, shown when the card expands |
| Task date | no | Date the task belongs to in the external system |
| Added date | yes | Prefilled with the current date and time when creating; editable |
| External link | no | `https://` is added when the scheme is missing |
| Internal status | yes | Active or Inactive (default: Active) |
| External status | no | Status label copied from the external app. Configurable in Settings → Data → External statuses |

## Usage

1. **Create**: use the button in the page header. The required fields are validated before saving.
2. **Edit**: the pencil icon on the card opens the same dialog with the current values.
3. **Delete**: the trash icon asks for confirmation, then removes the entry permanently.
4. **Inspect**: the “Show details” control expands the rest of the information without leaving the list.
5. **Filter and sort**: the search box and the two selectors keep their state while you navigate the app.

## Settings

| Section | Options |
|---|---|
| Language | Follow the system language, or force English/Spanish |
| Color scheme | Follow the system, or force light/dark |
| Entity naming | Singular and plural in English and Spanish; the preview shows the active language |
| Data | Export a JSON backup, merge one back by external ID, configure external statuses, or delete all local data |

Clearing the singular/plural field restores that language's default (`Task/Tasks`, `Tarea/Tareas`).

## Backup

The **Data** section of Settings has three actions:

- **Export JSON** downloads `daily-task-report-YYYY-MM-DD.json` with every task and its fields (no internal ids).
- **Import JSON** reads a file created by this app and opens a review window before changing anything. It shows how many entries will be added, updated or left unchanged and lists the data with its state. On confirm, the import **merges by external ID**: an entry with the same external ID updates the existing one (imported values win), and the rest are added as new.
- **Delete all data** asks for confirmation with the number of local entries and then removes them permanently.

Import and deletion are atomic: they run in a single database transaction, reject files from other apps or with an invalid structure, and keep the current data untouched if you cancel the review window. Cancelling the confirmation leaves everything as it was.

## Data and privacy

- Tasks are stored in **IndexedDB** (Dexie) in the browser of the device, never in `localStorage` and never sent anywhere.
- Settings (language, theme, naming) are stored separately with `settings-core`.
- Clearing the site data of the app deletes the tasks, so export a backup first if you want to keep them.

## Project structure

```
src/main.js                  bootstrap: Pinia, router, i18n, PWA listeners
src/App.vue                  master-slave shell, navigation, PWA popups
src/router/index.js          /tasks, /settings, /about
src/views/TasksPage.vue      filters, sorting, list and dialog orchestration
src/views/SettingsPage.vue   language, theme and entity naming
src/views/AboutPage.vue      ZnAbout panel
src/components/TaskCard.vue  collapsible card with edit/delete actions
src/components/TaskDialog.vue create/edit dialog (ZnDataForm)
src/stores/tasks.js          Pinia store for the page
src/db/                      Dexie database and tasks repository
src/helpers/                 DTO, validation, filtering, sorting and dates
src/data/task-schema.js      ui-data schemas for form and view
```

## Development

```bash
npm run dev --workspace=daily-task-report
npm run test:daily-task-report
npm run build:daily-task-report
```
