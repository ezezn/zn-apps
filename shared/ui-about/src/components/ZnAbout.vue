<script setup>
import { ZnIcon } from '@zn-apps/ui-core'

defineProps({
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' }
})
</script>

<template>
  <div class="zn-about">
    <div class="zn-about__primary">
      <img
        v-if="image"
        class="zn-about__icon zn-about__image"
        :src="image"
        :alt="imageAlt || name"
      >
      <ZnIcon v-else class="zn-about__icon" :name="icon || 'info'" :size="48" />
      <div class="zn-about__heading">
        <h2 class="zn-about__name">{{ name }}</h2>
        <p class="zn-about__version">v{{ version }}</p>
      </div>
    </div>

    <div class="zn-about__secondary">
      <p class="zn-about__description">{{ description }}</p>
      <p class="zn-about__author">{{ author }}</p>
    </div>
  </div>
</template>

<style scoped>
.zn-about {
  display: grid;
  gap: 20px;
}

.zn-about__primary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.zn-about__icon {
  flex: 0 0 auto;
}

.zn-about__image {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.zn-about__heading {
  flex: 1;
  min-width: 0;
}

.zn-about__name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.zn-about__version {
  margin: 4px 0 0;
  font-size: 1rem;
}

.zn-about__secondary {
  display: grid;
  gap: 8px;
}

.zn-about__description,
.zn-about__author {
  margin: 0;
}

.zn-about__author {
  font-size: 0.875rem;
}

</style>
