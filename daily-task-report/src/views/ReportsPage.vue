<template>
  <ZnScreen :title="t('reports.title')" :subtitle="summary">
    <div class="reports-page">
      <div class="reports-filters">
        <ZnDateInput
          v-model="from"
          class="reports-filters__date"
          :label="t('reports.fromDate')"
          variant="filled"
          size="small"
        />
        <ZnDateInput
          v-model="to"
          class="reports-filters__date"
          :label="t('reports.toDate')"
          variant="filled"
          size="small"
        />
        <ZnButton v-if="hasFilters" variant="text" @click="clearFilters">
          {{ t('reports.clearFilters') }}
        </ZnButton>
      </div>

      <div v-if="dayReport" class="reports-day-alert" role="status">
        <ZnIcon name="description" :size="18" />
        <p class="reports-day-alert__text">
          {{ t('reports.dayReport', { date: filterDayLabel }) }}
        </p>
        <a class="reports-day-alert__link" :href="`#report-${dayReport.id}`">
          {{ t('reports.dayReportLink') }}
        </a>
      </div>

      <p v-if="store.error" class="reports-alert" role="alert">
        {{ t(`reports.${store.error}`) }}
      </p>
      <p v-else-if="feedback" class="reports-feedback" role="status">{{ feedback }}</p>

      <p v-if="store.loading" class="reports-state">{{ t('reports.loading') }}</p>

      <ZnBox v-else-if="store.isEmpty" variant="outlined" class="reports-state reports-state--empty">
        <ZnIcon name="description" :size="40" />
        <p class="reports-state__title">{{ t('reports.emptyTitle') }}</p>
        <p class="reports-state__text">{{ t('reports.emptyMessage') }}</p>
      </ZnBox>

      <p v-else-if="visibleReports.length === 0" class="reports-state">
        {{ t('reports.noResults') }}
      </p>

      <ul v-else class="reports-list">
        <li
          v-for="report in visibleReports"
          :id="`report-${report.id}`"
          :key="report.id"
          class="report-card"
        >
          <header class="report-card__header">
            <div class="report-card__heading">
              <h2 class="report-card__name">{{ reportName(report) }}</h2>
              <span class="report-card__meta">
                {{ t('reports.itemCount', { count: reportItemCount(report) }) }}
              </span>
            </div>

            <ZnRow padding="0" gap="4px" class="report-card__actions">
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('reports.export')"
                :title="t('reports.export')"
                @click="openExport(report)"
              >
                <ZnIcon name="download" :size="20" :label="t('reports.export')" />
              </ZnButton>
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('reports.copy')"
                :title="t('reports.copy')"
                :disabled="store.saving"
                @click="copyReport(report)"
              >
                <ZnIcon name="content_copy" :size="20" :label="t('reports.copy')" />
              </ZnButton>
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="removeReport(report)"
              >
                <ZnIcon name="delete" :size="20" :label="t('common.delete')" />
              </ZnButton>
            </ZnRow>
          </header>

          <div class="report-card__sections">
            <section
              v-for="section in REPORT_SECTION_KEYS"
              :key="section"
              class="report-section"
            >
              <div class="report-section__header">
                <h3 class="report-section__title">{{ t(`reports.sections.${section}`) }}</h3>
                <span class="report-section__count">{{ report.sections[section].length }}</span>
              </div>

              <p v-if="report.sections[section].length === 0" class="report-section__empty">
                {{ t('reports.emptySection') }}
              </p>

              <ul v-else class="report-section__items">
                <li
                  v-for="(item, index) in report.sections[section]"
                  :key="`${section}-${index}`"
                  class="report-item"
                  :class="`report-item--${item.kind}`"
                >
                  <span v-if="item.kind === 'update' && item.taskName" class="report-item__task">
                    {{ item.taskName }}
                  </span>
                  <p class="report-item__text">{{ item.description }}</p>
                </li>
              </ul>
            </section>
          </div>
        </li>
      </ul>
    </div>

    <ReportExportDialog
      v-model="isExportOpen"
      :report="exportReport"
      :tasks="tasksStore.tasks"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ZnBox, ZnButton, ZnDateInput, ZnIcon, ZnRow, ZnScreen, useDialogs } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { useReportsStore } from '../stores/reports.js'
import { useTasksStore } from '../stores/tasks.js'
import {
  REPORT_SECTION_KEYS,
  filterReports,
  reportDateValue,
  reportItemCount
} from '../helpers/reports.js'
import { formatTaskDate, formatTaskDateTime } from '../helpers/dates.js'
import ReportExportDialog from '../components/ReportExportDialog.vue'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const route = useRoute()
const store = useReportsStore()
const tasksStore = useTasksStore()

const from = ref('')
const to = ref('')
const feedback = ref('')
const isExportOpen = ref(false)
const exportReport = ref(null)

const hasFilters = computed(() => Boolean(from.value || to.value))
const visibleReports = computed(() =>
  filterReports(store.sortedReports, { from: from.value, to: to.value })
)
const summary = computed(() =>
  t('reports.summary', { shown: visibleReports.value.length, total: store.total })
)
/** Only a single-day filter (both fields equal) identifies one date. */
const isSingleDay = computed(() => Boolean(from.value) && from.value === to.value)
const filterDayLabel = computed(() =>
  from.value ? formatTaskDate(from.value, i18n.global.locale.value) : ''
)
const dayReport = computed(() => {
  if (!isSingleDay.value) return null
  return store.sortedReports.find((report) => reportDateValue(report) === from.value) ?? null
})

onMounted(async () => {
  tasksStore.load()
  await store.load()
  await nextTick()
  scrollToHashReport()
})

/** The export dialog needs the tasks to resolve each update's external link. */
function openExport(report) {
  exportReport.value = report
  isExportOpen.value = true
}

/** "Open report" on Home arrives with `#report-<id>`; scroll once rendered. */
function scrollToHashReport() {
  const target = String(route?.hash ?? '').replace(/^#/, '')
  if (!target || typeof document === 'undefined') return
  const element = document.getElementById(target)
  if (element && typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ block: 'start' })
  }
}

function reportName(report) {
  return formatTaskDateTime(report.createdAt, i18n.global.locale.value)
}

function clearFilters() {
  from.value = ''
  to.value = ''
}

async function copyReport(report) {
  feedback.value = ''
  const copy = await store.copyReport(report)
  if (copy) feedback.value = t('reports.copyDone')
}

async function removeReport(report) {
  feedback.value = ''
  const accepted = await confirm(
    t('reports.deleteMessage', { name: reportName(report) }),
    {
      title: t('reports.deleteTitle'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel')
    }
  )
  if (!accepted) return
  await store.deleteReport(report.id)
}
</script>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.reports-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 168px)) auto;
  align-items: center;
  justify-content: start;
  gap: 8px 12px;
}

.reports-filters__date {
  width: 100%;
  min-width: 0;
}

.reports-day-alert {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-size: 0.875rem;
}

.reports-day-alert__text {
  flex: 1 1 auto;
  margin: 0;
}

.reports-day-alert__link {
  color: inherit;
  font-weight: 500;
}

.reports-alert {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--md-error-container, var(--md-surface-variant));
  color: var(--md-on-error-container, var(--md-error));
  font-size: 0.875rem;
}

.reports-feedback {
  margin: 0;
  color: var(--md-primary);
  font-size: 0.875rem;
}

.reports-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 32px 16px;
  color: var(--md-on-surface-variant);
  text-align: center;
}

.reports-state--empty {
  background: var(--md-surface-container-low);
}

.reports-state__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
}

.reports-state__text {
  margin: 0;
  font-size: 0.875rem;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.report-card {
  padding: 16px;
  scroll-margin-top: 88px;
  border: 1px solid var(--md-outline-variant, var(--md-outline));
  border-radius: 16px;
  background: var(--md-surface);
}

.report-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.report-card__heading {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.report-card__name {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1.0625rem;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.report-card__meta {
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
}

.report-card__actions {
  width: auto;
  flex: 0 0 auto;
  margin-left: auto;
}

.report-card__sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid color-mix(in srgb, var(--md-on-surface) 12%, transparent);
}

.report-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.report-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-section__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
}

.report-section__count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.report-section__empty {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  font-style: italic;
}

.report-section__items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.report-item {
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--md-surface-container-low, var(--md-surface-variant));
}

.report-item__task {
  display: block;
  margin-bottom: 2px;
  color: var(--md-primary);
  font-size: 0.75rem;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.report-item__text {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

@media (max-width: 720px) {
  .report-card__sections {
    grid-template-columns: 1fr;
  }

  .reports-filters {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
