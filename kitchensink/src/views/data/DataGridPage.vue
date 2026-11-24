<template>
  <DemoView view="data-grid">
    <ZnSection title="1. Grilla completa (piezas integradas)" collapsible :columns="1">
      <p class="section-desc">
        <code>ZnDataGrid</code> recibe <code>data</code> y <code>columns</code>.
        Cuando no se le pasa un estado compartido compone su propia barra de
        filtros y su paginación. Las columnas usan los tipos de
        <code>ui-data-core</code>: <code>text</code>, <code>select</code>,
        <code>date</code>, <code>number</code> o <code>custom-render</code>.
        Activa una celda editable para abrir el diálogo de edición.
      </p>

      <ZnDataGrid
        :data="standaloneRows"
        :columns="columns"
        :filters="filters"
        :page-size="5"
        editable
        label="Tareas de ejemplo"
        edit-label="Editar"
        save-label="Guardar"
        cancel-label="Cancelar"
        empty-text="No hay tareas"
        @update:data="updateStandalone"
      />
    </ZnSection>

    <ZnSection title="2. Grilla, filtros y paginación separados" collapsible :columns="1">
      <p class="section-desc">
        <code>useDataGrid</code> crea un estado reactivo compartido. Cada pieza
        (<code>ZnDataGridFilters</code>, <code>ZnDataGrid</code> y
        <code>ZnDataGridPagination</code>) puede vivir en un contenedor distinto
        y todas reaccionan a los mismos filtros, orden y página. La barra de
        filtros muestra el limpiar y el selector tabla/cards en línea con los
        fields mediante <code>show-clear</code> y
        <code>show-view-switch</code>; <code>v-model:view</code> comparte la
        vista con la grilla.
      </p>

      <ZnBox variant="outlined" class="grid-piece">
        <ZnDataGridFilters
          :grid="grid"
          show-view-switch
          v-model:view="sharedView"
        />
      </ZnBox>

      <ZnCard variant="outlined" class="grid-card">
        <ZnDataGrid
          :grid="grid"
          :show-view-switch="false"
          v-model:view="sharedView"
          editable
          label="Tareas con estado compartido"
          edit-label="Editar"
          save-label="Guardar"
          cancel-label="Cancelar"
          @update:data="updateShared"
        />
      </ZnCard>

      <ZnBox variant="outlined" class="grid-piece">
        <ZnDataGridPagination :grid="grid" />
      </ZnBox>

      <ZnBox variant="outlined" class="grid-output">
        <span class="showcase-label">Filas actuales</span>
        <pre class="json-dump">{{ sharedJson }}</pre>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Estado vacío" collapsible :columns="1">
      <p class="section-desc">
        Sin filas, la grilla muestra el icono y el texto configurados. Si los
        filtros ocultan todos los resultados, el mensaje es distinto del estado
        vacío de origen.
      </p>

      <ZnDataGrid
        :data="[]"
        :columns="columns.slice(0, 3)"
        :show-filters="false"
        :show-pagination="false"
        empty-text="Todavía no hay tareas registradas"
      />
    </ZnSection>

    <ZnSection title="4. Barra de filtros compacta" collapsible :columns="1">
      <p class="section-desc">
        Los fields de la barra usan <code>size="xsmall"</code> por defecto y
        ocupan el ancho restante. Con <code>show-view-switch</code> se agregan
        los botones de tabla/cards y con <code>:show-clear="false"</code> se
        oculta el limpiar; ambos son acciones de texto, sólo icono, alineadas
        con los fields.
      </p>

      <ZnBox variant="outlined" class="grid-piece">
        <ZnDataGridFilters
          :grid="compactGrid"
          show-view-switch
          :show-clear="false"
          v-model:view="compactView"
        />
      </ZnBox>

      <ZnCard variant="outlined" class="grid-card">
        <ZnDataGrid
          :grid="compactGrid"
          :show-view-switch="false"
          :view="compactView"
        />
      </ZnCard>
    </ZnSection>

    <ZnSection title="5. Columnas y filtros (JSON)" collapsible :expanded="false" :columns="1">
      <p class="section-desc">
        <code>filter.match(query, row)</code> permite un filtro propio; las
        columnas <code>custom-render</code> exponen
        <code>render(row, { column, rowIndex, value })</code>.
      </p>

      <ZnBox variant="outlined" class="grid-output">
        <span class="showcase-label">columns</span>
        <pre class="json-dump">{{ columnsJson }}</pre>
      </ZnBox>

      <ZnBox variant="outlined" class="grid-output">
        <span class="showcase-label">filters</span>
        <pre class="json-dump">{{ filtersJson }}</pre>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { ZnBox, ZnCard, ZnChip, ZnSection } from '@zn-apps/ui-core'
import { clone } from '@zn-apps/ui-data-core'
import {
  ZnDataGrid,
  ZnDataGridFilters,
  ZnDataGridPagination,
  useDataGrid
} from '@zn-apps/ui-data-grid'
import DemoView from '../../components/DemoView.vue'

const statusOptions = [
  { value: 'open', label: 'Abierta' },
  { value: 'progress', label: 'En curso' },
  { value: 'done', label: 'Completada' }
]

const demoRows = [
  { code: 'TSK-01', name: 'Revisar propuesta de diseño', status: 'open', priority: 2, due: '2026-11-18', notes: 'Falta validar con el equipo.' },
  { code: 'TSK-02', name: 'Implementar formulario de alta', status: 'progress', priority: 5, due: '2026-11-20', notes: '' },
  { code: 'TSK-03', name: 'Actualizar iconos de la app', status: 'done', priority: 1, due: '2026-11-14', notes: 'Generado con build:icons.' },
  { code: 'TSK-04', name: 'Documentar componentes nuevos', status: 'open', priority: 3, due: '2026-11-25', notes: '' },
  { code: 'TSK-05', name: 'Revisar accesibilidad del diálogo', status: 'progress', priority: 8, due: '2026-11-21', notes: 'Foco y Escape.' },
  { code: 'TSK-06', name: 'Preparar demo de la grilla', status: 'open', priority: 4, due: '2026-11-19', notes: '' },
  { code: 'TSK-07', name: 'Migrar textos al esquema i18n', status: 'done', priority: 2, due: '2026-11-10', notes: '' },
  { code: 'TSK-08', name: 'Optimizar sprites de iconos', status: 'open', priority: 6, due: '2026-12-02', notes: 'Sólo los glifos usados.' },
  { code: 'TSK-09', name: 'Validar borradores sin conexión', status: 'progress', priority: 7, due: '2026-11-28', notes: '' }
]

const columns = [
  { key: 'code', label: 'Código', type: 'custom-render', render: (row) =>
    h(ZnChip, { variant: 'suggestion', size: 'small', label: row.code }) },
  { key: 'name', label: 'Tarea', type: 'text', sortable: true },
  { key: 'status', label: 'Estado', type: 'select', sortable: true, options: statusOptions },
  { key: 'priority', label: 'Prioridad', type: 'number', sortable: true },
  { key: 'due', label: 'Vence', type: 'date', sortable: true },
  { key: 'notes', label: 'Notas', type: 'textarea' }
]

const filters = [
  { key: 'name', label: 'Tarea', type: 'text', placeholder: 'Buscar por nombre' },
  { key: 'status', label: 'Estado', type: 'select', options: statusOptions },
  {
    key: 'due',
    label: 'Vencimiento',
    type: 'date-range',
    startLabel: 'Desde',
    endLabel: 'Hasta'
  }
]

const standaloneRows = ref(clone(demoRows))
const sharedRows = ref(clone(demoRows))
const compactRows = ref(clone(demoRows))
const sharedView = ref('table')
const compactView = ref('table')
const grid = useDataGrid({
  data: sharedRows,
  columns,
  filters,
  pageSize: 4
})
const compactGrid = useDataGrid({
  data: compactRows,
  columns,
  filters,
  pageSize: 4
})

function updateStandalone(rows) {
  standaloneRows.value = rows
}

function updateShared(rows) {
  sharedRows.value = rows
}

const sharedJson = computed(() => JSON.stringify(sharedRows.value, null, 2))
const columnsJson = computed(() => JSON.stringify(columns, null, 2))
const filtersJson = computed(() => JSON.stringify(filters, null, 2))
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.grid-piece {
  margin-bottom: 12px;
}

.grid-card {
  margin-bottom: 12px;
}

.grid-output {
  margin-top: 16px;
}

.showcase-label {
  display: block;
  margin-bottom: 8px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.json-dump {
  overflow-x: auto;
  max-height: 320px;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--md-surface-container-low);
  color: var(--md-on-background);
  font-family: monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
}
</style>
