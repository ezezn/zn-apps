# 🌐 zn-apps — multi-PWA monorepo

> Monorepo of independent **Progressive Web Apps** built with **Vue 3**, **Vite** and **Material Design 3**, orchestrated with **npm workspaces** and deployed to **GitHub Pages**.

**Documentation:** [English](./doc/en/README.md) · [Español](./doc/es/README.md) · AI agents start at [`ai/README.md`](./ai/README.md)

---

## 📱 Projects

| Project | Folder | Role | Deploy path |
|---|---|---|---|
| **Landing portal** | `index.html` | Launcher for every PWA | `/zn-apps/` |
| **@zn-apps/ui-core** | [`shared/ui-core/`](./shared/ui-core) | MD3 design system: components, tokens, composables, icons | library |
| **@zn-apps/settings-core** | [`shared/settings-core/`](./shared/settings-core) | Deep JSON settings with local persistence | library |
| **@zn-apps/ui-about** | [`shared/ui-about/`](./shared/ui-about) | About panel built on `ui-core` | library |
| **@zn-apps/pwa-integration** | [`shared/pwa-integration/`](./shared/pwa-integration) | PWA state, theme sync, install/update popups | library |
| **@zn-apps/ui-data-** | [`shared/`](./shared) | Schema-driven form, view, editor and rich text | libraries |
| **@zn-apps/ui-calendar** | [`shared/ui-calendar/`](./shared/ui-calendar) | MD3 calendars: month/week/day, single or range selection, events | library |
| **Zound Box** | [`zound-box/`](./zound-box) | Ambient audio mixer PWA | `/zn-apps/zound-box/` |
| **Kitchensink** | [`kitchensink/`](./kitchensink) | Showroom, icon catalog and blueprint for new apps | `/zn-apps/kitchensink/` |
| **Daily Task Report** | [`daily-task-report/`](./daily-task-report) | Local task tracker with configurable entity naming | `/zn-apps/daily-task-report/` |

Each project keeps its own user manual in `doc/en/README.md` and `doc/es/README.md`, and its agent context in `ai/README.md`.

---

## 🛠️ Requirements

- **Node.js** 24.x recommended (20+ supported)
- **npm** 10+

## 🚀 Install

```bash
git clone https://github.com/<user>/zn-apps.git
cd zn-apps
npm install
```

## 💻 Local development

```bash
npm run dev --workspace=kitchensink
npm run dev --workspace=daily-task-report
npm run dev --workspace=zound-box
npm run dev --workspace=@zn-apps/ui-core   # library watch build
```

## 🧪 Tests

```bash
npm test                    # watch
npm run test:run            # full suite once (CI)
npm run test:coverage
npm run test:shared
npm run test:zound-box
npm run test:kitchensink
npm run test:daily-task-report
```

Run the narrowest scope that covers your change; the full suite is for cross-project or release-level verification. Documentation-only changes need no tests or builds.

## 📦 Build

```bash
npm run build:shared
npm run build:zound-box
npm run build:kitchensink
npm run build:daily-task-report
npm run build:production   # full dist/ + validate:pwa
npm run build:icons        # scan + generate icon sprites (commit the result)
```

## 🚢 Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install → `npm run test:run` → `npm run build:production` → `404.html` fallbacks → GitHub Pages at `/zn-apps/`.

---

## 📚 Documentation

| Tree | Audience | Language |
|---|---|---|
| [`doc/en`](./doc/en/README.md) / [`doc/es`](./doc/es/README.md) | Developers and users: architecture, workflow, app types, conventions | English and Spanish |
| `<project>/doc/{en,es}/` | Per-app / per-library manual | English and Spanish |
| [`ai/`](./ai/README.md) | AI coding agents: compact architecture, contracts, APIs, decisions | English |

- [Getting started](./doc/en/getting-started.md) · [Empezar](./doc/es/getting-started.md)
- [Architecture](./doc/en/architecture.md) · [Arquitectura](./doc/es/architecture.md)
- [App types](./doc/en/app-types.md) · [Tipos de app](./doc/es/app-types.md)
- [Conventions](./doc/en/conventions.md) · [Convenciones](./doc/es/conventions.md)
