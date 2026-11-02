<template>
  <div class="zn-nav-layout">
    <aside class="zn-nav-layout__aside">
      <div class="zn-nav-layout__aside-header">
        <slot name="aside-header" />
      </div>
      <nav class="zn-nav-layout__aside-menu">
        <slot name="aside" />
      </nav>
    </aside>

    <div class="zn-nav-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Layout estructural puro, el estado de las rutas lo manejará vue-router externamente
</script>

<style scoped>
.zn-nav-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--md-background);
}

/* ==========================================================================
   ESTILOS DEL ASIDE (Navigation Drawer MD3)
   ========================================================================== */
.zn-nav-layout__aside {
  width: 280px; /* Ancho estándar de un Navigation Drawer en MD3 */
  min-width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--md-surface);
  border-right: 1px solid var(--md-surface-variant);
  box-sizing: border-box;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.zn-nav-layout__aside-header {
  padding: 24px 16px;
  display: flex;
  align-items: center;
}

.zn-nav-layout__aside-menu {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ==========================================================================
   ÁREA DE CONTENIDO PRINCIPAL
   ========================================================================== */
.zn-nav-layout__content {
  flex: 1;
  min-width: 0; /* Previene desbordamientos de flexbox */
  display: flex;
  flex-direction: column;
  background-color: var(--md-background);
}

/* ==========================================================================
   RESPONSIVIDAD
   ========================================================================== */
@media (max-width: 768px) {
  .zn-nav-layout {
    flex-direction: column;
  }

  .zn-nav-layout__aside {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid var(--md-surface-variant);
  }
}
</style>