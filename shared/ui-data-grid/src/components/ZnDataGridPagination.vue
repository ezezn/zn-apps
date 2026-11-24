<script setup>
import { computed } from 'vue'
import { ZnButton, ZnIcon, ZnRow } from '@zn-apps/ui-core'

const props = defineProps({
  /** Shared state created with `useDataGrid`. */
  grid: { type: Object, required: true },
  previousLabel: { type: String, default: 'Previous page' },
  nextLabel: { type: String, default: 'Next page' },
  ofLabel: { type: String, default: 'of' },
  /** Optional custom page indicator; defaults to `page / pageCount`. */
  pageLabel: { type: String, default: '' }
})

const total = computed(() => props.grid.total.value)
const page = computed(() => props.grid.page.value)
const pageCount = computed(() => props.grid.pageCount.value)
const rangeStart = computed(() => props.grid.rangeStart.value)
const rangeEnd = computed(() => props.grid.rangeEnd.value)
const indicator = computed(
  () => props.pageLabel || `${page.value} / ${pageCount.value}`
)
</script>

<template>
  <ZnRow
    v-if="total > 0"
    class="zn-data-grid-pagination"
    padding="0"
    gap="8px"
    align="center"
    justify="space-between"
  >
    <span class="zn-data-grid-pagination__range">
      {{ rangeStart }}–{{ rangeEnd }} {{ ofLabel }} {{ total }}
    </span>

    <div class="zn-data-grid-pagination__controls">
      <ZnButton
        variant="text"
        icon-only
        :disabled="page <= 1"
        :aria-label="previousLabel"
        :title="previousLabel"
        @click="grid.previousPage()"
      >
        <ZnIcon name="chevron_left" :size="20" />
      </ZnButton>

      <span class="zn-data-grid-pagination__page">{{ indicator }}</span>

      <ZnButton
        variant="text"
        icon-only
        :disabled="page >= pageCount"
        :aria-label="nextLabel"
        :title="nextLabel"
        @click="grid.nextPage()"
      >
        <ZnIcon name="chevron_right" :size="20" />
      </ZnButton>
    </div>
  </ZnRow>
</template>

<style scoped>
.zn-data-grid-pagination {
  width: 100%;
  min-width: 0;
  padding-top: 12px;
  font-family: 'Roboto', sans-serif;
  color: var(--md-on-surface-variant);
}

.zn-data-grid-pagination__range {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.zn-data-grid-pagination__controls {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.zn-data-grid-pagination__page {
  min-width: 56px;
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
}
</style>
