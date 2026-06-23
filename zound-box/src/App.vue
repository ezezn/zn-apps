<template>
  <ZnApp mode="system">
    
    <ZnScreen title="Zound Box Player" icon="🎵">
      
      <template #actions>
        <button style="background: none; border: none; font-size: 20px; cursor: pointer;">⚙️</button>
      </template>

      <ZnRow padding="24px 16px">
        <h2>Bienvenido a tu música</h2>
      </ZnRow>

      <ZnRow>
        <p>Aquí irá el listado de pistas o el reproductor unificado en el futuro cercano.</p>
      </ZnRow>

      <ZnRow justify="center" padding="32px 16px">
        <CustomButton label="Escanear Directorio Local" />
      </ZnRow>

      <ZnSection title="Configuración del Servidor">
        <p>Contenido estático aquí...</p>
      </ZnSection>

      <ZnSection title="Historial de Pistas" collapsible :expanded="false">
        <p>Esta lista inicia cerrada y se despliega con transiciones limpias...</p>
      </ZnSection>

      <ZnSection collapsible>
        <template #title>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge-vivo">🔴 EN VIVO</span>
            <h3 style="color: var(--md-primary)">Estadísticas de Tráfico</h3>
          </div>
        </template>
        
        <p>Gráficos o telemetría en tiempo real...</p>
      </ZnSection>
    </ZnScreen>
  </ZnApp>
</template>

<script setup>
// 1. IMPORTA AQUÍ EL CSS DE LA LIBRERÍA COMPARTIDA
import '@zn-apps/shared/dist/shared.css'
import { ZnApp, ZnScreen, ZnRow, ZnSection, CustomButton } from '@zn-apps/shared'
</script>