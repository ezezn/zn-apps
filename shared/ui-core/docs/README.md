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
| `--md-surface-container-highest` | `#E6E0E9` | `#36343B` | Fondo de los campos de entrada (los separa de la tarjeta) |
| `--md-surface-variant` | `#E7E0EC` | `#49454F` | Fondo de tarjetas y switches inactivos |
| `--md-on-surface-variant` | `#49454F` | `#CAC4D0` | Texto secundario o bordes |
| `--md-outline` | `#79747E` | `#938F99` | Contornos y bordes en variante outlined |
| `--md-error` | `#B3261E` | `#F2B8B5` | Errores de validación en campos de entrada |
| `--md-section-gap` | `24px` | `24px` | Espaciado vertical estándar entre secciones |

### Control de Tema y `ZnApp`
El cambio de tema se gestiona **únicamente** a través del componente raíz `ZnApp`:
- `mode="light"`: inyecta la clase `zn-theme-light` en `document.body` y el contenedor raíz.
- `mode="dark"`: inyecta la clase `zn-theme-dark`.
- `mode="system"`: suscribe un listener a `window.matchMedia('(prefers-color-scheme: dark)')` para alternar automáticamente.

---

## 3. Catálogo de Componentes y API

### Organización de carpetas

Los componentes se agrupan por significado en `shared/ui-core/src/components/` (los tests de todos ellos viven en `__tests__/` en la raíz de esa carpeta):

| Carpeta | Contenido |
|---|---|
| `layout/` | `ZnApp`, `ZnScreen`, `ZnScrollArea`, `ZnMasterSlaveLayout` y `screenNavigation.js` (clave de navegación compartida) |
| `containers/` | Contenedores de contenido: `ZnBox`, `ZnRow`, `ZnSection`, `ZnCard` |
| `controls/` | Controles interactivos: `ZnButton`, `ZnChip`, `ZnSwitch` |
| `input/` | Campos de formulario: `ZnSingleLineText`, `ZnMultilineText`, `ZnEmailInput`, `ZnPhoneInput`, `ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput`, `ZnSelect`, `ZnRangeInput`, `ZnDateRangeInput`, `ZnTimeRangeInput`, `ZnDateTimeRangeInput` (+ `ZnFieldShell`, la anatomía MD3 exportada para librerías derivadas, y `ZnTemporalRange`, interno) |
| `navigation/` | `ZnTabs` |
| `dialogs/` | `ZnDialog`, `ZnDialogHost` |
| `media/` | `ZnIcon`, `ZnImage` |

Las apps consumen los componentes exclusivamente desde el barrel `src/index.js` (`@zn-apps/ui-core`), nunca por ruta de archivo, para que esta organización pueda evolucionar.

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

#### `ZnChip`
Chip MD3 reutilizable (`controls/ZnChip.vue`) con las cuatro variantes de Material Design 3.
- **Props**:
  - `variant`: `'assist'` | `'filter'` | `'input'` | `'suggestion'` (default `'assist'`).
  - `size`: `'small'` (24px, densidad -2) | `'medium'` (32px, default) | `'large'` (40px).
  - `label`: texto del chip (también acepta el slot `default`).
  - `selected` (`filter` muestra el check y el fondo `secondary-container`), `disabled`, `elevated` (assist/filter/suggestion).
  - `clickable`: lo hace interactivo y accesible por teclado (`role="button"`; en `filter`, `role="checkbox"` + `aria-checked`).
  - `removable`: añade el botón de quitar y emite `remove` (variante `input`). `removeLabel` define su etiqueta accesible.
- **Slots**: `#icon` (icono inicial de 18px), `default` (contenido del label).
- **Eventos**: `click`, `remove`.
- **Geometría MD3**: 32dp de alto y radio 8dp por defecto; el tamaño del texto no cambia con la densidad. `ZnSelect` con `multiple` usa internamente `ZnChip variant="input"` y le pasa su propio `size`, por lo que los chips acompañan al campo (48/24px, 56/32px o 64/40px).

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
- `ZnRow`: contenedor flexbox. Props: `padding` (`'16px'`), `gap` (`'12px'`), `align` (`'flex-start'`), `justify` (`'flex-start'`), `direction` (`'row' | 'column'`) y `wrap` (`Boolean`). Úsalo en lugar de duplicar `display: flex` en las apps y librerías.

Los tokens `--md-secondary-container` y `--md-on-secondary-container` están disponibles para los estados seleccionados de chips y filtros.

---

### Componentes de Entrada de Datos (`input/`)

Todos los campos comparten la anatomía MD3 *outlined* (contorno con muesca, etiqueta flotante, texto de asistencia y estado de error) implementada por el componente interno `ZnFieldShell`, y envuelven controles HTML nativos: cualquier atributo (`name`, `autocomplete`, `aria-*`, `@keydown`) se reenvía al `<input>` o `<textarea>` real.

**Props comunes**: `modelValue` (`v-model`), `label`, `hint`, `error`, `placeholder`, `name`, `disabled`, `readonly`, `required`, `floatLabel`, `variant`, `size`. **Slots**: `#leading` y `#trailing` (iconos o adornos). El error añade `aria-invalid="true"` y enlaza el texto con `aria-describedby`.

- `variant`: `'outlined'` (por defecto, contorno con muesca) o `'filled'` (contenedor tonal con indicador inferior de 1px que pasa a 2px en foco y error). Son las dos variantes que define MD3 para campos de texto. `ZnDateRangeInput`, `ZnTimeRangeInput` y `ZnDateTimeRangeInput` también lo aceptan.
- `size`: `'small'` (48px), `'medium'` (56px, por defecto) o `'large'` (64px). MD3 fija 56dp como altura estándar y una escala de densidad de 4dp por paso: `small` equivale a la densidad -2. MD3 recomienda no aplicar densidad por defecto, sino ofrecerla como preferencia (por ejemplo, un layout denso alternable); `large` conserva la tipografía y sólo amplía contenedor y padding. La escala se aplica igual en `outlined` y `filled`, con o sin iconos, y en `ZnSelect`, correos, teléfonos y campos temporales.
- `label` es opcional: sin etiqueta no se renderiza `label` ni la muesca del contorno; el `placeholder` queda siempre visible. En ese caso aporta `aria-label` (se reenvía al control nativo).
- `floatLabel` mantiene la etiqueta sobre el contorno aunque el campo esté vacío. Los campos temporales (`ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput` y los tres rangos) lo activan siempre, porque el control nativo muestra su propio texto (`dd/mm/aaaa`, `--:--`) y de lo contrario se superpondría a la etiqueta.
- El contenedor del campo usa `--md-surface-container-highest` y el contorno aparece solo con el borde, de modo que el área editable se distingue de la superficie de la tarjeta en ambos temas.
- Con `#leading` (icono inicial), la etiqueta en reposo se desplaza 44px para no superponerse al icono; al flotar vuelve al borde. Sin `label` el contorno nunca abre muesca.
- El contorno outlined se dibuja con tres paneles (borde inicial, muesca de ancho automático y borde final) en lugar de `fieldset`/`legend`, para que el borde coincida exactamente con el contenedor en todos los navegadores.

#### `ZnSingleLineText`
Campo de texto de una línea (`<input type="text">`).
- **Props extra**: `type`, `maxlength`, `autocomplete`, `variant`.
- **Eventos**: `update:modelValue`, `enter`, `focus`, `blur`.

#### `ZnMultilineText`
Área de texto (`<textarea>`) con contador opcional externo.
- **Props extra**: `rows` (default `4`), `maxlength`, `variant`.
- **Eventos**: `update:modelValue`, `focus`, `blur`.

#### `ZnEmailInput`
`type="email"` con validación de formato al perder el foco.
- **Props extra**: `validate` (default `true`), `invalidMessage`, `autocomplete` (default `'email'`).
- **Eventos**: `update:modelValue`, `update:valid`, `validation(Boolean)`.

#### `ZnPhoneInput`
`type="tel"` que sanea la entrada (solo dígitos, `+`, espacios, paréntesis y guiones) y valida la cantidad de dígitos.
- **Props extra**: `minDigits` (default `6`), `maxDigits` (default `15`), `validate`, `invalidMessage`.
- **Eventos**: `update:modelValue` (valor saneado), `update:valid`, `validation(Boolean)`.

#### `ZnDateInput` / `ZnTimeInput` / `ZnDateTimeInput`
Selectores nativos `date`, `time` y `datetime-local`.
- **Props extra**: `min`, `max`, `step` (hora y fecha-hora).
- **Eventos**: `update:modelValue`, `change`, `focus`, `blur`.

#### `ZnSelect`
Menú desplegable MD3 de selección simple o múltiple, renderizado con `Teleport` y posición fija (no lo recorta el scroll del contenedor). Si el select está anidado en un `<dialog>` (por ejemplo, en el editor de datos), el menú se teleporta al propio diálogo: un diálogo modal ocupa la capa superior del navegador y un menú en `<body>` quedaría detrás de él. El menú se cierra automáticamente cuando el diálogo se cierra.
- **Props**:
  - `options`: `Array<string | number | { value, label?, disabled? }>`.
  - `multiple` (`Boolean`): con `true` el `modelValue` es un `Array` y la selección se muestra como chips removibles.
  - `maxVisibleItems` (`Number`, default `6`): altura máxima del menú (`items × 48px`); al superarla aparece la barra de desplazamiento.
  - `label`, `hint`, `error`, `placeholder`, `disabled`, `required`, `variant`.
- **Eventos**: `update:modelValue`, `change`, `open`, `close`.
- **Teclado**: `ArrowDown`/`ArrowUp` abren y recorren, `Home`/`End`, `Enter`/`Espacio` seleccionan, `Escape` cierra.

#### `ZnRangeInput`
Deslizador basado en `<input type="range">`.
- **Props**: `modelValue` (`Number` simple o `[inicio, fin]` con dos actuadores), `min`, `max`, `step`, `label`, `hint`, `error`, `showValue`, `valueFormat(Function)`, `disabled`, `showTicks`, `centered`.
- **Variantes MD3**: continua (por defecto), discreta con marcas por cada `step` (`showTicks`, hasta 50 marcas), centrada (el indicador crece desde el punto medio con `centered`) y de rango (dos actuadores con `modelValue` como array).
- **Eventos**: `update:modelValue`, `change`. En modo doble los valores nunca se cruzan.

#### `ZnDateRangeInput` / `ZnTimeRangeInput` / `ZnDateTimeRangeInput`
Pares de campos temporales nativos (`date`, `time` y `datetime-local`) con la misma API; comparten la implementación interna `ZnTemporalRange`.
- **Props**: `modelValue` (`[inicio, fin]` en el formato nativo: `YYYY-MM-DD`, `HH:mm` o `YYYY-MM-DDTHH:mm`), `startLabel`, `endLabel`, `startName`, `endName`, `min`, `max`, `step` (hora y fecha-hora), `hint`, `error`, `invalidMessage`, `disabled`, `required`.
- **Comportamiento**: aplica el límite cruzado (`max` del inicio = fin, `min` del fin = inicio) y muestra error si el fin es anterior al inicio (mensaje por defecto adaptado al tipo).
- **Eventos**: `update:modelValue`, `change`, `focus`, `blur`.

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
