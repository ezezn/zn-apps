<template>
  <div class="zn-screen">
    <header 
      v-if="title || $slots.title || $slots.icon || $slots.actions" 
      class="zn-screen__header"
    >
      <div class="zn-screen__branding">
        <div v-if="$slots.icon" class="zn-screen__icon">
          <slot name="icon" />
        </div>
        
        <h1 class="zn-screen__title">
          <slot name="title">{{ title }}</slot>
        </h1>
      </div>

      <div v-if="$slots.actions" class="zn-screen__actions">
        <slot name="actions" />
      </div>
    </header>

    <main class="zn-screen__content">
      <slot />
    </main>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.zn-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--md-background);
  color: var(--md-on-background);
}

/* ==========================================================================
   ESTILOS TOP APP BAR (MD3)
   ========================================================================== */
.zn-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px; /* Altura estándar de una barra M3 compacta */
  padding: 0 16px;
  background-color: var(--md-surface);
  border-bottom: 1px solid var(--md-outline);
  box-sizing: border-box;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.zn-screen__branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zn-screen__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--md-primary);
}

/* Forzar que cualquier SVG inyectado en el slot del icono mantenga proporciones */
.zn-screen__icon :deep(svg) {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.zn-screen__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  color: var(--md-on-surface);
}

.zn-screen__actions {
  display: flex;
  align-items: center;
}

/* ==========================================================================
   ÁREA DE CONTENIDO
   ========================================================================== */
.zn-screen__content {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .zn-screen__content {
    padding: 12px;
  }
}
</style>