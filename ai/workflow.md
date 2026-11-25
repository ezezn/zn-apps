# Workflow — commands, icons, PWA, CI

## Setup and dev

```bash
npm install                                  # resolves every workspace
npm run dev --workspace=kitchensink          # run an app
npm run dev --workspace=daily-task-report
npm run dev --workspace=zound-box
npm run dev --workspace=@zn-apps/ui-core     # library watch build
```

Apps' `vitest.config.js` alias `@zn-apps/ui-core` to `shared/ui-core/src/index.js`, so tests run without building the library first.

## Tests

See [`testing.md`](./testing.md).

## Builds

| Command | Action |
|---|---|
| `npm run build:shared` | Builds `ui-core`, `settings-core`, `ui-about`, `pwa-integration`, `ui-data-*`, `ui-calendar`, `ui-data-charts` |
| `npm run build:zound-box` | Builds `zound-box` → `zound-box/dist/` |
| `npm run build:kitchensink` | Builds `kitchensink` → `kitchensink/dist/` |
| `npm run build:daily-task-report` | Builds `daily-task-report` → `daily-task-report/dist/` |
| `npm run build:all` / `build:production` | Clean `dist/`, copy landing + `sw.js`, build shared + apps, move to `dist/<app>/`, run `validate:pwa` |
| `npm run build:changed` | Selective build: only workspaces touched by `BASE_SHA..HEAD_SHA`; requires `RESTORE_OK=1` (previous site already in `dist/`). Env: `DRY_RUN=1`, `FULL_BUILD=1` |
| `npm run validate:pwa` | Checks generated manifests and 192/512 PNGs |
| `npm run build:icons` | `scan:icons` + `generate:icons` (run before committing new icon usage) |

Production order: shared → zound-box → kitchensink → daily-task-report. Production consumes the **versioned** sprites and never regenerates icons.

CI runs `build:changed` (`scripts/build-changed.mjs`) instead of `build:production`. It diffs `github.event.before..github.sha`, maps each file to its workspace (longest directory prefix) and builds only those, libraries in dependency order. It falls back to a full `build:production` when there is no restored `dist/`, when `BASE_SHA` cannot be resolved, or when the change touches global inputs (`package.json`, `package-lock.json`, `vitest*.js`, `index.html`, `sw.js`, `scripts/`). Docs/`ai/` changes build nothing.

Two consequences to keep in mind: untouched apps are preserved from the previous Pages artifact, and an app that bundles a changed library **is not** rebuilt automatically (apps alias shared sources), so CI logs an `aviso` listing them — rebuild those apps in the same push or run `FULL_BUILD=1`.

## Icon pipeline

```
source (.vue)  --scan:icons-->  icon-profile.json {scanned, manual}
              --generate:icons--> public/icons/sprite-<family>.svg
              --vite build--> dist/icons/...  (precached by Workbox)
```

- `npm run scan:icons` — scans `<ZnIcon name="...">` usages; keeps `manual`.
- `npm run generate:icons` — writes the five family sprites from `@material-design-icons/svg`.
- App chunks include the icons used by the shared libraries they compose (`ui-core`, `pwa-integration`, `ui-data-*` and `ui-calendar`), so an app never has to redeclare an icon a shared component renders.
- `ZnIcon` downloads a family sprite once and injects it into `#zn-icon-sprite-host`.
- Profiles/sprites are committed; production never generates them.

| Project | Profile | Output |
|---|---|---|
| `ui-core` | `shared` | library distribution (only its own icons) |
| `pwa-integration` | — | merged into each app (`download`, `system_update`) |
| `zound-box` | `app:zound-box` | `zound-box/public/icons/` |
| `kitchensink` | `app:kitchensink` | `kitchensink/public/icons/` (full catalog via `manual`) |
| `daily-task-report` | `app:daily-task-report` | `daily-task-report/public/icons/` (dynamic names in `manual`) |

## PWA checklist for any app

1. `public/pwa-icon.svg` + `public/pwa-icon-192.png` + `public/pwa-icon-512.png` (art inside the maskable safe area ~80%).
2. `VitePWA({ registerType: 'prompt', manifest: { ... } })` with both PNGs declared exactly (`type: 'image/png'`, `purpose: 'any maskable'`, app-relative paths), valid `start_url`/`scope`/`display: 'standalone'`, plus `display_override: ['window-controls-overlay', 'standalone']` so the installed desktop app uses the native title bar with the MD3 top app bar (`ui-core` handles it automatically).
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

`.github/workflows/deploy.yml`, on `push: main` (or `workflow_dispatch`), two jobs:

- `build` → checkout `fetch-depth: 0` → Node 24 + npm cache → `npm install` → `npm run test:run` → restore the previous `github-pages` artifact into `dist/` → `node scripts/build-changed.mjs` (selective) → `validate:pwa` → guard that `dist/` is non-empty and symlink-free → inject `404.html` per app present + root → `actions/upload-pages-artifact@v4` (`path: ./dist`, artifact `github-pages`).
- `deploy` → `needs: build`, `environment: github-pages` → `actions/deploy-pages@v4`.

Keep upload and deploy in the same workflow run and never change the artifact name: `deploy-pages` only looks for `github-pages` in its own run, so an empty/skipped upload shows up as `No artifacts named "github-pages" were found`. Concurrency group `pages`, `cancel-in-progress: false`.
