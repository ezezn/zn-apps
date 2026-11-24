<script setup>
import { computed } from 'vue'

/**
 * ZnDashletCounter - Card de resumen tipo contador para dashboards.
 *
 * Props:
 *  - value: number | string - el número principal a mostrar
 *  - label: string - etiqueta descriptiva (ej. "Ventas", "Usuarios")
 *  - subtitle: string | null - subtítulo opcional debajo del número
 *  - icon: string - nombre de icono Material Design (ej. 'trending_up', 'people')
 *  - variant: variant of ZnDashlet ('primary' | 'warning' | 'info' | 'success' | 'error' | 'neutral')
 *  - filled: boolean - si la card debe llenarse con color
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
  }
})
</script>

<template>
  <div class="zn-dashlet"
       :class="`zn-dashlet--${props.variant} ${props.class}`"
       style="
         height: ${props.height}px;
         background: ${props.filled ? 'var(--zn-dashlet-bg)' : 'transparent'};
         color: ${props.filled ? 'var(--zn-dashlet-fg)' : 'inherit'};
       ">
    <div class="zn-dashlet-counter">
      <span class="zn-dashlet-counter__icon">📊</span>
      <div class="zn-dashlet-counter__details">
        <div class="zn-dashlet-counter__value">{{ value }}</div>
        <template v-if="subtitle">
          <span class="zn-dashlet-counter__label">{{ label }}</span>
          <span class="zn-dashlet-counter__subtitle">{{ subtitle }}</span>
        </template>
        <template v-else>
          <span class="zn-dashlet-counter__label">{{ label }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zn-dashlet-counter {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.zn-dashlet-counter__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  color: var(--md-primary, #6750A4);
  flex-shrink: 0;
}

.zn-dashlet-counter__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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