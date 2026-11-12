<template>
  <div ref="rootRef" class="zn-select">
    <ZnFieldShell
      :label="label"
      :hint="hint"
      :error="error"
      :disabled="disabled"
      :focused="open || isFocused"
      :filled="hasValue || open"
      :required="required"
      :for-id="triggerId"
      :variant="variant"
    >
      <template #trailing>
        <ZnIcon
          name="arrow_drop_down"
          :size="20"
          :class="['zn-select__caret', { 'zn-select__caret--open': open }]"
        />
      </template>

      <button
        :id="triggerId"
        ref="triggerRef"
        type="button"
        class="zn-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="open ? listboxId : undefined"
        :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="describedBy"
        :disabled="disabled"
        @click="toggleMenu"
        @keydown="onTriggerKeydown"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
        <template v-if="multiple">
          <span v-if="selectedOptions.length === 0 && showPlaceholder" class="zn-select__placeholder">
            {{ placeholder }}
          </span>
          <span v-for="option in selectedOptions" :key="option.value" class="zn-select__chip">
            <span class="zn-select__chip-label">{{ option.label }}</span>
            <span
              class="zn-select__chip-remove"
              role="button"
              tabindex="-1"
              :aria-label="`Quitar ${option.label}`"
              @click.stop.prevent="removeOption(option)"
            >×</span>
          </span>
        </template>

        <span
          v-else
          :class="['zn-select__value', { 'zn-select__value--placeholder': !hasValue }]"
        >
          {{ selectedLabel || (showPlaceholder ? placeholder : '') }}
        </span>
      </button>
    </ZnFieldShell>

    <Teleport to="body">
      <div
        v-if="open"
        :id="listboxId"
        ref="menuRef"
        class="zn-select__menu"
        role="listbox"
        :aria-multiselectable="multiple ? 'true' : undefined"
        :aria-labelledby="label ? triggerId : undefined"
        :style="menuStyle"
      >
        <button
          v-for="(option, index) in normalizedOptions"
          :id="optionId(index)"
          :key="option.value"
          type="button"
          :class="[
            'zn-select__option',
            {
              'zn-select__option--active': activeIndex === index,
              'zn-select__option--selected': isSelected(option)
            }
          ]"
          role="option"
          :aria-selected="isSelected(option) ? 'true' : 'false'"
          :disabled="option.disabled"
          @click="selectOption(option)"
          @mousemove="activeIndex = index"
        >
          <span
            v-if="multiple"
            :class="['zn-select__checkbox', { 'zn-select__checkbox--checked': isSelected(option) }]"
          >
            <ZnIcon v-if="isSelected(option)" name="check" :size="16" />
          </span>

          <span class="zn-select__option-label">{{ option.label }}</span>

          <ZnIcon
            v-if="!multiple && isSelected(option)"
            name="check"
            :size="18"
            class="zn-select__check"
          />
        </button>

        <p v-if="normalizedOptions.length === 0" class="zn-select__empty">Sin opciones</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import ZnFieldShell from './ZnFieldShell.vue'
import ZnIcon from '../media/ZnIcon.vue'

const MENU_ITEM_HEIGHT = 48
const MENU_PADDING = 8

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: null },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: 'Selecciona una opción' },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  /** Número de elementos visibles antes de que aparezca la barra de desplazamiento. */
  maxVisibleItems: { type: Number, default: 6 },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close'])

const uid = useId()
const triggerId = `zn-select-${uid}`
const listboxId = `zn-select-listbox-${uid}`

const rootRef = ref(null)
const triggerRef = ref(null)
const menuRef = ref(null)

const open = ref(false)
const isFocused = ref(false)
const activeIndex = ref(-1)
const menuStyle = ref({})

const normalizedOptions = computed(() =>
  (Array.isArray(props.options) ? props.options : []).map((option) => {
    if (option !== null && typeof option === 'object') {
      return {
        value: option.value,
        label: option.label ?? String(option.value),
        disabled: Boolean(option.disabled)
      }
    }
    return { value: option, label: String(option), disabled: false }
  })
)

const selectedValues = computed(() => {
  if (!props.multiple) return []
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

const selectedOptions = computed(() =>
  props.multiple ? normalizedOptions.value.filter((option) => isSelected(option)) : []
)

const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find((option) => option.value === props.modelValue)
  return selected ? selected.label : ''
})

const hasValue = computed(() => {
  if (props.multiple) return selectedValues.value.length > 0
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

const describedBy = computed(() => (props.error || props.hint ? `${triggerId}-supporting` : undefined))

// Con etiqueta, el placeholder solo aparece cuando la etiqueta flota (igual
// que en los campos de texto nativos).
const showPlaceholder = computed(() => !props.label || isFocused.value || open.value)

function isSelected(option) {
  return props.multiple
    ? selectedValues.value.includes(option.value)
    : option.value === props.modelValue
}

function optionId(index) {
  return `${listboxId}-option-${index}`
}

/* --------------------------------------------------------------------------
   Apertura, cierre y posicionamiento del menú (teleportado a <body>)
   -------------------------------------------------------------------------- */
function computeMenuStyle() {
  const root = rootRef.value
  if (!root || typeof window === 'undefined') return

  const rect = root.getBoundingClientRect()
  const desired = Math.min(
    props.maxVisibleItems * MENU_ITEM_HEIGHT + MENU_PADDING,
    normalizedOptions.value.length * MENU_ITEM_HEIGHT + MENU_PADDING
  ) || MENU_ITEM_HEIGHT + MENU_PADDING

  const spaceBelow = window.innerHeight - rect.bottom - 8
  const spaceAbove = rect.top - 8
  const openUp = spaceBelow < desired && spaceAbove > spaceBelow

  const available = Math.max(openUp ? spaceAbove : spaceBelow, 120)
  const maxHeight = Math.min(desired, available)
  const top = openUp ? Math.max(8, rect.top - maxHeight - 4) : rect.bottom + 4
  const width = rect.width
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))

  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    maxHeight: `${maxHeight}px`
  }
}

function selectedIndex() {
  return normalizedOptions.value.findIndex((option) => isSelected(option) && !option.disabled)
}

function openMenu(initialIndex) {
  if (props.disabled) return

  open.value = true
  const index = initialIndex ?? selectedIndex()
  activeIndex.value = index >= 0 ? index : 0

  nextTick(() => {
    computeMenuStyle()
    scrollActiveIntoView()
  })

  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  window.addEventListener('scroll', computeMenuStyle, true)
  window.addEventListener('resize', computeMenuStyle)

  emit('open')
}

function closeMenu() {
  if (!open.value) return

  open.value = false
  activeIndex.value = -1
  emit('close')

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  window.removeEventListener('scroll', computeMenuStyle, true)
  window.removeEventListener('resize', computeMenuStyle)
}

function toggleMenu() {
  if (open.value) closeMenu()
  else openMenu()
}

function onDocumentPointerDown(event) {
  const target = event.target
  if (rootRef.value?.contains(target) || menuRef.value?.contains(target)) return
  closeMenu()
}

function scrollActiveIntoView() {
  if (activeIndex.value < 0) return
  const element = document.getElementById(optionId(activeIndex.value))
  element?.scrollIntoView({ block: 'nearest' })
}

function moveActive(delta) {
  const options = normalizedOptions.value
  if (options.length === 0) return

  let index = activeIndex.value
  for (let step = 0; step < options.length; step += 1) {
    index = (index + delta + options.length) % options.length
    if (!options[index].disabled) break
  }

  activeIndex.value = index
  nextTick(scrollActiveIntoView)
}

onBeforeUnmount(() => {
  closeMenu()
})

watch(
  () => normalizedOptions.value.length,
  () => {
    if (open.value) {
      activeIndex.value = Math.min(activeIndex.value, normalizedOptions.value.length - 1)
      nextTick(computeMenuStyle)
    }
  }
)

/* --------------------------------------------------------------------------
   Selección
   -------------------------------------------------------------------------- */
function selectOption(option) {
  if (!option || option.disabled) return

  if (props.multiple) {
    const next = isSelected(option)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value]
    emit('update:modelValue', next)
    emit('change', next)
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeMenu()
  triggerRef.value?.focus()
}

function removeOption(option) {
  const next = selectedValues.value.filter((value) => value !== option.value)
  emit('update:modelValue', next)
  emit('change', next)
}

/* --------------------------------------------------------------------------
   Teclado
   -------------------------------------------------------------------------- */
function onTriggerKeydown(event) {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (open.value) moveActive(1)
      else openMenu()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (open.value) moveActive(-1)
      else openMenu(normalizedOptions.value.length - 1)
      break
    case 'Home':
      if (open.value) {
        event.preventDefault()
        moveActive(-activeIndex.value)
      }
      break
    case 'End':
      if (open.value) {
        event.preventDefault()
        moveActive(normalizedOptions.value.length - 1 - activeIndex.value)
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!open.value) openMenu()
      else if (activeIndex.value >= 0) selectOption(normalizedOptions.value[activeIndex.value])
      break
    case 'Escape':
      if (open.value) {
        event.preventDefault()
        closeMenu()
      }
      break
    case 'Tab':
      closeMenu()
      break
    default:
      break
  }
}
</script>

<style scoped>
.zn-select {
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
}

.zn-select__trigger {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  min-height: 24px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--md-on-background);
  font-family: inherit;
  font-size: 1rem;
  line-height: 24px;
  text-align: left;
  cursor: pointer;
}

.zn-select__trigger:disabled {
  cursor: not-allowed;
}

.zn-select__trigger:focus-visible {
  outline: none;
}

.zn-select__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-select__value--placeholder,
.zn-select__placeholder {
  color: var(--md-on-surface-variant);
}

/* Chips de selección múltiple */
.zn-select__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 0 4px 0 10px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background-color: transparent;
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  line-height: 26px;
}

.zn-select__chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-select__chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: var(--md-on-surface-variant);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.zn-select__chip-remove:hover {
  background-color: color-mix(in srgb, var(--md-on-surface-variant) 16%, transparent);
}

.zn-select__caret {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.zn-select__caret--open {
  transform: rotate(180deg);
}
</style>

<style scoped>
/* --------------------------------------------------------------------------
   Menú (se renderiza en <body>, por eso no depende del contenedor)
   -------------------------------------------------------------------------- */
.zn-select__menu {
  position: fixed;
  z-index: 1200;
  box-sizing: border-box;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 4px;
  background-color: var(--md-surface-container-low, var(--md-surface, #FFFFFF));
  color: var(--md-on-background);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
  scrollbar-width: thin;
}

.zn-select__menu::-webkit-scrollbar {
  width: 8px;
}

.zn-select__menu::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 8px;
  background-clip: content-box;
  background-color: var(--md-outline);
}

.zn-select__option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  margin: 0;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}

.zn-select__option--active {
  background-color: color-mix(in srgb, var(--md-on-surface-variant) 12%, transparent);
}

.zn-select__option--selected {
  color: var(--md-primary);
  font-weight: 500;
}

.zn-select__option:disabled {
  color: var(--md-on-surface-variant);
  cursor: not-allowed;
  opacity: 0.38;
}

.zn-select__option-label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-select__check {
  flex: 0 0 auto;
  color: var(--md-primary);
}

.zn-select__checkbox {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid var(--md-outline);
  border-radius: 2px;
  color: var(--md-on-primary);
}

.zn-select__checkbox--checked {
  border-color: var(--md-primary);
  background-color: var(--md-primary);
}

.zn-select__empty {
  margin: 0;
  padding: 12px 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}
</style>
