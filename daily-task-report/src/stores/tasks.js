import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { tasksRepository } from '../db/tasksRepository.js'
import { backupRepository } from '../db/backupRepository.js'
import {
  ALL_STATUSES,
  SORT_DIRECTIONS,
  TASK_SORT_FIELDS,
  filterTasks,
  sortTasks
} from '../helpers/tasks.js'
import { i18n } from '../i18n.js'

/**
 * Page-scoped store for the tasks view. The filter/sort state lives here so
 * leaving and returning to the page keeps the working view.
 */
export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loaded = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  /** i18n key suffix, e.g. `loadError` → `tasks.loadError`. */
  const error = ref(null)

  const filters = reactive({
    search: '',
    status: ALL_STATUSES,
    externalStatus: ALL_STATUSES,
    sortBy: 'addedAt',
    direction: 'desc'
  })

  const visibleTasks = computed(() =>
    sortTasks(filterTasks(tasks.value, filters), filters, i18n.global.locale.value)
  )
  const total = computed(() => tasks.value.length)
  const shown = computed(() => visibleTasks.value.length)
  const isEmpty = computed(() => loaded.value && tasks.value.length === 0)
  const hasActiveFilters = computed(
    () =>
      filters.search.trim() !== '' ||
      filters.status !== ALL_STATUSES ||
      filters.externalStatus !== ALL_STATUSES
  )

  async function load({ force = false } = {}) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksRepository.list()
      loaded.value = true
    } catch {
      error.value = 'loadError'
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload) {
    saving.value = true
    error.value = null
    try {
      const task = await tasksRepository.create(payload)
      tasks.value = [...tasks.value, task]
      return task
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateTask(id, payload) {
    saving.value = true
    error.value = null
    try {
      const task = await tasksRepository.update(id, payload)
      tasks.value = tasks.value.map((item) => (item.id === id ? task : item))
      return task
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deleteTask(id) {
    error.value = null
    try {
      await tasksRepository.remove(id)
      tasks.value = tasks.value.filter((item) => item.id !== id)
      return true
    } catch {
      error.value = 'removeError'
      return false
    }
  }

  /** Restores tasks, updates and reports from a parsed backup file. */
  async function importBackup(backup = {}) {
    saving.value = true
    error.value = null
    try {
      const result = await backupRepository.importBackup(backup)
      tasks.value = result.tasks
      loaded.value = true
      return result
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  /** Merges imported tasks by external id (see `planMerge`). */
  async function mergeTasks(payloads = []) {
    saving.value = true
    error.value = null
    try {
      const result = await tasksRepository.mergeAll(payloads)
      tasks.value = result.tasks
      loaded.value = true
      return result
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function clearTasks() {
    error.value = null
    try {
      await tasksRepository.clearAll()
      tasks.value = []
      loaded.value = true
      return true
    } catch {
      error.value = 'removeError'
      return false
    }
  }

  function findById(id) {
    return tasks.value.find((task) => task.id === id) ?? null
  }

  function resetFilters() {
    filters.search = ''
    filters.status = ALL_STATUSES
    filters.externalStatus = ALL_STATUSES
  }

  function setSortBy(field) {
    if (TASK_SORT_FIELDS.includes(field)) filters.sortBy = field
  }

  function toggleDirection() {
    filters.direction = filters.direction === 'asc' ? 'desc' : 'asc'
  }

  function setDirection(direction) {
    if (SORT_DIRECTIONS.includes(direction)) filters.direction = direction
  }

  return {
    tasks,
    loaded,
    loading,
    saving,
    error,
    filters,
    visibleTasks,
    total,
    shown,
    isEmpty,
    hasActiveFilters,
    load,
    createTask,
    updateTask,
    deleteTask,
    importBackup,
    mergeTasks,
    clearTasks,
    findById,
    resetFilters,
    setSortBy,
    setDirection,
    toggleDirection
  }
})
