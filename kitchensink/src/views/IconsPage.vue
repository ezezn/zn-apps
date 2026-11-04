<template>
  <DemoView view="icons">
    <template #icon>
      <ZnIcon name="palette" />
    </template>

    <ZnSection title="1. Uso Básico (Props: name / family / size)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>ZnIcon</code> referencia un <code>&lt;symbol&gt;</code> del sprite SVG con
        <code>&lt;use&gt;</code>. El sprite de la familia se inyecta una única vez en el documento,
        así que cientos de iconos comparten un solo recurso.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Nombre por defecto (filled · 24)</span>
        <ZnIcon name="home" />
        <span class="helper-text"><code>&lt;ZnIcon name="home" /&gt;</code></span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Familia outlined</span>
        <ZnIcon name="home" family="outlined" />
        <span class="helper-text"><code>family="outlined"</code></span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Tamaño personalizado</span>
        <ZnRow padding="0" gap="12px">
          <ZnIcon name="bolt" :size="18" />
          <ZnIcon name="bolt" :size="24" />
          <ZnIcon name="bolt" :size="36" />
          <ZnIcon name="bolt" size="2.5rem" />
        </ZnRow>
        <span class="helper-text">Número → px; string → unidad CSS.</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Color Heredado y Accesibilidad (Prop: label)" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        El icono usa <code>fill: currentColor</code>, por lo que respeta el contraste de cada variante
        de <code>ZnButton</code>. Con <code>label</code> se expone como imagen accesible
        (<code>role="img"</code> + <code>aria-label</code>); sin ella es decorativo (<code>aria-hidden</code>).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Dentro de botones (hereda el color)</span>
        <ZnRow padding="0" gap="8px">
          <ZnButton variant="filled" iconOnly>
            <ZnIcon name="play_arrow" />
          </ZnButton>
          <ZnButton variant="tonal" iconOnly>
            <ZnIcon name="pause" />
          </ZnButton>
          <ZnButton variant="outlined" iconOnly>
            <ZnIcon name="skip_next" />
          </ZnButton>
          <ZnButton variant="text" iconOnly>
            <ZnIcon name="more_vert" />
          </ZnButton>
          <ZnButton variant="tonal" iconOnly disabled>
            <ZnIcon name="settings" />
          </ZnButton>
        </ZnRow>
        <span class="helper-text">El estado <code>disabled</code> atenúa el icono automáticamente.</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Icono con etiqueta accesible</span>
        <ZnRow padding="0" gap="8px">
          <ZnIcon name="favorite" label="Favorito" />
          <span class="helper-text"><code>label="Favorito"</code></span>
        </ZnRow>
        <span class="helper-text">Sin <code>label</code> el icono se oculta a lectores de pantalla.</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Explorador de Iconos" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        Cada familia contiene {{ perFamilyCount.toLocaleString('es-ES') }} iconos.
        Filtra por nombre y elige el estilo; el sprite se carga bajo demanda.
      </p>

      <div class="icon-toolbar">
        <ZnRow padding="0" gap="8px" class="icon-families">
          <ZnButton
            v-for="item in ICON_FAMILIES"
            :key="item"
            :variant="family === item ? 'filled' : 'text'"
            @click="family = item"
          >
            {{ item }}
          </ZnButton>
        </ZnRow>

        <input
          v-model="query"
          class="icon-search"
          type="search"
          placeholder="Buscar icono… (ej. play, arrow, home)"
          aria-label="Buscar icono"
        />
      </div>

      <p class="helper-text icon-counter">
        <template v-if="loading">Cargando catálogo…</template>
        <template v-else>
          {{ filtered.length.toLocaleString('es-ES') }} iconos encontrados · mostrando {{ visible.length }}
        </template>
      </p>

      <ul v-if="!loading" class="icon-grid">
        <li v-for="name in visible" :key="`${family}-${name}`" class="icon-cell">
          <ZnIcon :name="name" :family="family" :size="26" />
          <span class="icon-name">{{ name }}</span>
        </li>
      </ul>

      <ZnButton
        v-if="!loading && visible.length < filtered.length"
        variant="tonal"
        @click="visibleCount += PAGE_SIZE"
      >
        Mostrar más ({{ filtered.length - visible.length }} restantes)
      </ZnButton>
    </ZnSection>

    <ZnSection title="4. API Auxiliar y Carga Diferida" collapsible :expanded="false" :columns="1">
      <p class="section-desc section-desc--full">
        El paquete exporta helpers para construir galerías, buscadores o validar nombres antes de
        renderizar. Cada familia es un chunk independiente que solo se descarga al usarse.
      </p>

      <pre class="code-block">import { ZnIcon, iconNames, iconExists } from '@zn-apps/ui-core'

// Todos los nombres de una familia (para galerías o buscadores)
const names = await iconNames('outlined')

// ¿Existe el icono antes de renderizarlo?
if (await iconExists('filled', 'play_arrow')) { /* … */ }</pre>

      <pre class="code-block">&lt;ZnIcon name="play_arrow" /&gt;
&lt;ZnIcon name="dark_mode" family="outlined" :size="32" label="Modo oscuro" /&gt;</pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { ICON_FAMILIES, ZnButton, ZnBox, ZnIcon, ZnRow, ZnSection, iconNames } from '@zn-apps/ui-core'

const PAGE_SIZE = 120

const family = ref('filled')
const query = ref('')
const names = ref([])
const loading = ref(true)
const visibleCount = ref(PAGE_SIZE)

// Todas las familias del set tienen la misma cantidad de iconos.
const perFamilyCount = computed(() => names.value.length)

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return names.value
  return names.value.filter((name) => name.includes(term))
})

const visible = computed(() => filtered.value.slice(0, visibleCount.value))

// Evita que una respuesta lenta de una familia anterior sobrescriba la actual.
let requestToken = 0

async function loadFamily(value) {
  const token = ++requestToken
  loading.value = true
  try {
    const list = await iconNames(value)
    if (token === requestToken) names.value = list
  } catch (error) {
    if (token === requestToken) names.value = []
    console.warn('[IconsPage] No se pudo cargar el catálogo de iconos:', error)
  } finally {
    if (token === requestToken) loading.value = false
  }
}

onMounted(() => loadFamily(family.value))

watch(family, (value) => {
  visibleCount.value = PAGE_SIZE
  loadFamily(value)
})

watch(query, () => {
  visibleCount.value = PAGE_SIZE
})
</script>

<style scoped>
.icon-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.icon-families {
  width: auto;
  flex-wrap: wrap;
}

.icon-search {
  flex: 1 1 240px;
  min-width: 200px;
  padding: 10px 14px;
  border-radius: 100px;
  border: 1px solid var(--md-outline);
  background-color: transparent;
  color: var(--md-on-background);
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
}

.icon-search:focus {
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.icon-counter {
  margin: 4px 0 0 0;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 8px;
  width: 100%;
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}

.icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 6px;
  border-radius: 12px;
  border: 1px solid var(--md-surface-variant);
  background-color: var(--md-surface-container-low);
  color: var(--md-on-surface-variant);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.icon-cell:hover {
  border-color: var(--md-primary);
  background-color: var(--md-surface-variant);
}

.icon-name {
  font-size: 0.62rem;
  line-height: 1.25;
  text-align: center;
  word-break: break-word;
}
</style>
