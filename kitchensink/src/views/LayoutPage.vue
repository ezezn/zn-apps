<template>
  <DemoView view="layout">

    <ZnSection title="1. ZnBox · Variantes Visuales (Prop: variant)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>ZnBox</code> es un contenedor genérico sin título ni imagen. Acepta las variantes <code>filled</code>, <code>elevated</code> y <code>outlined</code> de MD3.
      </p>

      <ZnBox variant="filled">
        <strong>Filled</strong>
        <p class="helper-text" style="margin-top: 4px;">Superficie tonal plana, sin sombra.</p>
      </ZnBox>

      <ZnBox variant="elevated">
        <strong>Elevated</strong>
        <p class="helper-text" style="margin-top: 4px;">Superficie limpia con elevación suave.</p>
      </ZnBox>

      <ZnBox variant="outlined">
        <strong>Outlined</strong>
        <p class="helper-text" style="margin-top: 4px;">Borde fino perimetral sobre la superficie.</p>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. ZnRow · Padding, Gap y Alineación" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        <code>ZnRow</code> es un contenedor flexbox horizontal con <code>padding</code>, <code>gap</code> y <code>align</code> configurables. Todos los estilos se pasan por props, sin CSS adicional.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">padding="8px" gap="8px" align="center"</span>
        <ZnRow padding="8px" gap="8px" align="center">
          <ZnButton variant="filled">Uno</ZnButton>
          <ZnButton variant="tonal">Dos</ZnButton>
          <ZnButton variant="outlined">Tres</ZnButton>
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">padding="0" gap="24px" align="flex-start"</span>
        <ZnRow padding="0" gap="24px" align="flex-start">
          <ZnBox variant="filled"><span class="helper-text">Bloque A</span></ZnBox>
          <ZnBox variant="filled"><span class="helper-text">Bloque B</span></ZnBox>
          <ZnBox variant="filled"><span class="helper-text">Bloque C</span></ZnBox>
        </ZnRow>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">padding="0" gap="12px" align="flex-end"</span>
        <ZnRow padding="0" gap="12px" align="flex-end">
          <ZnButton variant="text" icon-only>
            <ZnIcon name="keyboard_arrow_down" label="Expandir" />
          </ZnButton>
          <ZnBox variant="outlined"><span class="helper-text">Alineado al final</span></ZnBox>
          <ZnButton variant="filled">Continuar</ZnButton>
        </ZnRow>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Grilla y Spans (Prop: columns + clases zn-span-*)" collapsible :columns="4">
      <p class="section-desc section-desc--full">
        Al definir <code>columns</code> en <code>ZnSection</code>, los hijos se distribuyen en una grilla. Usa las clases <code>zn-span-2</code> … <code>zn-span-10</code> para expandir un bloque.
      </p>

      <ZnBox variant="filled">
        <strong>1 columna</strong>
      </ZnBox>

      <ZnBox variant="outlined">
        <strong>1 columna</strong>
      </ZnBox>

      <ZnBox variant="elevated" class="zn-span-2">
        <strong>zn-span-2</strong>
        <p class="helper-text" style="margin-top: 4px;">Ocupa dos de las cuatro columnas.</p>
      </ZnBox>

      <ZnBox variant="filled" class="zn-span-3">
        <strong>zn-span-3</strong>
        <p class="helper-text" style="margin-top: 4px;">Ideal para paneles anchos o visores de audio.</p>
      </ZnBox>

      <ZnBox variant="outlined">
        <strong>1 columna</strong>
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Composición: ZnBox + ZnCard + ZnRow" collapsible :expanded="false" :columns="2">
      <p class="section-desc section-desc--full">
        Los contenedores compartidos se combinan entre sí para construir tarjetas de contenido y barras de acciones.
      </p>

      <ZnCard title="Panel de control" variant="outlined">
        <ZnRow padding="0" gap="8px" align="center">
          <span class="state-chip">ONLINE</span>
          <span class="helper-text">Servicio respondiendo</span>
        </ZnRow>
        <ZnRow padding="0" gap="8px" align="center" style="margin-top: 12px;">
          <ZnButton variant="tonal">Configurar</ZnButton>
          <ZnButton variant="text">Detalles</ZnButton>
        </ZnRow>
      </ZnCard>

      <ZnBox variant="filled" class="showcase-stack">
        <span class="showcase-label">Bloque informativo</span>
        <p class="helper-text">Un ZnBox filled puede agrupar texto y acciones dentro de una grilla de sección.</p>
        <ZnButton variant="outlined">Saber más</ZnButton>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRow, ZnButton, ZnCard, ZnIcon } from '@zn-apps/ui-core'
</script>
