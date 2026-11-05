# AGENTS.md — Instructions for AI Coding Assistants

> This file is automatically loaded by Antigravity, OpenAI Codex, and other AI coding agents when working in this repository.

## 🚨 Mandatory: Read Documentation First

Before making modifications, generating components, or refactoring code in this monorepo, **you MUST inspect the relevant documentation files in the `docs/` folder**:

| Topic | Primary Document to Read |
|---|---|
| **Monorepo Architecture & Conventions** | [`docs/00-overview.md`](./docs/00-overview.md) |
| **Component Library (@zn-apps/ui-core API)** | [`docs/01-shared.md`](./docs/01-shared.md) |
| **Zound Box Application** | [`docs/02-app-zound-box.md`](./docs/02-app-zound-box.md) |
| **Kitchensink (Blueprint for New Apps)** | [`docs/03-app-kitchensink.md`](./docs/03-app-kitchensink.md) |
| **Testing Guidelines & Mock Setup** | [`docs/05-testing.md`](./docs/05-testing.md) |
| **General Developer Guide** | [`README.md`](./README.md) |

---

## 🏗️ Core Architecture Principles

1. **Independent PWAs**:
   - Each app (`zound-box`, `kitchensink`, etc.) is an autonomous SPA with its own `vite.config.js`, `package.json`, and service worker.
   - **Never share Pinia state across apps**. State is strictly per-application.
   - Applications must be deployed relative to subpaths: `/zn-apps/<app-name>/`.
2. **Shared libraries (isolated workspaces)**:
   - `shared/` contains isolated libraries. Each has its own `package.json`, `vite.config.js` and `vitest.config.js`.
   - `shared/ui-core/` (`@zn-apps/ui-core`): all shared components live in `shared/ui-core/src/components/` and are prefixed with `Zn` (e.g. `ZnButton`, `ZnCard`, `ZnSwitch`, `ZnScreen`, `ZnSection`, `ZnApp`).
   - `shared/storage/` (`@zn-apps/storage`): framework-agnostic persistence helpers (`createStorage`).
   - Apps consume the libraries via npm workspaces: `"@zn-apps/ui-core": "*"`, `"@zn-apps/storage": "*"`.
   - Never duplicate buttons, cards, or theme logic inside individual apps if an existing `Zn*` component covers it.
   - Shared libraries must not import from each other; only apps compose them.
3. **Design System (Material Design 3)**:
   - Uses CSS custom properties prefixed with `--md-*` (e.g. `--md-primary`, `--md-surface`).
   - Root theme switching is handled exclusively by `ZnApp` (`mode="light | dark | system"`).
4. **Templates & New Apps**:
   - When creating a new application, use `kitchensink/` as the blueprint.

---

## 🧪 Testing Policy (Vitest)

- Unit and component tests are run with Vitest and happy-dom.
- **Always run tests** after modifying code:
  ```bash
  npm run test:run
  ```
- If you add or modify a component in `ui-core`, add/update its corresponding unit test in `shared/ui-core/src/components/__tests__/`. Add storage tests in `shared/storage/src/__tests__/`.
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

1. `build:shared` (ui-core, storage y ui-about)
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

Before concluding a task that alters build configurations or code, verify that:
```bash
npm run test:run
npm run build:all
```
Both commands must exit with code 0.
