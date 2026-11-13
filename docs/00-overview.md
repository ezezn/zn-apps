# ZN-Apps Monorepo — Visión General de Arquitectura

> Documento raíz de arquitectura para desarrolladores e IAs.

---

## 1. ¿Qué es este repositorio?

`zn-apps` es un **monorepo de aplicaciones web progresivas (PWAs)** construidas con **Vue 3**, diseñadas para funcionar de manera independiente, compartiendo un sistema de diseño común basado en **Material Design 3 (MD3)** y utilidades compartidas.
El monorepo está alojado en GitHub y se compila y despliega de manera automatizada a **GitHub Pages** mediante GitHub Actions bajo la URL base `/zn-apps/`.

---

## 2. Stack Tecnológico Central

| Capa | Tecnología | Notas |
|---|---|---|
| UI Framework | **Vue 3** | Composition API + `<script setup>` (v~3.5) |
| Build Tool | **Vite 6** | Configuración independiente por subproyecto |
| Sistema de Paquetes | **npm workspaces** | Gestión unificada de dependencias (Node >= 20) |
| Sistema de Diseño | **Material Design 3 (MD3)** | Variables CSS (`--md-*`) y componentes compartidos |
| PWA Engine | **vite-plugin-pwa** | Service worker y manifiesto independiente por app |
| Testing | **Vitest 5 + happy-dom** | Suite modular centralizada con proyectos Vitest |
| Routing | **vue-router 4** | Opcional, reservado para apps multi-pantalla |
| Tipografía | **Roboto** (`@fontsource/roboto`) | Pesos 400 y 500 provistos por `ui-core` |
| Internacionalización | **Vue I18n** (`vue-i18n`) | Inglés y español en todas las aplicaciones, con resolución por settings, sistema e inglés |
| CI/CD | **GitHub Actions** | Validación, build y deploy automático en `push: main` |

---

## 3. Estructura del Monorepo y Modelo de Documentación

El repositorio utiliza una arquitectura de documentación en dos niveles:

```
zn-apps/
├── docs/                     # 📚 NIVEL 1: DOCUMENTACIÓN RAÍZ DEL MONOREPO
│   ├── README.md             # Índice maestro de documentación para IA y humanos
│   ├── 00-overview.md        # Visión general y arquitectura del monorepo (este archivo)
│   ├── 01-app-types.md       # Tipología de apps y criterios de override de arquitectura
│   ├── 02-workflow.md        # Guía operativa: desarrollo, builds, iconos, PWA y CI/CD
│   └── 05-testing.md         # Estrategia de testing, mocks globales y configuración Vitest
│
├── shared/                   # 📦 LIBRERÍAS COMPARTIDAS (AISLADAS)
│   ├── ui-core/              # @zn-apps/ui-core (Componentes MD3, temas, iconos)
│   │   └── docs/README.md    # 📖 Docs propias: API de componentes, tokens MD3, iconos
│   ├── settings-core/        # @zn-apps/settings-core (Settings JSON persistidos)
│   │   └── docs/README.md    # 📖 Docs propias: proxy profundo y definiciones
│   ├── ui-about/             # @zn-apps/ui-about (Componente de información de app)
│   │   └── docs/README.md    # 📖 Docs propias: ZnAbout, extracción de package.json
│   ├── pwa-integration/      # @zn-apps/pwa-integration (Detección PWA, tema de sistema, barras e install popup)
│   │   └── docs/README.md    # 📖 Docs propias: useColorScheme, usePwaMeta, ZnPwaInstallPrompt
│   ├── ui-data-core/         # @zn-apps/ui-data-core (Contrato de esquema y utilidades JSON)
│   │   └── docs/README.md    # 📖 Docs propias: FieldTypes, fieldSpan, defaults y formato
│   ├── ui-data-form/         # @zn-apps/ui-data-form (Formularios por secciones)
│   │   └── docs/README.md    # 📖 Docs propias: ZnDataForm, ZnDataField y secciones
│   ├── ui-data-view/         # @zn-apps/ui-data-view (Presentación de sólo lectura)
│   │   └── docs/README.md    # 📖 Docs propias: ZnDataView y formato de valores
│   ├── ui-data-editor/       # @zn-apps/ui-data-editor (Edición por campo en diálogo)
│   │   └── docs/README.md    # 📖 Docs propias: ZnDataEditor y diálogo de edición
│   └── ui-data-richtext/     # @zn-apps/ui-data-richtext (Texto enriquecido con valor Markdown)
│       └── docs/README.md    # 📖 Docs propias: ZnRichTextEditor, ZnRichTextView y conversores
│
├── zound-box/                # 🎵 APLICACIÓN PRODUCTIVA: ZOUND BOX
│   └── docs/README.md        # 📖 Docs propias: Dominio de audio, DTOs, reglas y overrides
│
├── kitchensink/              # 🧬 APLICACIÓN SHOWROOM Y BLUEPRINT
│   └── docs/README.md        # 📖 Docs propias: Catálogo total de iconos, blueprint nueva app
│
├── scripts/                  # Scripts de utilidades (escaneo de iconos, validación PWA)
├── index.html                # Portal/Landing institucional (HTML estático)
├── sw.js                     # Service Worker del portal
├── package.json              # Configuración raíz de npm workspaces y scripts de orquestación
└── vitest.config.js          # Configuración de Vitest que orquesta todos los proyectos
```

---

## 4. Principios Fundamentales de Arquitectura

### 1. Independencia Total de Aplicaciones
- Cada app (`zound-box`, `kitchensink`, etc.) es una SPA/PWA autónoma con su propio `package.json`, `vite.config.js`, `index.html` y Service Worker.
- **Prohibido compartir Pinia cross-app**: Las aplicaciones no deben compartir instancias de store. Cada aplicación es un silo funcional.
- Se publican bajo subrutas independientes: `/zn-apps/<nombre-app>/`.

### 2. Librerías Compartidas Aisladas (`shared/`)
- Cada librería en `shared/` (`ui-core`, `settings-core`, `ui-about`, `pwa-integration` y la familia `ui-data-*`) tiene su propio ciclo de build como ES module (`vite build --lib`), su propio `package.json` y tests unitarios.
- Las librerías de infraestructura no dependen de Vue ni del DOM, mientras que las de UI (`ui-core`) encapsulan el diseño MD3.
- Las librerías no se importan circularmente entre sí; solo se componen explícitamente donde corresponda (ej. `ui-about` consume `ui-core`).

### 3. Sistema de Diseño Material Design 3
- Variables CSS `--md-*` gestionadas de forma centralizada por `shared/ui-core`.
- La alternancia de tema claro/oscuro es gestionada de manera exclusiva por el componente raíz `<ZnApp>`.

### 4. Pipeline de Iconos Optimizado
- Los iconos Material Design se consumen a través de chunks SVG locales generados por proyecto (`ZnIcon`), precacheados por el Service Worker de cada app sin cargar la colección de glifos completa.

### 5. Internacionalización
- Todas las aplicaciones deben integrar **Vue I18n** y declarar mensajes para inglés (`en`) y español (`es`).
- Cada aplicación registra sus preferencias con `@zn-apps/settings-core`, usando `i18n.locale` como configuración opcional. Los valores admitidos son `en`, `es` o `null`/ausente.
- La prioridad de resolución inicial es: idioma explícito guardado en settings, idioma del sistema (`navigator.language`), y `en` como fallback. Los idiomas regionales se normalizan por su código base (`es-MX` → `es`).

### 5. Política de Ejecución de Builds y Tests
- La verificación local se elige según el alcance y el riesgo del cambio. Cuando sea útil, ejecuta los tests o builds más cercanos al código afectado (por ejemplo, `npm run test:zound-box` o `npm run build:zound-box`).
- La suite completa (`npm run test:run`) y el build completo (`npm run build:all`) **no son obligatorios para cada cambio de código**. Úsalos para cambios que atraviesan proyectos, modifican comportamiento compartido o requieren verificación amplia/de release.
- CI conserva su validación completa: antes de desplegar ejecuta la suite completa y el build de producción.
- Para tareas que solo cambian documentación Markdown, no ejecutes tests ni builds.

### 6. Contrato de Campos de Datos (`ui-data-form` / `ui-data-view` / `ui-data-editor`)

La familia `ui-data-*` comparte un único contrato de campos. Toda capacidad que se agregue a la implementación de un campo debe quedar soportada, en el mismo cambio, en **formulario, vista y editor**:

- **Paridad de features**: si un campo gana una prop, estado, variante, tamaño, adorno, layout o comportamiento (por ejemplo `span`, `variant`, `size` o chips), debe reflejarse también en `ZnDataViewField` y en `ZnDataEditorField`/diálogo, no sólo en `ZnDataField`.
- **Nuevo tipo de campo**: agregar un valor a `FieldTypes` exige su implementación en los tres renderizadores:
  1. `ui-data-form`: control de entrada/edición (`ZnDataField`).
  2. `ui-data-view`: representación de sólo lectura (`ZnDataViewField`).
  3. `ui-data-editor`: se apoya en la vista para el trigger y en el formulario para el diálogo; debe verificar que ambos caminos funcionan.
- **Contrato y pruebas**: el tipo se declara/formatea en `ui-data-core`, se documenta en `shared/ui-data-core/docs/` y se cubre con tests en `ui-data-form`, `ui-data-view` y `ui-data-editor` cuando aplique.
- **Layout**: los campos pueden ocupar varias columnas de su sección con `field.span`. El span se limita a las columnas efectivas de la sección y se aplica en los tres renderizadores.
- **Demo**: todo tipo o feature nueva debe tener un ejemplo en Kitchensink que cubra formulario, vista y editor.

---

## 5. Índice de Documentación Relacionada

- [**Lineamientos de Tipos de Apps**](./01-app-types.md) — Arquetipos de aplicaciones y matriz de decisiones.
- [**Flujo de Trabajo del Monorepo**](./02-workflow.md) — Scripts, builds, iconos y despliegue.
- [**Estrategia de Testing**](./05-testing.md) — Vitest, mocks globales y ejecución de pruebas.
- [**Versionado y CHANGELOGs**](./06-changelog-versioning.md) — Política SemVer y generación bilingüe de bitácoras de cambios.
- [**Docs de @zn-apps/ui-core**](../shared/ui-core/docs/README.md) — API completa de componentes y tokens.
- [**Docs de @zn-apps/settings-core**](../shared/settings-core/docs/README.md) — Proxy profundo de configuración JSON persistida.
- [**Docs de @zn-apps/ui-about**](../shared/ui-about/docs/README.md) — Componente Acerca de y utilidades.
- [**Docs de @zn-apps/pwa-integration**](../shared/pwa-integration/docs/README.md) — Integración PWA, tema del sistema, barras y popup de instalación.
- [**Docs de @zn-apps/ui-data-core**](../shared/ui-data-core/docs/README.md) — Contrato de esquema, `FieldTypes`, `fieldSpan` y utilidades.
- [**Docs de @zn-apps/ui-data-form**](../shared/ui-data-form/docs/README.md) — Formularios seccionados con borrador y acciones.
- [**Docs de @zn-apps/ui-data-view**](../shared/ui-data-view/docs/README.md) — Presentación de sólo lectura del esquema.
- [**Docs de @zn-apps/ui-data-editor**](../shared/ui-data-editor/docs/README.md) — Edición por campo con diálogo.
- [**Docs de @zn-apps/ui-data-richtext**](../shared/ui-data-richtext/docs/README.md) — Texto enriquecido HTML5 con valor Markdown.
- [**Docs de Zound Box**](../zound-box/docs/README.md) — Arquitectura de audio, DTOs y reglas de negocio.
- [**Docs de Kitchensink**](../kitchensink/docs/README.md) — Showroom y blueprint para nuevas apps.
