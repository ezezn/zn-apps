<template>
  <ZnScreen title="Componente: ZnCard">
    <ZnSection title="6. Tarjetas Material Design 3 (ZnCard)">
      <p class="section-desc">Las tarjetas agrupan contenidos relacionados. Soporta tres variantes nativas y dos variantes avanzadas de inyección de imágenes.</p>
      
      <div class="cards-showcase">
        
        <div class="card-box">
          <span class="showcase-label">ELEVATED CARD</span>
          <div class="mock-card elevated">
            <h3>Título de Tarjeta</h3>
            <p>Contenido interno secundario con elevación por sombra proyectada suave.</p>
          </div>
        </div>

        <div class="card-box">
          <span class="showcase-label">FILLED CARD</span>
          <div class="mock-card filled">
            <h3>Título de Tarjeta</h3>
            <p>Variación con color contenedor sólido para emparejar elementos adyacentes.</p>
          </div>
        </div>

        <div class="card-box">
          <span class="showcase-label">OUTLINED CARD</span>
          <div class="mock-card outlined">
            <h3>Título de Tarjeta</h3>
            <p>Enfoque minimalista delimitado por un borde sutil sin sombras de fondo.</p>
          </div>
        </div>

      </div>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ZnScreen, ZnSection } from '@zn-apps/shared'
// Nota: Cuando construyas el componente ZnCard formal en la librería compartida,
// lo sustituiremos directamente aquí.
</script>

<style scoped>
.section-desc {
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: var(--md-on-background);
  opacity: 0.7;
  margin-bottom: 20px;
}

.cards-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.showcase-label {
  font-family: 'Roboto', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--md-outline);
}

/* Estilos de simulación MD3 para previsualizar */
.mock-card {
  font-family: 'Roboto', sans-serif;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.mock-card h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.mock-card p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.elevated {
  background-color: var(--md-surface);
  box-shadow: 0px 1px 3px rgba(0,0,0,0.15), 0px 1px 2px rgba(0,0,0,0.1);
}

.filled {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}

.outlined {
  background-color: var(--md-background);
  border: 1px solid var(--md-outline);
}
</style>