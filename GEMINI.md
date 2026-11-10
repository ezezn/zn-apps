# Reglas y Contexto para Gemini / Antigravity

> Archivo de descubrimiento automático para **Antigravity** y **Gemini CLI**.

## 📖 Documentación Obligatoria

Al trabajar en este monorepo, **debes consultar la documentación organizada en dos niveles**:

### Nivel 1: Lineamientos Generales del Monorepo (`docs/`)
- [`docs/README.md`](./docs/README.md) — Índice maestro de documentación para IA.
- [`docs/00-overview.md`](./docs/00-overview.md) — Visión general, arquitectura de monorepo, CI/CD y convenciones.
- [`docs/01-app-types.md`](./docs/01-app-types.md) — Tipología de apps, matriz de decisiones y reglas de override.
- [`docs/02-workflow.md`](./docs/02-workflow.md) — Flujos de trabajo, scripts, pipeline de iconos y PWA.
- [`docs/05-testing.md`](./docs/05-testing.md) — Estrategia de tests unitarios, mocks y comandos.
- [`docs/06-changelog-versioning.md`](./docs/06-changelog-versioning.md) — Política SemVer y generación de CHANGELOGs bilingües a pedido.
- [`README.md`](./README.md) — Guía humana de ejecución local, build y estructura.

### Nivel 2: Documentación Específica por Proyecto (`docs/` en cada subproyecto)
- [`shared/ui-core/docs/README.md`](./shared/ui-core/docs/README.md) — API completa de `@zn-apps/ui-core` (props, slots, eventos, tokens MD3).
- [`shared/ui-about/docs/README.md`](./shared/ui-about/docs/README.md) — Componente neutral `ZnAbout` y utilidades de metadatos.
- [`shared/pwa-integration/docs/README.md`](./shared/pwa-integration/docs/README.md) — Detección PWA, tema del sistema, barras y popup de instalación.
- [`zound-box/docs/README.md`](./zound-box/docs/README.md) — Arquitectura de audio, DTOs (`SoundItem`, `SoundChannel`), overrides y reglas de negocio.
- [`kitchensink/docs/README.md`](./kitchensink/docs/README.md) — Catálogo total de iconos, showroom y blueprint para nuevas apps.

## 📌 Reglas Clave de Desarrollo

1. **Librerías Compartidas Aisladas:**
   - `shared/` contiene librerías independientes como `shared/ui-core/` y `shared/settings-core/`.
   - Todo componente compartido debe vivir en `shared/ui-core/src/components/` con prefijo `Zn` (ej. `ZnButton`, `ZnCard`).
   - Respetar los tokens de Material Design 3 (`--md-*`).
   - Las librerías compartidas no deben importarse entre sí.
2. **Independencia de Aplicaciones:**
   - No acoplar apps entre sí ni compartir stores de Pinia entre distintas aplicaciones.
   - Cada app se compila con base URL `/zn-apps/<nombre>/`.
3. **Calidad, Tests y Builds:**
   - Ejecutar `npm run test:run` y `npm run build:all` **ÚNICAMENTE ante cambios relacionados con código** (archivos `.vue`, `.js`, `.css`, configs o dependencias).
   - En tareas de **documentación exclusiva** (archivos `.md`), **NO ejecutar tests ni compilación**.
   - Si creas o modificas componentes en `ui-core`, crea o actualiza su test en `shared/ui-core/src/**/__tests__/`.
