# Daily Task Report — user manual

PWA to keep a local list of the tasks reported from an external work system: search, filter, sort, create, edit and delete them, offline and installable.

- Folder: `daily-task-report/` · Deploy path: `/zn-apps/daily-task-report/`
- Spanish: [Leer en español](../es/README.md)

## What it does

- **Master-slave layout**: the navigation panel on the left and the active page on the right. The main entry (the task list) sits at the top and the secondary options (Settings, About) are pinned to the bottom of the panel. On mobile the page takes the screen and the hamburger in its header opens the navigation in a drawer.
- **Home** (the entry point): a calendar that opens in the **week view** (switchable to the month view) where a click selects a single day, starting on today. Below it, three lists for the selected day: **Current work** (tasks with an update recorded that day), **Previous day** (tasks with an update recorded on the nearest business day before) and **Pending** (active tasks with no update on either day). Each list is collapsible: Current work and Previous day start open and Pending starts closed. Every card has actions: create a new update for that task, and edit any of the updates shown in it. Creating from a card opens the update dialog with the task's **last update** as a read-only reference (date, time and text) and two buttons: copy the text to the clipboard or use it as the starting text of the new update. The header's **New report** button turns those lists into a report draft. Below the calendar, a banner tells whether the selected date already has a report: in **success** color with an **Open report** action when it exists, in **warning** color with “Report not created yet.” when the selected date is today and no report exists, and informational for any other date without a report. The banner can be dismissed and comes back when the date or the report changes.
- **Task list** built with cards: the collapsed card shows the name, external ID, internal status and the status in the external app. The name is a link that opens the task in the external app in a new tab (when the task has an external link), and the “Show details” control sits on the same row as the status labels, aligned to the right. Expanding the card shows the description, dates and a button to open the external link.
- **Updates log**: every task can accumulate updates — what changed and the date and time it was set. The **Updates** section lists them all, newest first, with edit and delete actions; the expanded task card shows that task's updates, also newest first, each with its edit action.
- **Reports**: immutable documents with four sections — **What I did yesterday**, **What I am working on today**, **What I could finish today** and **Blockers**. Each section holds update references (task name + editable text) or plain notes. They are created only from Home, named by their creation date and time, and in the **Reports** section you can filter them by a day or a date range using two date fields, copy one into a new document or delete one.
- **Filters** at the top: search by name or external ID, and filter by internal or external status.
- **Sorting** by name, task date or added date, ascending or descending.
- **Create/edit dialog** with every field of the entity; **delete** with confirmation.
- **Settings**: language, color scheme, business days, the entity naming and the external statuses explained below.
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
| External status | no | One of the values configured in Settings → External statuses; the label follows the app language |

## Usage

1. **Create**: use the button in the page header. The required fields are validated before saving.
2. **Edit**: the pencil icon on the card opens the same dialog with the current values.
3. **Delete**: the trash icon asks for confirmation, then removes the entry permanently.
4. **Inspect**: the “Show details” control (right end of the status row) expands the rest of the information without leaving the list. The task name opens the external link in a new tab.
5. **Filter and sort**: the search box and the selectors keep their state while you navigate the app. The external status selector only appears once at least one status is configured.
6. **Record an update**: open **Updates** in the navigation, choose the task, describe what changed and confirm the date and time (prefilled with the current moment). Edit any entry from the section or from the task card; delete it from the section.
7. **Read the history**: expand a task card to see its updates from the most recent to the oldest.
8. **Read the day**: open **Home**, switch between the week and month views and click a day. The three lists update at once, each showing the updates of the day it covers; the pending list shows the active tasks that were not updated on the selected day or the business day before.
9. **Create a report**: on **Home**, select the day and use **New report** in the header. The draft already contains yesterday's updates under **What I did yesterday** and the selected day's updates under **What I am working on today**. Review or extend every text, remove the lines you do not need, add notes (for example under **Blockers** or **What I could finish today**) and confirm. The report is saved with the current date and time as its name.
10. **Review reports**: open **Reports**, filter by a single day (fill only *From* or *To*) or by a range, and use the copy action to create a new document with the current date and time. To discard one, use the delete action and confirm.

## Reports

A report is a snapshot: later changes to a task or its updates do not modify an existing report. Each line can be:

- **An update of a task**: it keeps a reference to the task and the source update, and its text starts as the update's description. You can rewrite or extend it before saving.
- **A note**: free text, added from the **Add note** button of any section.

While creating a report, **What I could finish today** also offers a **Related case** selector and an **Add case** button. It creates a task reference without an existing update: the text starts from the task description and you can rewrite it as the comment of that case.

The four sections are fixed and always shown in the same order. Empty sections appear as “No items.” The page header shows how many reports match the current date filter and the total; the filters are inclusive and the two fields can be used together or separately. When **From** and **To** select the same day and a report exists for it, a notice above the list says so and links directly to that report card. Reports cannot be created from that page, only exported, copied or deleted.

### Exporting a report

Every report card has an **Export** action. It opens a dialog where you pick a template and see the generated markdown in a live preview, then **Copy text** (clipboard) or **Download .md**. The built-in template renders the four sections with one bullet per item: an update of a task becomes `[Task name](external link) -> comment` (the name alone when the task has no link), and a plain note becomes just its comment. A section without items becomes `No`.

The template text is editable in **Settings → Report export templates**. The section placeholders are the names `yesterday`, `today`, `finish` and `blockers` written between braces; each one is replaced with that section's bullets. You can keep the default template and add as many of your own as you need. The export dialog remembers the last template you used on this device and starts with it next time.

## Settings

| Section | Options |
|---|---|
| Language | Follow the system language, or force English/Spanish |
| Color scheme | Follow the system, or force light/dark |
| Business days | The weekdays that count as working days, Monday to Friday by default |
| Report export templates | Markdown templates offered by the Export dialog; the default one is always available |
| Entity naming | Singular and plural in English and Spanish; the preview shows the active language |
| External statuses | List, add, edit and delete the possible values of the external status field |
| Data | Export a JSON backup of tasks, updates and reports, merge one back, or delete all local data |

The **Business days** switches decide which days the report treats as working days. **Previous day** always looks back to the nearest business day before the selected date, so a Monday compares against Friday (and every day of a long weekend against the last working day). At least one day must stay on.

Clearing the singular/plural field restores that language's default (`Task/Tasks`, `Tarea/Tareas`).

Each external status has a **label in English**, which is required, and a **label in Spanish**, which is optional: when empty, the English label is used. The app generates a hidden identifier for each status, so in Settings and on the cards you only see the labels. With no statuses configured, the field in the task dialog is disabled and points to this section. Deleting a status leaves the tasks that already use it untouched.

## Backup

The **Data** section of Settings has three actions:

- **Export JSON** downloads `daily-task-report-YYYY-MM-DD.json` with **everything** stored locally: the tasks, their updates and the reports (no internal ids). Each task carries a `ref` and the updates and report items point to it, so the links survive the export.
- **Import JSON** reads a file created by this app and opens a review window before changing anything. It shows how many tasks will be added, updated or left unchanged, how many updates and reports the file contains, and lists the tasks with their state. On confirm, tasks **merge by external ID** (imported values win), then the updates are attached to the matching task and the reports are restored as documents. Entries already present are skipped, so importing the same file twice does not duplicate the log or the reports. Older files that only contain tasks are still accepted.
- **Delete all data** asks for confirmation with the number of local entries and then removes the tasks, their updates and every report permanently.

Import and deletion are atomic: they run in a single database transaction, reject files from other apps or with an invalid structure, and keep the current data untouched if you cancel the review window. Cancelling the confirmation leaves everything as it was.

## Data and privacy

- Tasks are stored in **IndexedDB** (Dexie) in the browser of the device, never in `localStorage` and never sent anywhere.
- Settings (language, theme, business days, naming and external statuses) are stored separately with `settings-core`.
- Clearing the site data of the app deletes the tasks, their updates and the reports, so export a backup first if you want to keep the tasks.

## Project structure

```
src/main.js                  bootstrap: Pinia, router, i18n, PWA listeners
src/App.vue                  master-slave shell, navigation, PWA popups
src/router/index.js          / (Home), /tasks, /updates, /reports, /settings, /about
src/views/HomePage.vue       calendar (week/month, single day) and the daily report lists
src/components/DailyTaskList.vue one Home list: title, count, entries, empty state and collapse toggle
src/helpers/daily-report.js  current / previous / pending split for a date (business-day aware)
src/composables/useBusinessDays.js  configured working weekdays
src/views/TasksPage.vue      filters, sorting, list and dialog orchestration
src/views/UpdatesPage.vue    change log: newest first, edit and delete
src/views/ReportsPage.vue    report documents: date-range filter, export, copy and delete
src/views/SettingsPage.vue   language, theme, business days, entity naming and external statuses
src/views/AboutPage.vue      ZnAbout panel
src/components/TaskCard.vue  collapsible card with edit/delete actions
src/components/TaskDialog.vue create/edit dialog (ZnDataForm)
src/components/UpdateDialog.vue create/edit dialog for an update
src/components/ReportCreateDialog.vue Home dialog that drafts a report from the day lists
src/components/ExternalStatusDialog.vue create/edit dialog for an external status
src/stores/tasks.js          Pinia store for the task list
src/stores/updates.js        Pinia store for the change log
src/stores/reports.js        Pinia store for the reports
src/db/                      Dexie database, tasks, updates and reports repositories
src/helpers/                 DTO, validation, filtering, sorting, reports and dates
src/composables/             locale, theme, entity names and external statuses
src/data/task-schema.js      ui-data schemas for form and view
```

## Development

```bash
npm run dev --workspace=daily-task-report
npm run test:daily-task-report
npm run build:daily-task-report
```
