import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { reportsRepository } from '../db/reportsRepository.js'
import { duplicateReport, sortReportsDesc } from '../helpers/reports.js'

/**
 * Report store. A report is created only from the Home page; this store serves
 * the Reports page (list, copy, delete) and keeps the in-memory copy in sync.
 */
export const useReportsStore = defineStore('reports', () => {
  const reports = ref([])
  const loaded = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  /** i18n key suffix, e.g. `loadError` → `reports.loadError`. */
  const error = ref(null)

  const sortedReports = computed(() => sortReportsDesc(reports.value))
  const total = computed(() => reports.value.length)
  const isEmpty = computed(() => loaded.value && reports.value.length === 0)

  async function load({ force = false } = {}) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      reports.value = await reportsRepository.list()
      loaded.value = true
    } catch {
      error.value = 'loadError'
    } finally {
      loading.value = false
    }
  }

  async function createReport(payload) {
    saving.value = true
    error.value = null
    try {
      const report = await reportsRepository.create(payload)
      reports.value = [...reports.value, report]
      return report
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function copyReport(report) {
    return createReport(duplicateReport(report))
  }

  async function deleteReport(id) {
    error.value = null
    try {
      await reportsRepository.remove(id)
      reports.value = reports.value.filter((item) => item.id !== id)
      return true
    } catch {
      error.value = 'removeError'
      return false
    } finally {
      saving.value = false
    }
  }

  /** Memory-only sync after all data is deleted (the repository cascades). */
  function forgetAll() {
    reports.value = []
    loaded.value = true
  }

  return {
    reports,
    loaded,
    loading,
    saving,
    error,
    sortedReports,
    total,
    isEmpty,
    load,
    createReport,
    copyReport,
    deleteReport,
    forgetAll
  }
})
