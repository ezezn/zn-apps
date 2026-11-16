# Kitchensink — manual de usuario

Showroom de componentes, catálogo completo de iconos Material y blueprint para nuevas apps del monorepo.

- Carpeta: `kitchensink/` · Ruta de despliegue: `/zn-apps/kitchensink/`
- English: [Read in English](../en/README.md)

## Qué encontrarás

1. **Showroom** — una página interactiva por cada componente de `ui-core`, `ui-data-*`, `ui-about`, `settings-core` y `pwa-integration`, con todas las variantes y tamaños MD3.
2. **Catálogo de iconos** — todos los glifos de Material Design en las cinco familias (`filled`, `outlined`, `round`, `sharp`, `two-tone`).
3. **Blueprint** — la estructura de referencia para arrancar una app multi-pantalla.

## Rutas

| Grupo | Rutas |
|---|---|
| Layout y navegación | `/tabs`, `/navigation-layout`, `/layout`, `/sections`, `/screen` |
| Controles | `/buttons`, `/cards`, `/switches`, `/dialogs` |
| Entradas | `/inputs` más `/inputs/text`, `multiline`, `email`, `phone`, `number`, `date`, `time`, `datetime`, `select`, `chip`, `range`, `date-range`, `time-range`, `datetime-range` |
| Datos | `/data/core`, `/data/form`, `/data/view`, `/data/editor`, `/data/richtext` |
| Recursos | `/icons`, `/legacy` |
| Librerías | `/about`, `/settings`, `/pwa/color-scheme`, `/pwa/bar-styling`, `/pwa/install` |

`/` redirige a `/buttons`.

## Arquitectura

| Aspecto | Implementación |
|---|---|
| Router | `vue-router` con `createWebHistory()`; cada demo tiene URL propia |
| Layout | `ZnMasterSlaveLayout`: navegación agrupada a la izquierda, demo a la derecha; colapsable en móvil |
| Perfil de iconos | `manual` declara el catálogo completo (~2100 glifos) para poder explorarlos todos |
| Demos de datos | un esquema y un valor compartidos por formulario, vista y editor (`src/data/data-demo.js`) |
| i18n | shell, navegación, tema y popup de instalación traducidos; las cadenas estáticas de las demos están en migración |

## Catálogo de iconos

`icon-profile.json` combina los iconos escaneados con la lista completa de `manual`; el script genera cinco archivos de sprite en `public/icons/` que `ZnIcon` carga por familia a demanda.

```bash
npm run scan:icons
npm run generate:icons
```

## Guía blueprint para una app nueva

1. **Estructura**: `public/` (`favicon.svg`, `pwa-icon.svg`, `pwa-icon-192.png`, `pwa-icon-512.png`), `src/{main.js,App.vue,views/}`, `index.html`, `package.json`, `vite.config.js`, `vitest.config.js`, `icon-profile.json`, y las carpetas `ai/` y `doc/{en,es}/`.
2. **Dependencias**: `@zn-apps/ui-core` (más `ui-about`, `pwa-integration`, `settings-core`, `ui-data-*` según necesidad), `vue` y `vue-router` para apps multi-pantalla.
3. **Vite**: `base: '/zn-apps/<app>/'`, `VitePWA` con manifiesto, ambos PNG (`any maskable`), `theme_color`/`background_color` `#FEF7FF`, `changelogPlugin` y el alias de `@zn-apps/pwa-integration` a su fuente.
4. **main.js**: i18n (`en`/`es`), namespace propio de settings, `initPwaInstallListener()`, `initPwaUpdateListener()`, `initPwaThemeSync()`.
5. **App.vue**: `<ZnApp>` envolviendo el layout, con `ZnPwaInstallPrompt` y `ZnPwaUpdatePrompt` como hijos directos.
6. **Registrar** la app en los workspaces del `package.json` raíz, en los scripts de iconos y en `build:production`.
7. **Verificar** con `npm run test:<app>` y `npm run build:<app>`.

## Desarrollo

```bash
npm run dev --workspace=kitchensink
npm run test:kitchensink
npm run build:kitchensink
```
