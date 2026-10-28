# ZN-Apps — Documentación para IA

Esta carpeta contiene documentación de contexto rápido en Markdown para que cualquier IA pueda entender rápidamente la arquitectura, los componentes y las reglas del monorepo `zn-apps`.

## Índice de Documentos

| Archivo | Contenido |
|---|---|
| [`00-overview.md`](./00-overview.md) | **Visión general** del monorepo: stack, estructura, lineamientos de arquitectura, CI/CD, convenciones |
| [`01-shared.md`](./01-shared.md) | **Librería `@zn-apps/shared`**: todos los componentes (API, props, slots, eventos), composables, utilidades, sistema de tokens MD3 |
| [`02-app-zound-box.md`](./02-app-zound-box.md) | **App Zound Box**: estructura, arquitectura de componentes, estado actual, lineamientos de desarrollo, tareas pendientes |
| [`03-app-kitchensink.md`](./03-app-kitchensink.md) | **App Kitchensink**: catálogo de componentes + plantilla de referencia para nuevas apps |
| [`04-legacy-templates.md`](./04-legacy-templates.md) | **Templates legacy** (pwa-app1/2): estado, plan de migración, qué ignorar |
| [`05-testing.md`](./05-testing.md) | **Testing**: arquitectura de Vitest, scripts, mocks globales y buenas prácticas |
| [`../README.md`](../README.md) | **Manual para Humanos**: instalación, ejecución local con dev server, builds y comandos |
| [`../AGENTS.md`](../AGENTS.md) | **Instrucciones para Agentes**: directivas de contexto automático para IAs (Antigravity, Cursor, etc.) |

## Cómo usar esta documentación

**Para entender el proyecto:**
→ Leer `00-overview.md` primero.

**Para trabajar en la librería de componentes:**
→ Leer `01-shared.md` para API completa de cada componente.

**Para desarrollar en Zound Box:**
→ Leer `00-overview.md` + `01-shared.md` + `02-app-zound-box.md`.

**Para crear una nueva app:**
→ Leer `00-overview.md` + `03-app-kitchensink.md` (sección "Rol como Plantilla").

**Para entender qué ignorar:**
→ Leer `04-legacy-templates.md`.
