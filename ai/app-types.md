# App archetypes & overrides

## Archetypes

| Archetype | Example | Router | Layout | State | Icons |
|---|---|---|---|---|---|
| Single-screen utility PWA | `zound-box` | ❌ | `ZnScreen` directly | `ref()`/`reactive()` in `App.vue` or local composables | scanned only |
| Multi-screen routed PWA | new apps from the kitchensink blueprint | ✅ `createWebHistory()` with `/zn-apps/<app>/` | `ZnMasterSlaveLayout` (`#master` nav + default `<router-view>`) | `ref()` or app-local Pinia (never cross-app) | scanned + explicit `manual` |
| Showroom / catalog | `kitchensink` | ✅ | `ZnMasterSlaveLayout` | local `ref()` | full catalog in `manual` (~2100 glyphs) |

Add `ZnTabs`/`ZnSection` for in-screen grouping; dialogs (`ZnDialog`, `useDialogs()`) for one-off flows.

## Decision matrix

| Criterion | Single-screen | Multi-screen | Showroom |
|---|---|---|---|
| `vue-router` | ❌ unnecessary | ✅ recommended | ✅ |
| `ZnMasterSlaveLayout` | ❌ | ✅ | ✅ |
| `settings-core` persistence | optional, own namespace | optional | optional |
| Vue I18n `en`/`es` | ✅ | ✅ | ✅ |
| `ui-about` panel | `ZnDialog` | `/about` route or dialog | `/about` route |
| PWA manifest + 192/512 PNGs | ✅ | ✅ | ✅ |

## Invariants (cannot be overridden)

1. One folder per app root with its own `package.json`, `vite.config.js` and `dist/`.
2. No shared state between apps.
3. Base URL `/zn-apps/<app-name>/`.
4. Every app wrapped in `<ZnApp>` (theme classes on `<body>`).
5. Do not break the shared `--md-*` tokens or Roboto typography.
6. Valid `pwa-icon-192.png` / `pwa-icon-512.png` with `any maskable` purpose.

## Allowed overrides

1. Omit `vue-router` (single-screen) or add it (multi-screen).
2. Local components that compose `Zn*` primitives with domain visuals (e.g. `SoundToggle.vue` grayscale/brightness filter over `ZnCard`).
3. Workbox cache options for domain assets (`.ogg`, `.jpg`, custom fonts).
4. Domain schema, DTOs, events and business rules inside the app (`src/data/`, `src/models/`).

## New app from the blueprint

1. Copy `kitchensink/` structure: `public/` (favicon, `pwa-icon.svg` + 2 PNGs), `src/{main.js,App.vue,views/}`, `index.html`, `package.json`, `vite.config.js`, `vitest.config.js`, `icon-profile.json`, plus `ai/` and `doc/{en,es}/`.
2. Dependencies: `@zn-apps/ui-core`, optionally `@zn-apps/ui-about`, `ui-data-*`, `pwa-integration`, `settings-core`, `vue`, `vue-router`.
3. `vite.config.js`: `base: '/zn-apps/<app>/'`, `VitePWA` with manifest + icons, `changelogPlugin({ root: __dirname })`, source aliases for `pwa-integration`.
4. `src/main.js`: i18n, settings namespace, PWA listeners + theme sync.
5. Register the workspace in the root `package.json`, add icon scan/generate targets, add it to `build:production`, and keep `validate:pwa` covering it.
6. Verify with `npm run test:<app>` and `npm run build:<app>`; full suite/build for release-level verification.
