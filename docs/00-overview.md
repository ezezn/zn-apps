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
├── shared/                   # 📦 Librería de componentes Vue compartidos
│   └── src/
│       ├── index.js          # Entry point: exports públicos
│       ├── components/       # Componentes Zn* (MD3)
│       ├── composables/      # useOnlineStatus
│       ├── utils/            # helpers.js (formatDate)
│       └── assets/css/       # global.css + tokens CSS de MD3
│
├── zound-box/                # 🎵 App 1 — Primera app productiva (branch actual)
├── kitchensink/              # 🧬 App catálogo/showroom de componentes shared
├── pwa-app2/                 # 🗂️  Template legacy (sin @zn-apps/shared todavía)
└── pwa-app1/                 # 🗂️  Template legacy (vacío/básico)
```

> **Nota:** `pwa-app1` y `pwa-app2` son subcarpetas legacy que sirvieron de plantilla inicial. En el futuro, `kitchensink` reemplazará ese rol. Estos folders se limpiarán en iteraciones futuras.

---

## Lineamientos de Arquitectura

### 1. Independencia de aplicaciones
Cada app (`zound-box`, `kitchensink`, etc.) es una SPA **completamente independiente**:
- Tiene su propio `package.json`, `vite.config.js`, `index.html` y service worker.
- **No comparten estado entre sí** (no hay store Pinia cross-app).
- Se despliegan en subcarpetas separadas: `/zn-apps/zound-box/`, `/zn-apps/kitchensink/`.

### 2. Librería compartida (`@zn-apps/shared`)
- Es una **librería de componentes** compilada como ES module (`vite build --lib`).
- Las apps la consumen mediante el workspace de npm: `"@zn-apps/shared": "*"`.
- Exporta **componentes Vue**, **composables** y **utilidades JS**.
- Cada app importa `@zn-apps/shared/dist/shared.css` para los estilos globales.

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
4. `npm run build:all` → compila `shared` primero, luego cada app, y copia los `dist/` a `dist/` raíz.
5. Se inyectan archivos `404.html` (copia de `index.html`) para fallback en SPA.
6. Se publica el directorio `dist/` en GitHub Pages.

**Orden de build:**
```
shared → zound-box → pwa-app2 → kitchensink
```

---

## Guía de Desarrollo Local y Comandos de Consola

Para instrucciones paso a paso pensadas para desarrolladores humanos (instalación, scripts de ejecución por workspace, puertos y builds individuales), consulta el archivo:
- [**`../README.md`**](../README.md) — Manual de desarrollo local y guía operativa.

Comandos rápidos para desarrolladores:
- Levantar app específica: `npm run dev --workspace=<app>` (ej. `npm run dev --workspace=zound-box`)
- Correr tests: `npm test` (watch) o `npm run test:run` (CI)
- Recompilar shared en vivo: `npm run dev --workspace=shared`

---

## URLs de Producción (GitHub Pages)

| Recurso | URL |
|---|---|
| Portal / Landing | `/zn-apps/` |
| Zound Box | `/zn-apps/zound-box/` |
| Kitchensink | `/zn-apps/kitchensink/` |
| PWA App 2 (legacy) | `/zn-apps/pwa-app2/` |

---

## Convenciones de Nomenclatura

- **Componentes:** prefijo `Zn` + PascalCase → `ZnButton`, `ZnCard`, `ZnScreen`.
- **Variables CSS:** prefijo `--md-` siguiendo tokens de Material Design 3.
- **Clases CSS de utilidad:** prefijo `zn-` → `zn-span-2`, `zn-theme-dark`.
- **Paquete shared:** scope `@zn-apps/shared`.
- **Composables:** prefijo `use` → `useOnlineStatus`.

---

## Documentos Relacionados

- [`01-shared.md`](./01-shared.md) — Librería compartida de componentes
- [`02-app-zound-box.md`](./02-app-zound-box.md) — App Zound Box
- [`03-app-kitchensink.md`](./03-app-kitchensink.md) — App Kitchensink (catálogo)
- [`04-legacy-templates.md`](./04-legacy-templates.md) — Templates legacy (pwa-app1/2)
- [`05-testing.md`](./05-testing.md) — Arquitectura y ejecución de tests unitarios con Vitest
