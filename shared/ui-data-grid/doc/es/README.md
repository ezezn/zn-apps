# @zn-apps/ui-data-grid — manual de usuario

`ZnDataGrid` es una tabla de datos Material Design 3. Presenta un array de objetos como filas paginadas, formatea cada celda con los mismos tipos de campo que `ui-data-*`, ordena columnas y compone una barra de filtros. La grilla, la barra de filtros y la paginación son componentes separados que pueden compartir un mismo estado, así que cada uno puede vivir en un contenedor distinto.

- Paquete: `@zn-apps/ui-data-grid` · Carpeta: `shared/ui-data-grid/`
- English: [Read in English](../en/README.md)

## Inicio rápido

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataGrid } from '@zn-apps/ui-data-grid'
import '@zn-apps/ui-data-grid/dist/ui-data-grid.css'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const rows = ref([
  { name: 'Ada', status: 'admin', createdAt: '2026-11-10' },
  { name: 'Grace', status: 'editor', createdAt: '2026-11-12' }
])

const columns = [
  { key: 'name', label: 'Nombre', type: 'text', sortable: true },
  {
    key: 'status',
    label: 'Rol',
    type: 'select',
    sortable: true,
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'editor', label: 'Editor' }
    ]
  },
  { key: 'createdAt', label: 'Creado', type: 'date', sortable: true }
]
</script>

<template>
  <ZnDataGrid :data="rows" :columns="columns" />
</template>
```

Con `data` y `columns`, la grilla controla su propio estado y compone su barra de filtros (cuando recibe `filters`) y su paginación.

## Grilla, filtros y paginación por separado

Crea el estado compartido con `useDataGrid` y coloca cada pieza donde la necesites:

```vue
<script setup>
import { ref } from 'vue'
import {
  ZnDataGrid,
  ZnDataGridFilters,
  ZnDataGridPagination,
  useDataGrid
} from '@zn-apps/ui-data-grid'

const rows = ref(/* ... */)
const columns = [/* ... */]
const filters = [
  { key: 'name', label: 'Nombre', type: 'text' },
  {
    key: 'status',
    label: 'Rol',
    type: 'select',
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'editor', label: 'Editor' }
    ]
  },
  { key: 'createdAt', label: 'Creado', type: 'date-range', startLabel: 'Desde', endLabel: 'Hasta' }
]

const grid = useDataGrid({ data: rows, columns, filters, pageSize: 10 })
</script>

<template>
  <ZnCard>
    <ZnDataGridFilters :grid="grid" />
  </ZnCard>

  <ZnCard>
    <ZnDataGrid
      :grid="grid"
      editable
      edit-label="Editar"
      save-label="Guardar"
      cancel-label="Cancelar"
      @update:data="rows = $event"
    />
  </ZnCard>

  <ZnCard>
    <ZnDataGridPagination :grid="grid" />
  </ZnCard>
</template>
```

Cuando recibe `grid`, `ZnDataGrid` ignora `data`, `columns`, `filters` y `pageSize`, y no dibuja la barra de filtros ni la paginación.

## Columnas

| Opción | Descripción |
|---|---|
| `key` | Ruta del valor dentro de la fila; admite rutas anidadas (`meta.priority`) |
| `label` | Encabezado ya traducido |
| `type` | Un tipo de campo de `ui-data-core` (`text`, `number`, `date`, `select`, `list`, `textarea`, …) o `custom-render` |
| `sortable` | Muestra el encabezado ordenable (ascendente → descendente → orden original) |
| `options` | Opciones de las celdas `select` / `multi-select` y de los filtros |
| `editable` | Ponlo en `false` para dejar una columna de sólo lectura |
| `render` | Render propio de la celda: `row => contenido` o `(row, { column, rowIndex, value }) => contenido` |
| `width` | Ancho opcional de la columna |

Una columna propia también puede declarar `DataGridColumnTypes.CUSTOM_RENDER` (`'custom-render'`). El renderizador puede devolver un VNode, texto o número:

```vue
<script setup>
import { h } from 'vue'
import { ZnChip } from '@zn-apps/ui-core'

const columns = [
  { key: 'name', label: 'Nombre', type: 'text' },
  {
    key: 'status',
    label: 'Estado',
    type: 'custom-render',
    render: (row) => h(ZnChip, { label: row.status, size: 'small', variant: 'suggestion' })
  }
]
</script>
```

## Filtros

| Tipo | Control |
|---|---|
| `text` | Contiene, sin distinguir mayúsculas; también busca en las etiquetas de los selects |
| `select` | Valor exacto de `options` |
| `date` | Mismo día (parte de fecha del valor) |
| `date-range` | Rango inclusivo; cualquiera de los extremos puede quedar vacío |

Cada filtro declara `key`, `label` y `type` (por defecto `text`); `select` necesita `options`, `date-range` acepta `startLabel`/`endLabel` y todos admiten `placeholder`. Usa `filter.match(query, row)` para un criterio propio.

## Edición

Activa `editable` en la grilla para convertir las celdas no personalizadas en disparadores. Al hacer click (o pulsar Enter/Espacio) se abre un diálogo con el input del tipo de campo y se emite el array actualizado:

```vue
<ZnDataGrid v-model:data="rows" :columns="columns" editable />
```

Eventos: `update:data(rows)` y `cell-change({ row, rowIndex, key, value })`. El array se reemplaza con copia (copy-on-write), así que las filas existentes no se mutan. Las columnas `readonly`/`disabled` y las `custom-render` nunca son editables.

## Estado vacío

`emptyText` cubre un origen sin filas; `noResultsText` cubre los filtros que ocultan todas las filas. Ambos usan `emptyIcon` (`inbox` por defecto) y se anuncian con `role="status"`.

```vue
<ZnDataGrid
  :data="rows"
  :columns="columns"
  empty-text="Aún no hay tareas"
  no-results-text="Ninguna tarea coincide con los filtros"
/>
```

## Props principales

| Prop | Por defecto | Descripción |
|---|---|---|
| `data` | `[]` | Filas (modo autónomo) |
| `columns` | `[]` | Definición de columnas |
| `filters` | `[]` | Filtros predefinidos (modo autónomo) |
| `grid` | `null` | Estado de `useDataGrid`; habilita el layout separado |
| `pageSize` | `10` | Filas por página |
| `showFilters` / `showPagination` | `true` | Composición autónoma |
| `editable` | `false` | Edición por celda en diálogo |
| `cellSize` | `small` | Escala del texto de las celdas |
| `emptyText` / `noResultsText` | `'No data'` / `'No results match the filters'` | Mensajes de vacío |
| `emptyIcon` | `inbox` | Icono de vacío |
| `label` | `Data grid` | Nombre accesible de la tabla |
| `editLabel`, `editTitle`, `saveLabel`, `cancelLabel` | `Edit`, `''`, `Save`, `Cancel` | Textos del diálogo de edición |

## Demo y tests

Kitchensink `/data/grid`. Tests: `npx vitest run --project ui-data-grid`.
