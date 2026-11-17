import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { updatesRepository } from '../db/updatesRepository.js'
import { sortUpdatesDesc, updatesForTask } from '../helpers/updates.js'

/**
 * Change log store. Updates are small and local, so the whole list is loaded
 * once and both the Updates page and the expanded task cards read from it.
 */
export const useUpdatesStore = defineStore('updates', () => {
  const updates = ref([])
  const loaded = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  /** i18n key suffix, e.g. `loadError` → `updates.loadError`. */
  const error = ref(null)

  const sortedUpdates = computed(() => sortUpdatesDesc(updates.value))
  const total = computed(() => updates.value.length)
  const isEmpty = computed(() => loaded.value && updates.value.length === 0)

  async function load({ force = false } = {}) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      updates.value = await updatesRepository.list()
      loaded.value = true
    } catch {
      error.value = 'loadError'
    } finally {
      loading.value = false
    }
  }

  async function createUpdate(payload) {
    saving.value = true
    error.value = null
    try {
      const update = await updatesRepository.create(payload)
      updates.value = [...updates.value, update]
      return update
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateUpdate(id, payload) {
    saving.value = true
    error.value = null
    try {
      const update = await updatesRepository.update(id, payload)
      updates.value = updates.value.map((item) => (item.id === id ? update : item))
      return update
    } catch {
      error.value = 'saveError'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deleteUpdate(id) {
    error.value = null
    try {
      await updatesRepository.remove(id)
      updates.value = updates.value.filter((item) => item.id !== id)
      return true
    } catch {
      error.value = 'removeError'
      return false
    } finally {
      saving.value = false
    }
  }

  /** Newest first, for the expanded task card. */
  function forTask(taskId) {
    return updatesForTask(updates.value, taskId)
  }

  /** Memory-only sync after a task is removed (the repository cascades). */
  function forgetTask(taskId) {
    updates.value = updates.value.filter((item) => item.taskId !== Number(taskId))
  }

  /** Memory-only sync after every task is removed (the repository cascades). */
  function forgetAll() {
    updates.value = []
    loaded.value = true
  }

  return {
    updates,
    loaded,
    loading,
    saving,
    error,
    sortedUpdates,
    total,
    isEmpty,
    load,
    createUpdate,
    updateUpdate,
    deleteUpdate,
    forTask,
    forgetTask,
    forgetAll
  }
})
