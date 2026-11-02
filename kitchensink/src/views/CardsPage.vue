<template>
  <ZnScreen title="Tarjetas (ZnCard)">
    <template #title>
      <div>
        <h1 class="screen-heading">Tarjetas (ZnCard)</h1>
        <span class="screen-subtitle">Material Design 3 · variantes e imágenes de cabecera o fondo completo</span>
      </div>
    </template>

    <ZnSection title="1. Variantes Nativas (Prop: variant)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        Las tarjetas agrupan contenidos relacionados. El componente admite las variantes <code>filled</code>, <code>elevated</code> y <code>outlined</code>.
      </p>

      <ZnCard title="Tarjeta Filled" variant="filled">
        <p>Estilo por defecto de MD3. Fondo tonal sutil sin sombras, ideal para elementos secundarios.</p>
        <div class="card-actions">
          <ZnButton variant="text">Acción</ZnButton>
        </div>
      </ZnCard>

      <ZnCard title="Tarjeta Elevated" variant="elevated">
        <p>Usa sombras suaves para separarse del fondo. Excelente para destacar contenidos principales.</p>
        <div class="card-actions">
          <ZnButton variant="tonal">Revisar</ZnButton>
        </div>
      </ZnCard>

      <ZnCard title="Tarjeta Outlined" variant="outlined">
        <p>Borde limpio perimetral y diseño minimalista, perfecto para grillas densas de información.</p>
      </ZnCard>
    </ZnSection>

    <ZnSection title="2. Imagen en Cabecera (Prop: imageVariant='header')" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Con <code>imageVariant="header"</code> la imagen se coloca detrás del título y aplica un scrim inferior para mantener la legibilidad.
      </p>

      <ZnCard
        title="Álbum: Retro Wave 1988"
        variant="outlined"
        :image="headerImage"
        image-variant="header"
      >
        <p class="helper-text">Pistas de audio cargadas localmente en la Pi.</p>
        <div class="card-actions card-actions--end">
          <ZnButton variant="filled" iconOnly>
            <ZnIcon name="play_arrow" label="Reproducir" />
          </ZnButton>
        </div>
      </ZnCard>

      <ZnCard
        title="Sesión Acústica"
        variant="elevated"
        :image="headerImageAlt"
        image-variant="header"
      >
        <p class="helper-text">Grabaciones en directo con carátula personalizada.</p>
        <div class="card-actions card-actions--end">
          <ZnButton variant="tonal" iconOnly>
            <ZnIcon name="play_arrow" label="Reproducir" />
          </ZnButton>
        </div>
      </ZnCard>
    </ZnSection>

    <ZnSection title="3. Imagen de Fondo Completa (Prop: imageVariant='full')" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Con <code>imageVariant="full"</code> la imagen cubre toda la tarjeta y el texto se fuerza a blanco sobre un scrim completo.
      </p>

      <ZnCard
        title="Zound Box Premium"
        variant="elevated"
        :image="fullImage"
        image-variant="full"
      >
        <p>Accede a la ecualización avanzada en tiempo real desde el hardware embebido.</p>
        <div class="card-actions">
          <ZnButton variant="elevated">Activar modos</ZnButton>
        </div>
      </ZnCard>

      <ZnCard
        title="Radio Nocturna"
        variant="filled"
        :image="fullImageAlt"
        image-variant="full"
      >
        <p>Listas de reproducción curadas para sesiones largas de madrugada.</p>
        <div class="card-actions">
          <ZnButton variant="outlined">Escuchar</ZnButton>
        </div>
      </ZnCard>
    </ZnSection>

    <ZnSection title="4. Slot de Título Personalizado (Slot: title)" collapsible :expanded="false" :columns="1">
      <p class="section-desc section-desc--full">
        El slot <code>#title</code> reemplaza el título y permite HTML enriquecido (por ejemplo, un badge junto al nombre).
      </p>

      <ZnCard variant="outlined" :image="headerImage" image-variant="header">
        <template #title>
          <div class="custom-title">
            <span>Playlist Destacada</span>
            <span class="state-chip">NUEVO</span>
          </div>
        </template>
        <p class="helper-text">El contenido del slot convive con la imagen de cabecera y su scrim.</p>
      </ZnCard>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ZnScreen, ZnSection, ZnCard, ZnButton, ZnIcon } from '@zn-apps/ui-core'

const headerImage = 'https://picsum.photos/id/1025/600/300'
const headerImageAlt = 'https://picsum.photos/id/1050/600/300'
const fullImage = 'https://picsum.photos/id/903/600/400'
const fullImageAlt = 'https://picsum.photos/id/1069/600/400'
</script>

<style scoped>
.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.card-actions--end {
  justify-content: flex-end;
}

.custom-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
