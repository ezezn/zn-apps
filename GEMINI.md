# Reglas y Contexto para Gemini / Antigravity

> Archivo de descubrimiento automático para **Antigravity** y **Gemini CLI**.

## 📖 Documentación Obligatoria

Al trabajar en este monorepo, **debes consultar primero los archivos de contexto técnico en `docs/`**:

- [`docs/00-overview.md`](./docs/00-overview.md) — Visión general, arquitectura de monorepo, CI/CD y convenciones.
- [`docs/01-shared.md`](./docs/01-shared.md) — API completa de `@zn-apps/ui-core` (props, slots, eventos, tokens MD3).
- [`docs/02-app-zound-box.md`](./docs/02-app-zound-box.md) — Arquitectura de Zound Box y estado actual.
- [`docs/03-app-kitchensink.md`](./docs/03-app-kitchensink.md) — Catálogo de componentes y plantilla para nuevas apps.
- [`docs/05-testing.md`](./docs/05-testing.md) — Estrategia de tests unitarios, mocks y comandos.
- [`README.md`](./README.md) — Guía humana de ejecución local, build y estructura.

## 📌 Reglas Clave de Desarrollo

1. **Librerías Compartidas Aisladas:**
   - `shared/` contiene librerías independientes: `shared/ui-core/` (`@zn-apps/ui-core`) y `shared/storage/` (`@zn-apps/storage`).
   - Todo componente compartido debe vivir en `shared/ui-core/src/components/` con prefijo `Zn` (ej. `ZnButton`, `ZnCard`).
   - Respetar los tokens de Material Design 3 (`--md-*`).
   - Las librerías compartidas no deben importarse entre sí.
2. **Independencia de Aplicaciones:**
   - No acoplar apps entre sí ni compartir stores de Pinia entre distintas aplicaciones.
   - Cada app se compila con base URL `/zn-apps/<nombre>/`.
3. **Calidad y Tests:**
   - Toda modificación de código debe validarse ejecutando `npm run test:run`.
   - Si creas o modificas componentes en `ui-core`, crea o actualiza su test en `shared/ui-core/src/**/__tests__/`; para `storage`, usa `shared/storage/src/__tests__/`.
   - Asegurar que `npm run build:all` compile exitosamente.
