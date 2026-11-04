import { reactive } from 'vue'

const dialogState = reactive({ current: null })
const pendingDialogs = []
let nextDialogId = 1

function showNextDialog() {
  if (!dialogState.current && pendingDialogs.length > 0) {
    dialogState.current = pendingDialogs.shift()
  }
}

function requestDialog(options) {
  return new Promise((resolve) => {
    pendingDialogs.push(reactive({
      ...options,
      id: nextDialogId++,
      inputValue: options.initialValue ?? '',
      open: true,
      resolve,
      settled: false
    }))
    showNextDialog()
  })
}

function settleCurrentDialog(value) {
  const current = dialogState.current
  if (!current || current.settled) return

  current.settled = true
  current.resolve(value)
  current.open = false
}

function dismissCurrentDialog() {
  const current = dialogState.current
  if (!current) return

  const value = current.kind === 'confirm' ? false : current.kind === 'prompt' ? null : undefined
  settleCurrentDialog(value)
}

function finishCurrentDialog() {
  if (dialogState.current && !dialogState.current.open) {
    dialogState.current = null
    showNextDialog()
  }
}

/**
 * Queue standard modal interactions. Mount one ZnDialogHost in the app root.
 */
export function useDialogs() {
  return {
    alert(message, options = {}) {
      return requestDialog({
        kind: 'alert',
        title: options.title ?? 'Aviso',
        message,
        confirmText: options.confirmText ?? 'Aceptar'
      })
    },
    confirm(message, options = {}) {
      return requestDialog({
        kind: 'confirm',
        title: options.title ?? 'Confirmar',
        message,
        confirmText: options.confirmText ?? 'Sí',
        cancelText: options.cancelText ?? 'No'
      })
    },
    prompt(message, options = {}) {
      return requestDialog({
        kind: 'prompt',
        title: options.title ?? 'Tu respuesta',
        message,
        confirmText: options.confirmText ?? 'Aceptar',
        cancelText: options.cancelText ?? 'Cancelar',
        placeholder: options.placeholder ?? '',
        initialValue: options.initialValue ?? '',
        required: options.required ?? false,
        inputType: options.inputType ?? 'text'
      })
    }
  }
}

export { dialogState, dismissCurrentDialog, finishCurrentDialog, settleCurrentDialog }
