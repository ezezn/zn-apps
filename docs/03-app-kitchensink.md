# App: Kitchensink — Contexto de IA

> Documento de contexto rápido para IA. Actualizado: 2026-10-28.

## Descripción

**Kitchensink** es el **catálogo visual de componentes** del monorepo. Funciona como una mini-documentación interactiva de `@zn-apps/shared`. Su propósito es doble:

1. **Referencia de desarrollo:** ver todos los componentes con sus variantes y props en acción.
2. **Plantilla base:** es la referencia arquitectónica para nuevas apps (reemplazará a `pwa-app1/2` como template).

---

## Ubicación y URLs

| Recurso | Valor |
|---|---|
| Carpeta | `kitchensink/` |
| Base URL | `/zn-apps/kitchensink/` |
| URL producción | `https://<usuario>.github.io/zn-apps/kitchensink/` |

---

## Stack Específico

| Tecnología | Versión | Nota |
|---|---|---|
| Vue 3 | ~3.5.34 | Composition API + `<script setup>` |
| vue-router | ~4.6.4 | Multi-página — única app con router activo |
| Vite | ~5.0 | Build tool |
| vite-plugin-pwa | ~0.20.0 | PWA manifest + Service Worker |
| @zn-apps/shared | `*` (workspace) | Librería interna |

---

## Estructura de Archivos

```
kitchensink/
├── index.html            # HTML root
├── package.json          # name: "kitchensink"
├── vite.config.js        # base: '/zn-apps/kitchensink/', VitePWA config
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js           # createApp + router + mount
    ├── App.vue           # Shell: ZnApp + ZnNavigationLayout + router-view
    ├── style.css         # Estilos locales (nav-item, logo)
    ├── router/
    │   └── index.js      # Rutas: /buttons, /cards, /switches
    └── views/
        ├── ButtonsPage.vue    # Catálogo de ZnButton
        ├── CardsPage.vue      # Catálogo de ZnCard
        └── SwitchesPage.vue   # Catálogo de ZnSwitch
```

---

## Configuración PWA (vite.config.js)

```js
base: '/zn-apps/kitchensink/'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Dev Kitchensink',
    short_name: 'kitchensink',
    description: 'Kitchensink for the local Material UI and helpers of this monorepo',
    start_url: '/zn-apps/kitchensink/index.html',
    scope: '/zn-apps/kitchensink/',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone'
  }
})
```

---

## Arquitectura de la App

### Inicialización (`main.js`)

```js
import { createApp } from 'vue'
import { router } from './router/index.js'
import App from './App.vue'

createApp(App).use(router).mount('#app')
```

### Shell (`App.vue`)

El componente raíz configura el layout de navegación y delega el contenido al router.

```
ZnApp (:mode="isDarkMode ? 'dark' : 'light'")
  └── ZnNavigationLayout
        ├── [slot #aside-header] → "🧬 ZnComponents Hub"
        ├── [slot #aside] → router-links (Botones / Tarjetas / Selectores)
        └── [default] → <router-view />
```

**Estado local:**
```js
const isDarkMode = ref(false)
```

> **Nota:** El modo oscuro en kitchensink aún es un `ref` local que NO está conectado a `ZnApp` a través de ningún mecanismo persistente. Es manual.

### Router (`src/router/index.js`)

```js
// Historial web (requiere 404.html fallback en GitHub Pages)
createWebHistory()

const routes = [
  { path: '/',         redirect: '/buttons' },
  { path: '/buttons',  name: 'buttons',  component: ButtonsPage },
  { path: '/cards',    name: 'cards',    component: CardsPage },
  { path: '/switches', name: 'switches', component: SwitchesPage }
]
```

### Estilos de navegación (en `App.vue`)

```css
.nav-item               → padding 12px 16px, border-radius 100px (pastillas MD3)
.nav-item:hover         → fondo --md-surface-variant
.router-link-active     → fondo --md-primary, color --md-on-primary
```

---

## Páginas (Views)

### `ButtonsPage.vue`
Catálogo completo de `ZnButton`:
- **Sección 1:** 5 variantes de énfasis (filled / tonal / elevated / outlined / text)
- **Sección 2:** Botones con slot `#icon` (SVG)
- **Sección 3:** Modo `iconOnly` (filled, tonal, text)

**Imports:**
```js
import { ZnScreen, ZnSection, ZnButton } from '@zn-apps/shared'
```

---

### `CardsPage.vue`
Catálogo de `ZnCard`:
- Variantes: `filled`, `elevated`, `outlined`
- Con imagen en modo `'header'` y `'full'`

**Imports:**
```js
import { ZnScreen, ZnSection, ZnCard } from '@zn-apps/shared'
```

---

### `SwitchesPage.vue`
Catálogo de `ZnSwitch`:
- Switch básico con `v-model`
- Switch con etiquetas izquierda/derecha
- Switch con iconos en el actuador (sol/luna)
- Indicador de estado reactivo

**Estado local:**
```js
const switchState = ref(false)
```

**Imports:**
```js
import { ZnScreen, ZnSection, ZnSwitch } from '@zn-apps/shared'
```

---

## Rol como Plantilla para Nuevas Apps

Kitchensink define la **estructura estándar** que deben seguir las nuevas apps del monorepo:

```
nueva-app/
├── index.html
├── package.json          → dependencies: vue, @zn-apps/shared; devDeps: vite, plugin-vue, plugin-pwa
├── vite.config.js        → base: '/zn-apps/nueva-app/', VitePWA config
└── src/
    ├── main.js           → createApp + (optional router) + mount
    ├── App.vue           → <ZnApp> + layout principal
    ├── style.css         → estilos locales mínimos
    ├── router/           → (solo si es multi-página)
    │   └── index.js
    └── views/            → (solo si es multi-página)
        └── HomePage.vue
```

**Checklist para nueva app:**
- [ ] Nombre correcto en `package.json` y `vite.config.js`
- [ ] `base` URL correcta en vite
- [ ] PWA manifest con `name`, `short_name`, `description`, `start_url`, `scope`
- [ ] `import '@zn-apps/shared/dist/shared.css'` en el entry
- [ ] `ZnApp` como componente raíz con prop `mode`
- [ ] Añadir al `workspaces` en root `package.json`
- [ ] Añadir al script `build:all` en root `package.json`
- [ ] Añadir al workflow de GitHub Actions si corresponde

---

## Lineamientos de Desarrollo en Kitchensink

1. **Solo documentar componentes de `@zn-apps/shared`**: no implementar lógica de negocio real.
2. **Cada nuevo componente en shared** debe tener una sección o página en kitchensink.
3. **Naming de rutas:** usar el nombre del componente en plural → `/buttons`, `/cards`, `/switches`.
4. **No añadir estado global:** kitchensink no necesita Pinia.
5. **Patrones de showcase:** cada variante del componente va en un `.showcase-item` dentro de un `.component-showcase-grid`.
