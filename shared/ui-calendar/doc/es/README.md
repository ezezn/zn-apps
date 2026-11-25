# @zn-apps/ui-calendar — manual de usuario

Calendarios Material Design 3 construidos sobre `@zn-apps/ui-core`: muestran días, permiten elegir una fecha o un rango y marcan eventos. Los campos integrados opcionales permiten escribir la selección en lugar de tocar la cuadrícula.

- Paquete: `@zn-apps/ui-calendar` · Carpeta: `shared/ui-calendar/`
- English: [Read in English](../en/README.md)

## Instalación

```js
import { ZnCalendar } from '@zn-apps/ui-calendar'
import '@zn-apps/ui-calendar/dist/ui-calendar.css'
```

La app debe usar ya `@zn-apps/ui-core` (tokens, tipografías y tema). Si tu build resuelve las librerías desde su fuente, agrega el alias `@zn-apps/ui-calendar` → `shared/ui-calendar/src/index.js` en `vite.config.js` y `vitest.config.js`.

## Ejemplo rápido

```vue
<script setup>
import { ref } from 'vue'
import { ZnCalendar } from '@zn-apps/ui-calendar'

const dia = ref('2026-11-18')
const rango = ref({ start: '2026-11-10', end: '2026-11-14' })

const eventos = [
  { id: 1, title: 'Revisión', start: '2026-11-18T09:00', end: '2026-11-18T10:00', color: '#6750A4' },
  { id: 2, title: 'Conferencia', start: '2026-11-12', end: '2026-11-14' }
]
</script>

<template>
  <ZnCalendar v-model="dia" type-view="month" :events="eventos" show-fields />
  <ZnCalendar v-model="rango" type-view="month" selection-mode="range" />
</template>
```

## Vistas

| `type-view` | Qué muestra | Selección |
|---|---|---|
| `month` | Cuadrícula de seis semanas con los días y las marcas de eventos | Clic en un día |
| `week` | Pestañas horizontales compactas de los días y la agenda del día elegido (la agenda desaparece con `show-events="false"`) | Clic en la pestaña de un día |
| `day` | Agenda de un día, ordenada por hora de inicio | Clic en el encabezado del día |

La navegación sigue a la vista: las flechas avanzan un mes, una semana o un día. `month` y `week` incluyen selectores de mes y año; `day` incluye un campo de fecha. `show-navigation="false"` los oculta todos.

## Props

| Prop | Tipo | Default | Notas |
|---|---|---|---|
| `type-view` | String | `'month'` | `month`, `week` o `day` |
| `selection-mode` | String | `'single'` | `single` o `range` |
| `model-value` / `v-model` | String \| Object | `null` | `YYYY-MM-DD` para fecha única, `{ start, end }` para rango |
| `events` | Array | `[]` | `{ id?, title, start, end?, color? }` |
| `show-today` | Boolean | `true` | Marca el día de hoy y muestra el botón «Hoy» |
| `show-navigation` | Boolean | `true` | Flechas, selectores de mes/año o campo de fecha |
| `show-fields` | Boolean | `false` | Campos opcionales para escribir la selección |
| `show-events` | Boolean | `true` | `false` convierte el calendario en un selector de días |
| `show-event-details` | Boolean | `true` | `false` dibuja los eventos de un día como puntos y los de varios días como líneas |
| `event-variant` | String | `'accent'` | `accent` usa una muesca de color sobre una superficie tenue; `filled` pinta el evento con su color y elige texto negro o blanco automáticamente |
| `locale` | String | sistema | Locale BCP 47 para meses, días de la semana y horas |
| `week-starts-on` | Number | `1` | 0 = domingo … 6 = sábado |
| `labels` | Object | `{}` | Reemplaza los textos en inglés (`today`, `previous`, `next`, `month`, `year`, `date`, `startDate`, `endDate`, `noEvents`, `allDay`, `selectDay`) |
| `today` | String \| Date | hoy real | Fija la fecha de referencia (tests, previsualizaciones) |

Eventos: un `start` con hora (`2026-11-18T09:00`) es un evento con horario; sin hora ocupa el día completo. `end` es opcional y hace que el evento abarque varios días (inclusive); en la vista de mes un evento de varios días se dibuja una vez por semana como una barra continua. `color` acepta cualquier color CSS y se usa para la marca, la barra o el punto.

Los campos de selección y los selectores de mes y año usan el tamaño compacto `xsmall` (40px) a propósito: acompañan a la cuadrícula sin robarle protagonismo. En pantallas estrechas (≤600px) el título y los botones de navegación comparten una sola línea y los campos reparten el ancho disponible, de modo que la cabecera del calendario sigue siendo una franja compacta.

Emite: `update:model-value`, `select`, `event-click` (con el evento normalizado) y `cursor-change` (el día visible como `YYYY-MM-DD` al navegar, usar los selectores de mes y año o cambiar el valor desde fuera; útil para listar algo del mes mostrado).

## Reglas de selección

- **Única**: el valor es un día ISO y cada clic lo reemplaza.
- **Rango**: el primer clic fija el inicio, el segundo el fin y el rango se guarda ordenado aunque se elija al revés. Un tercer clic empieza un rango nuevo. Los días seleccionados conservan la misma marca circular que hoy, rellena con el color principal, y una única línea gruesa y continua del mismo color los une en lugar de sombrear las celdas: solo se redondea en el primer y el último día y permanece sólida en todos los intermedios.
- Con `show-fields`, el modo único muestra un campo de fecha y el modo rango muestra campos de inicio y fin. Editar un campo actualiza el calendario y viceversa.
- Cuando el valor cambia desde fuera, el calendario navega a la fecha seleccionada.

## Textos y locale

Los nombres de meses, días y las horas provienen de `Intl`, así que `locale="es"` basta para las fechas en español. Los pocos textos de interfaz están en inglés por defecto; pasa `labels` desde el i18n de tu app:

```vue
<ZnCalendar v-model="dia" locale="es" :labels="{ today: 'Hoy', previous: 'Anterior', next: 'Siguiente', month: 'Mes', year: 'Año', date: 'Fecha', startDate: 'Fecha inicial', endDate: 'Fecha final', noEvents: 'Sin eventos', allDay: 'Todo el día', selectDay: 'Seleccionar {date}' }" />
```

## Vistas individuales y utilidades

`ZnCalendarMonth`, `ZnCalendarWeek` y `ZnCalendarDay` se exportan para composiciones propias; reciben los días ya calculados y los extremos de la selección, y emiten `select`. También se exportan utilidades de fecha (`buildMonthMatrix`, `normalizeEvents`, `toISODate`, `formatRangeLabel`, …).

## Demo y tests

Kitchensink: `/calendar/month`, `/calendar/range`, `/calendar/week`, `/calendar/day`. Tests: `npx vitest run --project ui-calendar`.
