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
│   ├── storage/              # @zn-apps/storage (Persistencia framework-agnostic)
│   │   └── docs/README.md    # 📖 Docs propias: API de storage, DTOs, namespaces
│   ├── ui-about/             # @zn-apps/ui-about (Componente de información de app)
│   │   └── docs/README.md    # 📖 Docs propias: ZnAbout, extracción de package.json
│   └── pwa-integration/      # @zn-apps/pwa-integration (Detección PWA, tema de sistema, barras e install popup)
│       └── docs/README.md    # 📖 Docs propias: useColorScheme, usePwaMeta, ZnPwaInstallPrompt
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
- Cada librería en `shared/` (`ui-core`, `storage`, `ui-about`) tiene su propio ciclo de build como ES module (`vite build --lib`), su propio `package.json` y tests unitarios.
- Las librerías de infraestructura no dependen de Vue ni del DOM (`storage`), mientras que las de UI (`ui-core`) encapsulan el diseño MD3.
- Las librerías no se importan circularmente entre sí; solo se componen explícitamente donde corresponda (ej. `ui-about` consume `ui-core`).

### 3. Sistema de Diseño Material Design 3
- Variables CSS `--md-*` gestionadas de forma centralizada por `shared/ui-core`.
- La alternancia de tema claro/oscuro es gestionada de manera exclusiva por el componente raíz `<ZnApp>`.

### 4. Pipeline de Iconos Optimizado
- Los iconos Material Design se consumen a través de chunks SVG locales generados por proyecto (`ZnIcon`), precacheados por el Service Worker de cada app sin cargar la colección de glifos completa.

### 5. Política de Ejecución de Builds y Tests
- **Solo ante cambios de código**: Los scripts de testing (`npm run test:run`) y construcción de producción (`npm run build:all` / `npm run build:production`) se deben ejecutar **ÚNICAMENTE cuando se modifique código ejecutable** (componentes Vue, scripts JS/MJS, hojas de estilo CSS, configuraciones de empaquetado o dependencias).
- **Exclusión para documentación**: En tareas de documentación pura (archivos Markdown `.md`, notas, diagramas de texto o comentarios), **NO** se deben ejecutar builds ni tests, evitando consumo innecesario de tiempo y recursos.

---

## 5. Índice de Documentación Relacionada

- [**Lineamientos de Tipos de Apps**](./01-app-types.md) — Arquetipos de aplicaciones y matriz de decisiones.
- [**Flujo de Trabajo del Monorepo**](./02-workflow.md) — Scripts, builds, iconos y despliegue.
- [**Estrategia de Testing**](./05-testing.md) — Vitest, mocks globales y ejecución de pruebas.
- [**Docs de @zn-apps/ui-core**](../shared/ui-core/docs/README.md) — API completa de componentes y tokens.
- [**Docs de @zn-apps/storage**](../shared/storage/docs/README.md) — Capa de persistencia con namespace.
- [**Docs de @zn-apps/ui-about**](../shared/ui-about/docs/README.md) — Componente Acerca de y utilidades.
- [**Docs de @zn-apps/pwa-integration**](../shared/pwa-integration/docs/README.md) — Integración PWA, tema del sistema, barras y popup de instalación.
- [**Docs de Zound Box**](../zound-box/docs/README.md) — Arquitectura de audio, DTOs y reglas de negocio.
- [**Docs de Kitchensink**](../kitchensink/docs/README.md) — Showroom y blueprint para nuevas apps.
