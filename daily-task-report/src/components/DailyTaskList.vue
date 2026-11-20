<template>
  <section class="daily-list">
    <button
      v-if="collapsible"
      type="button"
      class="daily-list__header daily-list__header--toggle"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="contentId"
      @click="isOpen = !isOpen"
    >
      <span class="daily-list__title">{{ title }}</span>
      <span class="daily-list__count">{{ entries.length }}</span>
      <svg
        class="daily-list__chevron"
        :class="{ 'daily-list__chevron--open': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        aria-hidden="true"
      >
        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" fill="currentColor" />
      </svg>
    </button>

    <header v-else class="daily-list__header">
      <h2 class="daily-list__title">{{ title }}</h2>
      <span class="daily-list__count">{{ entries.length }}</span>
    </header>

    <div v-show="!collapsible || isOpen" :id="contentId" class="daily-list__content">
      <p v-if="entries.length === 0" class="daily-list__empty">{{ emptyText }}</p>

      <ul v-else class="daily-list__items">
        <li v-for="entry in entries" :key="entry.task.id" class="daily-task">
          <div class="daily-task__header">
            <div class="daily-task__heading">
              <h3 class="daily-task__name">
                <a
                  v-if="linkFor(entry.task)"
                  class="daily-task__name-link"
                  :href="linkFor(entry.task)"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ entry.task.name }}</a>
                <template v-else>{{ entry.task.name }}</template>
              </h3>
              <span class="daily-task__external-id">{{ entry.task.externalId }}</span>
            </div>

            <div class="daily-task__chips">
              <ZnChip
                variant="assist"
                size="small"
                :class="['daily-task__status', `daily-task__status--${entry.task.status}`]"
              >
                <template #icon>
                  <span class="daily-task__dot" aria-hidden="true" />
                </template>
                {{ statusLabel(t, entry.task.status) }}
              </ZnChip>
              <ZnChip v-if="entry.task.externalStatus" variant="suggestion" size="small">
                {{ externalStatusLabel(entry.task.externalStatus) }}
              </ZnChip>
              <ZnButton
                variant="text"
                icon-only
                class="daily-task__new-update"
                :aria-label="t('updates.new')"
                :title="t('updates.new')"
                @click="$emit('create-update', entry.task)"
              >
                <ZnIcon name="add" :size="20" />
              </ZnButton>
            </div>
          </div>

          <ul v-if="entry.updates.length > 0" class="daily-task__updates">
            <li v-for="update in sortedUpdates(entry.updates)" :key="update.id" class="daily-task__update">
              <time class="daily-task__update-time" :datetime="update.createdAt">
                {{ formatTime(update.createdAt) }}
              </time>
              <p class="daily-task__update-description">{{ update.description }}</p>
              <ZnButton
                variant="text"
                icon-only
                class="daily-task__update-edit"
                :aria-label="t('common.edit')"
                :title="t('common.edit')"
                @click="$emit('edit-update', update)"
              >
                <ZnIcon name="edit" :size="18" />
              </ZnButton>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, useId } from 'vue'
import { ZnButton, ZnChip, ZnIcon } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { statusLabel } from '../data/task-schema.js'
import { useExternalStatuses } from '../composables/useExternalStatuses.js'
import { absoluteUrl } from '../helpers/tasks.js'
import { sortUpdatesDesc } from '../helpers/updates.js'
import { formatTaskTime } from '../helpers/dates.js'

const props = defineProps({
  title: { type: String, default: '' },
  /** `{ task, updates }` entries; `updates` may be empty (pending list). */
  entries: { type: Array, default: () => [] },
  emptyText: { type: String, default: '' },
  /** When true the header toggles the list body. */
  collapsible: { type: Boolean, default: false },
  /** Initial state of a collapsible list. */
  expanded: { type: Boolean, default: false }
})

defineEmits(['create-update', 'edit-update'])

const contentId = `daily-list-${useId()}`
const isOpen = ref(props.expanded)

const t = (...args) => i18n.global.t(...args)
const { labelFor: externalStatusLabel } = useExternalStatuses()

function linkFor(task) {
  return absoluteUrl(task.externalUrl)
}

function sortedUpdates(updates) {
  return sortUpdatesDesc(updates)
}

function formatTime(value) {
  return formatTaskTime(value, i18n.global.locale.value)
}
</script>

<style scoped>
.daily-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.daily-list__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* The header itself is the toggle, so the whole row is the hit area. */
.daily-list__header--toggle {
  width: 100%;
  padding: 4px 0;
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.daily-list__header--toggle:hover .daily-list__title {
  text-decoration: underline;
}

.daily-list__header--toggle:focus-visible {
  border-radius: 8px;
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.daily-list__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
}

.daily-list__chevron {
  width: 20px;
  height: 20px;
  margin-left: auto;
  color: var(--md-on-surface-variant);
  transition: transform 150ms ease;
}

.daily-list__chevron--open {
  transform: rotate(180deg);
}

.daily-list__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.daily-list__count {
  min-width: 24px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--md-surface-container-high, var(--md-surface-variant));
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.daily-list__empty {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--md-surface-container-low, var(--md-surface));
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.daily-list__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.daily-task {
  padding: 12px 16px;
  border: 1px solid var(--md-outline-variant, var(--md-outline));
  border-radius: 12px;
  background: var(--md-surface);
}

.daily-task__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.daily-task__heading {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.daily-task__name {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.daily-task__name-link {
  color: inherit;
  text-decoration: none;
}

.daily-task__name-link:hover {
  text-decoration: underline;
}

.daily-task__external-id {
  color: var(--md-on-surface-variant);
  font-family: monospace;
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}

.daily-task__chips {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.daily-task__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-on-surface-variant);
}

.daily-task__status--active .daily-task__dot {
  background: #386A20;
}

.daily-task__status--inactive .daily-task__dot {
  background: var(--md-outline);
}

.daily-task__updates {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid color-mix(in srgb, var(--md-on-surface) 12%, transparent);
  list-style: none;
}

.daily-task__update {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.daily-task__update-edit {
  flex: 0 0 auto;
  margin-top: -4px;
}

.daily-task__update-time {
  flex: 0 0 auto;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
}

.daily-task__update-description {
  flex: 1 1 auto;
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
}
</style>
