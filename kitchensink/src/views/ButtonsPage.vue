<script setup>
import DemoView from '../components/DemoView.vue'
import {
  ZnSection, ZnBox, ZnButton, ZnIcon, ZnRow
} from '@zn-apps/ui-core'

// --- Sección 1: 5 variantes de énfasis ---
const variantShowcase = [
  { label: 'Filled', variant: 'filled', icon: 'check' },
  { label: 'Tonal',  variant: 'tonal', icon: 'check' },
  { label: 'Elevated', variant: 'elevated', icon: 'check' },
  { label: 'Outlined', variant: 'outlined', icon: 'check' },
  { label: 'Text',    variant: 'text',    icon: 'check' }
]
</script>

<template>
  <DemoView view="buttons">
    <template #icon>
      <ZnIcon name="menu" />
    </template>

    <section class="content">
      <ZnSection :columns="5">
        <ZnButton
          v-for="btn in variantShowcase"
          :key="btn.variant"
          :variant="btn.variant"
        >
          <template #icon>
            <ZnIcon :name="btn.icon" />
          </template>
          {{ btn.label }}
        </ZnButton>
      </ZnSection>
    </section>
  </DemoView>
</template>
