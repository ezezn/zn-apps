# ZN-Apps — Índice Maestro de Documentación

Bienvenido a la raíz de la documentación del monorepo `zn-apps`.  
Este directorio (`docs/`) es el **punto de entrada unificado** para desarrolladores y **agentes de Inteligencia Artificial** (Antigravity, Cursor, Claude Code, Copilot, Gemini).

---

## 🧭 Arquitectura de la Documentación

La documentación del monorepo sigue un esquema estructurado en dos niveles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NIVEL 1: DOCUMENTACIÓN RAÍZ (docs/)                  │
│  Lineamientos globales, arquitectura monorepo, tipos de apps, CI/CD,   │
│               estrategia de testing y flujos operativos.               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
┌───────────────────────────────┐         ┌──────────────────────────────┐
│  NIVEL 2: APPS (<app>/docs/)  │         │  NIVEL 2: SHARED (lib/docs/) │
│  - zound-box/docs/            │         │  - shared/ui-core/docs/      │
│  - kitchensink/docs/          │         │  - shared/settings-core/docs/│
│  - Dominio, DTOs, reglas de   │         │  - shared/ui-about/docs/     │
│    negocio y overrides.       │         │  - API de componentes y lib. │
└───────────────────────────────┘         └──────────────────────────────┘
```

---

## 📚 Directorio de Documentos

### Nivel 1: Lineamientos Globales del Monorepo (`docs/`)

| Documento | Contenido y Propósito | Audiencia Principal |
|---|---|---|
| [**`00-overview.md`**](./00-overview.md) | **Visión General de Arquitectura**: Stack central, estructura de carpetas, principios de aislamiento y CI/CD. | IAs y nuevos desarrolladores |
| [**`01-app-types.md`**](./01-app-types.md) | **Tipología de Aplicaciones**: Arquetipos (Single-screen, Multi-screen routed, Showroom/Catalog), matriz de decisiones y reglas de override. | IAs al planificar o crear apps |
| [**`02-workflow.md`**](./02-workflow.md) | **Flujo de Trabajo Operativo**: Comandos de desarrollo local, pipeline de iconos, compilación de producción y validación PWA. | Humanos e IAs en ejecución de tareas |
| [**`05-testing.md`**](./05-testing.md) | **Estrategia de Testing**: Configuración centralizada de Vitest, proyectos modulares, mocks globales y cobertura. | IAs y desarrolladores al probar código |
| [**`06-changelog-versioning.md`**](./06-changelog-versioning.md) | **Versionado y CHANGELOGs**: Política y formato SemVer para generación de CHANGELOGs bilingües a pedido del usuario. | IAs y desarrolladores en entregas |

---

### Nivel 2: Documentación de Aplicaciones (`<app>/docs/`)

Cada aplicación contiene su propia carpeta `docs/` con su modelo de dominio, reglas de negocio, DTOs y decisiones de override arquitectónico:

| Aplicación | Documento Local | Tipo de App | Foco del Documento |
|---|---|---|---|
| **Zound Box** | [`zound-box/docs/README.md`](../zound-box/docs/README.md) | Single-Screen Utility | Motor de audio multicanal en bucle, DTOs (`SoundItem`, `SoundChannel`), reglas de atenuación, override sin router. |
| **Kitchensink** | [`kitchensink/docs/README.md`](../kitchensink/docs/README.md) | Showroom & Blueprint | Catálogo exhaustivo de iconos, layout maestro-esclavo con `vue-router`, guía paso a paso para crear nuevas apps. |

---

### Nivel 2: Documentación de Librerías Compartidas (`shared/<lib>/docs/`)

Cada librería compartida contiene su propia carpeta `docs/` detallando su API, componentes, contratos y utilidades:

| Librería | Paquete npm | Documento Local | Foco del Documento |
|---|---|---|---|
| **ui-core** | `@zn-apps/ui-core` | [`shared/ui-core/docs/README.md`](../shared/ui-core/docs/README.md) | Design System Material Design 3, tokens `--md-*`, API completa de componentes (`Zn*`), composables (`useDialogs`, `useOnlineStatus`) y pipeline de chunks SVG. |
| **settings-core** | `@zn-apps/settings-core` | [`shared/settings-core/docs/README.md`](../shared/settings-core/docs/README.md) | Documento JSON de settings con proxy profundo, definiciones por defecto y persistencia en `localStorage`. |
| **ui-about** | `@zn-apps/ui-about` | [`shared/ui-about/docs/README.md`](../shared/ui-about/docs/README.md) | Componente neutral de "Acerca de" (`ZnAbout`) y extractor de metadatos de aplicación desde `package.json`. |
| **pwa-integration** | `@zn-apps/pwa-integration` | [`shared/pwa-integration/docs/README.md`](../shared/pwa-integration/docs/README.md) | Detección de PWA, esquema de color del sistema, sincronización dinámica de barras (`theme-color`, fondo) y popup interactivo de instalación (`ZnPwaInstallPrompt`). |
| **ui-data-core** | `@zn-apps/ui-data-core` | [`shared/ui-data-core/docs/README.md`](../shared/ui-data-core/docs/README.md) | Contrato del esquema, utilidades de rutas JSON anidadas, defaults y formato de valores para la familia `ui-data-*`. |
| **ui-data-form** | `@zn-apps/ui-data-form` | [`shared/ui-data-form/docs/README.md`](../shared/ui-data-form/docs/README.md) | Formularios por secciones derivados de un esquema, con borrador, doble binding opcional y acciones save/cancel/reset/clear. |
| **ui-data-view** | `@zn-apps/ui-data-view` | [`shared/ui-data-view/docs/README.md`](../shared/ui-data-view/docs/README.md) | Presentación de sólo lectura del mismo esquema, con etiquetas encima o en línea y valores formateados. |
| **ui-data-editor** | `@zn-apps/ui-data-editor` | [`shared/ui-data-editor/docs/README.md`](../shared/ui-data-editor/docs/README.md) | Presentación tipo vista con edición por campo en un diálogo (`ZnDataEditor`). |

---

## 🤖 Guía de Consulta Rápida para Agentes de IA

Cuando recibas una tarea en este repositorio:
1. **Para entender la arquitectura monorepo o flujos generales**: Lee [`docs/00-overview.md`](./00-overview.md) y [`docs/02-workflow.md`](./02-workflow.md).
2. **Para crear o categorizar una aplicación**: Lee [`docs/01-app-types.md`](./01-app-types.md) y [`kitchensink/docs/README.md`](../kitchensink/docs/README.md).
3. **Para usar o modificar componentes de UI**: Consulta [`shared/ui-core/docs/README.md`](../shared/ui-core/docs/README.md).
4. **Para trabajar con settings persistidos**: Consulta [`shared/settings-core/docs/README.md`](../shared/settings-core/docs/README.md).
5. **Para trabajar en Zound Box**: Lee [`zound-box/docs/README.md`](../zound-box/docs/README.md).
6. **Para escribir o ejecutar tests**: Consulta [`docs/05-testing.md`](./05-testing.md).
