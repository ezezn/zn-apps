# zn-apps — user documentation

> Monorepo of independent **Progressive Web Apps** built with **Vue 3**, **Vite** and **Material Design 3**, orchestrated with **npm workspaces** and deployed to **GitHub Pages** at `/zn-apps/`.

**Español:** [Leer esta documentación en español](../es/README.md).

This folder is the human entry point. Each app and library keeps its own user manual under its `doc/` folder.

## Contents

| Guide | Description |
|---|---|
| [Getting started](./getting-started.md) | Requirements, install, local development, tests, builds, deployment |
| [Architecture](./architecture.md) | Stack, repository layout, isolation principles, dependencies |
| [App types](./app-types.md) | Archetypes, decision matrix, overridable vs. invariant rules |
| [Conventions](./conventions.md) | Design system, icons, PWA, i18n, data fields, versioning, documentation policy |

## Projects

### Applications

| Project | Folder | Description | Deploy path | Manual |
|---|---|---|---|---|
| **Zound Box** | `zound-box/` | Ambient audio mixer PWA (background soundscapes + rhythmic shh) | `/zn-apps/zound-box/` | [EN](../../zound-box/doc/en/README.md) · [ES](../../zound-box/doc/es/README.md) |
| **Kitchensink** | `kitchensink/` | Component showroom, full icon catalog and blueprint for new apps | `/zn-apps/kitchensink/` | [EN](../../kitchensink/doc/en/README.md) · [ES](../../kitchensink/doc/es/README.md) |
| **Daily Task Report** | `daily-task-report/` | Local task tracker with configurable entity naming (Dexie + Pinia) | `/zn-apps/daily-task-report/` | [EN](../../daily-task-report/doc/en/README.md) · [ES](../../daily-task-report/doc/es/README.md) |
| **Landing portal** | `index.html` | Static launcher for every PWA | `/zn-apps/` | — |

### Shared libraries (`shared/`)

| Library | Description | Manual |
|---|---|---|
| `@zn-apps/ui-core` | MD3 design system: components, tokens, composables, icon chunks | [EN](../../shared/ui-core/doc/en/README.md) · [ES](../../shared/ui-core/doc/es/README.md) |
| `@zn-apps/settings-core` | Deep JSON settings document with localStorage persistence | [EN](../../shared/settings-core/doc/en/README.md) · [ES](../../shared/settings-core/doc/es/README.md) |
| `@zn-apps/ui-about` | Standard "About" panel built on `ui-core` | [EN](../../shared/ui-about/doc/en/README.md) · [ES](../../shared/ui-about/doc/es/README.md) |
| `@zn-apps/pwa-integration` | PWA state, system color scheme, system bars, install/update popups | [EN](../../shared/pwa-integration/doc/en/README.md) · [ES](../../shared/pwa-integration/doc/es/README.md) |
| `@zn-apps/ui-data-core` | Schema contract, nested JSON helpers, defaults, value formatting | [EN](../../shared/ui-data-core/doc/en/README.md) · [ES](../../shared/ui-data-core/doc/es/README.md) |
| `@zn-apps/ui-data-form` | Schema-driven forms with draft/live binding and actions | [EN](../../shared/ui-data-form/doc/en/README.md) · [ES](../../shared/ui-data-form/doc/es/README.md) |
| `@zn-apps/ui-data-view` | Read-only presentation of the same schema | [EN](../../shared/ui-data-view/doc/en/README.md) · [ES](../../shared/ui-data-view/doc/es/README.md) |
| `@zn-apps/ui-data-editor` | View-like presentation with per-field dialog editing | [EN](../../shared/ui-data-editor/doc/en/README.md) · [ES](../../shared/ui-data-editor/doc/es/README.md) |
| `@zn-apps/ui-data-grid` | Paginated MD3 data table with filters, sorting and cell editing | [EN](../../shared/ui-data-grid/doc/en/README.md) · [ES](../../shared/ui-data-grid/doc/es/README.md) |
| `@zn-apps/ui-data-richtext` | Markdown-backed rich text editor and view | [EN](../../shared/ui-data-richtext/doc/en/README.md) · [ES](../../shared/ui-data-richtext/doc/es/README.md) |
| `@zn-apps/ui-calendar` | MD3 calendars: month/week/day views, single or range selection, events | [EN](../../shared/ui-calendar/doc/en/README.md) · [ES](../../shared/ui-calendar/doc/es/README.md) |

## Documentation layout

```
doc/{en,es}/           ← this guide (architecture, workflow, conventions)
<project>/doc/{en,es}/ ← user manual of each app or library
ai/                    ← compact English context for AI agents
<project>/ai/          ← per-project agent context
```

The `ai/` trees are internal reference material for coding agents; everything a human needs is under `doc/`.
