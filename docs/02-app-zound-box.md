# App: Zound Box — Contexto de IA

> Documento de contexto rápido para IA. Actualizado: 2026-10-28.

## Descripción

**Zound Box** es la **primera aplicación productiva** del monorepo. Es una PWA de una sola pantalla orientada a mostrar/reproducir contenido de audio. Su nombre y el ícono de nota musical sugieren una app de gestión o reproducción de sonidos/música.

**Estado:** Primera app en producción real. Branch principal activo.

---

## Ubicación y URLs

| Recurso | Valor |
|---|---|
| Carpeta | `zound-box/` |
| Base URL | `/zn-apps/zound-box/` |
| URL producción | `https://<usuario>.github.io/zn-apps/zound-box/` |

---

## Stack Específico

| Tecnología | Versión | Nota |
|---|---|---|
| Vue 3 | ~3.5.34 | Composition API + `<script setup>` |
| Vite | ~5.0 | Build tool |
| vite-plugin-pwa | ~0.20.0 | PWA manifest + Service Worker |
| @zn-apps/shared | `*` (workspace) | Librería interna |
| **Sin vue-router** | — | App de una sola pantalla |
| **Sin Pinia** | — | Estado local con `ref()` |

---

## Estructura de Archivos

```
zound-box/
├── index.html            # HTML root (título: "pwa-app1" — pendiente actualizar)
├── package.json          # name: "zound-box"
├── vite.config.js        # base: '/zn-apps/zound-box/', VitePWA config
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js           # createApp(App).mount('#app')
    ├── App.vue           # Componente raíz — UI completa
    ├── style.css         # (archivo existente, estilos overrideados por shared)
    └── assets/
        ├── hero.png
        ├── vite.svg
        └── vue.svg
```

> **Nota:** No existe subcarpeta `views/` ni `router/` — toda la UI vive en `App.vue`.

---

## Configuración PWA (vite.config.js)

```js
base: '/zn-apps/zound-box/'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Zound Box',
    short_name: 'App1',           // pendiente actualizar a 'zound-box'
    description: 'PWA número uno independiente',
    start_url: '/zn-apps/zound-box/index.html',
    scope: '/zn-apps/zound-box/',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone'
  }
})
```

> **Pendiente:** `short_name` dice 'App1' — debería ser 'Zound Box'.

---

## Arquitectura de la App (`App.vue`)

### Árbol de componentes

```
ZnApp (modo controlado por isDarkMode)
  └── ZnScreen (title="Zound Box", icon=nota musical SVG)
        ├── [slot #actions] → ZnSwitch (v-model=isDarkMode, icons sol/luna)
        └── [contenido principal]
              ├── ZnSection "1. Variantes de Énfasis" (collapsible)
              │     └── showcase-grid con 5 ZnButton (filled/tonal/elevated/outlined/text)
              ├── ZnSection "2. Botones con Iconos" (collapsible, expanded=true)
              │     └── showcase-grid con ZnButton+icon (filled+play, outlined+download)
              ├── ZnSection "3. Botones de Icono Puro" (collapsible)
              │     └── ZnButton iconOnly (filled/tonal/text)
              ├── ZnSection "4. Estado Deshabilitado" (collapsible)
              │     └── ZnButton :disabled=true (filled/outlined)
              ├── ZnSection "5. Variantes de ZnCard" (collapsible)
              │     └── card-showcase-grid con ZnCard (filled/elevated/outlined)
              ├── ZnSection "6. Selectores ZnSwitch" (collapsible)
              │     └── ZnSwitch x3 (switchA/B/C con labels e iconos)
              ├── ZnSection "7. Sistema de Grilla" (collapsible, columns=4)
              │     └── ZnBox + ZnCard con zn-span-2 / zn-span-3
              └── ZnSection "8. Grilla de Alta Densidad" (collapsible, columns=6, expanded=false)
                    └── 6 ZnButton variantes + iconOnly
```

### Estado local reactivo

```js
const isDarkMode = ref(false)   // Controla el modo visual de ZnApp
const switchA = ref(true)       // Estado de switch de ejemplo A
const switchB = ref(false)      // Estado de switch de ejemplo B
const switchC = ref(false)      // Estado de switch de ejemplo C
```

### Imports

```js
import '@zn-apps/shared/dist/shared.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton, ZnBox, ZnSwitch } from '@zn-apps/shared'
```

---

## Funcionalidad Actual

> **Importante para IA:** El estado actual de `zound-box` es un **showroom / demostración** de los componentes de `@zn-apps/shared`. Actualmente NO tiene funcionalidad real de audio/música más allá de los íconos y el nombre.

El contenido es prácticamente idéntico al `App.vue` del kitchensink, con ligeras variaciones en el texto de las secciones. Esto es temporal: la app debe evolucionar hacia su funcionalidad real de "caja de sonidos".

---

## Lineamientos para Nuevas Funcionalidades

Al desarrollar en `zound-box`:

1. **No crear router:** si se necesitan múltiples vistas, crear componentes de vista e intercambiarlos con `v-if/v-show`, o añadir `vue-router` si la complejidad lo justifica.
2. **Usar componentes de `@zn-apps/shared`:** NO crear estilos propios para patrones ya cubiertos (botones, cards, switches, layouts).
3. **Estado local:** usar `ref()` y `reactive()` de Vue. Si el estado se complejiza, añadir una store Pinia **local a la app** (no compartida).
4. **No acoplar a otras apps:** zound-box es independiente. No importar de `kitchensink/` u otras apps.
5. **PWA:** la app debe funcionar offline. Usar `useOnlineStatus()` de shared si es necesario mostrar estado de conexión.

---

## Tareas Pendientes Identificadas

- [ ] Actualizar `short_name` del manifest PWA de `'App1'` a `'Zound Box'`.
- [ ] Actualizar `<title>` del `index.html` (actualmente dice `'pwa-app1'`).
- [ ] Implementar funcionalidad real de audio (reproducción, gestión de sonidos).
- [ ] Separar el showroom de componentes de la lógica real de la app.
