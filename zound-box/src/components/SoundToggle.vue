<script setup>
import { computed } from 'vue'
import { ZnCard } from '@zn-apps/ui-core'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  indicator: { type: String, default: '' },
  image: { type: String, default: '' },
  playing: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
const variant = computed(() => props.modelValue ? 'filled' : 'outlined')

function toggle() {
  const nextValue = !props.modelValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <button
    class="sound-toggle"
    type="button"
    :aria-pressed="modelValue"
    @click="toggle"
  >
    <ZnCard
      class="sound-toggle__card"
      :class="{
        'sound-toggle__card--image': image,
        'sound-toggle__card--active': modelValue
      }"
      :style="image ? { '--sound-toggle-image': `url('${image}')` } : undefined"
      :variant="variant"
    >
      <div class="sound-toggle__body">
        <span v-if="indicator" class="sound-toggle__indicator">{{ indicator }}</span>
        <span class="sound-toggle__title">{{ title }}</span>
        <span v-if="description" class="sound-toggle__description">{{ description }}</span>
        <span class="sound-toggle__state">{{ playing ? 'Reproduciendo' : modelValue ? 'Seleccionado' : 'Desactivado' }}</span>
      </div>
    </ZnCard>
  </button>
</template>

<style scoped>
.sound-toggle {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.sound-toggle:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 3px;
}

.sound-toggle__card {
  box-sizing: border-box;
  display: flex;
  min-height: 132px;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.sound-toggle__card--image {
  isolation: isolate;
}

.sound-toggle__card--image::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.32)),
    var(--sound-toggle-image);
  background-position: center;
  background-size: cover;
  content: '';
  filter: grayscale(1) brightness(0.55);
  pointer-events: none;
  transition: filter 220ms ease;
}

.sound-toggle__card--image.sound-toggle__card--active::before {
  filter: none;
}

.sound-toggle__card :deep(.zn-card__content) {
  display: flex;
  flex: 1;
  z-index: 2;
}

.sound-toggle__body {
  display: grid;
  flex: 1;
  align-content: start;
  gap: 8px;
}

.sound-toggle__indicator {
  color: var(--md-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.sound-toggle__title {
  color: var(--md-on-background);
  font-size: 1rem;
  font-weight: 500;
}

.sound-toggle__description {
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.4;
}

.sound-toggle__state {
  margin-top: auto;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
}

.sound-toggle__card--image .sound-toggle__indicator,
.sound-toggle__card--image .sound-toggle__title,
.sound-toggle__card--image .sound-toggle__description,
.sound-toggle__card--image .sound-toggle__state {
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
}

@media (prefers-reduced-motion: reduce) {
  .sound-toggle__card,
  .sound-toggle__card--image::before {
    transition: none;
  }
}
</style>
