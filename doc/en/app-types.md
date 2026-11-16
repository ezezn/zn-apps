# App types and overrides

To keep consistency and avoid over-engineering, every application fits one archetype.

## Archetypes

### 1. Single-screen utility PWA
Example: `zound-box`.
- Purpose: one focused task (player, timer, converter, calculator).
- **No `vue-router`**: the whole experience lives in one screen or modal.
- **Local state** with `ref()`/`reactive()` in the orchestrating `App.vue` or local composables; no Pinia.
- Composed with MD3 primitives: `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`.
- Dialogs (`ZnDialog`, `useDialogs()`) for settings or "About".

### 2. Multi-screen routed PWA
Example: apps derived from the `kitchensink` blueprint.
- Purpose: multiple views, dashboards, step flows, URL-addressable sections.
- `vue-router` with `createWebHistory()` and base `/zn-apps/<app>/`.
- `ZnMasterSlaveLayout`: side navigation (`#master`) + content (`default`) on desktop; collapsing navigation with automatic back button on mobile.
- State: Composition API or app-local Pinia, **strictly inside the app**.
- Deep linking: every view has its own URL.

### 3. Showroom / catalog PWA
Example: `kitchensink`.
- Demonstrates components, catalogs resources (icons, tokens) and doubles as a live template.
- Full icon catalog declared in `manual` (~2100 glyphs).
- A demo page for every component variant and composable.

## Decision matrix

| Criterion | Single-screen | Multi-screen | Showroom |
|---|---|---|---|
| `vue-router` | ❌ | ✅ | ✅ |
| `ZnMasterSlaveLayout` | ❌ (`ZnScreen` directly) | ✅ recommended | ✅ |
| State | local `ref()` | local `ref()` or app-local Pinia | local `ref()` |
| `settings-core` persistence | optional, own namespace | optional, own namespace | optional |
| i18n `en`/`es` | ✅ | ✅ | ✅ |
| `icon-profile.json` | `scanned` only | `scanned` + specific `manual` | full catalog in `manual` |
| About panel | inside `ZnDialog` | `/about` route or dialog | `/about` route |
| PWA manifest + 192/512 PNGs | ✅ | ✅ | ✅ |

## Invariants (cannot be overridden)

1. One folder per app with its own `package.json`, `vite.config.js` and `dist/`.
2. No shared state between applications.
3. Base URL `/zn-apps/<app-name>/`.
4. Every app wrapped in `<ZnApp>` for MD3 theme synchronization.
5. Shared `--md-*` tokens and Roboto typography stay intact.
6. Valid `pwa-icon-192.png` and `pwa-icon-512.png` with `any maskable` purpose.

## Allowed overrides

1. **Router presence** — omit it for single-screen apps, add it for multi-view apps.
2. **Domain components** — create local components that compose `Zn*` primitives with specific visuals (e.g. `SoundToggle.vue` grayscale/brightness filter over `ZnCard`).
3. **PWA cache strategy** — tune Workbox options for domain assets (`.ogg`, `.jpg`, custom fonts).
4. **Data domain** — each app defines its schemas, DTOs, event contracts and business rules in `src/data/` or `src/models/`.

## Creating a new app

Use `kitchensink/` as the blueprint: structure, `VitePWA` manifest, icon profile, PWA listeners and popups, i18n, `ai/` and `doc/{en,es}/` folders. Steps are detailed in the [Kitchensink manual](../../kitchensink/doc/en/README.md#blueprint-for-new-apps).

## Related

- [Conventions](./conventions.md) — PWA checklist, icons, i18n, field contract.
- [Zound Box manual](../../zound-box/doc/en/README.md) — single-screen reference.
- [Kitchensink manual](../../kitchensink/doc/en/README.md) — multi-screen reference.
