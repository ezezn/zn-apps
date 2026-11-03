# App: Zound Box — Contexto de IA

> Documento de contexto rápido para IA. Actualizado: 2026-10-28.

## Descripción

**Zound Box** es la **primera aplicación productiva** del monorepo. Es una PWA de una sola pantalla para combinar un sonido en primer plano con varios sonidos ambientales de fondo. La interfaz actual presenta interruptores para ambas capas; la reproducción de audio se implementará después.

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

## Sistema de chunks de iconos

La interfaz usa `ZnIcon` para identificar el sonido principal y los sonidos de
fondo. El escáner detecta iconos declarados literalmente en el template; los
iconos de la lista dinámica se declaran en `manual` dentro de
`icon-profile.json`.

El flujo de sprites es automático:

1. `predev` / `prebuild` ejecutan `scan:icons` → `icon-profile.json`.
2. `generate:icons --profile app:zound-box` escribe
   `zound-box/public/icons/sprite-<familia>.svg` con solo esos iconos.
3. Vite copia `public/icons/` a `zound-box/dist/icons/` en el build.
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
    display: 'standalone'
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
              ├── ZnSection "Sonido en primer plano"
              │     └── ZnCard con ZnSwitch para el sonido principal
              └── ZnSection "Sonidos de fondo"
                    └── ZnCard + ZnSwitch por sonido ambiental
```

### Estado local reactivo

```js
const isDarkMode = ref(false)   // Controla el modo visual de ZnApp
const foregroundEnabled = ref(false)
const backgroundSounds = reactive([...])
```

### Imports

```js
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton, ZnBox, ZnSwitch } from '@zn-apps/ui-core'
```

---

## Funcionalidad Actual

La app presenta dos grupos de controles: un interruptor para el sonido principal y varios interruptores independientes para sonidos ambientales. Los controles reflejan el estado en la interfaz; la reproducción de audio en segundo plano aún no está implementada.

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

- [ ] Implementar reproducción de audio en primer plano y en segundo plano.
- [ ] Persistir la selección de sonidos del usuario.
