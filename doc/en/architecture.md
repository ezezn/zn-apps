# Architecture

## Overview

`zn-apps` is a monorepo of independent Vue 3 PWAs sharing one Material Design 3 design system. Each app is an autonomous SPA with its own manifest, service worker, dependencies and deployment subpath; the `shared/` folder holds isolated libraries that apps compose.

## Stack

| Layer | Technology |
|---|---|
| UI framework | Vue 3.5, Composition API, `<script setup>` |
| Build tool | Vite 6, one config per project |
| Packages | npm workspaces (Node ≥ 20) |
| Design system | Material Design 3 tokens (`--md-*`) + `Zn*` components |
| PWA | `vite-plugin-pwa` (manifest + service worker per app) |
| Testing | Vitest + `@vue/test-utils` + happy-dom, modular `projects` config |
| Routing | `vue-router` 4, only for multi-screen apps |
| Typography | Roboto 400/500 (`@fontsource/roboto`, shipped by `ui-core`) |
| i18n | `vue-i18n`, English and Spanish in every app |
| CI/CD | GitHub Actions → GitHub Pages |

## Repository layout

```
zn-apps/
├── index.html, sw.js            landing portal and its service worker
├── package.json                 workspaces + orchestration scripts
├── vitest.config.js             central Vitest projects
├── doc/{en,es}/                 this documentation
├── ai/                          AI agent context
├── shared/                      isolated libraries
│   ├── ui-core/                 design system, tokens, components, icons
│   ├── settings-core/           deep settings proxy
│   ├── ui-about/                About panel (composes ui-core)
│   ├── pwa-integration/         PWA state, theme sync, install/update popups
│   ├── ui-data-core/            schema contract + JSON helpers
│   ├── ui-data-form/            schema-driven form
│   ├── ui-data-view/            read-only presentation
│   ├── ui-data-editor/          view + per-field dialog editing
│   └── ui-data-richtext/        Markdown-backed rich text
├── zound-box/                   product PWA (single screen)
├── daily-task-report/           product PWA (master-slave, Pinia + Dexie)
└── kitchensink/                 showroom, icon catalog, blueprint
```

Every project also holds `ai/` (agent context) and `doc/{en,es}/` (user manual).

## Principles

### 1. Applications are fully independent
Each app owns `package.json`, `vite.config.js`, `index.html`, service worker and `dist/`. **Never share state between apps** (no cross-app Pinia). Deployment subpaths are `/zn-apps/<app>/`.

### 2. Shared libraries are isolated
Each `shared/*` library has its own manifest, Vite library build and tests. Libraries do not import each other except explicit composition edges: `ui-about → ui-core`, the `ui-data-*` family over `ui-core` and `ui-data-core`, `ui-data-editor → ui-data-form + ui-data-view`, `ui-data-richtext → ui-core`. Infrastructure libraries (`settings-core`, `ui-data-core`) depend on neither Vue nor the DOM.

### 3. Material Design 3, centralized
Tokens live in `shared/ui-core/src/assets/css/global.css`. Theme switching happens only through `<ZnApp mode="light|dark|system">`, which applies `zn-theme-light`/`zn-theme-dark` to `<body>`.

### 4. Generated icon chunks
Icons come from per-project SVG sprites built from `icon-profile.json`; `ZnIcon` loads one family sprite on demand. The full glyph collection is never shipped.

### 5. Internationalization
Every app ships `en` and `es` messages. Initial locale: `settings.i18n.locale` → base language of `navigator.language` (`es-MX` → `es`) → `en`. Own `settings-core` namespace per app.

### 6. Shared data-field contract
`ui-data-form`, `ui-data-view` and `ui-data-editor` share one schema and one JSON value. Any field capability must exist in all three renderers in the same change; a new field type requires an implementation in `ZnDataField`, `ZnDataViewField` and the editor dialog.

### 7. Scoped verification
Verify with the narrowest useful command for the change; full suite and `build:all` are for cross-project or release-level work. Markdown-only changes skip tests and builds. CI keeps full validation.

## Related

- [Getting started](./getting-started.md) · [App types](./app-types.md) · [Conventions](./conventions.md)
- [ui-core manual](../../shared/ui-core/doc/en/README.md) · [ui-data-core manual](../../shared/ui-data-core/doc/en/README.md)
