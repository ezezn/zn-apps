# @zn-apps/pwa-integration — manual de usuario

Todo lo que una PWA instalada necesita más allá del manifiesto: estado de instalación, esquema de color del sistema, colores de las barras del sistema y popups de instalación y actualización.

- Paquete: `@zn-apps/pwa-integration` · Carpeta: `shared/pwa-integration/`
- English: [Read in English](../en/README.md)

## Configuración obligatoria en cada app

```js
// src/main.js
import { initPwaInstallListener, initPwaUpdateListener, initPwaThemeSync } from '@zn-apps/pwa-integration'

initPwaInstallListener() // captura beforeinstallprompt / appinstalled
initPwaUpdateListener()  // detecta versiones nuevas del service worker
initPwaThemeSync()       // mantiene las barras del sistema con el tema de la app
```

```vue
<!-- src/App.vue: hijos directos de ZnApp, nunca dentro de ZnScreen o contenedores con transform/overflow -->
<ZnApp :mode="resolvedTheme">
  <ZnScreen>…</ZnScreen>

  <ZnPwaInstallPrompt :title="t('pwa.installTitle')" :message="t('pwa.installMessage')" :image="pwaIconUrl" />
  <ZnPwaUpdatePrompt :title="t('pwa.updateTitle')" :message="t('pwa.updateMessage')"
                     :update-text="t('pwa.updateText')" :dismiss-text="t('pwa.dismissUpdate')" />
</ZnApp>
```

`vite.config.js` debe resolver el paquete a su código fuente:

```js
'@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js')
```

El build de librería emite su CSS en un archivo aparte; consumir `dist/` deja los popups sin estilos y fuera del viewport.

## Esquema de color

```js
import { useColorScheme } from '@zn-apps/pwa-integration'
const { resolvedTheme, preference, setPreference, systemColorScheme, isDark, isLight } = useColorScheme()
```

`resolvedTheme` sigue a `preference` (`system`/`light`/`dark`) y a la media query del sistema; pásalo a `<ZnApp :mode>`.

## Barras del sistema

`initPwaThemeSync()` escribe `<meta name="theme-color">` y el fondo de `<html>`/`<body>` desde el tema resuelto, de modo que la barra de estado de Android **y** su barra de navegación inferior siguen a la app en lugar del azul del navegador. Valores por defecto: claro `#FEF7FF`, oscuro `#141218` (igual que `--md-background`); se pueden sobrescribir con `initPwaThemeSync({ colors: { light: {...}, dark: {...} } })`.

Además, declara `theme_color` y `background_color` en `#FEF7FF` en el manifiesto y agrega `<meta name="theme-color" content="#FEF7FF">` en `index.html`, para que la app no parpadee en azul durante el arranque.

`usePwaMeta()` sigue disponible para casos puntuales (`syncWithScreenHeading()` para igualar el header de una `ZnScreen`, demos). No lo uses para fijar los colores iniciales del tema.

## Popup de instalación (`ZnPwaInstallPrompt`)

| Prop | Default |
|---|---|
| `title` | `'¿Deseas instalar esta aplicación?'` |
| `message` | `'Instálala en tu dispositivo...'` |
| `installText` / `dismissText` | `'Instalar'` / `'Ahora no'` |
| `icon` / `image` | `'download'` / `''` (la imagen tiene prioridad) |
| `delayMs` | `1500` |
| `persistDismissKey` | `'zn-pwa-dismissed'` |
| `storageType` | `'session'` (`session`/`local`/`none`) |

Eventos: `install`, `installed`, `dismiss`. Nunca aparece si la app ya corre en modo standalone; respeta `env(safe-area-inset-bottom)`.

## Popup de actualización (`ZnPwaUpdatePrompt`)

Props `title`, `message`, `updateText`, `dismissText`, `persistDismissKey`. Eventos `update`, `updated`, `dismiss`.

Las apps usan `registerType: 'prompt'`: el nuevo service worker espera. La librería reporta un worker pendiente al arrancar, consulta cada 30 minutos y al volver al primer plano (máximo una vez cada 5 minutos), aplica la actualización con `SKIP_WAITING` y recarga la página, y recuerda el descarte por versión en `sessionStorage`.

## Utilidades

`usePwaInstall()` → `{ isInstalled, canInstall, promptInstall() }`.
`isPwaUpdateAvailable()`, `updatePwa(): Promise<boolean>`, `onPwaUpdateChange(cb)`, `applyPwaThemeColors()`, `getAppColorScheme()`.

## Demo y tests

Kitchensink `/pwa/color-scheme`, `/pwa/bar-styling`, `/pwa/install`. Tests: `npx vitest run --project pwa-integration`.
