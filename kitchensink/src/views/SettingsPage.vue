<template>
  <DemoView view="settings">
    <ZnSection title="Estado reactivo y almacenamiento">
      <p class="section-desc">
        <code>@zn-apps/settings-core</code> provee un documento JSON persistido en Web Storage accesible a través de un proxy profundo, con valores por defecto declarativos (<code>settings.define</code>).
      </p>

      <div class="settings-demo">
        <div class="settings-field">
          <label class="field-label" for="user-name">Nombre de usuario (<code>settings.user.name</code>):</label>
          <input
            id="user-name"
            v-model="userName"
            type="text"
            class="field-input"
            placeholder="Escribe un nombre..."
            @input="updateUserName"
          />
        </div>

        <div class="settings-field">
          <label class="field-label">Notificaciones activas (<code>settings.notifications.enabled</code>):</label>
          <ZnSwitch
            :model-value="notificationsEnabled"
            label="Activar notificaciones"
            @update:model-value="toggleNotifications"
          />
        </div>

        <div class="settings-actions">
          <ZnButton variant="tonal" @click="resetSettings">Restablecer valores por defecto</ZnButton>
        </div>

        <div class="settings-preview">
          <span class="preview-title">Documento JSON actual (<code>settings.toJSON()</code>):</span>
          <pre class="json-dump"><code>{{ jsonDump }}</code></pre>
        </div>
      </div>
    </ZnSection>

    <ZnSection title="Uso">
      <pre class="usage"><code>import { createSettings } from '@zn-apps/settings-core'

// 1. Crear instancia vinculada a un namespace
const settings = createSettings({ namespace: 'mi-app' })

// 2. Definir valores por defecto sin sobrescribir lo guardado
settings.define({
  user: { name: 'Invitado' },
  notifications: { enabled: true }
})

// 3. Leer y escribir directamente como propiedades
console.log(settings.user.name) // 'Invitado'
settings.user.name = 'Juan'     // Se guarda en localStorage automáticamente

// 4. Obtener documento completo o reiniciar
const json = settings.toJSON()
settings.reset()</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import { createSettings } from '@zn-apps/settings-core'
import { ZnButton, ZnSection, ZnSwitch } from '@zn-apps/ui-core'
import DemoView from '../components/DemoView.vue'

// Instancia de settings aislada para la demostración en memoria / storage local
const demoSettings = createSettings({
  namespace: 'kitchensink-demo',
  defaults: {
    user: { name: 'Invitado' },
    notifications: { enabled: true }
  }
})

const userName = ref(demoSettings.user.name)
const notificationsEnabled = ref(demoSettings.notifications.enabled)
const jsonDump = ref(JSON.stringify(demoSettings.toJSON(), null, 2))

function syncState() {
  jsonDump.value = JSON.stringify(demoSettings.toJSON(), null, 2)
  userName.value = demoSettings.user.name
  notificationsEnabled.value = demoSettings.notifications.enabled
}

function updateUserName(event) {
  demoSettings.user.name = event.target.value
  syncState()
}

function toggleNotifications(val) {
  demoSettings.notifications.enabled = val
  syncState()
}

function resetSettings() {
  demoSettings.reset()
  syncState()
}
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.settings-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--md-on-surface);
}

.field-label code {
  color: var(--md-primary);
}

.field-input {
  max-width: 360px;
  padding: 10px 14px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 1px var(--md-primary);
}

.settings-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.settings-preview {
  margin-top: 16px;
}

.preview-title {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}

.preview-title code {
  color: var(--md-primary);
}

.json-dump,
.usage {
  overflow-x: auto;
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
