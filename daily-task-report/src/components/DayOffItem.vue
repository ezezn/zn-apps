<template>
  <li class="day-off">
    <span class="day-off__marker" :style="{ background: color }" />

    <div class="day-off__body">
      <div class="day-off__heading">
        <span class="day-off__type">{{ label }}</span>
        <span class="day-off__range">{{ range }}</span>
      </div>
      <p v-if="entry.note" class="day-off__note">{{ entry.note }}</p>
    </div>

    <ZnRow padding="0" gap="4px" class="day-off__actions">
      <ZnButton
        variant="text"
        icon-only
        :aria-label="t('common.edit')"
        :title="t('common.edit')"
        @click="$emit('edit')"
      >
        <ZnIcon name="edit" :size="20" />
      </ZnButton>
      <ZnButton
        variant="text"
        icon-only
        :aria-label="t('common.delete')"
        :title="t('common.delete')"
        @click="$emit('delete')"
      >
        <ZnIcon name="delete" :size="20" />
      </ZnButton>
    </ZnRow>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { ZnButton, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { DAY_OFF_COLORS } from '../helpers/days-off.js'

const props = defineProps({
  entry: { type: Object, required: true },
  /** Localized type label. */
  label: { type: String, default: '' },
  /** Localized date or date range. */
  range: { type: String, default: '' }
})

defineEmits(['edit', 'delete'])

const t = (...args) => i18n.global.t(...args)

const color = computed(() => DAY_OFF_COLORS[props.entry.type] ?? DAY_OFF_COLORS.nonWorking)
</script>

<style scoped>
.day-off {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--md-outline-variant, var(--md-outline));
  border-radius: 12px;
  background: var(--md-surface);
}

.day-off__marker {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 50%;
}

.day-off__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.day-off__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.day-off__type {
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
}

.day-off__range {
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
}

.day-off__note {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  overflow-wrap: anywhere;
}

.day-off__actions {
  width: auto;
  flex: 0 0 auto;
  margin-left: auto;
}
</style>
