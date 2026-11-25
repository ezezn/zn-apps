<script setup>
import ZnDashlet from './ZnDashlet.vue'

/**
 * ZnDashletSummary - Card de resumen tipo resumen para dashboards.
 *
 * Props:
 *  - value: number | string - el número principal grande
 *  - subtitle: string - subtítulo encima del número grande
 *  - secondaryValue: number | string - número secundario menor
 *  - secondaryLabel: string - etiqueta del número secundario
 *  - secondarySubtitle: string - subtítulo del número secundario
 *  - variant: variant of ZnDashlet
 *  - filled: boolean - si la card debe llenarse con color
 *  - layout: 'double-row' | 'side-by-side' - disposición de las filas
 *  - height: number - altura en px (default 120)
 */
defineProps({
  value: {
    type: [Number, String],
    default: 0
  },
  subtitle: {
    type: String,
    default: ''
  },
  secondaryValue: {
    type: [Number, String],
    default: 0
  },
  secondaryLabel: {
    type: String,
    default: ''
  },
  secondarySubtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  filled: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    validator: (v) => ['double-row', 'side-by-side'].includes(v),
    default: 'double-row'
  },
  height: {
    type: Number,
    default: 120
  }
})
</script>

<template>
  <ZnDashlet :variant="variant" :filled="filled" :height="height">
    <div class="zn-dashlet-summary">
      <div v-if="layout === 'double-row'" class="zn-dashlet-summary__row">
        <div class="zn-dashlet-summary__value-large">{{ value }}</div>
        <span class="zn-dashlet-summary__label-large">{{ subtitle }}</span>
        <div class="zn-dashlet-summary__row--bottom">
          <div class="zn-dashlet-summary__value-small">{{ secondaryValue }}</div>
          <span class="zn-dashlet-summary__label-small">
            {{ secondarySubtitle || secondaryLabel }}
          </span>
        </div>
      </div>

      <div v-else class="zn-dashlet-summary__row side-by-side">
        <div class="zn-dashlet-summary__item-left">
          <div class="zn-dashlet-summary__value-large">{{ value }}</div>
          <span class="zn-dashlet-summary__label-large">{{ subtitle }}</span>
        </div>
        <div class="zn-dashlet-summary__item-right">
          <div class="zn-dashlet-summary__value-small">{{ secondaryValue }}</div>
          <span class="zn-dashlet-summary__label-small">
            {{ secondarySubtitle || secondaryLabel }}
          </span>
        </div>
      </div>
    </div>
  </ZnDashlet>
</template>

<style scoped>
.zn-dashlet-summary {
  display: flex;
  flex-direction: column;
  /* Separa el bloque principal del secundario cuando la card crece en alto. */
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
  height: 100%;
}

.zn-dashlet-summary__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.zn-dashlet-summary__row--bottom {
  margin-top: 8px;
  border-top: 1px solid var(--md-outline-variant, #cac4d0);
  padding-top: 8px;
}

.zn-dashlet-summary__value-large {
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1;
  color: inherit;
}

.zn-dashlet-summary__label-large {
  font-size: 0.625rem;
  color: var(--md-on-surface-variant, #787878);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.zn-dashlet-summary__row--bottom .zn-dashlet-summary__value-small {
  font-size: 1rem;
  color: inherit;
}

.zn-dashlet-summary__label-small {
  font-size: 0.625rem;
  color: var(--md-on-surface-variant, #787878);
  margin-top: 2px;
}

/* Layout side-by-side */
.zn-dashlet-summary__row.side-by-side {
  flex-direction: row;
  /* Cada columna ocupa la mitad y se reparte el ancho disponible. */
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.zn-dashlet-summary__item-left,
.zn-dashlet-summary__item-right {
  flex: 1 1 0;
  min-width: 0;
}

.zn-dashlet-summary__item-left {
  text-align: left;
}

.zn-dashlet-summary__item-right {
  text-align: right;
}
</style>
