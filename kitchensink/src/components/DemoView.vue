<script setup>
import { computed } from 'vue'
import { ZnScreen, ZnSection } from '@zn-apps/ui-core'
import { demoViews } from '../data/demo-views'

const props = defineProps({
  view: { type: String, required: true }
})

const config = computed(() => demoViews.find((item) => item.key === props.view))
</script>

<template>
  <ZnScreen v-if="config" :title="config.title" :subtitle="config.subtitle">
    <ZnSection
      v-for="section in config.sections"
      :key="section.title"
      :title="section.title"
    >
      <p class="demo-view__description">{{ section.content }}</p>
    </ZnSection>
    <slot />
  </ZnScreen>
  <div v-else class="demo-view__missing" role="alert">
    No existe una vista de demostración con la clave “{{ view }}”.
  </div>
</template>

<style scoped>
.demo-view__description {
  margin: 0;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.demo-view__missing {
  padding: 24px;
  color: var(--md-error);
}
</style>
