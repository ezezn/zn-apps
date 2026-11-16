# Architecture

## What this repo is

Monorepo of independent Vue 3 + Vite PWAs sharing a Material Design 3 design system, deployed to GitHub Pages under `/zn-apps/`.

```
zn-apps/
├── index.html, sw.js            # landing portal + its service worker
├── package.json                 # npm workspaces + orchestration scripts
├── vitest.config.js             # Vitest projects (root orchestration)
├── ai/                          # AI context (this folder)
├── doc/{en,es}/                 # user docs: architecture & guidelines
├── shared/                      # isolated libraries (own package.json / vite.config / vitest.config)
│   ├── ui-core/                 # design system, tokens, Zn* components, icons
│   ├── settings-core/           # deep JSON settings proxy (no Vue, no DOM)
│   ├── ui-about/                # ZnAbout, metadata helpers (composes ui-core)
│   ├── pwa-integration/         # PWA state, theme sync, install/update popups
│   ├── ui-data-core/            # schema contract + JSON helpers (no Vue)
│   ├── ui-data-form/            # schema-driven form (ZnDataForm)
│   ├── ui-data-view/            # read-only presentation (ZnDataView)
│   ├── ui-data-editor/          # view + per-field dialog editing (ZnDataEditor)
│   └── ui-data-richtext/        # Markdown-backed rich text editor/view
├── zound-box/                   # product PWA (single screen, no router)
└── kitchensink/                 # showroom, icon catalog, blueprint for new apps
```

Each project also holds `ai/` (agent context, English) and `doc/{en,es}/` (user docs, bilingual).

## Stack

| Layer | Tech |
|---|---|
| UI | Vue 3.5, Composition API, `<script setup>` |
| Build | Vite 6, per-project config |
| Packages | npm workspaces (Node ≥ 20, recommended 24) |
| Design system | Material Design 3 tokens (`--md-*`) + `Zn*` components |
| PWA | `vite-plugin-pwa` (one manifest + service worker per app) |
| Tests | Vitest + `@vue/test-utils` + happy-dom, modular `projects` config |
| Routing | `vue-router` 4, only for multi-screen apps |
| Fonts | Roboto 400/500 via `@fontsource/roboto` (shipped by `ui-core`) |
| i18n | `vue-i18n`, `en` + `es` in every app |
| CI/CD | GitHub Actions → GitHub Pages on push to `main` |

## Non-negotiable principles

1. **App independence** — own `package.json`, `vite.config.js`, `index.html`, service worker, deployed at `/zn-apps/<app>/`. Never share state (Pinia or other) across apps.
2. **Isolated libraries** — each `shared/*` builds as an ES module on its own. Libraries do not import each other except the explicit composition edges: `ui-about → ui-core`, `ui-data-form/view/editor → ui-core + ui-data-core`, `ui-data-editor → ui-data-form + ui-data-view`, `ui-data-richtext → ui-core`. Apps compose libraries; libraries never import apps.
3. **MD3 is centralized** — tokens and theme switching live only in `ui-core`. Theme toggling happens exclusively through `<ZnApp mode="light|dark|system">`, which writes `zn-theme-light`/`zn-theme-dark` on `<body>`.
4. **Icon chunks are generated, never bundled whole** — each project declares `icon-profile.json` (`scanned` + `manual`); `ZnIcon` lazily fetches `<BASE_URL>icons/sprite-<family>.svg`.
5. **i18n everywhere** — every app ships `en` and `es` messages. Initial locale: `settings.i18n.locale` → base of `navigator.language` → `en`. Each app uses its own `settings-core` namespace.
6. **Verification is scoped** — narrowest useful test/build for the change; full suite + `build:all` for cross-project or release-level work. Markdown-only changes: no tests, no builds. CI always runs the full suite and production build.

## ui-data field contract

The `ui-data-*` family shares one schema and one JSON `value`, so an app can switch between form, view and editor without transforming data.

- Any capability added to a field (prop, state, variant, size, adornment, layout, `span`, chips) must land in **form + view + editor** in the same change.
- A new `FieldTypes` value requires: declaration/formatting in `ui-data-core`, input in `ZnDataField`, read-only rendering in `ZnDataViewField`, and verification of the `ZnDataEditorField` dialog (trigger = view, dialog = form).
- Layout: `field.span` (1..section columns) applies in all three renderers.
- Every new type/feature needs a Kitchensink demo covering form, view and editor.

Details: [`../shared/ui-data-core/ai/README.md`](../shared/ui-data-core/ai/README.md).

## Where decisions live

| Decision | Recorded in |
|---|---|
| Global architecture / contracts | `ai/architecture.md` (this file) + `doc/{en,es}/architecture.md` |
| App archetype and overrides | `ai/app-types.md` + `<app>/ai/README.md` |
| Library API and behavior | `<library>/ai/README.md` |
| User-facing behavior and usage | `<project>/doc/{en,es}/README.md` |

## Related

- [`../shared/ui-core/ai/README.md`](../shared/ui-core/ai/README.md) — components, tokens, icons.
- [`workflow.md`](./workflow.md) — commands, PWA checklist, CI.
- [`app-types.md`](./app-types.md) — archetypes and override matrix.
