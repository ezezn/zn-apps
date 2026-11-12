# @zn-apps/pwa-integration — Documentación de Librería

> Ubicación: `shared/pwa-integration/`  
> Paquete npm: `@zn-apps/pwa-integration`  
> Responsabilidades: Detección del estado de PWA (instalada vs navegador), detección del esquema de colores del sistema (modo claro/oscuro), manipulación dinámica de metadatos de barras del sistema (`theme-color` y fondo de carga/overscroll), popup de instalación interactiva y popup de actualización de la versión instalada.

---

## 1. Propósito y Alcance

`@zn-apps/pwa-integration` provee una capa especializada para integrar aplicaciones web progresivas con el sistema operativo anfitrión (móvil o escritorio):
1. **Detección de Esquema de Color**: Detecta y escucha cambios en tiempo real de `prefers-color-scheme`, permitiendo a cada app decidir si heredar el tema del sistema o forzar una preferencia de usuario.
2. **Control de Metadatos y Barras del Sistema**: Sincroniza dinámicamente la barra superior/status bar (`<meta name="theme-color">`) y el fondo del documento (para overscroll y barra de navegación inferior) para igualar el color de la cabecera de `ZnScreen` o especificar colores personalizados.
3. **Instalación Asistida de PWA**: Detecta si la app ya está instalada en modo standalone y, si no lo está, ofrece un popup interactivo (`ZnPwaInstallPrompt`) que dispara el diálogo nativo de instalación.
4. **Actualización Asistida de PWA**: Detecta que el service worker descargó una versión nueva y ofrece `ZnPwaUpdatePrompt` para activarla y recargar la página (`registerType: 'prompt'`).

---

## 2. Arquitectura y Dependencias

- **Dependencias**: Consume `@zn-apps/ui-core` para renderizar botones (`ZnButton`) e iconos (`ZnIcon`) con el sistema de diseño MD3.
- **Tolerancia a Entornos sin DOM**: Todas las utilidades cuentan con salvaguardas para ejecutarse de forma segura en SSR, testing con Happy-DOM o navegadores antiguos sin soporte de `matchMedia`.
- **Patrón Singleton para Eventos**: El evento nativo `beforeinstallprompt` solo se dispara una vez por página; la librería lo captura de forma centralizada en un manejador global para que múltiples componentes o composables puedan consumirlo sin perder la referencia al evento diferido.

---

## 3. Catálogo de Composables y API

### `useColorScheme(options?)`
Detecta el esquema de colores del sistema y gestiona la preferencia de tema de la aplicación.

```typescript
function useColorScheme(options?: {
  defaultPreference?: 'system' | 'light' | 'dark'
}): {
  systemColorScheme: Ref<'light' | 'dark'>
  preference: Ref<'system' | 'light' | 'dark'>
  resolvedTheme: ComputedRef<'light' | 'dark'>
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
  setPreference: (pref: 'system' | 'light' | 'dark') => void
}
```

**Ejemplo de uso:**
```vue
<script setup>
import { useColorScheme } from '@zn-apps/pwa-integration'
import { ZnApp } from '@zn-apps/ui-core'

const { resolvedTheme, preference, setPreference } = useColorScheme()
</script>

<template>
  <ZnApp :mode="resolvedTheme">
    <button @click="setPreference('dark')">Oscuro</button>
    <button @click="setPreference('light')">Claro</button>
    <button @click="setPreference('system')">Automático</button>
  </ZnApp>
</template>
```

---

### `usePwaMeta(options?)`
Gestiona reactivamente la barra de estado superior, el fondo de carga y la barra inferior del sistema.

```typescript
function usePwaMeta(options?: {
  initialThemeColor?: string
  initialBackgroundColor?: string
  syncOnMount?: boolean
  restoreOnUnmount?: boolean
}): {
  themeColor: Ref<string>
  backgroundColor: Ref<string>
  setThemeColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setAppMetaColors: (params: { themeColor?: string, backgroundColor?: string, statusBarStyle?: string }) => void
  syncWithScreenHeading: (options?: { selector?: string, syncBackground?: boolean }) => string | null
}
```

**Ejemplo de sincronización con `ZnScreen`:**
```vue
<script setup>
import { onMounted } from 'vue'
import { usePwaMeta } from '@zn-apps/pwa-integration'

const { syncWithScreenHeading, setThemeColor } = usePwaMeta()

onMounted(() => {
  // Sincroniza la barra del sistema con el color del header de la ZnScreen
  syncWithScreenHeading()
})
</script>
```

---

### `usePwaInstall()`
Detecta si la app está instalada y expone el activador del diálogo nativo.

```typescript
function usePwaInstall(): {
  isInstalled: Ref<boolean>
  canInstall: Ref<boolean>
  promptInstall: () => Promise<{ outcome: 'accepted' | 'dismissed' } | null>
}
```

---

## 4. Componente: `ZnPwaInstallPrompt`

Popup flotante y accesible que detecta si la app no está instalada y ofrece un llamado a la acción para instalarla.

### Props
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | String | `'¿Deseas instalar esta aplicación?'` | Título del popup |
| `message` | String | `'Instálala en tu dispositivo...'` | Mensaje persuasivo |
| `installText` | String | `'Instalar'` | Texto del botón principal |
| `dismissText` | String | `'Ahora no'` | Texto del botón secundario |
| `icon` | String | `'download'` | Icono Material a mostrar |
| `image` | String | `''` | URL de avatar o icono de app (tiene prioridad sobre `icon`) |
| `delayMs` | Number | `1500` | Tiempo de espera antes de mostrar el popup tras detectar que no está instalada |
| `persistDismissKey` | String | `'zn-pwa-dismissed'` | Clave de almacenamiento para recordar el descarte |
| `storageType` | String | `'session'` | `'session'` \| `'local'` \| `'none'` |

### Eventos
- `@install`: Se emite cuando el usuario presiona el botón de instalación.
- `@installed`: Se emite cuando el usuario completa y acepta la instalación en el navegador.
- `@dismiss`: Se emite cuando el usuario descarta o pospone la instalación.

**Ejemplo de integración:**
```vue
<script setup>
import { ZnPwaInstallPrompt } from '@zn-apps/pwa-integration'
</script>

<template>
  <div class="app-layout">
    <!-- Contenido principal -->
    <main>...</main>

    <!-- Popup de instalación PWA -->
    <ZnPwaInstallPrompt
      title="Instalar Zound Box"
      message="Disfruta de audio relajante continuo sin necesidad de conexión."
      image="/pwa-icon.svg"
      :delay-ms="2000"
    />
  </div>
</template>
```

---

## 5. Componente y utilidades de actualización

### `ZnPwaUpdatePrompt`

Popup flotante que aparece cuando el service worker tiene una versión nueva en espera. Mantiene el descarte en `sessionStorage` (`zn-pwa-update-dismissed`) y limpia esa marca en cuanto la app queda al día, de modo que una actualización posterior vuelve a avisar.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | String | `'Hay una actualización disponible'` | Título del popup |
| `message` | String | `'La aplicación tiene una nueva versión. ¿Quieres actualizarla ahora?'` | Mensaje |
| `updateText` | String | `'Actualizar'` | Texto del botón principal |
| `dismissText` | String | `'Ahora no'` | Texto del botón secundario |
| `persistDismissKey` | String | `'zn-pwa-update-dismissed'` | Clave de `sessionStorage` para recordar el descarte |

**Eventos:** `@update` (se inicia la actualización), `@updated` (el worker nuevo activó) y `@dismiss`.

### Utilidades (`utils/pwaUpdate.js`)

```typescript
export function initPwaUpdateListener(): void
export function onPwaUpdateChange(
  listener: (state: { updateAvailable: boolean, registration: ServiceWorkerRegistration | null }) => void
): () => void
export function isPwaUpdateAvailable(): boolean
export function updatePwa(): Promise<boolean> // true si se activó una versión nueva
```

- `initPwaUpdateListener()` es idempotente y debe llamarse en `src/main.js`. Detecta un worker `waiting` ya existente, escucha `updatefound`/`controllerchange` y consulta `registration.update()` cada 30 minutos y al volver al primer plano (máximo una vez cada 5 minutos).
- `updatePwa()` envía `SKIP_WAITING` al worker en espera, aguarda su activación y recarga la página. Devuelve `false` si no había actualización pendiente o si el worker no activó a tiempo, para que el componente vuelva a habilitar el botón.

### Integración requerida en cada app

```javascript
// src/main.js
import { initPwaInstallListener, initPwaUpdateListener } from '@zn-apps/pwa-integration'
initPwaInstallListener()
initPwaUpdateListener()
```

```vue
<!-- src/App.vue: hijos directos de ZnApp, fuera de ZnScreen/layouts -->
<ZnPwaInstallPrompt :title="t('pwa.installTitle')" :message="t('pwa.installMessage')" :image="pwaIconUrl" />
<ZnPwaUpdatePrompt :title="t('pwa.updateTitle')" :message="t('pwa.updateMessage')" :update-text="t('pwa.updateText')" :dismiss-text="t('pwa.dismissUpdate')" />
```

> **Estilos**: los popups usan `position: fixed`. La app debe resolver `@zn-apps/pwa-integration` al código fuente en `vite.config.js`. El build de librería emite los estilos en `dist/pwa-integration.css`, que el entry JS no importa: si se consume `dist/`, el popup se renderiza sin estilos al final del documento (fuera del viewport) y alarga el scroll. Tampoco deben anidarse dentro de contenedores con `transform`, `overflow` o `isolation`.

---

## 6. Reglas de Negocio y Casos de Borde

1. **Supresión en Modo Instalado**: Si la app ya se está ejecutando como PWA (`standalone`, `window-controls-overlay` o iOS standalone), `ZnPwaInstallPrompt` no se monta ni se muestra bajo ninguna circunstancia.
2. **Persistencia de Descarte**: Cuando el usuario pulsa "Ahora no", la decisión se persiste en `sessionStorage` (por defecto) para evitar interrupciones repetidas durante la misma sesión de navegación.
3. **Soporte de Safe Area**: El componente incluye estilos responsivos con `env(safe-area-inset-bottom)` para no superponerse a barras gestuales de Android o iOS.
4. **Sincronización de Barras**: `syncWithScreenHeading()` inspecciona la clase `.zn-screen__header` y aplica el color computado a `<meta name="theme-color">` y `document.documentElement.style.backgroundColor`, logrando una transición visual fluida entre la barra de estado y el contenido.

## 7. Configuración Avanzada de Barras de Color

Para que la barra de estado superior y la barra inferior sigan el esquema de colores de la aplicación:

1. **Usar `usePwaMeta` en `App.vue`**: El composable `usePwaMeta` debe invocarse en el componente raíz (generalmente `App.vue`) con `syncOnMount: true` para sincronizar dinámicamente la barra superior (`<meta name="theme-color">`) y el fondo del documento con el esquema de colores actual de la app.

2. **Color según tema**: Los colores iniciales `#1D1B20` (modo oscuro) y `#FEF7FF` (modo claro) se aplican al montar y luego se actualizan automáticamente mediante `syncWithScreenHeading()` basándose en el color de cabecera de `ZnScreen` y los cambios de `prefers-color-scheme` del sistema.

3. **Actualización reactiva**: La reactividad de Vue asegura que los colores se actualicen cuando el tema cambia (fondo oscuro/light) sin requerir recarga de página.

4. **Integración en `main.js`**: Es obligatorio llamar a `initPwaInstallListener()` en el archivo `src/main.js` de cada aplicación para habilitar el popup de instalación en dispositivos móviles.

5. **Ejemplo de uso en `App.vue`**:
   ```vue
   <script setup>
   import { usePwaMeta } from '@zn-apps/pwa-integration'
   
   const { themeColor, backgroundColor, syncWithScreenHeading } = usePwaMeta({
     initialThemeColor: isDarkMode ? '#1D1B20' : '#FEF7FF',
     initialBackgroundColor: isDarkMode ? '#1D1B20' : '#FEF7FF',
     syncOnMount: true
   })
   </script>
   ```

6. **Testing**: Tests en `shared/pwa-integration/src/__tests__/` cubren `usePwaMeta`, `usePwaInstall` y `ZnPwaInstallPrompt`. Ejecutar con `npx vitest run --project pwa-integration`.



---

## 8. Testing

Tests ubicados en `shared/pwa-integration/src/__tests__/`:
- `useColorScheme.spec.js`: Cobertura de detección de `prefers-color-scheme`, cambios de evento y reactividad.
- `usePwaMeta.spec.js`: Manipulación de etiquetas meta, sincronización con DOM y actualización de estilos de fondo.
- `usePwaInstall.spec.js`: Captura de `beforeinstallprompt`, detección de standalone y resolución de promesas.
- `ZnPwaInstallPrompt.spec.js`: Ciclo de vida del componente, retardo con temporizadores, descarte y emisión de eventos.
- `ZnPwaUpdatePrompt.spec.js`: Aparición ante una versión nueva, descarte persistido, aplicación de la actualización y limpieza de la marca de descarte.
- `pwaUpdate.spec.js`: Detección del worker en espera, `updatefound`, activación con `SKIP_WAITING` y recarga de la página.

Ejecutar tests:
```bash
npx vitest run --project pwa-integration
```
