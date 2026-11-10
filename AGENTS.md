# AGENTS.md — Instructions for AI Coding Assistants

> This file is automatically loaded by Antigravity, OpenAI Codex, and other AI coding agents when working in this repository.

## 🚨 Mandatory: Read Documentation First

Before making modifications, generating components, or refactoring code in this monorepo, **you MUST inspect the relevant documentation**.
Documentation follows a **two-tier architecture**:

### Tier 1: Monorepo Root Documentation (`docs/`)
Lineamientos generales de arquitectura, taxonomía de aplicaciones y procesos del monorepo:

| Topic | Document |
|---|---|
| **Master Documentation Index** | [`docs/README.md`](./docs/README.md) |
| **Monorepo Architecture & Conventions** | [`docs/00-overview.md`](./docs/00-overview.md) |
| **App Typology & Override Guidelines** | [`docs/01-app-types.md`](./docs/01-app-types.md) |
| **Workflow, Builds, Icons & PWA** | [`docs/02-workflow.md`](./docs/02-workflow.md) |
| **Testing Guidelines & Mock Setup** | [`docs/05-testing.md`](./docs/05-testing.md) |
| **Versioning & CHANGELOG Guidelines** | [`docs/06-changelog-versioning.md`](./docs/06-changelog-versioning.md) |
| **General Developer Guide** | [`README.md`](./README.md) |

### Tier 2: Project-Specific Documentation (`<app>/docs/` & `shared/<lib>/docs/`)
Contiene la arquitectura local, decisiones de override, dominio, DTOs y reglas de negocio encapsuladas en cada proyecto:

| Project | Specific Documentation | Focus & Scope |
|---|---|---|
| **@zn-apps/ui-core** | [`shared/ui-core/docs/README.md`](./shared/ui-core/docs/README.md) | MD3 Design System, tokens `--md-*`, complete component API, composables, SVG sprite chunks |
| **@zn-apps/settings-core** | [`shared/settings-core/docs/README.md`](./shared/settings-core/docs/README.md) | Deep JSON settings proxy, nested definitions and localStorage persistence |
| **@zn-apps/ui-about** | [`shared/ui-about/docs/README.md`](./shared/ui-about/docs/README.md) | Neutral `ZnAbout` panel, package.json metadata extraction & app integration |
| **@zn-apps/pwa-integration** | [`shared/pwa-integration/docs/README.md`](./shared/pwa-integration/docs/README.md) | PWA state detection, system color scheme, dynamic bar styling & install popup |
| **Zound Box** | [`zound-box/docs/README.md`](./zound-box/docs/README.md) | Audio mixer architecture, sound channels domain, DTOs (`SoundItem`, `SoundChannel`), overrides (no-router, local reactive state) |
| **Kitchensink** | [`kitchensink/docs/README.md`](./kitchensink/docs/README.md) | Showroom, full icon catalog integration, master-slave layout, step-by-step blueprint for new apps |

---

## 🏗️ Core Architecture Principles

1. **Independent PWAs**:
   - Each app (`zound-box`, `kitchensink`, etc.) is an autonomous SPA with its own `vite.config.js`, `package.json`, and service worker.
   - **Never share Pinia state across apps**. State is strictly per-application.
   - Applications must be deployed relative to subpaths: `/zn-apps/<app-name>/`.
2. **Shared libraries (isolated workspaces)**:
   - `shared/` contains isolated libraries. Each has its own `package.json`, `vite.config.js` and `vitest.config.js`.
   - `shared/ui-core/` (`@zn-apps/ui-core`): all shared components live in `shared/ui-core/src/components/` and are prefixed with `Zn` (e.g. `ZnButton`, `ZnCard`, `ZnSwitch`, `ZnScreen`, `ZnSection`, `ZnApp`).
   - `shared/settings-core/` (`@zn-apps/settings-core`): deep settings proxy with nested defaults and a single persisted JSON document.
   - Apps consume the libraries via npm workspaces.
   - Never duplicate buttons, cards, or theme logic inside individual apps if an existing `Zn*` component covers it.
   - Shared libraries must not import from each other; only apps compose them.
3. **Design System (Material Design 3)**:
   - Uses CSS custom properties prefixed with `--md-*` (e.g. `--md-primary`, `--md-surface`).
   - Root theme switching is handled exclusively by `ZnApp` (`mode="light | dark | system"`).
4. **Internationalization**:
   - All applications use Vue I18n with `en` and `es` messages.
   - Initial locale priority is `settings.i18n.locale`, then the system language, then `en`.
   - Each app uses its own `@zn-apps/settings-core` namespace.
5. **Templates & New Apps**:
   - When creating a new application, use `kitchensink/` as the blueprint.

---

## 🧪 Testing Policy (Vitest)

- Unit and component tests are run with Vitest and happy-dom.
- **Run tests when they help verify the change**. Choose the narrowest relevant project or test file; run the full `npm run test:run` suite when the change spans projects, affects shared behavior, or carries broader regression risk. Code changes do not automatically require the full suite.
- **Documentation-only changes**: If a task ONLY touches documentation (`.md` files, READMEs), **DO NOT run tests**.
- If you add or modify a component in `ui-core`, add/update its corresponding unit test in `shared/ui-core/src/components/__tests__/`.
- Do not bypass mocks: `window.matchMedia` and `IntersectionObserver` are mocked in `vitest.setup.js`.

---

## 📦 Icon Chunk System

Cada proyecto genera su propio chunk de iconos (`ZnIcon`), filtrado a los nombres
de su `icon-profile.json`. Nunca se publica la colección completa salvo que el
proyecto la declare explícitamente en `manual`.

| Proyecto | Perfil | Destino del chunk | Contenido |
|---|---|---|---|
| `@zn-apps/ui-core` | `shared` | Distribución de la librería | Solo los iconos usados por sus componentes |
| `zound-box` | `app:zound-box` | `zound-box/public/icons/` → `dist/icons/` | Sus iconos |
| `kitchensink` | `app:kitchensink` | `kitchensink/public/icons/` → `dist/icons/` | Sus iconos + el catálogo completo declarado en `manual` |

`ZnIcon` descarga el sprite de cada familia desde
`<BASE_URL>icons/sprite-<familia>.svg` la primera vez que lo necesita y lo
inyecta una sola vez en el documento. Los chunks de las apps incluyen además los
iconos que usan los componentes de `ui-core`.

### Comandos

```bash
npm run scan:icons          # escanea cada proyecto → icon-profile.json (scanned + manual)
npm run generate:icons      # genera todos los chunks de sprite (shared + apps)
npm run build:icons         # scan + generate; luego subir perfiles/sprites por Git
npm run build:production    # build sin escanear ni regenerar iconos
```

La generación de iconos es manual. Los sprites versionados en `public/icons/`
se usan en desarrollo y producción; Vite los copia a `dist/`.

### Flujo de CI (deploy.yml)

```text
npm install
npm run test:run
npm run build:production   # consume sprites versionados, no genera iconos
```

La orden de `build:production` es:

1. `build:shared` (ui-core, settings-core, ui-about y pwa-integration)
2. `build:zound-box`
3. `build:kitchensink`

Antes de integrar usos nuevos, ejecuta `npm run build:icons` y sube los perfiles
y sprites actualizados al repositorio.

## 📲 PWA Installability for New Apps

When adding an app from `kitchensink/`, keep it independently installable:

- Add an editable `public/pwa-icon.svg` and local PNG exports at 192×192 and
  512×512. Keep artwork inside the maskable safe area.
- Declare both PNG files in `VitePWA({ manifest: { icons } })` with their exact
  sizes, `type: "image/png"`, `purpose: "any maskable"`, and app-relative paths.
- Keep `name` or `short_name`, `start_url`, `scope`, and `display: "standalone"`
  valid for the app's `/zn-apps/<app-name>/` deployment path.
- Add the app to the monorepo production build so `npm run validate:pwa` checks
  its generated manifest and verifies that both PNGs exist with correct sizes.

---

## 📦 Build Verification

For changes to executable code or build configuration, select verification that matches the scope and regression risk. A full test suite and monorepo build are not mandatory for every code change. Use `npm run test:run` and `npm run build:all` for cross-project or release-level verification. CI still runs the full suite and production build before deployment.
```bash
npm run test:zound-box
npm run build:zound-box
```

> **Documentation-only tasks**: Do not run builds or tests when a task changes only Markdown documentation.
