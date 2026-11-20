# @zn-apps/ui-core — manual de usuario

Sistema de diseño Material Design 3 para todas las apps del monorepo: componentes, tokens CSS, composables, utilidades y sistema de chunks de iconos.

- Paquete: `@zn-apps/ui-core` · Carpeta: `shared/ui-core/`
- English: [Read in English](../en/README.md)

## Instalación y uso

```js
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton } from '@zn-apps/ui-core'
```

Importa siempre desde el barrel del paquete, nunca por ruta de archivo. Toda app debe envolverse en `<ZnApp>`.

```vue
<ZnApp mode="system">
  <ZnScreen title="Mi app">
    <ZnSection title="Contenido">…</ZnSection>
  </ZnScreen>
</ZnApp>
```

## Tema

`ZnApp` es el único interruptor de tema: `mode` = `system` (por defecto), `light` o `dark`. Aplica `zn-theme-light`/`zn-theme-dark` en `<body>` y sigue la preferencia del sistema en modo `system`.

Todos los colores y espaciados provienen de tokens `--md-*` (definidos en `src/assets/css/global.css`): `primary`, `on-primary`, `primary-container`, `background`, `on-background`, `surface`, `surface-container-low`, `surface-container-highest` (fondo de inputs), `surface-variant`, `on-surface-variant`, `outline`, `error`, `secondary-container`, `section-gap`… Cada uno tiene valor claro y oscuro; úsalos en lugar de colores literales.

## Componentes

**Layout** — `ZnApp`, `ZnScreen` (`title`, `subtitle`, `menuLabel`; slots `#icon`, `#title`, `#actions`), `ZnScrollArea`, `ZnMasterSlaveLayout` (`viewKey`, `breakpoint`; slots `#master`, default), `ZnSection` (`title`, `collapsible`, `expanded`, `columns` 0–10, hijos `.zn-span-N`), `ZnTabs` (`tabs`, `modelValue`, `variant` primary/secondary; slot `#panel`), `ZnDrawer` (`modelValue`, `variant` modal/standard, `side` start/end, `width`, `label`, `closeButton`, `closeLabel`, `closeOnEscape`, `closeOnScrim`; slots `#header`, default).

En escritorio `ZnMasterSlaveLayout` muestra la navegación al costado del contenido. En móvil muestra una sola pantalla a la vez: si la app arranca sin ruta seleccionada, la navegación ocupa la pantalla primero; si arranca en una página (contenido primero), la página conserva el foco y el botón hamburguesa del header abre la navegación como drawer modal. Las apps no implementan nada de esto.

**Contenedores y controles** — `ZnBox` (filled/elevated/outlined), `ZnRow` (flex: `padding`, `gap`, `align`, `justify`, `direction`, `wrap`), `ZnCard` (`title`, `variant`, `image`, `imageVariant` header/full), `ZnButton` (`variant` filled/tonal/elevated/outlined/text, `iconOnly`, `tag`), `ZnChip` (assist/filter/input/suggestion; `size` small 24px / medium 32px / large 40px; `selected`, `clickable`, `removable`), `ZnSwitch` (`labelLeft`/`labelRight`, `textOn`/`textOff`, slots de iconos).

**Entradas** — `ZnSingleLineText`, `ZnMultilineText`, `ZnEmailInput`, `ZnPhoneInput`, `ZnNumberInput`, `ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput`, `ZnSelect`, `ZnRangeInput`, `ZnDateRangeInput`, `ZnTimeRangeInput`, `ZnDateTimeRangeInput`. Todas comparten la anatomía MD3 (etiqueta flotante, muesca, hint, error) con:

| Prop | Valores |
|---|---|
| `variant` | `outlined` (por defecto) · `filled` |
| `size` | `xsmall` 40px · `small` 48px · `medium` 56px (por defecto) · `large` 64px |
| comunes | `label`, `hint`, `error`, `placeholder`, `disabled`, `readonly`, `required`, `floatLabel` |
| slots | `#leading`, `#trailing` |

- `label` es opcional (aporta `aria-label`); `floatLabel` la mantiene flotando aunque el campo esté vacío.
- `ZnEmailInput` valida al perder el foco y emite `update:valid`/`validation`; `ZnPhoneInput` sanea la entrada y valida la cantidad de dígitos (`minDigits` 6, `maxDigits` 15); `ZnNumberInput` emite `Number | null` y valida `min`/`max` al perder el foco.
- `ZnSelect` soporta `multiple` (chips MD3), `maxVisibleItems`, teleporta su menú (también dentro de diálogos) y es navegable por teclado.
- `ZnRangeInput` ofrece variantes continua, discreta (`showTicks`), centrada y de doble actuador.
- Los rangos temporales validan que el fin no sea anterior al inicio.

**Media** — `ZnIcon` (`name` en snake_case, `family` filled/outlined/round/sharp/two-tone, `size`, `label`), `ZnImage`.

**Diálogos** — monta `ZnDialogHost` una vez y usa `const { alert, confirm, prompt } = useDialogs()`.

## Composables y utilidades

- `useOnlineStatus()` → `{ isOnline }`.
- `formatDate(date)` → fecha legible en español.

## Iconos

Agrega `<ZnIcon name="volume_up" />`, ejecuta `npm run build:icons` y haz commit de `icon-profile.json` y `public/icons/*.svg`. `ZnIcon` descarga cada sprite de familia una vez y lo cachea; los builds de producción usan los sprites versionados.

## Demos y tests

Cada componente se demuestra en Kitchensink (`/buttons`, `/inputs/*`, `/data/*`, `/icons`…). Tests: `npx vitest run --project ui-core`.
