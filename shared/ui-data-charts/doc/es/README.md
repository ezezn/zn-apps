# @zn-apps/ui-data-charts — manual de usuario

Gráficos SVG definidos por tus datos y un único objeto de configuración: barras verticales (simples, agrupadas y apiladas), líneas (una o varias), áreas (superpuestas o apiladas), pie y donut. Al hacer clic en una barra, un punto de la línea o una porción se abre un detalle fijado; la paleta por defecto sigue los colores de Material Design 3 y puede reemplazarse.

- Paquete: `@zn-apps/ui-data-charts` · Carpeta: `shared/ui-data-charts/`
- English: [Read in English](../en/README.md)

## Instalación

```js
import { ZnChart } from '@zn-apps/ui-data-charts'
import '@zn-apps/ui-data-charts/dist/ui-data-charts.css'
```

La librería no depende de `ui-core`: sólo lee las variables CSS `--md-*` cuando existen, así que también funciona con un tema propio. Si tu build resuelve las librerías desde su fuente, agrega el alias `@zn-apps/ui-data-charts` → `shared/ui-data-charts/src/index.js` en `vite.config.js` y `vitest.config.js`.

## Ejemplo rápido

```vue
<script setup>
import { ZnChart } from '@zn-apps/ui-data-charts'

const ventas = [
  { mes: 'Ene', online: 22, tienda: 14 },
  { mes: 'Feb', online: 28, tienda: 17 },
  { mes: 'Mar', online: 24, tienda: 19 },
]

const config = {
  type: 'bar-stacked',
  category: 'mes',
  series: [
    { key: 'online', label: 'Online' },
    { key: 'tienda', label: 'Tienda' }
  ],
  yAxis: { title: 'Pedidos' },
  height: 280
}
</script>

<template>
  <ZnChart :data="ventas" :config="config" @point-click="console.log" />
</template>
```

## Tipos de gráfico

| `config.type` | Qué dibuja |
|---|---|
| `bar` | Una barra vertical por categoría |
| `bar-grouped` | Una barra por serie, una al lado de otra (también es el comportamiento de `bar` con varias series) |
| `bar-stacked` | Series acumuladas en una sola barra |
| `line` | Una línea con puntos |
| `line-multi` | Una línea por serie |
| `area` | Área rellena bajo cada línea |
| `area-stacked` | Áreas acumuladas por categoría |
| `pie` | Porciones del total |
| `donut` | Pie con radio interior y total opcional en el centro |

`line` y `area` también aceptan varias series: se comportan como `line-multi` y áreas superpuestas. Los tipos agrupados y apilados existen para que la intención quede explícita en la configuración.

## Cómo indicar dónde están los datos

El `config` mapea tus filas a categorías y series. Un mismo arreglo `data` puede leerse de tres formas:

```js
// 1. Un valor por fila
{ category: 'mes', value: 'ventas' }

// 2. Una columna por serie
{ category: 'mes', series: ['online', 'tienda'] }
{ category: 'mes', series: [{ key: 'online', label: 'Online', color: '#6750A4' }] }

// 3. Una fila por categoría + serie (formato largo)
{ category: 'mes', value: 'visitas', series: 'canal' }
```

Las filas también pueden ser números (`[3, 7, 5]`). Con el formato largo, los pares categoría+serie repetidos se suman y las series aparecen en el orden en que se encuentran. `config.categories` puede renombrar las categorías por índice, y `config.seriesLabels` / `config.seriesColors` renombran o recolorean series por clave.

## Referencia de configuración

| Clave | Default | Notas |
|---|---|---|
| `type` | `'bar'` | Cualquier tipo de la tabla anterior |
| `category` | `'label'` | Propiedad usada como eje X / etiqueta de porción (admite rutas `a.b`) |
| `value` | `'value'` | Propiedad numérica para una serie y para gráficos circulares |
| `series` | — | Nombre de columna (extraer), arreglo de columnas u objetos `{ key, label, color }` |
| `categories` | — | Arreglo de etiquetas que reemplaza los valores de categoría |
| `colors` | paleta MD3 | Cualquier color CSS; uno por serie (cartesianos) o por porción (pie/donut) |
| `seriesLabels` / `seriesColors` | — | Objetos indexados por nombre de serie |
| `stacked` | según `type` | Fuerza el apilado |
| `height` | `280` | Alto del área de dibujo en píxeles; la leyenda queda encima |
| `legend` | automática | Apagada salvo con varias series, pie o donut; `true`/`false` la fuerza |
| `tooltip` | `true` | `false` mantiene el evento `point-click` pero desactiva el popup |
| `curve` | `'linear'` | `'smooth'` dibuja líneas curvas |
| `points` | sólo líneas | Muestra los puntos visibles |
| `valueFormat` | número Intl | Función o locale para valores y marcas del eje |
| `valueLabel` / `percentLabel` | inglés | Etiquetas del popup en pie/donut (`Value`, `Share`); pasa traducciones |
| `xAxis` | `{}` | `title`, `hide`, `rotateLabels`, `format(label)` |
| `yAxis` | `{}` | `title`, `hide`, `grid: false`, `min`, `max`, `ticks` (arreglo o cantidad), `tickCount`, `format(value)` |
| `donut` | `{}` | `innerRadius` (0.62), `totalLabel`, `showTotal: false` |

Los valores que no son numéricos (o están vacíos) se convierten en huecos: las líneas se cortan, las barras desaparecen y las series apiladas quedan planas en ese punto. Los gráficos apilados mantienen los valores positivos sobre cero y los negativos debajo.

## Interacción

- Haz clic en una barra, un punto o una porción para fijar su detalle; repite el clic, haz clic en el fondo o pulsa <kbd>Esc</kbd> para cerrarlo.
- Al pasar el puntero o enfocar una marca se previsualiza el popup sin fijarlo. El detalle muestra todas las series de esa categoría, con la seleccionada resaltada, el valor y, en pie/donut, el porcentaje.
- Las marcas son accesibles por teclado: <kbd>Tab</kbd> recorre las marcas y <kbd>Intro</kbd> o <kbd>Espacio</kbd> abre el popup.
- `@point-click` informa la selección para que la app reaccione (abrir un detalle, filtrar una tabla, etc.):

```js
{
  type: 'bar-stacked',
  category: 'Ene',
  categoryIndex: 0,
  series: 'online',
  seriesLabel: 'Online',
  seriesIndex: 0,
  value: 22,
  seriesValues: [22, 14], // todas las series de esa categoría
  percent: null            // sólo pie/donut
}
```

## Personalización

- Colores: `colors` acepta hex, `rgb()`, `oklch()` y variables CSS. El primer color por defecto es `var(--md-primary, #6750A4)`, así que las series heredan el tema de la app.
- Accesibilidad: pasa `aria-label` para nombrar el gráfico y `empty-text` para traducir el estado vacío. El componente no muestra texto propio salvo las etiquetas `Value`/`Share` del popup, que puedes reemplazar con `valueLabel` y `percentLabel`.
- Layout: el gráfico ocupa el ancho de su contenedor y se redibuja al cambiar de tamaño. Colócalo dentro de `ZnCard` o `ZnSection` para usar la superficie MD3.

## Miniaturas con `ZnChartShape`

`ZnChartShape` recibe los mismos `data` y `config` y dibuja una versión reducida sin ejes, etiquetas, leyenda, popup ni interacción: sirve como icono o como vista previa dentro de una tarjeta de resumen.

```vue
<script setup>
import { ZnChartShape } from '@zn-apps/ui-data-charts'

const visitas = [
  { canal: 'Email', visitas: 420 },
  { canal: 'Búsqueda', visitas: 610 },
  { canal: 'Redes', visitas: 340 }
]
</script>

<template>
  <!-- Decorativa: oculta para lectores de pantalla -->
  <ZnChartShape :data="visitas" :config="{ type: 'donut' }" :width="32" :height="32" />

  <!-- Con nombre: se expone como imagen -->
  <ZnChartShape
    :data="visitas"
    :config="{ type: 'bar', category: 'canal', value: 'visitas' }"
    :aria-label="'Visitas por canal'"
  />
</template>
```

`width` y `height` (por defecto `64×40`) definen el `viewBox` en píxeles; el SVG escala con CSS si el contenedor es más grande. Se ignoran `config.height`, los ejes, la leyenda y el popup, y sin datos dibuja un marcador punteado para que el hueco no colapse.

## Demo y tests

Kitchensink: `/data/charts` recorre todos los tipos, la galería de miniaturas, las tres formas de datos y controles en vivo para apilado, curvas, puntos, leyendas y paleta MD3/personalizada; `/data/charts-data` imprime el `data` y el `config` exactos de cada ejemplo para copiarlos. Tests: `npx vitest run --project ui-data-charts`.
