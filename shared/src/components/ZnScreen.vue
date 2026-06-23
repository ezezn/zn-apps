<template>
  <div class="zn-screen">
    <header class="zn-top-app-bar">
      <div class="zn-header-navigation">
        <slot name="icon">
          <span v-if="icon" class="zn-default-icon">{{ icon }}</span>
        </slot>
        <slot name="title">
          <h1 class="zn-default-title">{{ title }}</h1>
        </slot>
      </div>
      <div class="zn-header-actions">
        <slot name="actions" />
      </div>
    </header>

    <main class="zn-screen-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'ZoundBox'
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.zn-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.zn-top-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  background-color: var(--md-surface);
  color: var(--md-on-surface);
  border-bottom: 1px solid var(--md-surface-variant);
  z-index: 10;
}

.zn-header-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.zn-default-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.zn-default-title {
  font-size: 22px;
  font-weight: 400; /* MD3 usa fuentes más ligeras para títulos de barra */
  margin: 0;
  letter-spacing: 0;
}

.zn-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zn-screen-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  background-color: var(--md-background);
  /* Configura por defecto una disposición en columna de arriba hacia abajo */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>