<template>
  <ZnScreen title="Catálogo de Componentes">
    <template #title>
      <div>
        <h1 style="margin:0; font-size: 1.4rem;">Catálogo de Componentes</h1>
        <span style="font-size: 0.8rem; color: var(--md-outline);">Material Design 3 e Infraestructura Shared</span>
      </div>
    </template>

    <ZnSection title="1. Variantes de Énfasis (Prop: variant)" collapsible>
      <p class="section-desc">Material Design 3 define 5 tipos de botones según su peso visual en la interfaz. El valor por defecto es <code>filled</code>.</p>
      
      <div class="component-showcase-grid">
        <div class="showcase-item">
          <span class="showcase-label">FILLED (MÁXIMO)</span>
          <ZnButton variant="filled">Filled Button</ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">TONAL (MEDIO-ALTO)</span>
          <ZnButton variant="tonal">Tonal Button</ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">ELEVATED (MEDIO CON SOMBRA)</span>
          <ZnButton variant="elevated">Elevated Button</ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">OUTLINED (MEDIO-BAJO)</span>
          <ZnButton variant="outlined">Outlined Button</ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">TEXT (BAJO)</span>
          <ZnButton variant="text">Text Button</ZnButton>
        </div>
      </div>
    </ZnSection>

    <ZnSection title="2. Botones con Iconos (Slot: icon)" collapsible>
      <p class="section-desc">Puedes pasar un SVG al slot <code>#icon</code> para acompañar al texto. Cumple con la regla MD3 de mantener el texto en <em>Sentence case</em>.</p>
      
      <div class="component-showcase-grid">
        <div class="showcase-item">
          <span class="showcase-label">CON ICONO E INFORMACIÓN</span>
          <ZnButton variant="filled">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-203v-554l440 277-440 277Z"/></svg>
            </template>
            Reproducir pista
          </ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">OUTLINED CON ICONO</span>
          <ZnButton variant="outlined">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
            </template>
            Descargar audio
          </ZnButton>
        </div>
      </div>
    </ZnSection>

    <ZnSection title="3. Botones de Icono Puro (Prop: iconOnly)" collapsible>
      <p class="section-desc">Al activar <code>iconOnly</code>, el botón se vuelve circular (40x40px). Útil para barras de herramientas o controles de reproducción compactos.</p>
      
      <div class="component-showcase-grid">
        <div class="showcase-item">
          <span class="showcase-label">FILLED ICON</span>
          <ZnButton variant="filled" iconOnly>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>
          </ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">TONAL ICON</span>
          <ZnButton variant="tonal" iconOnly>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80 240-320l240-240 240 240L480-80Z"/></svg>
          </ZnButton>
        </div>
        <div class="showcase-item">
          <span class="showcase-label">STANDARD / TEXT ICON</span>
          <ZnButton variant="text" iconOnly>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-19-7-35-17.5T288-251l-119 50-100-173 102-78q-2-14-2-28t2-28L69-686l100-173 119 50q15-15 31-25.5t35-17.5l16-128h200l16 128q19 7 35 17.5T672-709l119-50 100 173-102 78q2 14 2 28t-2 28l102 78-100 173-119-50q-15 15-31 25.5T672-251l-16 128H370Z"/></svg>
          </ZnButton>
        </div>
      </div>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ZnScreen, ZnSection, ZnButton } from '@zn-apps/shared'
</script>

<style scoped>
.section-desc {
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: var(--md-on-background);
  opacity: 0.7;
  margin-bottom: 16px;
}

/* El contenedor oscuro característico de tus muestras */
.component-showcase-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  box-sizing: border-box;
}

/* Compatibilidad adaptativa si el tema global cambia a oscuro */
:deep(.zn-theme-dark) .component-showcase-grid {
  background-color: rgba(255, 255, 255, 0.04);
}

.showcase-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.showcase-label {
  font-family: 'Roboto', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--md-outline);
}
</style>