# @zn-apps/shared — Librería de Componentes Compartidos

> Contexto de IA para el paquete `shared/`. Actualizado: 2026-10-28.

## Propósito

`@zn-apps/shared` es la **librería de componentes Vue 3 interna** del monorepo. Provee:
- Componentes de infraestructura UI (layout, pantallas, secciones).
- Componentes atómicos MD3 (botones, tarjetas, switches).
- Composables reutilizables.
- Utilidades JS.
- Estilos globales (reset + tokens MD3).

---

## Configuración del Paquete

```
shared/
├── package.json       # name: "@zn-apps/shared", peerDep: vue ^3
├── vite.config.js     # Build mode: library, format ES, output: dist/shared.js
└── src/
    ├── index.js       # Punto de entrada — todos los exports públicos
    ├── assets/
    │   └── css/
    │       └── global.css     # Reset CSS + tokens MD3 (modo claro y oscuro)
    ├── components/
    │   ├── ZnApp.vue
    │   ├── ZnScreen.vue
    │   ├── ZnNavigationLayout.vue
    │   ├── ZnSection.vue
    │   ├── ZnRow.vue
    │   ├── ZnBox.vue
    │   ├── ZnButton.vue
    │   ├── ZnCard.vue
    │   ├── ZnSwitch.vue
    │   └── CustomButton.vue   # Legacy, a reemplazar por ZnButton
    ├── composables/
    │   └── useOnlineStatus.js
    └── utils/
        └── helpers.js
```

**Build:** `vite build --lib` genera `dist/shared.js` (ES module) y `dist/shared.css`.

---

## Cómo Usar en una App

```js
// 1. Importar estilos (en main.js o App.vue)
import '@zn-apps/shared/dist/shared.css'

// 2. Importar componentes
import { ZnApp, ZnScreen, ZnButton, ZnCard, ZnSwitch } from '@zn-apps/shared'

// 3. Importar composables y utilidades
import { useOnlineStatus } from '@zn-apps/shared'
import { formatDate } from '@zn-apps/shared'
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
import { useOnlineStatus } from '@zn-apps/shared'

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
import { formatDate } from '@zn-apps/shared'
formatDate(new Date()) // → "28 de octubre de 2026"
formatDate('2024-01-15') // → "15 de enero de 2024"
```

---

## Dependencias del Paquete

| Paquete | Tipo | Nota |
|---|---|---|
| `vue ^3` | peerDependency | Provista por la app consumidora |
| `@fontsource/roboto` | dependency | Pesos 400 y 500 incluidos |
| `@vitejs/plugin-vue ^5` | devDependency | Plugin para compilar SFCs |
| `vite ^6` | devDependency | Build tool |
