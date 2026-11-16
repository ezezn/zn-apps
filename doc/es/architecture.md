# Arquitectura

## Visión general

`zn-apps` es un monorepo de PWAs independientes en Vue 3 que comparten un sistema de diseño Material Design 3. Cada app es una SPA autónoma con su propio manifiesto, service worker, dependencias y subruta de despliegue; la carpeta `shared/` contiene librerías aisladas que las apps componen.

## Stack

| Capa | Tecnología |
|---|---|
| Framework UI | Vue 3.5, Composition API, `<script setup>` |
| Build | Vite 6, una configuración por proyecto |
| Paquetes | npm workspaces (Node ≥ 20) |
| Sistema de diseño | Tokens Material Design 3 (`--md-*`) + componentes `Zn*` |
| PWA | `vite-plugin-pwa` (manifiesto y service worker por app) |
| Testing | Vitest + `@vue/test-utils` + happy-dom, configuración modular por proyectos |
| Routing | `vue-router` 4, sólo en apps multi-pantalla |
| Tipografía | Roboto 400/500 (`@fontsource/roboto`, provista por `ui-core`) |
| i18n | `vue-i18n`, inglés y español en todas las apps |
| CI/CD | GitHub Actions → GitHub Pages |

## Estructura del repositorio

```
zn-apps/
├── index.html, sw.js            portal de entrada y su service worker
├── package.json                 workspaces y scripts de orquestación
├── vitest.config.js             proyectos Vitest centralizados
├── doc/{en,es}/                 esta documentación
├── ai/                          contexto para agentes de IA
├── shared/                      librerías aisladas
│   ├── ui-core/                 sistema de diseño, tokens, componentes, iconos
│   ├── settings-core/           proxy profundo de configuración
│   ├── ui-about/                panel Acerca de (compone ui-core)
│   ├── pwa-integration/         estado PWA, sincronía de tema, popups
│   ├── ui-data-core/            contrato de esquema + utilidades JSON
│   ├── ui-data-form/            formularios por esquema
│   ├── ui-data-view/            presentación de sólo lectura
│   ├── ui-data-editor/          vista + edición por campo en diálogo
│   └── ui-data-richtext/        texto enriquecido con valor Markdown
├── zound-box/                   PWA productiva (mono-pantalla)
└── kitchensink/                 showroom, catálogo de iconos y blueprint
```

Cada proyecto incluye además `ai/` (contexto de agentes) y `doc/{en,es}/` (manual de usuario).

## Principios

### 1. Aplicaciones totalmente independientes
Cada app tiene su `package.json`, `vite.config.js`, `index.html`, service worker y `dist/`. **Nunca se comparte estado entre apps** (ni Pinia cross-app). Las subrutas son `/zn-apps/<app>/`.

### 2. Librerías compartidas aisladas
Cada librería en `shared/*` tiene su manifiesto, build de librería en Vite y tests. Las librerías no se importan entre sí salvo las composiciones explícitas: `ui-about → ui-core`, la familia `ui-data-*` sobre `ui-core` y `ui-data-core`, `ui-data-editor → ui-data-form + ui-data-view`, `ui-data-richtext → ui-core`. Las de infraestructura (`settings-core`, `ui-data-core`) no dependen de Vue ni del DOM.

### 3. Material Design 3 centralizado
Los tokens viven en `shared/ui-core/src/assets/css/global.css`. El cambio de tema ocurre sólo en `<ZnApp mode="light|dark|system">`, que aplica `zn-theme-light`/`zn-theme-dark` en `<body>`.

### 4. Chunks de iconos generados
Los iconos se sirven desde sprites SVG por proyecto generados a partir de `icon-profile.json`; `ZnIcon` carga una familia a demanda. Nunca se distribuye la colección completa de glifos.

### 5. Internacionalización
Cada app declara mensajes `en` y `es`. Locale inicial: `settings.i18n.locale` → idioma base de `navigator.language` (`es-MX` → `es`) → `en`. Namespace propio de `settings-core` por app.

### 6. Contrato compartido de campos de datos
`ui-data-form`, `ui-data-view` y `ui-data-editor` comparten un esquema y un valor JSON. Toda capacidad de un campo debe existir en los tres renderizadores en el mismo cambio; un tipo nuevo exige implementación en `ZnDataField`, `ZnDataViewField` y el diálogo del editor.

### 7. Verificación acotada
Verifica con el comando mínimo útil para el cambio; la suite completa y `build:all` son para trabajo transversal o de release. Las tareas sólo de Markdown no ejecutan tests ni builds. CI mantiene la validación completa.

## Relacionado

- [Primeros pasos](./getting-started.md) · [Tipos de app](./app-types.md) · [Convenciones](./conventions.md)
- [Manual de ui-core](../../shared/ui-core/doc/es/README.md) · [Manual de ui-data-core](../../shared/ui-data-core/doc/es/README.md)
