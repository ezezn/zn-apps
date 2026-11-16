# @zn-apps/pwa-integration — AI context

PWA environment layer: install state, system color scheme, system-bar colors, install and update popups. Composes `ui-core` (`ZnButton`, `ZnIcon`).
Location: `shared/pwa-integration/`.

Rules: every utility is SSR/DOM-safe (guards for missing `matchMedia`); `beforeinstallprompt` is captured by one singleton listener so any consumer can await the deferred prompt.

## Composables

```ts
useColorScheme(options?: { defaultPreference?: 'system' | 'light' | 'dark' }): {
  systemColorScheme: Ref<'light' | 'dark'>
  preference: Ref<'system' | 'light' | 'dark'>
  resolvedTheme: ComputedRef<'light' | 'dark'>
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
  setPreference: (pref) => void
}
```

Bind `resolvedTheme` to `<ZnApp :mode="resolvedTheme">`.

```ts
usePwaMeta(options?: { initialThemeColor?, initialBackgroundColor?, syncOnMount?, restoreOnUnmount? }): {
  themeColor: Ref<string>
  backgroundColor: Ref<string>
  setThemeColor(color): void
  setBackgroundColor(color): void
  setAppMetaColors({ themeColor?, backgroundColor?, statusBarStyle? }): void
  syncWithScreenHeading({ selector?, syncBackground? }): string | null
}
```

`usePwaInstall(): { isInstalled, canInstall, promptInstall() }` — `promptInstall` resolves `{ outcome: 'accepted' | 'dismissed' } | null`.

## System bar colors

```ts
PWA_THEME_COLORS = {
  light: { themeColor: '#FEF7FF', backgroundColor: '#FEF7FF' },
  dark:  { themeColor: '#141218', backgroundColor: '#141218' }
}

initPwaThemeSync(options?: { colors? }): () => void   // idempotent, returns cleanup
applyPwaThemeColors(scheme?, colors?): { themeColor, backgroundColor } | null
getAppColorScheme(): 'light' | 'dark'
```

`initPwaThemeSync()` observes `zn-theme-light`/`zn-theme-dark` on `<body>` (resolved theme, including user preference) and `prefers-color-scheme`, then writes `<meta name="theme-color">` and the html/body background. **Call it in `src/main.js`.** Colors match `--md-background` in `ui-core`. Installed apps still boot with blue bars unless the manifest declares `#FEF7FF` and `index.html` has `<meta name="theme-color" content="#FEF7FF">`.

## Components

### `ZnPwaInstallPrompt`

| Prop | Default |
|---|---|
| `title` | `'¿Deseas instalar esta aplicación?'` |
| `message` | `'Instálala en tu dispositivo...'` |
| `installText` | `'Instalar'` |
| `dismissText` | `'Ahora no'` |
| `icon` | `'download'` |
| `image` | `''` (wins over `icon`) |
| `delayMs` | `1500` |
| `persistDismissKey` | `'zn-pwa-dismissed'` |
| `storageType` | `'session'` (`session` \| `local` \| `none`) |

Events: `install`, `installed`, `dismiss`. Never renders in standalone / `window-controls-overlay` / iOS standalone. Respects `env(safe-area-inset-bottom)`.

### `ZnPwaUpdatePrompt`

Props: `title`, `message`, `updateText`, `dismissText`, `persistDismissKey` (`'zn-pwa-update-dismissed'`, `sessionStorage`). Events: `update`, `updated`, `dismiss`. Dismissal is remembered per version and cleared once up to date.

## Update utilities (`utils/pwaUpdate.js`)

```ts
initPwaUpdateListener(): void                                  // call in main.js, idempotent
onPwaUpdateChange(cb: (state: { updateAvailable, registration }) => void): () => void
isPwaUpdateAvailable(): boolean
updatePwa(): Promise<boolean>                                  // SKIP_WAITING + reload
```

Reports an existing waiting worker, listens to `updatefound`/`controllerchange`, polls every 30 min and on foreground (max once per 5 min). `updatePwa()` returns `false` when nothing was pending or activation timed out (component re-enables the button).

## Required app wiring

```js
// src/main.js
import { initPwaInstallListener, initPwaUpdateListener, initPwaThemeSync } from '@zn-apps/pwa-integration'
initPwaInstallListener(); initPwaUpdateListener(); initPwaThemeSync()
```

```vue
<!-- src/App.vue: direct children of ZnApp, outside ZnScreen/layouts -->
<ZnPwaInstallPrompt :title="t('pwa.installTitle')" :message="t('pwa.installMessage')" :image="pwaIconUrl" />
<ZnPwaUpdatePrompt :title="t('pwa.updateTitle')" :message="t('pwa.updateMessage')"
                   :update-text="t('pwa.updateText')" :dismiss-text="t('pwa.dismissUpdate')" />
```

Both popups are `position: fixed`: alias the package to its source in `vite.config.js` (`'@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js')`) and never nest them in a `transform`/`overflow`/`isolation` container. The library build emits CSS in a separate file that the JS entry does not import.

## Tests

`src/__tests__/`: `useColorScheme`, `usePwaMeta`, `pwaTheme`, `usePwaInstall`, `pwaUpdate`, `ZnPwaInstallPrompt`, `ZnPwaUpdatePrompt` → `npx vitest run --project pwa-integration`.
