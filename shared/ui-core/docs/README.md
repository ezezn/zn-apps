# @zn-apps/ui-core — Documentación de Librería

> Ubicación: `shared/ui-core/`  
> Paquete npm: `@zn-apps/ui-core`  
> Responsabilidad: Sistema de diseño Material Design 3 (MD3), componentes Vue 3 reutilizables, composables, utilidades y pipeline de sprites de iconos.

---

## 1. Propósito y Filosofía de Diseño

`@zn-apps/ui-core` es la biblioteca base de interfaz de usuario para todas las aplicaciones del monorepo `zn-apps`.
- **Material Design 3 (MD3)**: Cumple rigurosamente las pautas de MD3 para temas, contraste accesible, elevación y anatomía de componentes.
- **Agnóstica de Routing/Store**: No se acopla a Vue Router ni a Pinia. Permite que cualquier app (sea una SPA de una página o una aplicación multi-pantalla) use sus primitivas.
- **Aislamiento**: Se distribuye como librería ES module compilada (`dist/ui-core.js` y `dist/ui-core.css`). Las apps la consumen como workspace de npm (`"@zn-apps/ui-core": "*"`).

---

## 2. Sistema de Diseño (Tokens CSS MD3)

Los tokens se definen en `src/assets/css/global.css` y se activan mediante variables CSS (`--md-*`).

### Tokens Principales

| Token CSS | Modo Claro | Modo Oscuro | Rol / Propósito |
|---|---|---|---|
| `--md-primary` | `#6750A4` | `#D0BCFF` | Color principal de acción y énfasis alto |
| `--md-on-primary` | `#FFFFFF` | `#381E72` | Texto/iconos sobre fondo primary |
| `--md-primary-container` | `#EADDFF` | `#4F378B` | Contenedor de énfasis medio-alto |
| `--md-on-primary-container` | `#21005D` | `#EADDFF` | Texto sobre primary-container |
| `--md-background` | `#FEF7FF` | `#141218` | Fondo de la aplicación |
| `--md-on-background` | `#1D1B20` | `#E6E1E5` | Texto principal sobre fondo |
| `--md-surface` | `#FEF7FF` | `#141218` | Superficie estándar (cards, screens) |
| `--md-surface-container-low`| `#F7F2FA` | `#1D1B20` | Superficie con baja elevación |
| `--md-surface-variant` | `#E7E0EC` | `#49454F` | Fondo de tarjetas y switches inactivos |
| `--md-on-surface-variant` | `#49454F` | `#CAC4D0` | Texto secundario o bordes |
| `--md-outline` | `#79747E` | `#938F99` | Contornos y bordes en variante outlined |
| `--md-section-gap` | `24px` | `24px` | Espaciado vertical estándar entre secciones |

### Control de Tema y `ZnApp`
El cambio de tema se gestiona **únicamente** a través del componente raíz `ZnApp`:
- `mode="light"`: inyecta la clase `zn-theme-light` en `document.body` y el contenedor raíz.
- `mode="dark"`: inyecta la clase `zn-theme-dark`.
- `mode="system"`: suscribe un listener a `window.matchMedia('(prefers-color-scheme: dark)')` para alternar automáticamente.

---

## 3. Catálogo de Componentes y API

### Componentes de Infraestructura y Layout

#### `ZnApp`
Envoltorio raíz obligatorio de cada app.
- **Props**: `mode` (`'system'` | `'light'` | `'dark'`, default `'system'`).
- **Slots**: `default` (contenido de la aplicación).

#### `ZnScreen`
Contenedor principal de vistas con barra superior que se eleva dinámicamente al desplazarse.
- **Props**:
  - `title` (`String`, default `''`)
  - `subtitle` (`String`, default `''`)
- **Slots**:
  - `#icon`: Icono a la izquierda del título.
  - `#title`: Reemplazo personalizado del título.
  - `#actions`: Controles a la derecha de la barra (switches, botones de acción).
  - `default`: Cuerpo de la pantalla con scrollbar autocontenido (`ZnScrollArea`).

#### `ZnScrollArea`
Contenedor para scrollbars accesibles que superpone un thumb visual durante el desplazamiento.
- **Props**: `label` (`String`, default `''`, para accesibilidad `aria-label`).
- **Slots**: `default`.

#### `ZnMasterSlaveLayout`
Layout responsivo para apps multi-pantalla o maestro-detalle.
- **Comportamiento**: En pantallas anchas muestra navegación (master) y contenido (slave) lado a lado; en móvil (`<= breakpoint`), alterna deslizamiento suave entre master y slave con soporte de `prefers-reduced-motion`.
- **Props**:
  - `viewKey` (`String | Number`, enlazar con `$route.fullPath` para transiciones automáticas).
  - `breakpoint` (`Number`, default `768`).
- **Slots**:
  - `#master`: Vista maestra de navegación.
  - `default`: Vista de detalle o `<router-view />`.

#### `ZnSection`
Agrupador vertical de contenido con soporte opcional para colapsado y grilla.
- **Props**:
  - `title` (`String`, default `''`)
  - `collapsible` (`Boolean`, default `false`)
  - `expanded` (`Boolean`, default `true`)
  - `columns` (`Number | String`, default `0`, activa CSS grid de 1 a 10 columnas)
- **Slots**: `default`. Elementos hijos pueden usar `.zn-span-2` a `.zn-span-10`.
- **Eventos**: `@toggle(isOpen: Boolean)`

#### `ZnTabs`
Barra de navegación horizontal por pestañas (MD3 tabs).
- **Props**:
  - `tabs` (`Array<{ value, label, content?, icon?, badge?, disabled? }>`, requerido)
  - `modelValue` (`String | Number`, valor de tab activo para `v-model`)
  - `variant` (`'primary'` | `'secondary'`, default `'primary'`)
- **Slots**: `#panel` (recibe `{ tab, index }` para personalizar el panel activo).

---

### Componentes Atómicos y Controles

#### `ZnButton`
Botón interactivo con variantes MD3.
- **Props**:
  - `variant`: `'filled'` | `'tonal'` | `'elevated'` | `'outlined'` | `'text'` (default `'filled'`)
  - `disabled`: `Boolean` (default `false`)
  - `iconOnly`: `Boolean` (default `false`, renderiza botón circular 40x40px)
  - `tag`: `String` (default `'button'`, ej. `'a'`)
- **Slots**:
  - `#icon`: SVG o `ZnIcon` (hereda `fill: currentColor`)
  - `default`: Texto del botón

#### `ZnCard`
Tarjeta contenedora con elevación y soporte de scrim para imágenes.
- **Props**:
  - `title`: `String`
  - `variant`: `'filled'` | `'elevated'` | `'outlined'`
  - `image`: URL de imagen
  - `imageVariant`: `'header'` (scrim degradado) | `'full'` (fondo completo con oscurecimiento)
- **Slots**: `#title`, `default`.

#### `ZnSwitch`
Interruptor accesible MD3 con thumb animado, texto interior e iconos.
- **Props**:
  - `modelValue`: `Boolean` (`v-model`)
  - `labelLeft` / `labelRight`: `String` (etiquetas exteriores)
  - `textOn` / `textOff`: `String` (texto breve dentro del thumb)
  - `disabled`: `Boolean`
- **Slots**: `#labelLeft`, `#labelRight`, `#iconOn`, `#iconOff`.
- **Eventos**: `@update:modelValue`, `@change`.

#### `ZnBox` y `ZnRow`
Primitivas de espaciado y contenedores neutros:
- `ZnBox`: contenedor estilizado con variante MD3 (`filled`, `elevated`, `outlined`).
- `ZnRow`: contenedor flexbox (`padding`, `gap`, `align`).

---

### Sistema de Iconos (`ZnIcon`) y Chunks SVG

#### `ZnIcon`
Renderiza iconos Material Design mediante `<symbol>` y `<use>` referenciando sprites locales SVG.
- **Props**:
  - `name`: `String` (snake_case obligatorio, ej. `'home'`, `'volume_up'`)
  - `family`: `'filled'` | `'outlined'` | `'round'` | `'sharp'` | `'two-tone'` (default `'filled'`)
  - `size`: `Number | String` (default `24`)
  - `label`: `String` (si se omite, se marca como decorativo `aria-hidden="true"`)

#### Pipeline de Iconos
1. **Detección**: `npm run scan:icons` analiza el código fuente y genera `icon-profile.json` (`scanned` detectados + `manual` preservados).
2. **Generación de Chunks**: `npm run generate:icons` extrae únicamente los glifos requeridos desde `@material-design-icons/svg` y genera sprites en `public/icons/sprite-<familia>.svg`.
3. **Carga Diferida**: En runtime, `loadIconFamily(family)` descarga el sprite de la familia una única vez y lo inyecta en `#zn-icon-sprite-host`.

---

### Sistema de Diálogos (`ZnDialogHost` y `useDialogs`)

Monta un `ZnDialogHost` en la raíz de la app y consume `useDialogs()` de manera programática:

```javascript
import { useDialogs } from '@zn-apps/ui-core'

const { alert, confirm, prompt } = useDialogs()

// 1. Alerta
await alert('Configuración guardada con éxito.')

// 2. Confirmación (retorna true o false)
const ok = await confirm('¿Deseas reiniciar la sesión?')

// 3. Prompt (retorna string o null)
const username = await prompt('Introduce tu nombre:', { required: true })
```

---

## 4. Composables y Utilidades

- **`useOnlineStatus()`**: Composable reactivo que escucha eventos de red del navegador y expone `isOnline: Ref<Boolean>`.
- **`formatDate(date)`**: Formatea fechas a formato legible en español (ej. `"28 de octubre de 2026"`).

---

## 5. Testing

Los tests de componentes y composables residen en `shared/ui-core/src/**/__tests__/`.
Ejecución:
```bash
npm run test:shared
```
o específicamente:
```bash
npx vitest run --project ui-core
```
