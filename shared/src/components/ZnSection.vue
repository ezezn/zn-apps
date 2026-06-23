<template>
  <details 
    v-if="collapsible" 
    class="zn-section zn-section--collapsible" 
    :open="isOpen"
    @toggle="onToggle"
  >
    <summary class="zn-section__header">
      <div class="zn-section__title-wrapper">
        <slot name="title">
          <h2 class="zn-section__title">{{ title }}</h2>
        </slot>
      </div>
      
      <ZnButton variant="text" icon-only tag="div" class="zn-section__chevron">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="zn-section__icon">
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" fill="currentColor"/>
        </svg>
      </ZnButton>
    </summary>
    
    <div class="zn-section__content">
      <slot />
    </div>
  </details>

  <section v-else class="zn-section">
    <header v-if="title || $slots.title" class="zn-section__header">
      <div class="zn-section__title-wrapper">
        <slot name="title">
          <h2 class="zn-section__title">{{ title }}</h2>
        </slot>
      </div>
    </header>
    
    <div class="zn-section__content">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ZnButton from './ZnButton.vue' // <-- Importamos el nuevo botón

const props = defineProps({
  title: { type: String, default: '' },
  collapsible: { type: Boolean, default: false },
  expanded: { type: Boolean, default: true }
})

const emit = defineEmits(['toggle'])
const isOpen = ref(props.expanded)

function onToggle(event) {
  isOpen.value = event.target.open
  emit('toggle', isOpen.value)
}
</script>

<style scoped>
.zn-section {
  display: block;
  width: 100%;
  margin-bottom: var(--md-section-gap, 24px);
}
.zn-section:last-child {
  margin-bottom: 0;
}

.zn-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px; /* Bajamos el padding vertical para balancear el tamaño del botón */
  user-select: none;
  outline: none;
}

.zn-section--collapsible > .zn-section__header {
  cursor: pointer;
  list-style: none;
}
.zn-section--collapsible > .zn-section__header::-webkit-details-marker {
  display: none;
}

.zn-section__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 28px;
  color: var(--md-on-background);
}

.zn-section__title-wrapper {
  flex: 1;
}

/* Transición de rotación sobre el componente ZnButton */
.zn-section__chevron {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-section[open] .zn-section__chevron {
  transform: rotate(180deg);
}

.zn-section__content {
  padding: 16px;
  color: var(--md-on-background);
}
</style>