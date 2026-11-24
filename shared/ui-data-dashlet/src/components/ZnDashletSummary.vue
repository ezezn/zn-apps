<script setup>
import { computed } from 'vue'

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
 */
const props = defineProps({
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
    <div class="zn-dashlet-summary">
      <template v-if="props.layout === 'double-row'">
        <!-- Fila superior: número grande con subtítulo -->
        <div class="zn-dashlet-summary__row">
          <div class="zn-dashlet-summary__value-large">{{ value }}</div>
          <span class="zn-dashlet-summary__label-large">{{ subtitle }}</span>
        </div>
        <!-- Fila inferior: número menor con subtítulo -->
        <div class="zn-dashlet-summary__row--bottom">
          <div class="zn-dashlet-summary__value-small">{{ secondaryValue }}</div>
          <span class="zn-dashlet-summary__label-small">{{ secondarySubtitle }}</span>
        </div>
      </template>
      <template v-else="props.layout === 'side-by-side'">
        <!-- Dos números uno al lado del otro -->
        <div class="zn-dashlet-summary__row">
          <div class="zn-dashlet-summary__item-left">
            <div class="zn-dashlet-summary__value-large">{{ value }}</div>
            <span class="zn-dashlet-summary__label-large">{{ subtitle }}</span>
          </div>
          <div class="zn-dashlet-summary__item-right">
            <div class="zn-dashlet-summary__value-small">{{ secondaryValue }}</div>
            <span class="zn-dashlet-summary__label-small">{{ secondarySubtitle }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.zn-dashlet-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.zn-dashlet-summary__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  justify-content: space-between;
}

.zn-dashlet-summary__item-left,
.zn-dashlet-summary__item-right {
  width: 48%;
}

.zn-dashlet-summary__item-left {
  float: left;
  text-align: left;
}

.zn-dashlet-summary__item-right {
  float: right;
  text-align: right;
}

/* Clearfix for the summary container */
.zn-dashlet-summary::after {
  content: "";
  display: table;
  clear: both;
}
</style>