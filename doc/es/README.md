# zn-apps — documentación de usuario

> Monorepo de **Progressive Web Apps** independientes construidas con **Vue 3**, **Vite** y **Material Design 3**, orquestadas con **npm workspaces** y desplegadas en **GitHub Pages** bajo `/zn-apps/`.

**English:** [Read this documentation in English](../en/README.md).

Esta carpeta es el punto de entrada para personas. Cada app y librería mantiene su propio manual de usuario en su carpeta `doc/`.

## Contenido

| Guía | Descripción |
|---|---|
| [Primeros pasos](./getting-started.md) | Requisitos, instalación, desarrollo local, tests, builds y despliegue |
| [Arquitectura](./architecture.md) | Stack, estructura del repositorio, principios de aislamiento y dependencias |
| [Tipos de app](./app-types.md) | Arquetipos, matriz de decisiones, reglas invariables y overrides permitidos |
| [Convenciones](./conventions.md) | Sistema de diseño, iconos, PWA, i18n, campos de datos, versionado y política de documentación |

## Proyectos

### Aplicaciones

| Proyecto | Carpeta | Descripción | Ruta de despliegue | Manual |
|---|---|---|---|---|
| **Zound Box** | `zound-box/` | PWA mezcladora de audio ambiental (paisajes sonoros + seseo rítmico) | `/zn-apps/zound-box/` | [ES](../../zound-box/doc/es/README.md) · [EN](../../zound-box/doc/en/README.md) |
| **Kitchensink** | `kitchensink/` | Showroom de componentes, catálogo completo de iconos y blueprint para nuevas apps | `/zn-apps/kitchensink/` | [ES](../../kitchensink/doc/es/README.md) · [EN](../../kitchensink/doc/en/README.md) |
| **Daily Task Report** | `daily-task-report/` | Seguimiento local de tareas con nombres de entidad configurables (Dexie + Pinia) | `/zn-apps/daily-task-report/` | [ES](../../daily-task-report/doc/es/README.md) · [EN](../../daily-task-report/doc/en/README.md) |
| **Portal de entrada** | `index.html` | Lanzador estático de todas las PWA | `/zn-apps/` | — |

### Librerías compartidas (`shared/`)

| Librería | Descripción | Manual |
|---|---|---|
| `@zn-apps/ui-core` | Sistema de diseño MD3: componentes, tokens, composables y chunks de iconos | [ES](../../shared/ui-core/doc/es/README.md) · [EN](../../shared/ui-core/doc/en/README.md) |
| `@zn-apps/settings-core` | Documento JSON de configuración con proxy profundo y persistencia en localStorage | [ES](../../shared/settings-core/doc/es/README.md) · [EN](../../shared/settings-core/doc/en/README.md) |
| `@zn-apps/ui-about` | Panel "Acerca de" estándar construido sobre `ui-core` | [ES](../../shared/ui-about/doc/es/README.md) · [EN](../../shared/ui-about/doc/en/README.md) |
| `@zn-apps/pwa-integration` | Estado de PWA, esquema de color del sistema, barras del sistema y popups de instalación/actualización | [ES](../../shared/pwa-integration/doc/es/README.md) · [EN](../../shared/pwa-integration/doc/en/README.md) |
| `@zn-apps/ui-data-core` | Contrato de esquema, utilidades de rutas JSON, defaults y formato de valores | [ES](../../shared/ui-data-core/doc/es/README.md) · [EN](../../shared/ui-data-core/doc/en/README.md) |
| `@zn-apps/ui-data-form` | Formularios por secciones derivados de un esquema, con borrador o doble binding | [ES](../../shared/ui-data-form/doc/es/README.md) · [EN](../../shared/ui-data-form/doc/en/README.md) |
| `@zn-apps/ui-data-view` | Presentación de sólo lectura del mismo esquema | [ES](../../shared/ui-data-view/doc/es/README.md) · [EN](../../shared/ui-data-view/doc/en/README.md) |
| `@zn-apps/ui-data-editor` | Presentación tipo vista con edición por campo en un diálogo | [ES](../../shared/ui-data-editor/doc/es/README.md) · [EN](../../shared/ui-data-editor/doc/en/README.md) |
| `@zn-apps/ui-data-richtext` | Editor y vista de texto enriquecido con valor Markdown | [ES](../../shared/ui-data-richtext/doc/es/README.md) · [EN](../../shared/ui-data-richtext/doc/en/README.md) |

## Estructura de la documentación

```
doc/{en,es}/           ← esta guía (arquitectura, flujo de trabajo, convenciones)
<proyecto>/doc/{en,es}/ ← manual de usuario de cada app o librería
ai/                    ← contexto compacto en inglés para agentes de IA
<proyecto>/ai/          ← contexto de agente por proyecto
```

Los árboles `ai/` son material interno de referencia para agentes de código; todo lo que necesita una persona está en `doc/`.
