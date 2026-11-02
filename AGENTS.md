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
| **Legacy Templates to Ignore** | [`docs/04-legacy-templates.md`](./docs/04-legacy-templates.md) |
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
   - When creating a new application, use `kitchensink/` as the blueprint, **never** `pwa-app1` or `pwa-app2` (which are legacy templates scheduled for removal).

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

Todos los proyectos generan un chunk de iconos (`ZnIcon`), filtrado a los
nombres que realmente usa cada proyecto. El esquema:

| Proyecto | Chunk | Destino |
|---|---|---|
| `@zn-apps/ui-core` | `shared` (shared) | `shared/ui-core/dist/` |
| `zound-box` | `app:zound-box` | `zound-box/dist/` |
| `kitchensink` | `app:kitchensink` | `kitchensink/dist/` |
| `pwa-app2` | `app:pwa-app2` | `pwa-app2/dist/` |

### Comandos

```bash
npm run scan:icons          # escanea cada proyecto → icon-profile.json (scanned + manual)
npm run generate:icons      # genera todos los chunks de sprite (shared + apps)
npm run build:icons         # scan + generate (modo local)
```

### Flujo de CI (deploy.yml)

```text
npm install
npm run test:run
npm run build:all          # build:icons (scan + generate) para cada proyecto antes de su build
```

`generate:icons` escribe los sprites en `dist/` de cada proyecto. La orden de
build:all es:

1. `build:shared` (ui-core + storage)
2. `build:zound-box` + `generate:icons --profile app:zound-box`
3. `build:app2` + `generate:icons --profile app:pwa-app2`
4. `build:kitchensink` + `generate:icons --profile app:kitchensink`

Este orden asegura que los chunks de iconos estén en `dist/` después del build y
antes de publicar en GitHub Pages.

---

## 📦 Build Verification

Before concluding a task that alters build configurations or code, verify that:
```bash
npm run test:run
npm run build:all
```
Both commands must exit with code 0.
