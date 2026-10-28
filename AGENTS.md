# AGENTS.md — Instructions for AI Coding Assistants

> This file is automatically loaded by Antigravity, OpenAI Codex, and other AI coding agents when working in this repository.

## 🚨 Mandatory: Read Documentation First

Before making modifications, generating components, or refactoring code in this monorepo, **you MUST inspect the relevant documentation files in the `docs/` folder**:

| Topic | Primary Document to Read |
|---|---|
| **Monorepo Architecture & Conventions** | [`docs/00-overview.md`](./docs/00-overview.md) |
| **Component Library (@zn-apps/shared API)** | [`docs/01-shared.md`](./docs/01-shared.md) |
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
2. **Shared UI Library (`@zn-apps/shared`)**:
   - All shared components live in `shared/src/components/` and are prefixed with `Zn` (e.g. `ZnButton`, `ZnCard`, `ZnSwitch`, `ZnScreen`, `ZnSection`, `ZnApp`).
   - Apps consume the library via npm workspace: `"@zn-apps/shared": "*"`.
   - Never duplicate buttons, cards, or theme logic inside individual apps if an existing `Zn*` component covers it.
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
- If you add or modify a component in `shared`, add/update its corresponding unit test in `shared/src/components/__tests__/`.
- Do not bypass mocks: `window.matchMedia` and `IntersectionObserver` are mocked in `vitest.setup.js`.

---

## 📦 Build Verification

Before concluding a task that alters build configurations or code, verify that:
```bash
npm run test:run
npm run build:all
```
Both commands must exit with code 0.
