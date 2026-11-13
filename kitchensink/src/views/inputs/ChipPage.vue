<template>
  <DemoView view="input-chip">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        MD3 define cuatro variantes de chip: <code>assist</code> (acción sugerida),
        <code>filter</code> (filtro seleccionable), <code>input</code> (información
        introducida por la persona) y <code>suggestion</code> (sugerencia dinámica).
        Todas comparten 32dp de altura y radio de 8dp.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">assist</span>
        <ZnChip variant="assist" label="Añadir a calendario" clickable>
          <template #icon>
            <ZnIcon name="event" :size="18" />
          </template>
        </ZnChip>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">filter · seleccionable</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip
            v-for="filter in filters"
            :key="filter.id"
            variant="filter"
            :label="filter.label"
            :selected="filter.selected"
            clickable
            @click="toggleFilter(filter)"
          />
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">input · removable</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip
            v-for="person in people"
            :key="person"
            variant="input"
            :label="person"
            removable
            @remove="removePerson(person)"
          />
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">suggestion</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip variant="suggestion" label="Diseño" clickable />
          <ZnChip variant="suggestion" label="Código" clickable />
        </ZnRow>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Tamaños" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> sigue la escala de densidad MD3: <code>small</code> (24px,
        densidad -2), <code>medium</code> (32px, por defecto) y <code>large</code>
        (40px). El tamaño del texto no cambia, sólo el contenedor y el padding.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · 24px</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip variant="input" label="Compacto" size="small" removable />
          <ZnChip variant="filter" label="Filtro" size="small" selected />
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · 32px</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip variant="input" label="Estándar" removable />
          <ZnChip variant="filter" label="Filtro" selected />
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · 40px</span>
        <ZnRow padding="0" gap="8px" wrap>
          <ZnChip variant="input" label="Amplio" size="large" removable />
          <ZnChip variant="filter" label="Filtro" size="large" selected />
        </ZnRow>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado</span>
        <ZnChip variant="input" label="Bloqueado" disabled removable />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Elevado</span>
        <ZnChip variant="suggestion" label="Elevado" elevated />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con icono + removable</span>
        <ZnChip variant="input" label="Etiqueta" removable>
          <template #icon>
            <ZnIcon name="sell" :size="18" />
          </template>
        </ZnChip>
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Uso dentro y fuera del select" collapsible :columns="1">
      <p class="section-desc">
        <code>ZnSelect</code> usa <code>ZnChip variant="input"</code> para cada valor
        seleccionado, por lo que los chips heredan también su <code>size</code>. El
        mismo componente puede usarse de forma independiente, como en esta página.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnSelect multiple · size="small"</span>
        <ZnSelect v-model="selected" label="Etiquetas" :options="tagOptions" multiple size="small" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnBox, ZnChip, ZnIcon, ZnRow, ZnSection, ZnSelect } from '@zn-apps/ui-core'

const filters = ref([
  { id: 'design', label: 'Diseño', selected: true },
  { id: 'code', label: 'Código', selected: false },
  { id: 'research', label: 'Investigación', selected: false }
])

const people = ref(['Ada Lovelace', 'Grace Hopper'])
const selected = ref(['Diseño'])

const tagOptions = ['Diseño', 'Código', 'Investigación', 'Equipo']

function toggleFilter(filter) {
  filter.selected = !filter.selected
}

function removePerson(name) {
  people.value = people.value.filter((person) => person !== name)
}
</script>
