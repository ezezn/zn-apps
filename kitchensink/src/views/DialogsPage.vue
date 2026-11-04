<template>
  <DemoView view="dialogs">

    <ZnSection title="Diálogo base">
      <p class="section-desc">
        <code>ZnDialog</code> usa el elemento HTML <code>&lt;dialog&gt;</code> y permite componer título, contenido y acciones.
      </p>
      <ZnButton variant="outlined" @click="basicDialogOpen = true">Abrir diálogo base</ZnButton>

      <ZnDialog v-model="basicDialogOpen" title="Pausar sonido">
        <p>El sonido seguirá disponible para que puedas retomarlo cuando quieras.</p>
        <template #actions>
          <ZnButton variant="text" @click="basicDialogOpen = false">Volver</ZnButton>
          <ZnButton variant="filled" @click="closeBasicDialog">Pausar</ZnButton>
        </template>
      </ZnDialog>
    </ZnSection>

    <ZnSection title="Diálogos comunes">
      <p class="section-desc">
        <code>useDialogs()</code> ofrece alertas, confirmaciones Sí/No y preguntas con entrada de texto. El host compartido está montado una sola vez en la raíz de esta app.
      </p>
      <div class="dialog-examples">
        <ZnButton variant="tonal" @click="showAlert">Mostrar alerta</ZnButton>
        <ZnButton variant="tonal" @click="askYesNo">Pregunta Sí / No</ZnButton>
        <ZnButton variant="tonal" @click="askName">Pedir una respuesta</ZnButton>
      </div>
      <p class="dialog-result" aria-live="polite">{{ result }}</p>
    </ZnSection>

  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ref } from 'vue'
import { ZnButton, ZnDialog, ZnSection, useDialogs } from '@zn-apps/ui-core'

const basicDialogOpen = ref(false)
const result = ref('Prueba una de las acciones para ver su resultado.')
const { alert, confirm, prompt } = useDialogs()

function closeBasicDialog() {
  basicDialogOpen.value = false
}

async function showAlert() {
  await alert('Tus preferencias de sonido están listas.', { title: 'Configuración guardada' })
  result.value = 'Alerta cerrada.'
}

async function askYesNo() {
  const accepted = await confirm('¿Quieres detener todos los sonidos?', {
    title: 'Detener sonidos',
    confirmText: 'Sí, detener',
    cancelText: 'Seguir escuchando'
  })
  result.value = accepted ? 'Elegiste detenerlos.' : 'Elegiste seguir escuchando.'
}

async function askName() {
  const answer = await prompt('¿Cómo quieres llamar a esta mezcla?', {
    title: 'Guardar mezcla',
    placeholder: 'Ej. Noche tranquila',
    initialValue: '',
    required: true,
    confirmText: 'Guardar'
  })
  result.value = answer === null ? 'No se guardó la mezcla.' : `Nombre de la mezcla: ${answer}`
}
</script>

<style scoped>
.dialog-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dialog-result {
  min-height: 24px;
  margin: 20px 0 0;
  color: var(--md-on-surface-variant);
}
</style>
