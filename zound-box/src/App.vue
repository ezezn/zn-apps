<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">
    <ZnScreen title="Zound Box">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v520q0 66-47 113t-113 47Z"/></svg>
      </template>

      <template #actions>
        <ZnSwitch v-model="isDarkMode" labelLeft="Modo Claro" labelRight="Modo Oscuro">
          <template #iconOff>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280Z"/></svg>
          </template>
          <template #iconOn>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T440-660q0 90 63 153t153 63q52 0 99-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
          </template>
        </ZnSwitch>
      </template>
      <ZnSection title="1. Variantes de Énfasis (Prop: variant)" collapsible>
        <p class="showcase-description">
          Material Design 3 define 5 tipos de botones según su peso visual en la interfaz. El valor por defecto es <code>filled</code>.
        </p>
        
        <div class="showcase-grid">
          <div class="showcase-item">
            <span class="showcase-label">filled (Máximo)</span>
            <ZnButton variant="filled">Filled Button</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">tonal (Medio-Alto)</span>
            <ZnButton variant="tonal">Tonal Button</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">elevated (Medio con sombra)</span>
            <ZnButton variant="elevated">Elevated Button</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">outlined (Medio-Bajo)</span>
            <ZnButton variant="outlined">Outlined Button</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">text (Bajo)</span>
            <ZnButton variant="text">Text Button</ZnButton>
          </div>
        </div>
      </ZnSection>

      <ZnSection title="2. Botones con Iconos (Slot: icon)" collapsible :expanded="true">
        <p class="showcase-description">
          Puedes pasar un SVG al slot <code>#icon</code> para acompañar al texto. Cumple con la regla MD3 de mantener el texto en <em>Sentence case</em>.
        </p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <span class="showcase-label">Con Icono e Información</span>
            <ZnButton variant="filled">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M400-280v-400l320 200-320 400Z"/></svg>
              </template>
              Reproducir pista
            </ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">Outlined con Icono</span>
            <ZnButton variant="outlined">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-320 280-520l56-56 104 104v-328h80v328l104-104 56 56-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
              </template>
              Descargar audio
            </ZnButton>
          </div>
        </div>
      </ZnSection>

      <ZnSection title="3. Botones de Icono Puro (Prop: iconOnly)" collapsible :expanded="false">
        <p class="showcase-description">
          Al activar <code>iconOnly</code>, el botón se vuelve circular (40x40px). Útil para barras de herramientas o controles de reproducción compactos.
        </p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <span class="showcase-label">Filled Icon</span>
            <ZnButton variant="filled" iconOnly>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-200v-560h160v560H160Zm480 0v-560h160v560H640Z"/></svg>
            </ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">Tonal Icon</span>
            <ZnButton variant="tonal" iconOnly>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-96q-15 0-29.5-6T426-120L138-408q-11-11-16.5-26T116-466q0-16 5.5-31t16.5-26l288-288q11-11 25.5-17t29.5-6q16 0 31 6.5t26 17.5l26 26 26-26q11-11 26-17.5t31-6.5q15 0 29.5 6t25.5 17l288 288q11 11 16.5 26t5.5 31q0 16-5.5 31T822-408L534-120q-11 11-25.5 17T480-96Z"/></svg>
            </ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">Standard / Text Icon</span>
            <ZnButton variant="text" iconOnly>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="m370-80-16-128q-13-5-24.5-12T307-237l-119 48-118-204 100-77q-1-7-1-13.5t1-13.5l-100-77 118-204 119 48q11-8 23-14.5t25-11.5l16-128h236l16 128q13 5 24.5 12t22.5 17l119-48 118 204-100 77q1 7 1 13.5t-1 13.5l100 77-118 204-119-48q-11 8-23 14.5t-25 11.5L590-80H370Z"/></svg>
            </ZnButton>
          </div>
        </div>
      </ZnSection>

      <ZnSection title="4. Estado Deshabilitado (Prop: disabled)" collapsible :expanded="false">
        <p class="showcase-description">
          Aplica las opacidades y colores normativos de MD3 (12% de fondo y 38% de texto/icono sobre la superficie), bloqueando eventos de puntero automáticamente.
        </p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <span class="showcase-label">Filled Deshabilitado</span>
            <ZnButton variant="filled" disabled>No Disponible</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">Outlined Deshabilitado</span>
            <ZnButton variant="outlined" disabled>Bloqueado</ZnButton>
          </div>

          <div class="showcase-item">
            <span class="showcase-label">Icono Deshabilitado</span>
            <ZnButton variant="tonal" iconOnly disabled>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-200v-560h160v560H160Zm480 0v-560h160v560H640Z"/></svg>
            </ZnButton>
          </div>
        </div>
      </ZnSection>

      <ZnSection title="5. Comportamiento Polimórfico (Prop: tag)" collapsible :expanded="false">
        <p class="showcase-description">
          Por defecto renderiza un <code>&lt;button&gt;</code>, pero puedes transformarlo en un enlace semántico (<code>&lt;a&gt;</code>) o contenedores estructurales (<code>&lt;div&gt;</code>) manteniendo intacta toda la estética y estados.
        </p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <span class="showcase-label">Renderizado como Enlace NATIVO (&lt;a&gt;)</span>
            <ZnButton variant="outlined" tag="a" href="https://google.com" target="_blank">
              Ir a Google Externo
            </ZnButton>
          </div>
          
          <div class="showcase-item">
            <span class="showcase-label">Renderizado como Div Estético (&lt;div&gt;)</span>
            <ZnButton variant="tonal" tag="div">
              Actúo como bloque decorativo
            </ZnButton>
          </div>
        </div>
      </ZnSection>

<ZnSection title="6. Tarjetas Material Design 3 (ZnCard)" collapsible>
        <p class="showcase-description">
          Las tarjetas agrupan contenidos relacionados. Soporta tres variantes nativas y dos variantes avanzadas de inyección de imágenes.
        </p>

        <div class="card-showcase-grid">
          
          <ZnCard title="Tarjeta Filled" variant="filled">
            <p>Es el estilo por defecto de MD3. Utiliza un fondo tonal sutil sin sombras, ideal para elementos secundarios.</p>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <ZnButton variant="text" style="padding:0">Acción</ZnButton>
            </div>
          </ZnCard>

          <ZnCard title="Tarjeta Elevated" variant="elevated">
            <p>Utiliza sombras suaves para separarse del fondo. Excelente para destacar contenidos principales en layouts planos.</p>
            <div style="margin-top: 12px;">
              <ZnButton variant="tonal" style="height:32px; font-size:12px;">Revisar</ZnButton>
            </div>
          </ZnCard>

          <ZnCard title="Tarjeta Outlined" variant="outlined">
            <p>Tiene un borde limpio perimetral. Aporta un diseño minimalista perfecto para grillas densas de información.</p>
          </ZnCard>
          
        </div>

        <h3 style="color: var(--md-primary); margin-top: 24px; font-size: 1rem;">Variaciones con Imágenes de Fondo</h3>
        
        <div class="card-showcase-grid" style="margin-top: 12px;">
          
          <ZnCard 
            title="Álbum: Retro Wave 1988" 
            variant="outlined"
            image="https://picsum.photos/id/1025/400/250"
            imageVariant="header"
          >
            <p style="margin: 0; font-size: 0.85rem; color: var(--md-outline)">Pistas de audio cargadas localmente en la Pi.</p>
            <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
              <ZnButton variant="filled" iconOnly>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M400-280v-400l320 200-320 400Z"/></svg>
              </ZnButton>
            </div>
          </ZnCard>

          <ZnCard 
            title="Zound Box Premium" 
            variant="elevated"
            image="https://picsum.photos/id/903/400/400"
            imageVariant="full"
          >
            <p style="margin-bottom: 16px;">Accede a la ecualización avanzada en tiempo real desde el hardware embebido.</p>
            <ZnButton variant="elevated">Activar Modos</ZnButton>
          </ZnCard>

        </div>
      </ZnSection>

      <ZnSection title="7. Layouts Multicolumna Estrictos & ZnBox" columns="4" collapsible>
        <ZnBox variant="filled">
          <strong>Bloque 1/4</strong>
          <p style="font-size:12px; margin:4px 0 0 0;">ZnBox simple tipo filled.</p>
        </ZnBox>

        <ZnBox variant="outlined">
          <strong>Bloque 2/4</strong>
          <p style="font-size:12px; margin:4px 0 0 0;">ZnBox simple tipo outlined.</p>
        </ZnBox>

        <ZnBox variant="elevated" class="zn-span-2">
          <strong>Bloque de Doble Ancho (Clase: zn-span-2)</strong>
          <p style="font-size:12px; margin:4px 0 0 0;">Ocupo el espacio equivalente a dos columnas dentro de la sección de 4 vías.</p>
        </ZnBox>

        <ZnCard title="Card Integrada" variant="outlined">
          <p style="margin:0; font-size:12px;">Las Cards también respetan la grilla perfectamente.</p>
        </ZnCard>

        <ZnBox variant="filled" class="zn-span-3">
          <strong>Contenedor de Ancho Triple (Clase: zn-span-3)</strong>
          <p style="font-size:12px; margin:4px 0 0 0;">Ideal para paneles de control anchos o visualizadores de ondas de audio.</p>
        </ZnBox>
      </ZnSection>

      <ZnSection title="8. Grilla de Alta Densidad (6 Columnas)" columns="6" collapsible :expanded="false">
        <ZnButton variant="filled">B1</ZnButton>
        <ZnButton variant="tonal">B2</ZnButton>
        <ZnButton variant="outlined">B3</ZnButton>
        <ZnButton variant="elevated">B4</ZnButton>
        <ZnButton variant="text">B5</ZnButton>
        <ZnButton variant="filled" iconOnly>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M400-280v-400l320 200-320 400Z"/></svg>
        </ZnButton>
      </ZnSection>
    </ZnScreen>

  </ZnApp>
</template>

<script setup>
import { ref } from 'vue'
import '@zn-apps/shared/dist/shared.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton, ZnBox, ZnSwitch } from '@zn-apps/shared'

// Estados reactivos
const isDarkMode = ref(false)
const switchA = ref(true)
const switchB = ref(false)
const switchC = ref(false)

function onThemeChange(value) {
  console.log("El tema cambió a Oscuro?:", value)
  // Aquí podrías inyectar lógica para cambiar las variables CSS dinámicamente si lo deseas
}

</script>

<style scoped>

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--md-surface-container-low, #f7f2fa);
  border-bottom: 1px solid var(--md-outline);
  margin-bottom: 24px;
}

.app-header__branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__logo {
  width: 28px;
  height: 28px;
  color: var(--md-primary);
}

.app-header__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: var(--md-on-background);
}

/* ==========================================================================
   ESTILOS EXCLUSIVOS DEL SHOWROOM / DOCUMENTACIÓN
   ========================================================================== */
.showcase-header {
  padding: 24px 16px 8px 16px;
  border-bottom: 1px solid var(--md-surface-variant);
  margin-bottom: 16px;
}

.showcase-header__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--md-primary);
  margin: 0 0 4px 0;
}

.showcase-header__subtitle {
  font-size: 0.9rem;
  color: var(--md-outline);
  margin: 0;
}

.showcase-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--md-outline);
  margin-top: 0;
  margin-bottom: 20px;
}

/* Estilos extras de la grilla de tarjetas para el Showroom */
.card-showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

code {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

/* Grilla fluida para acomodar los ejemplos del catálogo de forma responsive */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  background-color: var(--md-surface-container-low, rgba(0,0,0,0.02));
  padding: 16px;
  border-radius: 12px;
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.showcase-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-outline);
}
</style>