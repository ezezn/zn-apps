# AI context — zn-apps

Compact, English-only documentation for AI agents. **Load only what the task needs.**

- Global rules and architecture: this folder (`ai/`).
- Project detail: `<project>/ai/README.md` — load a project file **only** when the change touches that project.
- Human documentation (EN + ES): `doc/` and `<project>/doc/{en,es}/README.md`. Never duplicate user docs into `ai/`.

## Task routing

| Task | Read |
|---|---|
| Understand the monorepo, isolation rules, MD3, i18n, icon pipeline | [`architecture.md`](./architecture.md) |
| Run, build, test, deploy, add icons, configure PWA | [`workflow.md`](./workflow.md) |
| Plan a new app or pick an app archetype / override | [`app-types.md`](./app-types.md) |
| Write or fix tests | [`testing.md`](./testing.md) |
| Bump versions or write a CHANGELOG | [`versioning.md`](./versioning.md) |
| Update documentation after a change | [`docs-maintenance.md`](./docs-maintenance.md) |
| Add/change a `Zn*` component, token, composable | [`architecture.md`](./architecture.md) + [`../shared/ui-core/ai/README.md`](../shared/ui-core/ai/README.md) |
| Anything in the `ui-data-*` family or a field type | [`../shared/ui-data-core/ai/README.md`](../shared/ui-data-core/ai/README.md) + the touched library |
| Settings persistence | [`../shared/settings-core/ai/README.md`](../shared/settings-core/ai/README.md) |
| PWA popups, system bars, theme sync | [`../shared/pwa-integration/ai/README.md`](../shared/pwa-integration/ai/README.md) |
| About panel / changelog UI | [`../shared/ui-about/ai/README.md`](../shared/ui-about/ai/README.md) |
| Calendars, date/range selection, calendar events | [`../shared/ui-calendar/ai/README.md`](../shared/ui-calendar/ai/README.md) |
| Work in Zound Box | [`../zound-box/ai/README.md`](../zound-box/ai/README.md) |
| Work in Daily Task Report (Pinia + Dexie, entity naming) | [`../daily-task-report/ai/README.md`](../daily-task-report/ai/README.md) |
| Work in Kitchensink, or copy it as a blueprint | [`../kitchensink/ai/README.md`](../kitchensink/ai/README.md) |

## Hard rules (apply to every task)

1. Vue 3 `<script setup>` only. Shared components live in `shared/ui-core/src/components/` with the `Zn` prefix and consume `--md-*` tokens.
2. Apps are autonomous PWAs: own `package.json`, `vite.config.js`, service worker, base `/zn-apps/<app>/`. Never share Pinia state across apps.
3. Shared libraries build independently (`vite build --lib`) and must not import each other; only apps compose them (`ui-about` → `ui-core` and `ui-calendar` → `ui-core` are the allowed edges; `ui-data-editor` reuses form/view renderers).
4. Field parity is mandatory: a feature on a field must exist in form, view and editor in the same change.
5. Verify with the narrowest useful command. Full suite/build only for cross-project or release-level changes. Documentation-only changes: no tests, no builds.
6. After adding a feature or making a decision, update the docs that changed — see [`docs-maintenance.md`](./docs-maintenance.md).

## Project index

| Project | AI context | User docs |
|---|---|---|
| `@zn-apps/ui-core` (`shared/ui-core/`) | [ai/README.md](../shared/ui-core/ai/README.md) | [EN](../shared/ui-core/doc/en/README.md) · [ES](../shared/ui-core/doc/es/README.md) |
| `@zn-apps/settings-core` (`shared/settings-core/`) | [ai/README.md](../shared/settings-core/ai/README.md) | [EN](../shared/settings-core/doc/en/README.md) · [ES](../shared/settings-core/doc/es/README.md) |
| `@zn-apps/ui-about` (`shared/ui-about/`) | [ai/README.md](../shared/ui-about/ai/README.md) | [EN](../shared/ui-about/doc/en/README.md) · [ES](../shared/ui-about/doc/es/README.md) |
| `@zn-apps/pwa-integration` (`shared/pwa-integration/`) | [ai/README.md](../shared/pwa-integration/ai/README.md) | [EN](../shared/pwa-integration/doc/en/README.md) · [ES](../shared/pwa-integration/doc/es/README.md) |
| `@zn-apps/ui-data-core` (`shared/ui-data-core/`) | [ai/README.md](../shared/ui-data-core/ai/README.md) | [EN](../shared/ui-data-core/doc/en/README.md) · [ES](../shared/ui-data-core/doc/es/README.md) |
| `@zn-apps/ui-data-form` (`shared/ui-data-form/`) | [ai/README.md](../shared/ui-data-form/ai/README.md) | [EN](../shared/ui-data-form/doc/en/README.md) · [ES](../shared/ui-data-form/doc/es/README.md) |
| `@zn-apps/ui-data-view` (`shared/ui-data-view/`) | [ai/README.md](../shared/ui-data-view/ai/README.md) | [EN](../shared/ui-data-view/doc/en/README.md) · [ES](../shared/ui-data-view/doc/es/README.md) |
| `@zn-apps/ui-data-editor` (`shared/ui-data-editor/`) | [ai/README.md](../shared/ui-data-editor/ai/README.md) | [EN](../shared/ui-data-editor/doc/en/README.md) · [ES](../shared/ui-data-editor/doc/es/README.md) |
| `@zn-apps/ui-data-richtext` (`shared/ui-data-richtext/`) | [ai/README.md](../shared/ui-data-richtext/ai/README.md) | [EN](../shared/ui-data-richtext/doc/en/README.md) · [ES](../shared/ui-data-richtext/doc/es/README.md) |
| `@zn-apps/ui-calendar` (`shared/ui-calendar/`) | [ai/README.md](../shared/ui-calendar/ai/README.md) | [EN](../shared/ui-calendar/doc/en/README.md) · [ES](../shared/ui-calendar/doc/es/README.md) |
| Zound Box (`zound-box/`) | [ai/README.md](../zound-box/ai/README.md) | [EN](../zound-box/doc/en/README.md) · [ES](../zound-box/doc/es/README.md) |
| Kitchensink (`kitchensink/`) | [ai/README.md](../kitchensink/ai/README.md) | [EN](../kitchensink/doc/en/README.md) · [ES](../kitchensink/doc/es/README.md) |
| Daily Task Report (`daily-task-report/`) | [ai/README.md](../daily-task-report/ai/README.md) | [EN](../daily-task-report/doc/en/README.md) · [ES](../daily-task-report/doc/es/README.md) |
