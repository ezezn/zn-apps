<template>
  <div
    :class="[
      'zn-button-group',
      `zn-button-group--${variant}`,
      `zn-button-group--${density}`,
      { 'zn-button-group--vertical': vertical }
    ]"
    role="group"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: false
  },
  mandatory: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled', 'tonal', 'elevated', 'text'].includes(value)
  },
  density: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium'].includes(value)
  },
  vertical: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isToggleGroup = computed(() => props.modelValue !== undefined)

function isValueSelected(val) {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(val)
  }
  return props.modelValue === val
}

function selectValue(val) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(val)
    if (index >= 0) {
      if (props.mandatory && current.length <= 1) return
      current.splice(index, 1)
    } else {
      current.push(val)
    }
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    if (props.modelValue === val) {
      if (!props.mandatory) {
        emit('update:modelValue', null)
        emit('change', null)
      }
    } else {
      emit('update:modelValue', val)
      emit('change', val)
    }
  }
}

provide('znButtonGroup', {
  variant: props.variant,
  isToggleGroup: isToggleGroup.value,
  isValueSelected,
  selectValue
})
</script>

<style scoped>
.zn-button-group {
  display: inline-flex;
  position: relative;
  vertical-align: middle;
  border-radius: 20px;
}

.zn-button-group--vertical {
  flex-direction: column;
}

/* Modificadores de forma para los botones hijos directos en el grupo */
.zn-button-group :deep(> .zn-button) {
  position: relative;
  border-radius: 0;
  margin: 0;
}

.zn-button-group:not(.zn-button-group--vertical) :deep(> .zn-button:first-child) {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.zn-button-group:not(.zn-button-group--vertical) :deep(> .zn-button:last-child) {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.zn-button-group.zn-button-group--vertical :deep(> .zn-button:first-child) {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.zn-button-group.zn-button-group--vertical :deep(> .zn-button:last-child) {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* En caso de haber un solo botón */
.zn-button-group :deep(> .zn-button:only-child) {
  border-radius: 20px;
}

.zn-button-group:not(.zn-button-group--vertical) :deep(> .zn-button:first-child.zn-button--icon-only) {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.zn-button-group:not(.zn-button-group--vertical) :deep(> .zn-button:last-child.zn-button--icon-only) {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.zn-button-group :deep(> .zn-button:only-child.zn-button--icon-only) {
  border-radius: 50%;
}

/* Manejo de bordes en botones contorneados (outlined) para evitar doble borde */
.zn-button-group--outlined:not(.zn-button-group--vertical) :deep(> .zn-button:not(:first-child)) {
  margin-left: -1px;
}

.zn-button-group--outlined.zn-button-group--vertical :deep(> .zn-button:not(:first-child)) {
  margin-top: -1px;
}

/* Z-index en hover/focus/selected para resaltar el borde activo */
.zn-button-group :deep(.zn-button:hover),
.zn-button-group :deep(.zn-button:focus-visible) {
  z-index: 1;
}

.zn-button-group :deep(.zn-button--selected) {
  z-index: 2;
}

/* Densidad compacta (small - 32px alto) */
.zn-button-group--small :deep(.zn-button) {
  min-height: 32px;
  height: 32px;
  padding: 0 12px;
  font-size: 0.8125rem;
}

.zn-button-group--small :deep(.zn-button--icon-only) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}
</style>