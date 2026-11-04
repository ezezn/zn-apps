# ZN-Apps Monorepo — Visión General

> Documento de contexto rápido para IA. Actualizado: 2026-10-28.

## ¿Qué es este repositorio?

`zn-apps` es un **monorepo de PWAs** (Progressive Web Applications) construidas con **Vue 3**, alojado en GitHub y desplegado automáticamente en **GitHub Pages** mediante GitHub Actions.

El monorepo actúa como paraguas de múltiples aplicaciones independientes, todas publicadas bajo la raíz `/zn-apps/` del Pages del repositorio.

---

## Stack Tecnológico Central

| Capa | Tecnología | Notas |
|---|---|---|
| UI Framework | **Vue 3** (Composition API + `<script setup>`) | Versión ~3.5 |
| Build Tool | **Vite 6** | Config por subproyecto |
| Gestión de estado | **Pinia** | Disponible, aún no implementado en apps actuales |
| Routing | **vue-router 4** | Solo en apps multi-página (kitchensink) |
| Empaquetado PWA | **vite-plugin-pwa** | Cada app genera su propio SW |
| Sistema de paquetes | **npm workspaces** | Node 24 |
| CI/CD | **GitHub Actions** | Deploy en `push` a `main` |
| Tipografía | **Roboto** (via `@fontsource/roboto`) | Pesos 400 y 500 |
| Design System | **Material Design 3 (MD3)** | Tokens como variables CSS |

---

## Estructura del Monorepo

```
zn-apps/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD: build:all → GitHub Pages
├── index.html                # Landing portal (HTML estático, lista las apps)
├── sw.js                     # Service Worker global para la landing
├── package.json              # Root: workspaces + script build:all
│
├── shared/                   # 📦 Contenedor de librerías compartidas aisladas
│   ├── ui-core/              # @zn-apps/ui-core — componentes Vue/MD3, composables, utils
│   │   └── src/
│   │       ├── index.js      # Entry point: exports públicos
│   │       ├── components/   # Componentes Zn* (MD3)
│   │       ├── composables/  # useOnlineStatus
│   │       ├── utils/        # helpers.js (formatDate)
│   │       └── assets/css/   # global.css + tokens CSS de MD3
│   └── storage/              # @zn-apps/storage — persistencia Web Storage
│   └── ui-about/             # @zn-apps/ui-about — panel de información de la app
│       └── src/index.js      # createStorage()
│
├── zound-box/                # 🎵 App 1 — Primera app productiva (branch actual)
├── kitchensink/              # 🧬 App catálogo/showroom de componentes shared
└── kitchensink/              # 🧬 App catálogo/showroom de componentes shared
```

---

## Lineamientos de Arquitectura

### 1. Independencia de aplicaciones
Cada app (`zound-box`, `kitchensink`, etc.) es una SPA **completamente independiente**:
- Tiene su propio `package.json`, `vite.config.js`, `index.html` y service worker.
- **No comparten estado entre sí** (no hay store Pinia cross-app).
- Se despliegan en subcarpetas separadas: `/zn-apps/zound-box/`, `/zn-apps/kitchensink/`.

### 2. Librerías compartidas (`@zn-apps/ui-core`, `@zn-apps/storage`)
- `shared/` agrupa **librerías aisladas**, cada una compilada como ES module (`vite build --lib`) con su propio `package.json`, `vite.config.js` y `vitest.config.js`.
- `@zn-apps/ui-core` exporta **componentes Vue**, **composables**, **utilidades JS** y el CSS global.
- `@zn-apps/storage` exporta utilidades de **persistencia** (`createStorage`) sin dependencia de Vue.
- Las apps las consumen mediante npm workspaces: `"@zn-apps/ui-core": "*"` / `"@zn-apps/storage": "*"`.
- Cada app importa `@zn-apps/ui-core/dist/ui-core.css` para los estilos globales.
- Las librerías compartidas **no se importan entre sí**; solo las apps las componen.

### 3. Design System — Material Design 3
- Todos los tokens de color y espaciado se definen como **variables CSS** (`--md-*`).
- El tema claro/oscuro se gestiona inyectando `zn-theme-light` o `zn-theme-dark` en el elemento raíz.
- El componente `ZnApp` es el **único responsable** de detectar el tema del sistema y cambiar las clases.

### 4. PWA por app
- Cada app registra su propio service worker con `vite-plugin-pwa`.
- La landing (`index.html` raíz) tiene un SW global (`sw.js`) para cachear el portal.
- El SW global **no interfiere** con los SWs de subcarpetas.

### 5. Routing
- Apps con múltiples vistas usan `vue-router` con `createWebHistory()`.
- Apps simples de una sola pantalla (como `zound-box`) no usan router.

### 6. Estado con Pinia
- Pinia está planificado como gestor de estado.
- **Estado no compartido entre apps**.
- Posibilidad de tener stores base reutilizables en `shared/` como plantillas.

---

## CI/CD — GitHub Actions

**Archivo:** `.github/workflows/deploy.yml`

**Flujo:**
1. `push` a `main` dispara el workflow.
2. `npm install` en la raíz (resuelve todos los workspaces).
3. `npm run test:run` (ejecuta todos los tests unitarios con Vitest y detiene el build si hay fallos).
4. `npm run build:all` → compila `ui-core` y `storage` primero, luego cada app, y copia los `dist/` a `dist/` raíz.
5. Se inyectan archivos `404.html` (copia de `index.html`) para fallback en SPA.
6. Se publica el directorio `dist/` en GitHub Pages.

**Orden de build:**
```
@zn-apps/ui-core → @zn-apps/storage → zound-box → kitchensink
```

---

## Guía de Desarrollo Local y Comandos de Consola

Para instrucciones paso a paso pensadas para desarrolladores humanos (instalación, scripts de ejecución por workspace, puertos y builds individuales), consulta el archivo:
- [**`../README.md`**](../README.md) — Manual de desarrollo local y guía operativa.

Comandos rápidos para desarrolladores:
- Levantar app específica: `npm run dev --workspace=<app>` (ej. `npm run dev --workspace=zound-box`)
- Correr tests: `npm test` (watch) o `npm run test:run` (CI)
- Recompilar librerías en vivo: `npm run dev --workspace=@zn-apps/ui-core` o `npm run dev --workspace=@zn-apps/storage`

---

## URLs de Producción (GitHub Pages)

| Recurso | URL |
|---|---|
| Portal / Landing | `/zn-apps/` |
| Zound Box | `/zn-apps/zound-box/` |
| Kitchensink | `/zn-apps/kitchensink/` |

---

## Convenciones de Nomenclatura

- **Componentes:** prefijo `Zn` + PascalCase → `ZnButton`, `ZnCard`, `ZnScreen`.
- **Variables CSS:** prefijo `--md-` siguiendo tokens de Material Design 3.
- **Clases CSS de utilidad:** prefijo `zn-` → `zn-span-2`, `zn-theme-dark`.
- **Paquetes shared:** scope `@zn-apps/<librería>` → `@zn-apps/ui-core`, `@zn-apps/storage`.
- **Composables:** prefijo `use` → `useOnlineStatus`.

---

## Documentos Relacionados

- [`01-shared.md`](./01-shared.md) — Librerías compartidas (`ui-core`, `storage` y `ui-about`)
- [`02-app-zound-box.md`](./02-app-zound-box.md) — App Zound Box
- [`03-app-kitchensink.md`](./03-app-kitchensink.md) — App Kitchensink (catálogo)
- [`05-testing.md`](./05-testing.md) — Arquitectura y ejecución de tests unitarios con Vitest
