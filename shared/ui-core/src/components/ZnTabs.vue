<template>
  <div :class="['zn-tabs', `zn-tabs--${variant}`]">
    <div
      class="zn-tabs__tablist"
      role="tablist"
      :aria-label="ariaLabel || undefined"
      :aria-labelledby="ariaLabelledby || undefined"
      aria-orientation="horizontal"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :id="tabId(tab)"
        :ref="(element) => setTabRef(element, index)"
        class="zn-tabs__tab"
        :class="{ 'zn-tabs__tab--selected': isSelected(tab) }"
        type="button"
        role="tab"
        :aria-selected="isSelected(tab)"
        :aria-controls="panelId(tab)"
        :tabindex="isSelected(tab) ? 0 : -1"
        :disabled="tab.disabled"
        @click="selectTab(tab)"
        @keydown="onTabKeydown($event, index)"
      >
        <ZnIcon v-if="tab.icon" :name="tab.icon" :size="24" />
        <span class="zn-tabs__label">{{ tab.label }}</span>
        <span v-if="tab.badge != null" class="zn-tabs__badge">{{ tab.badge }}</span>
      </button>
    </div>

    <div
      v-for="tab in tabs"
      :id="panelId(tab)"
      :key="`panel-${tab.value}`"
      class="zn-tabs__panel"
      role="tabpanel"
      :aria-labelledby="tabId(tab)"
      :tabindex="isSelected(tab) ? 0 : -1"
      :hidden="!isSelected(tab)"
    >
      <slot name="panel" :tab="tab" :index="tabs.indexOf(tab)">
        {{ tab.content }}
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, useId, ref, watch } from 'vue'
import ZnIcon from './ZnIcon.vue'

const props = defineProps({
  /** Tabs pares con value único, label y contenido opcional. */
  tabs: { type: Array, required: true },
  /** Valor seleccionado; admite v-model. Si se omite, empieza en el primer tab habilitado. */
  modelValue: { type: [String, Number], default: undefined },
  /** Tabs principales bajo una app bar o secundarios dentro de una sección. */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  ariaLabel: { type: String, default: '' },
  ariaLabelledby: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change'])
const baseId = `zn-tabs-${useId()}`
const tabButtons = ref([])
const firstEnabledValue = computed(() => props.tabs.find((tab) => !tab.disabled)?.value)
const internalValue = ref(firstEnabledValue.value)
const selectedValue = computed(() => {
  const candidate = props.modelValue === undefined ? internalValue.value : props.modelValue
  const selected = props.tabs.find((tab) => tab.value === candidate && !tab.disabled)
  return selected ? selected.value : firstEnabledValue.value
})

watch(firstEnabledValue, (value) => {
  if (!props.tabs.some((tab) => tab.value === internalValue.value && !tab.disabled)) {
    internalValue.value = value
  }
})

function isSelected(tab) {
  return tab.value === selectedValue.value
}

function tabId(tab) {
  return `${baseId}-tab-${encodeURIComponent(tab.value)}`
}

function panelId(tab) {
  return `${baseId}-panel-${encodeURIComponent(tab.value)}`
}

function setTabRef(element, index) {
  if (element) tabButtons.value[index] = element
}

function selectTab(tab) {
  if (tab.disabled || tab.value === selectedValue.value) return
  if (props.modelValue === undefined) internalValue.value = tab.value
  emit('update:modelValue', tab.value)
  emit('change', tab.value)
}

function onTabKeydown(event, currentIndex) {
  const enabledIndices = props.tabs
    .map((tab, index) => (tab.disabled ? -1 : index))
    .filter((index) => index !== -1)
  if (!enabledIndices.length) return

  const position = enabledIndices.indexOf(currentIndex)
  let nextPosition
  if (event.key === 'ArrowRight') nextPosition = (position + 1) % enabledIndices.length
  else if (event.key === 'ArrowLeft') nextPosition = (position - 1 + enabledIndices.length) % enabledIndices.length
  else if (event.key === 'Home') nextPosition = 0
  else if (event.key === 'End') nextPosition = enabledIndices.length - 1
  else return

  event.preventDefault()
  const nextIndex = enabledIndices[nextPosition]
  tabButtons.value[nextIndex]?.focus()
  selectTab(props.tabs[nextIndex])
}
</script>

<style scoped>
.zn-tabs {
  width: 100%;
  min-width: 0;
  color: var(--md-on-background);
}

.zn-tabs__tablist {
  display: flex;
  width: 100%;
  min-height: 48px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  border-bottom: 1px solid var(--md-outline-variant, var(--md-surface-variant));
  scrollbar-width: none;
}

.zn-tabs__tablist::-webkit-scrollbar {
  display: none;
}

.zn-tabs__tab {
  position: relative;
  display: inline-flex;
  flex: 1 0 auto;
  min-width: 90px;
  min-height: 48px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 0;
  background: transparent;
  color: var(--md-on-surface-variant, var(--md-on-background));
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.1px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease;
}

.zn-tabs__tab::after {
  position: absolute;
  right: 2px;
  bottom: -1px;
  left: 2px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--md-primary);
  content: '';
  transform: scaleX(0);
  transition: transform 220ms cubic-bezier(0.2, 0, 0, 1);
}

.zn-tabs__tab:hover:not(:disabled) {
  color: var(--md-on-background);
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-tabs__tab:focus-visible {
  z-index: 1;
  outline: 2px solid var(--md-primary);
  outline-offset: -3px;
}

.zn-tabs__tab--selected {
  color: var(--md-primary);
}

.zn-tabs__tab--selected::after {
  transform: scaleX(1);
}

.zn-tabs__tab:disabled {
  color: color-mix(in srgb, var(--md-on-background) 38%, transparent);
  cursor: default;
}

.zn-tabs__label {
  overflow-wrap: anywhere;
}

.zn-tabs__badge {
  display: inline-flex;
  min-width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-size: 0.6875rem;
  line-height: 16px;
}

.zn-tabs--secondary .zn-tabs__tab {
  min-width: 72px;
  min-height: 48px;
  font-size: 0.875rem;
}

.zn-tabs--secondary .zn-tabs__tab::after {
  right: 0;
  left: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
}

.zn-tabs__panel {
  min-width: 0;
  padding: 16px 0;
  outline: none;
}

.zn-tabs__panel[hidden] {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .zn-tabs__tab,
  .zn-tabs__tab::after {
    transition: none;
  }
}
</style>
