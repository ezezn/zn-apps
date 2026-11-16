# Kitchensink — AI context

Three roles: component showroom, full Material icon catalog, and the canonical blueprint for new apps.
Location: `kitchensink/`, base `/zn-apps/kitchensink/`.

## Architecture

| Aspect | Implementation |
|---|---|
| Router | `createRouter` + `createWebHistory()`; each demo has its own URL (deep link) |
| Layout | `ZnMasterSlaveLayout`: `#master` = grouped nav (`src/data/nav-groups.js`), default = `<router-view>` |
| Icon profile | `manual` holds the full catalog (~2122 names) so every glyph is browsable |
| About | `ZnAbout` on `/about` with `package.json` metadata |
| Settings | `createSettings` demo on `/settings` |
| Data | `/data/*` share one schema/value across form, view and editor (`src/data/data-demo.js`) |
| i18n | shell/nav/theme/install popup translated; static strings inside demo views are still Spanish and must be migrated (remove this note once done) |

## Routes (`src/router/index.js`)

- ui-core: `/buttons`, `/cards`, `/switches`, `/inputs` (+ `/inputs/text`, `multiline`, `email`, `phone`, `number`, `date`, `time`, `datetime`, `select`, `chip`, `range`, `date-range`, `time-range`, `datetime-range`), `/dialogs`, `/tabs`, `/layout`, `/sections`, `/screen`, `/navigation-layout`, `/icons`, `/legacy`
- ui-data: `/data/core`, `/data/form`, `/data/view`, `/data/editor`, `/data/richtext`
- ui-about: `/about`; settings-core: `/settings`; pwa-integration: `/pwa/color-scheme`, `/pwa/bar-styling`, `/pwa/install`
- `/` redirects to `/buttons`

Adding a demo requires: a view under `src/views/`, a `routes` entry, a `navGroups` item (with `nav.*` i18n key in `src/i18n.js` `en`/`es` and the map in `App.vue`), and an entry in `src/data/demo-views.js` when `DemoView` is used.

## DTOs

```ts
interface DemoViewSection { title: string; content: string }
interface DemoView { key: string; title: string; subtitle: string; sections: DemoViewSection[] } // src/data/demo-views.js
interface IconProfile { scanned: string[]; manual: string[] } // icon-profile.json
```

## Icon pipeline here

`icon-profile.json` (`scanned` + `manual` ≈ 2122) + icons used by shared libraries → five family sprites in `public/icons/` (`filled`, `outlined`, `round`, `sharp`, `two-tone`) → `ZnIcon` loads a family on demand via `loadIconFamily()`.

```bash
npm run scan:icons
npm run generate:icons
```

## Blueprint for a new app

1. Layout: `public/` (`favicon.svg`, `pwa-icon.svg`, `pwa-icon-192.png`, `pwa-icon-512.png`), `src/{main.js,App.vue,views/}`, `index.html`, `package.json`, `vite.config.js`, `vitest.config.js`, `icon-profile.json` (`{"scanned":[],"manual":[]}`), plus `ai/README.md` and `doc/{en,es}/README.md`.
2. `package.json`: `@zn-apps/ui-core`, optionally `@zn-apps/ui-about` / `pwa-integration` / `settings-core` / `ui-data-*`, `vue`, and `vue-router` for multi-screen.
3. `vite.config.js`: `base: '/zn-apps/<app>/'`, `VitePWA({ registerType: 'prompt', manifest: {...} })` with both PNGs (`any maskable`), `changelogPlugin({ root: __dirname })`, alias `@zn-apps/pwa-integration` to its source.
4. `src/main.js`: i18n (`en`/`es`), own settings namespace, `initPwaInstallListener()`, `initPwaUpdateListener()`, `initPwaThemeSync()`.
5. `src/App.vue`: `<ZnApp>` wrapping `ZnMasterSlaveLayout`/`ZnScreen`, with both PWA popups as direct children of `ZnApp`.
6. Register the workspace in the root `package.json`, add icon scan/generate targets, add the build to `build:production` (see [`../../ai/app-types.md`](../../ai/app-types.md)).
7. Verify with `npm run test:<app>` and `npm run build:<app>`.

## Tests

`src/__tests__/router.spec.js` (route/nav integrity) → `npm run test:kitchensink`.
