<template>
  <div
    v-if="hasContent"
    class="zn-richtext-view"
    :class="`zn-richtext-view--${size}`"
    v-html="html"
  />
  <p v-else class="zn-richtext-view__empty">{{ emptyText }}</p>
</template>

<script setup>
import { computed } from 'vue'
import { markdownToHtml } from '../markdown.js'

const props = defineProps({
  /** Valor en Markdown. */
  modelValue: { type: String, default: '' },
  emptyText: { type: String, default: '—' },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const hasContent = computed(() => String(props.modelValue || '').trim().length > 0)
const html = computed(() => markdownToHtml(props.modelValue || ''))
</script>

<style scoped>
.zn-richtext-view {
  min-width: 0;
  color: var(--md-on-background);
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.zn-richtext-view--small {
  font-size: 0.875rem;
}

.zn-richtext-view--medium {
  font-size: 1rem;
}

.zn-richtext-view--large {
  font-size: 1.125rem;
}

.zn-richtext-view__empty {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 1rem;
}

.zn-richtext-view :deep(h1) {
  margin: 12px 0 8px;
  font-size: 1.75em;
  font-weight: 500;
  line-height: 1.25;
}

.zn-richtext-view :deep(h2) {
  margin: 12px 0 8px;
  font-size: 1.5em;
  font-weight: 500;
  line-height: 1.3;
}

.zn-richtext-view :deep(h3) {
  margin: 12px 0 8px;
  font-size: 1.25em;
  font-weight: 500;
  line-height: 1.35;
}

.zn-richtext-view :deep(h4),
.zn-richtext-view :deep(h5),
.zn-richtext-view :deep(h6) {
  margin: 12px 0 8px;
  font-size: 1em;
  font-weight: 500;
}

.zn-richtext-view :deep(p) {
  margin: 0 0 8px;
}

.zn-richtext-view :deep(ul),
.zn-richtext-view :deep(ol) {
  margin: 0 0 8px;
  padding-left: 24px;
}

.zn-richtext-view :deep(ul:last-child),
.zn-richtext-view :deep(ol:last-child),
.zn-richtext-view :deep(p:last-child) {
  margin-bottom: 0;
}

.zn-richtext-view :deep(blockquote) {
  margin: 8px 0;
  padding-left: 12px;
  border-left: 3px solid var(--md-outline);
  color: var(--md-on-surface-variant);
}

.zn-richtext-view :deep(code) {
  padding: 1px 4px;
  border-radius: 4px;
  background-color: var(--md-surface-variant);
  font-family: monospace;
  font-size: 0.875em;
}

.zn-richtext-view :deep(pre) {
  margin: 8px 0;
  padding: 12px;
  overflow-x: auto;
  border-radius: 8px;
  background-color: var(--md-surface-container-low);
}

.zn-richtext-view :deep(pre code) {
  padding: 0;
  background: transparent;
}

.zn-richtext-view :deep(table) {
  width: 100%;
  margin: 8px 0;
  border-collapse: collapse;
}

.zn-richtext-view :deep(th),
.zn-richtext-view :deep(td) {
  padding: 6px 8px;
  border: 1px solid var(--md-outline);
  vertical-align: top;
}

.zn-richtext-view :deep(th) {
  background-color: var(--md-surface-variant);
  font-weight: 500;
}

.zn-richtext-view :deep(a) {
  color: var(--md-primary);
}
</style>
