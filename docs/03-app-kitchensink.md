# Kitsinksink (Blueprint for New Apps)

This document describes the **kitchensink** application, which acts as the blueprint for new apps and as the icon catalog.

## 1. Overview

- **Name**: `kitchensink`
- **Role**: Documentação de componentes e **catálogo completo de ícones**.
- **Stack**: Vue 3 + Vite + Vue Router + `vite-plugin-pwa`.
- **Dependencies**:
  - `@zn-apps/ui-core` (`@zn-apps/ui-core`: `"*"`)
  - `@zn-apps/ui-about` (`@zn-apps/ui-about`: `"*"`)
  - `vue` (`^3.5.34`)
  - `vue-router` (`^4.6.4`)
- **DevDependencies**:
  - `@vitejs/plugin-vue` (`^5.0.0`)
  - `vite` (`^5.0.0`)
  - `vite-plugin-pwa` (`^0.20.0`)

## 2. Architecture

Kitchensink is an autonomous SPA. It consumes **only** `shared/ui-core` and never shares Pinia state with other apps.

- The UI is composed of `ZnApp` (theme wrapper), `ZnMasterSlaveLayout` (responsive navigation), `ZnScreen` (screen structure), `ZnSection` (grouped content) and the concrete components (`ZnButton`, `ZnCard`, `ZnSwitch`, `ZnDialog`, `ZnIcon`, `ZnBox`, `ZnRow`, `ZnAbout`).
- The dialogs page demonstrates the native `ZnDialog` base and the `useDialogs()` alert, confirmation, and prompt helpers.
- Icons are not bundled as static PNG/SVG files. The app references them through `ZnIcon`, which loads a `<symbol>` from the **generated per-project sprite** in `public/icons/` (copied to `dist/icons/`).
- The app ships its own `icon-profile.json`. Its `manual` array declares the **full Material Design catalog** (that is what makes kitchensink the developer icon library); `scanned` holds the icons the pages actually use.

## 3. Icon pipeline

```
node shared/ui-core/scripts/generate-icons.mjs --profile app:kitchensink
```

The script:

1. Reads `kitchensink/icon-profile.json` and unions `scanned` + `manual` (2122 names).
2. Adds the names from `shared/ui-core/icon-profile.json` (icons used by the library components).
3. Loads every family (`filled`, `outlined`, `round`, `sharp`, `two-tone`) from `@material-design-icons/svg`.
4. Filters each family to the declared names and writes one sprite per family to `kitchensink/public/icons/` (and `dist/icons/` when it exists):

   ```
   public/icons/
   ├── sprite-filled.svg      ← filled family sprite
   ├── sprite-outlined.svg
   ├── sprite-round.svg
   ├── sprite-sharp.svg
   └── sprite-two-tone.svg
   ```

Each file contains only `<symbol id="zn-icon-<familia>-<nombre>" viewBox="…">` elements — no names module is needed; `ZnIcon` derives the available names from the injected sprite.

`ZnIcon` calls `loadIconFamily(family)` the first time an icon of a family appears. That function fetches `<BASE_URL>icons/sprite-<familia>.svg`, injects it **once** into `#zn-icon-sprite-host`, and reuses it for every `<use href="#zn-icon-filled-…">` reference.

## 4. Running the icon pipeline

```bash
# 1) Scan the app for ZnIcon usages and refresh icon-profile.json
npm run scan:icons

# 2) Generate the app-specific chunk into public/icons/
npm run generate:icons

# 3) Build the app (public/icons/ is copied to dist/icons/)
npm run build
```

The dev server and production build use the versioned sprites in `public/icons/`
without regenerating them. Before committing icon changes, regenerate and review
the profile and sprites from the repository root:

```bash
npm run build:icons
npm run build:production
```

## 5. File layout

| Path | Purpose |
|---|---|
| `kitchensink/src/App.vue` | Root component, theme toggle, layout shell |
| `kitchensink/src/main.js` | App bootstrap + router |
| `kitchensink/src/router/index.js` | Vue Router definition |
| `kitchensink/src/views/*.vue` | All feature pages |
| `scripts/scan-icons.mjs` (repo root) | Scans `<ZnIcon>` tags and updates the project's `icon-profile.json` |
| `kitchensink/vite.config.js` | Vite + PWA config (alias to the shared library source) |
| `kitchensink/icon-profile.json` | `scanned` icons + `manual` full catalog |
| `kitchensink/public/icons/` | Generated sprite chunk (gitignored, copied to `dist/icons/`) |

## 6. Testing

Run the unit tests with Vitest:

```bash
npm run test:run
```

Tests live in `kitchensink/src/__tests__/`. The shared setup (`vitest.setup.js`) mocks `window.matchMedia` and `IntersectionObserver`, which are used by `ZnApp` and `ZnScreen`.

## 7. Deployment

The app is a standard Vite SPA. The production build outputs to `dist/`, and `vite-plugin-pwa` generates the service worker (`sw.js`) that is responsible for precaching. When deployed to a subpath (e.g. `/zn-apps/kitchensink/`), set `base` accordingly in `vite.config.js`.

## 8. Legacy templates to ignore

