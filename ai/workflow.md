# Workflow — commands, icons, PWA, CI

## Setup and dev

```bash
npm install                                  # resolves every workspace
npm run dev --workspace=kitchensink          # run an app
npm run dev --workspace=zound-box
npm run dev --workspace=@zn-apps/ui-core     # library watch build
```

Apps' `vitest.config.js` alias `@zn-apps/ui-core` to `shared/ui-core/src/index.js`, so tests run without building the library first.

## Tests

See [`testing.md`](./testing.md).

## Builds

| Command | Action |
|---|---|
| `npm run build:shared` | Builds `ui-core`, `settings-core`, `ui-about`, `pwa-integration`, `ui-data-*` |
| `npm run build:zound-box` | Builds `zound-box` → `zound-box/dist/` |
| `npm run build:kitchensink` | Builds `kitchensink` → `kitchensink/dist/` |
| `npm run build:all` / `build:production` | Clean `dist/`, copy landing + `sw.js`, build shared + apps, move to `dist/<app>/`, run `validate:pwa` |
| `npm run validate:pwa` | Checks generated manifests and 192/512 PNGs |
| `npm run build:icons` | `scan:icons` + `generate:icons` (run before committing new icon usage) |

Production order: shared → zound-box → kitchensink. CI runs `build:production`, which consumes the **versioned** sprites and never regenerates icons.

## Icon pipeline

```
source (.vue)  --scan:icons-->  icon-profile.json {scanned, manual}
              --generate:icons--> public/icons/sprite-<family>.svg
              --vite build--> dist/icons/...  (precached by Workbox)
```

- `npm run scan:icons` — scans `<ZnIcon name="...">` usages; keeps `manual`.
- `npm run generate:icons` — writes the five family sprites from `@material-design-icons/svg`.
- App chunks include the icons used by shared components (`ui-core`, `pwa-integration`).
- `ZnIcon` downloads a family sprite once and injects it into `#zn-icon-sprite-host`.
- Profiles/sprites are committed; production never generates them.

| Project | Profile | Output |
|---|---|---|
| `ui-core` | `shared` | library distribution (only its own icons) |
| `pwa-integration` | — | merged into each app (`download`, `system_update`) |
| `zound-box` | `app:zound-box` | `zound-box/public/icons/` |
| `kitchensink` | `app:kitchensink` | `kitchensink/public/icons/` (full catalog via `manual`) |

## PWA checklist for any app

1. `public/pwa-icon.svg` + `public/pwa-icon-192.png` + `public/pwa-icon-512.png` (art inside the maskable safe area ~80%).
2. `VitePWA({ registerType: 'prompt', manifest: { ... } })` with both PNGs declared exactly (`type: 'image/png'`, `purpose: 'any maskable'`, app-relative paths), valid `start_url`/`scope`/`display: 'standalone'`.
3. `theme_color` and `background_color` = `#FEF7FF`; `<meta name="theme-color" content="#FEF7FF">` in `index.html` (prevents the blue boot flash).
4. `src/main.js`: `initPwaInstallListener()`, `initPwaUpdateListener()`, `initPwaThemeSync()`.
5. `src/App.vue`: mount `ZnPwaInstallPrompt` and `ZnPwaUpdatePrompt` as **direct children of `ZnApp`** — never inside `ZnScreen` or a container with `transform`/`overflow`/`isolation` (they are `position: fixed`).
6. `vite.config.js`: alias `'@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js')`. The library build emits CSS separately; consuming `dist/` renders the popups unstyled and out of viewport.
7. i18n keys `install*`, `update*`, `pwa.*` in `en` and `es`.

Theme sync details: `initPwaThemeSync()` is idempotent, watches the `zn-theme-light`/`zn-theme-dark` classes on `<body>` plus `prefers-color-scheme`, and writes `<meta name="theme-color">` and the html/body background. Defaults: light `#FEF7FF`, dark `#141218` (match `--md-background`). Use `usePwaMeta()` only for one-off cases such as `syncWithScreenHeading()`; do not pin initial theme colors in `App.vue`.

Updates (`registerType: 'prompt'`): `utils/pwaUpdate.js` reports an already-waiting worker, polls every 30 min and on foreground (max once per 5 min), sends `SKIP_WAITING` and reloads on accept; dismissal is remembered in `sessionStorage` per version and cleared once up to date.

## i18n setup (new app)

`vue-i18n` with `en` + `es`; resolve the initial locale as `settings.i18n.locale` → `navigator.language` base → `en`; own `settings-core` namespace per app.

## CI/CD

`.github/workflows/deploy.yml`, on `push: main` → Node 24 + npm cache → `npm install` → `npm run test:run` → `npm run build:production` → inject `404.html` fallbacks → publish `dist/` to GitHub Pages `/zn-apps/`.
