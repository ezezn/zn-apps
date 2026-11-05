# App: Zound Box — Contexto de IA

> Documento de contexto rápido para IA. Actualizado: 2026-10-28.

## Descripción

**Zound Box** es la **primera aplicación productiva** del monorepo. Es una PWA de una sola pantalla con tarjetas para seleccionar sonidos de fondo (ruido blanco, lluvia, viento y canción de cuna) y sonidos de seseo (×2, ×3 y ×5). Cada sección funciona como un canal de audio independiente con reproducción en loop.

Las tarjetas de fondo usan imágenes locales en `src/assets/sounds/`. En estado
inactivo se muestran oscurecidas y en escala de grises; al activarlas recuperan
el color y brillo normal. Las fuentes y atribuciones están en el README de esa
carpeta.

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
| @zn-apps/ui-core | `*` (workspace) | Librería interna |
| **Sin vue-router** | — | App de una sola pantalla |
| **Sin Pinia** | — | Estado local con `ref()` |

---

## Estructura de Archivos

```
zound-box/
├── index.html            # HTML root (título: "Zound Box")
├── package.json          # name: "zound-box"
├── vite.config.js        # base: '/zn-apps/zound-box/', VitePWA config
├── public/
│   ├── favicon.svg
│   ├── pwa-icon.svg
│   ├── pwa-icon-192.png
│   ├── pwa-icon-512.png
│   └── icons.svg
└── src/
    ├── main.js           # createApp(App).mount('#app')
    ├── App.vue           # Componente raíz — UI completa
    ├── components/
    │   └── SoundToggle.vue # Tarjeta accesible para activar/desactivar un sonido
    ├── style.css         # (archivo existente, estilos overrideados por shared)
```

> **Nota:** No existe subcarpeta `views/` ni `router/` — toda la UI vive en `App.vue`.

---

## Sistema de chunks de iconos

La interfaz usa `ZnIcon` para identificar el sonido principal y los sonidos de
fondo. El escáner detecta iconos declarados literalmente en el template; los
iconos de la lista dinámica se declaran en `manual` dentro de
`icon-profile.json`.

La actualización de sprites es manual:

1. Ejecuta `npm run build:icons` desde la raíz para actualizar perfiles y sprites.
2. Versiona `zound-box/icon-profile.json` y los sprites generados en
   `zound-box/public/icons/sprite-<familia>.svg` con solo esos iconos.
3. El build de producción no regenera iconos; Vite copia los sprites versionados
   de `public/icons/` a `zound-box/dist/icons/`.
4. VitePWA agrega los sprites generados al precache de Workbox.

Los iconos que usan los componentes de `ui-core` se suman automáticamente al
chunk de la app; no hace falta declararlos.

Ver también: [`docs/01-shared.md`](./01-shared.md#chunks-de-iconos-sprite-chunk)
para el flujo completo.

---



## Configuración PWA (vite.config.js)

```js
base: '/zn-apps/zound-box/'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Zound Box',
    short_name: 'Zound Box',
    description: 'Combina un sonido principal con sonidos ambientales de fondo.',
    start_url: '/zn-apps/zound-box/index.html',
    scope: '/zn-apps/zound-box/',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      { src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: 'pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  }
})
```


---

## Arquitectura de la App (`App.vue`)

### Árbol de componentes

```
ZnApp (modo controlado por isDarkMode)
  └── ZnScreen (title="Zound Box", icon=nota musical SVG)
        ├── [slot #actions] → ZnSwitch (v-model=isDarkMode, icons sol/luna)
        └── [contenido principal]
              ├── SoundChannelPlayer por canal (audio oculto, loop, precarga)
              ├── ZnSection de controles generales (reproducir/pausar, volumen)
              ├── ZnSection "Sonidos de fondo" (4 SoundToggle)
              └── ZnSection "Sonidos de seseo" (3 SoundToggle: ×2, ×3, ×5)
```

### Estado local reactivo

```js
const isDarkMode = ref(false)   // Controla el modo visual de ZnApp
const channels = reactive([...])
const isPlaying = ref(false)
const volume = ref(1) // 0.1 cuando se activa el control de volumen reducido
```

### Imports

```js
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton, ZnBox, ZnSwitch } from '@zn-apps/ui-core'
```

---

## Funcionalidad Actual

La pantalla presenta dos secciones de sonidos y una tarjeta inicial de controles generales. Cada canal permite seleccionar un solo sonido y tiene un `SoundChannelPlayer` con un elemento `<audio>` oculto, precargado y en loop. Cambiar la fuente emite `source-change`; al seleccionar mientras el control general está activo, el canal comienza a reproducir. El control general inicia o pausa todos los canales seleccionados. El control de volumen alterna entre 100 % y 10 %.

---

## Lineamientos para Nuevas Funcionalidades

Al desarrollar en `zound-box`:

1. **No crear router:** si se necesitan múltiples vistas, crear componentes de vista e intercambiarlos con `v-if/v-show`, o añadir `vue-router` si la complejidad lo justifica.
2. **Usar componentes de `@zn-apps/ui-core`:** NO crear estilos propios para patrones ya cubiertos (botones, cards, switches, layouts).
3. **Estado local:** usar `ref()` y `reactive()` de Vue. Si el estado se complejiza, añadir una store Pinia **local a la app** (no compartida).
4. **No acoplar a otras apps:** zound-box es independiente. No importar de `kitchensink/` u otras apps.
5. **PWA:** la app debe funcionar offline. Usar `useOnlineStatus()` de shared si es necesario mostrar estado de conexión.

---

## Tareas Pendientes Identificadas

- [ ] Mejorar el soporte de reproducción en segundo plano según las limitaciones de cada navegador y sistema operativo.
- [ ] Persistir la selección de sonidos del usuario.
