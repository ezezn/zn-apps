<script setup>
import { ZnIcon } from '@zn-apps/ui-core'
import ZnDashlet from './ZnDashlet.vue'

/**
 * ZnDashletCounter - Card de resumen tipo contador para dashboards.
 *
 * Props:
 *  - value: number | string - el número principal a mostrar
 *  - label: string - etiqueta descriptiva (ej. "Ventas", "Usuarios")
 *  - subtitle: string | null - subtítulo opcional debajo del número
 *  - icon: string - nombre de icono Material Design (ej. 'trending_up', 'people').
 *    Se dibuja con `ZnIcon` de ui-core, que carga el sprite del proyecto
 *    consumidor; el icono debe existir en su perfil de iconos.
 *  - variant: variant of ZnDashlet ('primary' | 'warning' | 'info' | 'success' | 'error' | 'neutral')
 *  - filled: boolean - si la card debe llenarse con color
 *  - height: number - altura en px (default 120)
 */
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  },
  label: {
    type: String,
    default: ''
  },
  subtitle: {
    type: [String, null],
    default: null
  },
  icon: {
    type: String,
    default: 'trending_up'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  filled: {
    type: Boolean,
    default: true
  },
  height: {
    type: Number,
    default: 120
  }
})
</script>

<template>
  <ZnDashlet :variant="variant" :filled="filled" :height="height">
    <div class="zn-dashlet-counter">
      <ZnIcon :name="props.icon" :size="40" class="zn-dashlet-counter__icon" />
      <div class="zn-dashlet-counter__details">
        <div class="zn-dashlet-counter__value">{{ value }}</div>
        <span class="zn-dashlet-counter__label">{{ label }}</span>
        <span v-if="subtitle" class="zn-dashlet-counter__subtitle">{{ subtitle }}</span>
      </div>
    </div>
  </ZnDashlet>
</template>

<style scoped>
.zn-dashlet-counter {
  display: flex;
  align-items: center;
  /* Reparte icono y datos a los extremos cuando la card se ensancha. */
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-width: 0;
}

.zn-dashlet-counter__icon {
  flex: none;
  color: var(--md-primary, #6750A4);
}

.zn-dashlet-counter__details {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2px;
  min-width: 0;
  text-align: right;
}

.zn-dashlet-counter__value {
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1;
  color: inherit;
}

.zn-dashlet-counter__label {
  font-size: 0.75rem;
  color: var(--md-on-surface-variant, #787878);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.zn-dashlet-counter__subtitle {
  font-size: 0.625rem;
  color: var(--md-on-surface-variant, #787878);
  margin-top: 4px;
}
</style>
