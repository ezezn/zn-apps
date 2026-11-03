# @zn-apps/ui-core — Librería de Componentes Compartidos

> Contexto de IA para las librerías compartidas del monorepo. Actualizado: 2026-11-02.

## Propósito

`shared/` es un **contenedor de librerías aisladas**, cada una con su propio `package.json`, build y tests. Actualmente contiene:

| Librería | Paquete | Contenido |
|---|---|---|
| `shared/ui-core/` | `@zn-apps/ui-core` | Componentes Vue 3 UI (MD3), composables, utilidades JS y estilos globales. |
| `shared/storage/` | `@zn-apps/storage` | Utilidades de persistencia sobre Web Storage, sin dependencia de Vue. |

Las librerías **no se importan entre sí**. Las apps consumen cada una por separado mediante npm workspaces.

`@zn-apps/ui-core` provee:
- Componentes de infraestructura UI (layout, pantallas, secciones).
- Componentes atómicos MD3 (botones, tarjetas, switches).
- Composables reutilizables.
- Utilidades JS.
- Estilos globales (reset + tokens MD3).

---

## Configuración del Paquete

```
shared/
├── README.md
├── ui-core/
│   ├── package.json       # name: "@zn-apps/ui-core", peerDep: vue ^3
│   ├── vite.config.js     # Build mode: library, format ES, output: dist/ui-core.js
│   ├── vitest.config.js   # Proyecto Vitest "ui-core"
│   ├── scripts/
│   │   └── generate-icons.mjs     # Genera el chunk filtrado desde @material-design-icons/svg
│   └── src/
│       ├── index.js       # Punto de entrada — todos los exports públicos
│       ├── icons/
│       │   └── index.js           # loadIconFamily / iconExists / iconNames (fetch + inyección)
│       ├── assets/
│       │   └── css/
│       │       └── global.css     # Reset CSS + tokens MD3 (modo claro y oscuro)
│       ├── components/
│       │   ├── ZnApp.vue
│       │   ├── ZnScreen.vue
│       │   ├── ZnNavigationLayout.vue
│       │   ├── ZnSection.vue
│       │   ├── ZnRow.vue
│       │   ├── ZnBox.vue
│       │   ├── ZnButton.vue
│       │   ├── ZnCard.vue
│       │   ├── ZnSwitch.vue
│       │   ├── ZnIcon.vue
│       │   └── CustomButton.vue   # Legacy, a reemplazar por ZnButton
│       ├── composables/
│       │   └── useOnlineStatus.js
│       └── utils/
│           └── helpers.js
└── storage/
    ├── package.json       # name: "@zn-apps/storage"
    ├── vite.config.js     # Build mode: library, format ES, output: dist/storage.js
    ├── vitest.config.js   # Proyecto Vitest "storage"
    └── src/
        ├── index.js
        └── __tests__/storage.spec.js
```

  **Iconos:** cada proyecto genera su propio chunk filtrado con `npm run generate:icons` (perfil `shared` para la librería). Ya no se versionan sprites en `src/icons/`; el loader vive en `src/icons/index.js`.
  **Escaneo:** los iconos usados se detectan con `npm run scan:icons` en cada proyecto (script único en `<raíz>/scripts/scan-icons.mjs`). Escribe el `icon-profile.json` con dos arrays: `scanned` (detectados) y `manual` (declarados por el desarrollador).
  **Chunk de sprite:** cada proyecto publica el suyo en `public/icons/`, que Vite copia a `dist/icons/`.

## Chunks de iconos (Sprite Chunk)

Cada proyecto (librería `ui-core` o app) genera solo los iconos que usa, tomados
de su `icon-profile.json`. El chunk son cinco ficheros, uno por familia:
`sprite-filled.svg`, `sprite-outlined.svg`, `sprite-round.svg`, `sprite-sharp.svg`
y `sprite-two-tone.svg`. Cada fichero contiene únicamente los `<symbol>` de los
nombres declarados.

| Proyecto | Qué contiene | Destino |
|---|---|---|
| `@zn-apps/ui-core` | Solo los iconos que usan sus componentes | `shared/ui-core/dist/icons/` |
| `kitchensink` | Sus iconos + el catálogo completo (declarado en `manual`) | `kitchensink/public/icons/` → `dist/icons/` |
| `zound-box` | Sus iconos (hoy no usa `ZnIcon`) | `zound-box/public/icons/` → `dist/icons/` |

Los chunks de las apps incluyen además los nombres del perfil de `ui-core`, de
modo que los iconos usados por componentes de la librería están disponibles sin
que la app tenga que declararlos.

`ZnIcon` resuelve el chunk con `import.meta.env.BASE_URL`, por lo que en
desarrollo descarga `/icons/sprite-<familia>.svg` y en producción
`/zn-apps/<app>/icons/sprite-<familia>.svg`. La familia se descarga una sola vez
y se inyecta en `#zn-icon-sprite-host`.

## Escaneo de iconos (scan:icons)

`npm run scan:icons` en la raíz escanea cada proyecto (o
`node scripts/scan-icons.mjs <proyecto>` para uno concreto). El script:

1. Recorre los `.js`, `.vue`, `.ts`, `.jsx`, `.tsx` del proyecto (salvo `scripts/`, `node_modules/`, `dist/`, `coverage/`, `.git/`, `__tests__/` y ficheros `*.spec.*`).
2. Busca las etiquetas `<ZnIcon …>` de apertura.
3. Extrae los atributos estáticos `name` y `family`.
4. Escribe `icon-profile.json` con dos arrays:

```json
{
  "scanned": [ "home", "play_arrow", "settings", ... ],
  "manual":  [ "favorite", ... ]   // añadidos por el desarrollador
}
```

- `scanned`: nombres detectados; se recalcula en cada ejecución.
- `manual`: nombres declarados por el desarrollador; nunca se sobrescriben ni se
  eliminan. Útil para `:name="…"` dinámicos o para publicar una colección
  completa (kitchensink).

El escáner descarta falsos positivos: bindings (`:name`, `v-bind:name`), valores
no estáticos, comentarios, nombres que no sean snake_case y palabras reservadas.

## Cómo generar los chunks (generate:icons)

`npm run generate:icons` genera los chunks de todos los proyectos. También se
puede invocar un perfil concreto:

```bash
node shared/ui-core/scripts/generate-icons.mjs --profile shared         # ui-core
node shared/ui-core/scripts/generate-icons.mjs --profile app:zound-box
node shared/ui-core/scripts/generate-icons.mjs --profile app:kitchensink
```

El generador lee los perfiles, filtra los nombres contra
`@material-design-icons/svg` (devDependency de `ui-core`) y escribe los sprites
en `public/icons/` (apps) o `dist/icons/` (ui-core). Si `dist/` ya existe
también se refresca allí. Si el perfil no declara iconos, no genera nada.

## Integración Continua (GitHub Actions)

```text
npm install
npm run test:run
npm run build:all          # cada app ejecuta scan + generate en su prebuild
```

Cada app ejecuta `icons` en `predev` y `prebuild`; `ui-core` lo hace en
`postbuild`. Así el chunk está en `dist/icons/` antes de publicar en GitHub
Pages.

## Cómo Usar en una App

```js
// 1. Importar estilos (en main.js o App.vue)
import '@zn-apps/ui-core/dist/ui-core.css'

// 2. Importar componentes
import { ZnApp, ZnScreen, ZnButton, ZnCard, ZnSwitch } from '@zn-apps/ui-core'

// 3. Importar composables y utilidades
import { useOnlineStatus } from '@zn-apps/ui-core'
import { formatDate } from '@zn-apps/ui-core'
```

---

## Sistema de Diseño — Material Design 3

### Tokens CSS (`--md-*`)

Definidos en `global.css` como variables CSS en `:root` (modo claro por defecto).

| Token | Claro | Oscuro |
|---|---|---|
| `--md-primary` | `#6750A4` | `#D0BCFF` |
| `--md-on-primary` | `#FFFFFF` | `#381E72` |
| `--md-primary-container` | `#EADDFF` | `#4F378B` |
| `--md-on-primary-container` | `#21005D` | `#EADDFF` |
| `--md-background` | `#FEF7FF` | `#141218` |
| `--md-on-background` | `#1D1B20` | `#E6E1E5` |
| `--md-surface` | `#FEF7FF` | `#141218` |
| `--md-surface-container-low` | `#F7F2FA` | `#1D1B20` |
| `--md-surface-variant` | `#E7E0EC` | `#49454F` |
| `--md-on-surface-variant` | `#49454F` | `#CAC4D0` |
| `--md-outline` | `#79747E` | `#938F99` |
| `--md-section-gap` | `24px` | — |

### Cambio de tema
- Modo claro: clase `zn-theme-light` en el elemento raíz.
- Modo oscuro: clase `zn-theme-dark` en el elemento raíz.
- El componente `ZnApp` gestiona esto automáticamente.

### Sistema de Grid (clases utilitarias)
```css
.zn-span-2  → grid-column: span 2
.zn-span-3  → grid-column: span 3
/* ... hasta zn-span-10 */
```
Se usan como clases en elementos hijos de `ZnSection` cuando esta tiene prop `columns`.

---

## Catálogo de Componentes

---

### `ZnApp`
**Propósito:** Componente raíz de cualquier aplicación. Gestiona el tema claro/oscuro y sincroniza la clase del body.

**Props:**
| Prop | Tipo | Default | Valores |
|---|---|---|---|
| `mode` | `String` | `'system'` | `'light'` \| `'dark'` \| `'system'` |

**Comportamiento:**
- `mode='system'`: detecta `prefers-color-scheme` del SO con `matchMedia`.
- Inyecta `zn-theme-light` o `zn-theme-dark` en `document.body` y en el div raíz.
- Limpia la clase al destruirse.

**Uso:**
```vue
<ZnApp mode="system">
  <!-- contenido de la app -->
</ZnApp>
```

---

### `ZnScreen`
**Propósito:** Contenedor de pantalla con **Top App Bar** que se eleva al hacer scroll (usando `IntersectionObserver` sobre un centinela invisible).

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `String` | `''` | Título de la barra superior |

**Slots:**
| Slot | Descripción |
|---|---|
| `#icon` | Ícono SVG junto al título |
| `#title` | Reemplaza el texto del título (permite HTML) |
| `#actions` | Controles a la derecha (ej: ZnSwitch) |
| `default` | Contenido principal de la pantalla |

**Estados de la Top App Bar:**
- **Reposo:** fondo `--md-background`, borde transparente, altura 72px.
- **Scrolled:** fondo `--md-surface`, sombra sutil, altura 60px (transición MD3 cubic-bezier).

**Uso:**
```vue
<ZnScreen title="Mi Pantalla">
  <template #icon><svg .../></template>
  <template #actions><ZnSwitch v-model="isDark" /></template>
  <!-- contenido -->
</ZnScreen>
```

---

### `ZnNavigationLayout`
**Propósito:** Layout de dos columnas: Navigation Drawer (280px) + área de contenido. Para apps multi-página con vue-router.

**Slots:**
| Slot | Descripción |
|---|---|
| `#aside-header` | Cabecera del drawer (logo, nombre de app) |
| `#aside` | Links de navegación (`<router-link>`) |
| `default` | Contenido principal (`<router-view>`) |

**Responsividad:** En pantallas ≤ 768px el drawer pasa a posición superior (flex-direction: column).

**Uso:**
```vue
<ZnNavigationLayout>
  <template #aside-header>Mi App</template>
  <template #aside>
    <router-link to="/home">Inicio</router-link>
  </template>
  <router-view />
</ZnNavigationLayout>
```

---

### `ZnSection`
**Propósito:** Agrupa contenido con título. Puede ser colapsable (usa `<details>`) y soporta layout en grilla.

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `String` | `''` | Título de la sección |
| `collapsible` | `Boolean` | `false` | Activa el modo `<details>` |
| `expanded` | `Boolean` | `true` | Estado inicial si es colapsable |
| `columns` | `Number\|String` | `0` | Nº de columnas de grilla (0 = sin grilla) |

**Eventos:**
- `@toggle(isOpen: Boolean)` — emitido al abrir/cerrar.

**Uso:**
```vue
<ZnSection title="Botones" collapsible :expanded="true" :columns="3">
  <ZnButton>Uno</ZnButton>
  <ZnButton>Dos</ZnButton>
  <ZnButton>Tres</ZnButton>
</ZnSection>
```

---

### `ZnButton`
**Propósito:** Botón Material Design 3 con 5 variantes de énfasis y modo icono puro.

**Props:**
| Prop | Tipo | Default | Valores |
|---|---|---|---|
| `variant` | `String` | `'filled'` | `'filled'` \| `'tonal'` \| `'elevated'` \| `'outlined'` \| `'text'` |
| `disabled` | `Boolean` | `false` | — |
| `iconOnly` | `Boolean` | `false` | Botón circular 40×40px |
| `tag` | `String` | `'button'` | Permite renderizar como `'a'` u otro tag HTML |

**Slots:**
| Slot | Descripción |
|---|---|
| `#icon` | SVG a la izquierda del texto (solo si no es `iconOnly`) |
| `default` | Texto del botón |

**Variantes:**
| Variante | Énfasis | Fondo / Color | Uso típico |
|---|---|---|---|
| `filled` | Máximo | `--md-primary` / `--md-on-primary` | Acción primaria |
| `tonal` | Medio-alto | `--md-surface-variant` / `--md-on-surface-variant` | Acción secundaria |
| `elevated` | Medio (sombra) | `--md-surface` / `--md-primary` | Superficie flotante |
| `outlined` | Medio-bajo | Transparente con borde `--md-outline` | Acción alternativa |
| `text` | Bajo | Transparente / `--md-primary` | Acción terciaria |

> **Color de Iconos:** Según la especificación MD3, los iconos incrustados en `#icon` o modo `iconOnly` heredan automáticamente el color del texto (`fill: currentColor`), respetando el contraste de cada variante y el estado `:disabled`.

**Uso:**
```vue
<ZnButton variant="filled">
  <template #icon><svg .../></template>
  Reproducir
</ZnButton>

<!-- Botón icono puro -->
<ZnButton variant="tonal" iconOnly>
  <svg .../>
</ZnButton>
```

---

### `ZnCard`
**Propósito:** Tarjeta MD3 con soporte de imagen (en cabecera o fondo completo con scrim).

**Props:**
| Prop | Tipo | Default | Valores |
|---|---|---|---|
| `title` | `String` | `''` | Título de la card |
| `variant` | `String` | `'filled'` | `'filled'` \| `'elevated'` \| `'outlined'` |
| `image` | `String` | `''` | URL de imagen |
| `imageVariant` | `String` | `'header'` | `'header'` \| `'full'` |

**Slots:**
| Slot | Descripción |
|---|---|
| `#title` | Reemplaza el título (permite HTML) |
| `default` | Cuerpo de la card |

**Comportamiento con imagen:**
- `'header'`: imagen detrás del título con scrim gradient inferior → texto legible.
- `'full'`: imagen de fondo total de la card con scrim completo → texto blanco forzado.

**Uso:**
```vue
<ZnCard title="Álbum" variant="elevated" image="/cover.jpg" imageVariant="header">
  <p>10 canciones</p>
</ZnCard>
```

---

### `ZnBox`
**Propósito:** Contenedor genérico con variante visual MD3. Más simple que `ZnCard` (sin título ni imagen). Ideal para bloques en grillas.

**Props:**
| Prop | Tipo | Default | Valores |
|---|---|---|---|
| `variant` | `String` | `'filled'` | `'filled'` \| `'elevated'` \| `'outlined'` |

**Uso:**
```vue
<ZnSection :columns="4">
  <ZnBox variant="filled">Contenido</ZnBox>
  <ZnBox variant="elevated" class="zn-span-2">Doble ancho</ZnBox>
</ZnSection>
```

---

### `ZnRow`
**Propósito:** Contenedor flexbox horizontal con padding y gap configurables.

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `padding` | `String` | `'16px'` | Padding interno |
| `gap` | `String` | `'12px'` | Separación entre hijos |
| `align` | `String` | `'center'` | `align-items`: `'center'` \| `'flex-start'` \| `'flex-end'` |

**Uso:**
```vue
<ZnRow padding="24px" gap="16px" align="flex-start">
  <ZnButton>A</ZnButton>
  <ZnButton>B</ZnButton>
</ZnRow>
```

---

### `ZnSwitch`
**Propósito:** Toggle (interruptor) MD3 con soporte de labels bilaterales, texto interno e íconos dentro del actuador (thumb).

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | `Boolean` | `false` | Valor (compatible con `v-model`) |
| `labelLeft` | `String` | `''` | Etiqueta exterior a la izquierda |
| `labelRight` | `String` | `''` | Etiqueta exterior a la derecha |
| `textOn` | `String` | `''` | Texto breve incrustado dentro del actuador al estar encendido (ej. `'ON'`, `'SÍ'`) |
| `textOff` | `String` | `''` | Texto breve incrustado dentro del actuador al estar apagado (ej. `'OFF'`, `'NO'`) |
| `disabled` | `Boolean` | `false` | Desactiva el control y aplica opacidad MD3 (38%) |

**Slots:**
| Slot | Descripción |
|---|---|
| `#labelLeft` | HTML personalizado para etiqueta izquierda |
| `#labelRight` | HTML personalizado para etiqueta derecha |
| `#iconOn` | SVG o contenido personalizado en el thumb cuando está encendido |
| `#iconOff` | SVG o contenido personalizado en el thumb cuando está apagado |

**Eventos:**
- `@update:modelValue(Boolean)` — para `v-model`.
- `@change(Boolean)` — emitido al cambiar.

**Especificación MD3:**
- **Sin contenido interior:** El thumb apagado mide 16px y al activarse se expande a 24px.
- **Con iconos o texto interior (`textOn`/`textOff` o slots):** El thumb permanece en 24px en ambos estados para albergar el contenido con legibilidad.
- **Standalone:** Si se omiten `labelLeft` y `labelRight`, renderiza únicamente el interruptor sin márgenes ni elementos adicionales.

**Uso:**
```vue
<!-- 1. Puro / Standalone (sin texto) -->
<ZnSwitch v-model="estado" />

<!-- 2. Con etiqueta exterior -->
<ZnSwitch v-model="estado" labelRight="Notificaciones" />

<!-- 3. Con texto interior -->
<ZnSwitch v-model="estado" textOn="ON" textOff="OFF" />

<!-- 4. Con iconos interiores -->
<ZnSwitch v-model="isDark" labelLeft="Claro" labelRight="Oscuro">
  <template #iconOff><svg .../></template>
  <template #iconOn><svg .../></template>
</ZnSwitch>
```

---

### `ZnIcon`
**Propósito:** Icono Material Design renderizado mediante **sprites SVG** (`<symbol>` + `<use>`). El sprite de la familia se descarga e inyecta una sola vez en el documento (oculto en `#zn-icon-sprite-host`), así que cientos de iconos comparten un único recurso.

**Props:**
| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `String` | — (requerido) | Nombre del icono en snake_case (`'home'`, `'play_arrow'`, `'dark_mode'`) |
| `family` | `String` | `'filled'` | `'filled'` \| `'outlined'` \| `'round'` \| `'sharp'` \| `'two-tone'` |
| `size` | `Number\|String` | `24` | Número → px; string → cualquier unidad CSS (`'1.5rem'`, `'2em'`) |
| `label` | `String` | `''` | Etiqueta accesible. Sin ella el icono es decorativo (`aria-hidden`, sin `role`) |

**Color:** los trazos usan `fill: currentColor`, por lo que heredan el color del contenedor (botones, variantes MD3, estados `:disabled`).

**Carga diferida:** cada familia es un chunk independiente en `icons/sprite-<familia>.svg` y solo se descarga cuando aparece el primer icono de esa familia. El tamaño depende del proyecto: un par de iconos pesan unos pocos KB; el catálogo completo de kitchensink ronda los 600-950 KB por familia. En desarrollo, un `name` inexistente (o un chunk que falta) emite un `console.warn` una sola vez.

**API auxiliar** (exportada por el paquete):
| Función | Descripción |
|---|---|
| `loadIconFamily(family)` | Descarga e inyecta el sprite; resuelve con un `Set` de nombres disponibles |
| `iconExists(family, name)` | `Promise<Boolean>` — indica si el icono existe |
| `iconNames(family)` | `Promise<string[]>` — nombres ordenados de la familia (útil para galerías y buscadores) |
| `iconSymbolId(family, name)` | Id del `<symbol>`, ej. `zn-icon-filled-home` |
| `iconSpriteUrl(family)` | URL del chunk resuelta con `BASE_URL`, ej. `/icons/sprite-filled.svg` |
| `ICON_FAMILIES` | `['filled', 'outlined', 'round', 'sharp', 'two-tone']` |

**Uso:**
```vue
<ZnIcon name="home" />
<ZnIcon name="dark_mode" family="outlined" :size="32" />
<ZnIcon name="play_arrow" label="Reproducir" />

<!-- Dentro de un botón hereda el color de la variante -->
<ZnButton variant="filled">
  <template #icon><ZnIcon name="play_arrow" /></template>
  Reproducir
</ZnButton>
```

---

### `CustomButton` _(Legacy)_
- **Estado:** Legacy. Estilos propios no MD3 (verde `#42b883`). A reemplazar por `ZnButton`.
- **Props:** `label: String` (default: `'Botón Compartido'`).
- **Eventos:** `@click`.

---

## Composables

### `useOnlineStatus()`
Detecta si el navegador tiene conexión a internet en tiempo real.

**Retorna:**
| Nombre | Tipo | Descripción |
|---|---|---|
| `isOnline` | `Ref<Boolean>` | `true` si hay conexión. Reactivo. |

**Implementación:** escucha eventos `online` y `offline` del `window`. Limpia listeners en `onUnmounted`.

**Uso:**
```js
import { useOnlineStatus } from '@zn-apps/ui-core'

const { isOnline } = useOnlineStatus()
// En template: v-if="isOnline"
```

---

## Utilidades (`utils/helpers.js`)

### `formatDate(date)`
Formatea una fecha en español.

| Parámetro | Tipo |
|---|---|
| `date` | `Date \| string \| number` |

**Retorna:** `string` — ej: `"28 de octubre de 2026"`. Retorna `''` si `date` es falsy.

```js
import { formatDate } from '@zn-apps/ui-core'
formatDate(new Date()) // → "28 de octubre de 2026"
formatDate('2024-01-15') // → "15 de enero de 2024"
```

---

---

## `@zn-apps/storage`

Librería de persistencia **independiente de Vue y del DOM**, pensada para compartir entre apps sin acoplarlas a Pinia ni a un framework.

### `createStorage(options?)`
Crea un almacén con claves serializadas en JSON y namespacing opcional.

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `namespace` | `String` | `'zn-apps'` | Prefijo aplicado a cada clave. Con `''` se desactiva. |
| `storage` | `Storage` | `localStorage` | Backend compatible con Web Storage (`getItem`, `setItem`, `removeItem`, `key`, `length`). |

**Métodos:**
| Método | Retorna | Descripción |
|---|---|---|
| `get(key, fallback?)` | `any` | Lee y deserializa. Devuelve el fallback si no existe (o el valor crudo si no es JSON válido). |
| `set(key, value)` | `Boolean` | Serializa y guarda. `false` si no hay backend o falla la escritura. |
| `remove(key)` | `Boolean` | Elimina una clave. |
| `has(key)` | `Boolean` | Indica si la clave existe. |
| `clear()` | `Boolean` | Elimina solo las claves del namespace. |

**Uso:**
```js
import { createStorage } from '@zn-apps/storage'

const storage = createStorage({ namespace: 'zound-box' })

storage.set('prefs', { volume: 8, theme: 'dark' })
storage.get('prefs', {})     // → { volume: 8, theme: 'dark' }
storage.has('prefs')         // → true
storage.remove('prefs')
storage.clear()              // solo claves "zound-box:*"
```

---

## Dependencias del Paquete

| Librería | Paquete | Tipo | Nota |
|---|---|---|---|
| ui-core | `vue ^3` | peerDependency | Provista por la app consumidora |
| ui-core | `@fontsource/roboto` | dependency | Pesos 400 y 500 incluidos |
| ui-core | `@material-design-icons/svg` | devDependency | Solo para regenerar los sprites (`generate:icons`) |
| ui-core | `@vitejs/plugin-vue ^5` | devDependency | Plugin para compilar SFCs |
| ui-core | `vite ^6` | devDependency | Build tool |
| storage | `vite ^6` | devDependency | Build tool |
