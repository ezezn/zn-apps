# @zn-apps/pwa-integration — user manual

Everything an installed PWA needs beyond the manifest: install state, system color scheme, system-bar colors, and install/update popups.

- Package: `@zn-apps/pwa-integration` · Folder: `shared/pwa-integration/`
- Spanish: [Leer en español](../es/README.md)

## Required setup in every app

```js
// src/main.js
import { initPwaInstallListener, initPwaUpdateListener, initPwaThemeSync } from '@zn-apps/pwa-integration'

initPwaInstallListener() // captures beforeinstallprompt / appinstalled
initPwaUpdateListener()  // detects new service worker versions
initPwaThemeSync()       // keeps system bars in sync with the app theme
```

```vue
<!-- src/App.vue: direct children of ZnApp, never inside ZnScreen or a transformed/overflow container -->
<ZnApp :mode="resolvedTheme">
  <ZnScreen>…</ZnScreen>

  <ZnPwaInstallPrompt :title="t('pwa.installTitle')" :message="t('pwa.installMessage')" :image="pwaIconUrl" />
  <ZnPwaUpdatePrompt :title="t('pwa.updateTitle')" :message="t('pwa.updateMessage')"
                     :update-text="t('pwa.updateText')" :dismiss-text="t('pwa.dismissUpdate')" />
</ZnApp>
```

`vite.config.js` must resolve the package to its source:

```js
'@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js')
```

The library build emits its CSS separately; consuming `dist/` renders the popups unstyled and outside the viewport.

## Color scheme

```js
import { useColorScheme } from '@zn-apps/pwa-integration'
const { resolvedTheme, preference, setPreference, systemColorScheme, isDark, isLight } = useColorScheme()
```

`resolvedTheme` follows `preference` (`system`/`light`/`dark`) and the OS media query; bind it to `<ZnApp :mode>`.

## System bars

`initPwaThemeSync()` writes `<meta name="theme-color">` and the `<html>`/`<body>` background from the resolved theme, so the Android status bar **and** bottom navigation bar follow the app instead of the browser's default blue. Defaults: light `#FEF7FF`, dark `#141218` (matching `--md-background`); override with `initPwaThemeSync({ colors: { light: {...}, dark: {...} } })`.

Also set `theme_color` and `background_color` to `#FEF7FF` in the manifest and add `<meta name="theme-color" content="#FEF7FF">` to `index.html`, so the app does not flash blue while booting.

`usePwaMeta()` remains available for one-off cases (`syncWithScreenHeading()` to match a `ZnScreen` header, demos). Do not use it to pin initial theme colors.

## Install popup (`ZnPwaInstallPrompt`)

| Prop | Default |
|---|---|
| `title` | `'¿Deseas instalar esta aplicación?'` |
| `message` | `'Instálala en tu dispositivo...'` |
| `installText` / `dismissText` | `'Instalar'` / `'Ahora no'` |
| `icon` / `image` | `'download'` / `''` (image wins) |
| `delayMs` | `1500` |
| `persistDismissKey` | `'zn-pwa-dismissed'` |
| `storageType` | `'session'` (`session`/`local`/`none`) |

Events: `install`, `installed`, `dismiss`. Never appears when the app already runs standalone; respects `env(safe-area-inset-bottom)`.

## Update popup (`ZnPwaUpdatePrompt`)

Props `title`, `message`, `updateText`, `dismissText`, `persistDismissKey`. Events `update`, `updated`, `dismiss`.

Apps use `registerType: 'prompt'`: the new service worker waits. The library reports a pending worker on startup, checks every 30 minutes and on foreground (max once per 5 minutes), applies the update with `SKIP_WAITING` plus a page reload, and remembers dismissal per version in `sessionStorage`.

## Utilities

`usePwaInstall()` → `{ isInstalled, canInstall, promptInstall() }`.
`isPwaUpdateAvailable()`, `updatePwa(): Promise<boolean>`, `onPwaUpdateChange(cb)`, `applyPwaThemeColors()`, `getAppColorScheme()`.

## Demo and tests

Kitchensink `/pwa/color-scheme`, `/pwa/bar-styling`, `/pwa/install`. Tests: `npx vitest run --project pwa-integration`.
