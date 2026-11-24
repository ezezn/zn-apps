# Kitchensink — user manual

Component showroom, full Material icon catalog and the blueprint for new apps in the monorepo.

- Folder: `kitchensink/` · Deploy path: `/zn-apps/kitchensink/`
- Spanish: [Leer en español](../es/README.md)

## What you will find

1. **Showroom** — an interactive page for every component of `ui-core`, `ui-data-*`, `ui-calendar`, `ui-about`, `settings-core` and `pwa-integration`, with all MD3 variants and sizes.
2. **Icon catalog** — every Material Design glyph in the five families (`filled`, `outlined`, `round`, `sharp`, `two-tone`).
3. **Blueprint** — the reference structure to start a new multi-screen app.

## Routes

| Group | Routes |
|---|---|
| Layout & navigation | `/tabs`, `/navigation-layout`, `/layout`, `/sections`, `/screen` |
| Controls | `/buttons`, `/cards`, `/switches`, `/dialogs` |
| Inputs | `/inputs` plus `/inputs/text`, `multiline`, `email`, `phone`, `number`, `date`, `time`, `datetime`, `select`, `chip`, `range`, `date-range`, `time-range`, `datetime-range` |
| Data | `/data/core`, `/data/form`, `/data/view`, `/data/editor`, `/data/grid`, `/data/richtext`, `/data/charts`, `/data/charts-data`, `/data/dashlets`, `/data/dashlets-data` |
| Calendars | `/calendar/month`, `/calendar/range`, `/calendar/week`, `/calendar/day` |
| Resources | `/icons`, `/legacy` |
| Libraries | `/about`, `/settings`, `/pwa/color-scheme`, `/pwa/bar-styling`, `/pwa/install` |

`/` redirects to `/buttons`.

## Architecture

| Aspect | Implementation |
|---|---|
| Router | `vue-router` with `createWebHistory()`; every demo is deep-linkable |
| Layout | `ZnMasterSlaveLayout`: grouped navigation on the left, demo on the right; on mobile the demo keeps the focus and the hamburger opens the navigation drawer |
| Icon profile | `manual` declares the full catalog (~2100 glyphs) so all icons are browsable |
| Data demos | one schema and one value shared by form, view and editor (`src/data/data-demo.js`); the data grid demo covers standalone and separated filter/pagination layouts |
| Chart demos | `/data/charts` is the `ui-data-charts` gallery (live toggles plus the `ZnChartShape` miniatures) and `/data/charts-data` prints the exact `data` and `config` objects of every example (`src/data/charts-demo.js`) |
| Dashlet demos | `/data/dashlets` is the `ui-data-dashlet` gallery of counter and summary cards with live variants, and `/data/dashlets-data` prints the exact `data` and `config` objects of every example (`src/data/dashlets-demo.js`) |
| i18n | shell, navigation, theme and install popup are translated; static strings inside demo pages are being migrated |

## Icon catalog

`icon-profile.json` combines scanned icons with the full `manual` list; the script generates five sprite files in `public/icons/` that `ZnIcon` loads per family on demand.

```bash
npm run scan:icons
npm run generate:icons
```

## Blueprint for new apps

1. **Structure**: `public/` (`favicon.svg`, `pwa-icon.svg`, `pwa-icon-192.png`, `pwa-icon-512.png`), `src/{main.js,App.vue,views/}`, `index.html`, `package.json`, `vite.config.js`, `vitest.config.js`, `icon-profile.json`, and the `ai/` + `doc/{en,es}/` folders.
2. **Dependencies**: `@zn-apps/ui-core` (plus `ui-about`, `pwa-integration`, `settings-core`, `ui-data-*` as needed), `vue` and `vue-router` for multi-screen apps.
3. **Vite**: `base: '/zn-apps/<app>/'`, `VitePWA` with manifest, both PNG icons (`any maskable`), `theme_color`/`background_color` `#FEF7FF`, `changelogPlugin`, and the `@zn-apps/pwa-integration` source alias.
4. **main.js**: i18n (`en`/`es`), own settings namespace, `initPwaInstallListener()`, `initPwaUpdateListener()`, `initPwaThemeSync()`.
5. **App.vue**: `<ZnApp>` wrapping the layout, with `ZnPwaInstallPrompt` and `ZnPwaUpdatePrompt` as direct children.
6. **Register** the app in the root `package.json` workspaces, icon scripts and `build:production`.
7. **Verify** with `npm run test:<app>` and `npm run build:<app>`.

## Development

```bash
npm run dev --workspace=kitchensink
npm run test:kitchensink
npm run build:kitchensink
```
