<template>
  <div :class="['zn-range', { 'zn-range--disabled': disabled }]">
    <div v-if="label || showValue" class="zn-range__header">
      <span v-if="label" class="zn-range__label">{{ label }}</span>
      <span v-if="showValue" class="zn-range__value">{{ displayValue }}</span>
    </div>

    <div ref="trackRef" class="zn-range__track-wrap" @pointerdown="onPointerDown">
      <div class="zn-range__track">
        <div class="zn-range__active" :style="activeStyle" />
        <span
          v-for="tick in tickMarks"
          :key="tick.value"
          class="zn-range__tick"
          :style="{ left: `${tick.percent}%` }"
          aria-hidden="true"
        />
      </div>

      <input
        v-if="isDual"
        class="zn-range__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="rangeStart"
        :disabled="disabled"
        :style="{ zIndex: activeThumb === 'start' ? 5 : 4 }"
        :aria-label="`${label || 'Rango'} · mínimo`"
        @input="onStartInput"
        @change="$emit('change', modelValue)"
      />

      <input
        class="zn-range__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="isDual ? rangeEnd : modelValue"
        :disabled="disabled"
        :style="{ zIndex: isDual ? (activeThumb === 'end' ? 5 : 3) : 4 }"
        :aria-label="isDual ? `${label || 'Rango'} · máximo` : label || undefined"
        @input="onEndInput"
        @change="$emit('change', modelValue)"
      />
    </div>

    <p
      v-if="error || hint"
      :class="['zn-range__supporting', { 'zn-range__supporting--error': Boolean(error) }]"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  /** Número (simple) o `[min, max]` (rango de dos actuadores). */
  modelValue: { type: [Number, Array], default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  showValue: { type: Boolean, default: true },
  valueFormat: { type: Function, default: null },
  disabled: { type: Boolean, default: false },
  /** Slider discreto MD3: marcas en cada `step` a lo largo del carril. */
  showTicks: { type: Boolean, default: false },
  /** Slider centrado MD3: el indicador crece desde el punto medio del rango. */
  centered: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const trackRef = ref(null)
const activeThumb = ref(null)

const isDual = computed(() => Array.isArray(props.modelValue))
const rangeStart = computed(() => (isDual.value ? Number(props.modelValue[0] ?? props.min) : props.min))
const rangeEnd = computed(() =>
  isDual.value ? Number(props.modelValue[1] ?? props.max) : Number(props.modelValue)
)

function clamp(value) {
  return Math.min(Math.max(value, props.min), props.max)
}

function percentOf(value) {
  if (props.max === props.min) return 0
  return ((clamp(value) - props.min) / (props.max - props.min)) * 100
}

const activeStyle = computed(() => {
  if (isDual.value) {
    const start = Math.min(percentOf(rangeStart.value), percentOf(rangeEnd.value))
    const end = Math.max(percentOf(rangeStart.value), percentOf(rangeEnd.value))
    return { left: `${start}%`, width: `${end - start}%` }
  }

  const percent = percentOf(rangeEnd.value)

  if (props.centered) {
    const start = Math.min(percent, 50)
    const end = Math.max(percent, 50)
    return { left: `${start}%`, width: `${end - start}%` }
  }

  return { left: '0%', width: `${percent}%` }
})

const tickMarks = computed(() => {
  if (!props.showTicks || props.step <= 0 || props.max <= props.min) return []

  const total = Math.floor((props.max - props.min) / props.step) + 1
  if (total > 50) return []

  return Array.from({ length: total }, (_, index) => {
    const value = props.min + index * props.step
    return { value, percent: percentOf(value) }
  })
})

function format(value) {
  return typeof props.valueFormat === 'function' ? props.valueFormat(value) : String(value)
}

const displayValue = computed(() =>
  isDual.value ? `${format(rangeStart.value)} – ${format(rangeEnd.value)}` : format(rangeEnd.value)
)

function onStartInput(event) {
  const next = Math.min(Number(event.target.value), rangeEnd.value)
  emit('update:modelValue', [next, rangeEnd.value])
}

function onEndInput(event) {
  const next = Number(event.target.value)
  if (isDual.value) {
    emit('update:modelValue', [rangeStart.value, Math.max(next, rangeStart.value)])
    return
  }
  emit('update:modelValue', next)
}

/** Elige el actuador más cercano al punto pulsado para que ambos sean accesibles. */
function onPointerDown(event) {
  if (!isDual.value || props.disabled || !trackRef.value) return

  const rect = trackRef.value.getBoundingClientRect()
  if (rect.width === 0) return

  const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  const value = props.min + ratio * (props.max - props.min)
  activeThumb.value =
    Math.abs(value - rangeStart.value) <= Math.abs(value - rangeEnd.value) ? 'start' : 'end'
}
</script>

<style scoped>
.zn-range {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
  color: var(--md-on-background);
}

.zn-range--disabled {
  opacity: 0.38;
}

.zn-range__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px;
}

.zn-range__label {
  overflow: hidden;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-range__value {
  flex: 0 0 auto;
  color: var(--md-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.zn-range__track-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  touch-action: pan-y;
}

.zn-range__track {
  position: absolute;
  right: 0;
  left: 0;
  height: 4px;
  border-radius: 2px;
  background-color: var(--md-surface-variant);
  pointer-events: none;
}

.zn-range__active {
  position: absolute;
  top: 0;
  height: 4px;
  border-radius: 2px;
  background-color: var(--md-primary);
}

.zn-range__tick {
  position: absolute;
  top: 50%;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: var(--md-outline);
  transform: translate(-50%, -50%);
}

.zn-range__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  pointer-events: none;
}

.zn-range__input::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background-color: var(--md-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: auto;
  -webkit-appearance: none;
  appearance: none;
  transition: transform 0.15s ease;
}

.zn-range__input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background-color: var(--md-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: auto;
}

.zn-range__input:hover::-webkit-slider-thumb,
.zn-range__input:focus-visible::-webkit-slider-thumb {
  transform: scale(1.15);
}

.zn-range__input:focus-visible {
  outline: none;
}

.zn-range__input:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 24%, transparent);
}

.zn-range__input:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.zn-range__supporting {
  margin: 0;
  padding: 0 2px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  line-height: 16px;
}

.zn-range__supporting--error {
  color: var(--md-error, #B3261E);
}
</style>
