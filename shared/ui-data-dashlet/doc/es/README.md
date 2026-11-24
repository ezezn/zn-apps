# @zn-apps/ui-data-dashlet — manual de usuario

Cards de dashboard para métricas KPI, resúmenes y estadísticas. Tres tipos principales de componentes: `ZnDashlet` (contenedor), `ZnDashletCounter` (ícono + número + subtítulo), `ZnDashletSummary` (resumen dual) y `ZnDashletSparkline` (mini gráfico de tendencia) y `ZnDashletProgress` (barra de progreso).

- Paquete: `@zn-apps/ui-data-dashlet` · Carpeta: `shared/ui-data-dashlet/`
- English: [Read in English](../en/README.md)

## Instalación

```js
import { ZnDashlet, ZnDashletCounter, ZnDashletSummary, ZnDashletSparkline, ZnDashletProgress } from '@zn-apps/ui-data-dashlet'
```

La librería no depende de `ui-core`: sólo lee las variables CSS `--md-*` cuando existen, así que también funciona con un tema propio. Si tu build resuelve las librerías desde su fuente, agrega el alias `@zn-apps/ui-data-dashlet` → `shared/ui-data-dashlet/src/index.js` en `vite.config.js` y `vitest.config.js`.

## ZnDashlet

Un contenedor de card flexible que aloja contenido de dashboard personalizado con variantes de colores MD3.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'neutral'` | Esquema de color variante. Usa tokens de color MD3 a través de propiedades CSS personalizadas. |
| `filled` | `boolean` | `true` | Si la card debe llenarse con el color variante. Cuando es `false`, muestra solo borde (modo outline). |
| `height` | `number` | `120` | Altura en píxeles. El por defecto coincide con la altura de card MD3. |
| `class` | `string` | `''` | Clase CSS adicional aplicada al elemento raíz. |

### Uso

```vue
<script setup>
import { ZnDashlet } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Card rellena primary -->
  <ZnDashlet variant="primary" filled :height="160">
    <p>Tu contenido personalizado aquí</p>
  </ZnDashlet>

  <!-- Modo outline (sin relleno) -->
  <ZnDashlet variant="success" filled :height="100">
    <p>Contenido sin fondo de color</p>
  </ZnDashlet>
</template>
```

## ZnDashletCounter

Card de contador con ícono grande a la izquierda, número grande a la derecha y subtítulo opcional abajo.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `value` | `number \| string` | `0` | El número principal a mostrar. |
| `label` | `string` | `''` | Etiqueta descriptiva (ej. "Usuarios", "Ventas"). |
| `subtitle` | `string` | `''` | Subtítulo mostrado debajo de la etiqueta. |
| `icon` | `string` | `'trending_up'` | Nombre de ícono Material Design (ej. `'people'`, `'trending_up'`). |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Esquema de color variante. |
| `filled` | `boolean` | `true` | Si la card debe llenarse con el color variante. |

### Uso

```vue
<script setup>
import { ZnDashletCounter } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Contador con ícono, valor y subtítulo -->
  <ZnDashletCounter
    :value="128"
    label="Usuarios"
    subtitle="Activos"
    icon="people"
    variant="primary"
    :filled="true"
  />
</template>
```

## ZnDashletSummary

Card de resumen con disposición de dos filas. El layout por defecto `double-row` tiene una fila superior más grande con el valor principal y el subtítulo, y una fila inferior más pequeña con un valor secundario y subtítulo. El layout `side-by-side` coloca dos elementos horizontalmente uno al lado del otro.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `value` | `number \| string` | `0` | El valor grande principal. |
| `subtitle` | `string` | `''` | Subtítulo mostrado encima del valor principal. |
| `secondaryValue` | `number \| string` | `0` | El valor secundario más pequeño. |
| `secondaryLabel` | `string` | `''` | Etiqueta para el valor secundario. |
| `secondarySubtitle` | `string` | `''` | Subtítulo para el valor secundario. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Esquema de color variante. |
| `filled` | `boolean` | `true` | Si la card debe llenarse con el color variante. |
| `layout` | `'double-row' \| 'side-by-side'` | `'double-row'` | Modo de disposición. `double-row` apila verticalmente; `side-by-side` coloca los elementos horizontalmente. |

### Uso - double-row (por defecto)

```vue
<script setup>
import { ZnDashletSummary } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <ZnDashletSummary
    :value="250"
    subtitle="Objetivo"
    secondaryValue="75"
    secondaryLabel="Avance"
    secondarySubtitle="Progreso"
    variant="success"
    :filled="true"
  />
</template>
```

### Uso - side-by-side

```vue
<script setup>
import { ZnDashletSummary } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <ZnDashletSummary
    :value="150"
    subtitle="Ventas"
    secondaryValue="80"
    secondaryLabel="Meta"
    secondarySubtitle="Meta trimestral"
    variant="info"
    :filled="true"
    :layout="'side-by-side'"
  />
</template>
```

## ZnDashletSparkline

Un pequeño gráfico de línea de tendencia que muestra puntos de datos recientes. Ideal para mostrar dirección de tendencia dentro de cards de dashboard.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `data` | `Array<number>` | `[]` | Puntos de datos numéricos para el sparkline. Se necesitan al menos 2 puntos para una línea visible. |
| `height` | `number` | `40` | Altura en píxeles. |
| `width` | `number` | `120` | Ancho en píxeles. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Esquema de color variante. Usa tokens de color MD3 para la línea. |
| `filled` | `boolean` | `true` | Si el contenedor de fondo usa el color variante. |

### Uso

```vue
<script setup>
import { ZnDashletSparkline } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Sparkline con 5 puntos de datos -->
  <ZnDashletSparkline
    :data="[10, 15, 12, 20, 18]"
    variant="primary"
    :filled="true"
  />
</template>
```

## ZnDashletProgress

Una barra de progreso horizontal que muestra el porcentaje de finalización. Ideal para mostrar completación de tareas, uso de recursos o cualquier métrica con valor porcentual.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `value` | `number` | `0` | Valor actual de progreso. |
| `max` | `number` | `100` | Valor máximo para cálculo porcentual. |
| `showValue` | `boolean` | `true` | Si mostrar el texto porcentual numérico encima de la barra. |
| `height` | `number` | `8` | Altura de la barra en píxeles. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Esquema de color variante. Usa tokens de color MD3 para el relleno. |
| `filled` | `boolean` | `true` | Si la barra usa el color variante (de lo contrario usa `currentColor` con baja opacidad). |

### Uso

```vue
<script setup>
import { ZnDashletProgress } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Barra de progreso mostrando 75% -->
  <ZnDashletProgress
    :value="75"
    max="100"
    variant="primary"
    :filled="true"
  />
</template>
```

## Personalización

- **Colores**: Todos los componentes usan tokens de color MD3 (`--md-primary`, `--md-success`, `--md-warning`, `--md-error`, `--md-info`) a través de propiedades CSS personalizadas. La primera entrada de color por defecto es `var(--md-primary, #6750A4)`, así que las series heredan el tema de la app automáticamente.
- **Modo outline**: Fija `filled=false` para renderizar cards/baras solo con bordes y trazos/rellenos en `currentColor`.
- **Responsive**: Los componentes son fluidos en ancho y restringidos en altura. Coloca dentro de `ZnCard` o `ZnSection` para styling de superficie MD3.

## Ejemplos

Ver la demo en Kitchensink en `/data/dashlets` para ejemplos en vivo de todos los tipos de componente con controles de variantes y opciones de disposición.