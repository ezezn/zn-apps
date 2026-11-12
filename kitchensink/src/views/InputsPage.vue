<template>
  <DemoView view="inputs">
    <!-- SECCIÓN 1: TEXTO -->
    <ZnSection title="1. Texto de una línea y multilínea" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Campos MD3 con contorno, etiqueta flotante y texto de asistencia. Los componentes
        envuelven inputs HTML nativos, por lo que admiten <code>name</code>,
        <code>autocomplete</code> y cualquier atributo del elemento real.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnSingleLineText</span>
        <ZnSingleLineText
          v-model="nombre"
          label="Nombre completo"
          hint="Como aparece en tu documento de identidad"
          autocomplete="name"
          required
        />
        <span class="helper-text">Valor: {{ nombre || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnMultilineText</span>
        <ZnMultilineText
          v-model="comentarios"
          label="Comentarios"
          :rows="4"
          hint="Máximo 200 caracteres"
          :maxlength="200"
        />
        <span class="helper-text">{{ comentarios.length }} / 200</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta (label opcional)</span>
        <ZnSingleLineText
          v-model="busqueda"
          placeholder="Buscar sonidos…"
          aria-label="Buscar sonidos"
        />
        <span class="helper-text">
          Omite <code>label</code> y usa <code>aria-label</code> cuando el contexto ya describe el campo.
        </span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 2: EMAIL Y TELÉFONO -->
    <ZnSection title="2. Email y teléfono" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Incluyen validación básica al perder el foco y emiten <code>@validation</code> /
        <code>@update:valid</code>. El campo de teléfono descarta caracteres no numéricos.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnEmailInput</span>
        <ZnEmailInput
          v-model="correo"
          label="Correo electrónico"
          hint="nombre@dominio.com"
          @update:valid="correoValido = $event"
        />
        <span class="helper-text">¿Válido? {{ correoValido ? 'Sí' : 'No' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnPhoneInput</span>
        <ZnPhoneInput
          v-model="telefono"
          label="Teléfono"
          hint="Entre 6 y 15 dígitos"
          :min-digits="6"
        />
        <span class="helper-text">Valor saneado: {{ telefono || '—' }}</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 3: SELECT -->
    <ZnSection title="3. Select simple y múltiple" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        El menú se renderiza en <code>body</code> con posición fija y se limita a
        <code>maxVisibleItems</code> elementos (6 por defecto) antes de mostrar una barra de
        desplazamiento. Soporta teclado (flechas, Home/End, Enter, Escape).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Selección simple</span>
        <ZnSelect
          v-model="pais"
          label="País"
          :options="paises"
          :max-visible-items="5"
          hint="Lista con scroll a partir de 5 elementos"
        />
        <span class="helper-text">Seleccionado: {{ pais || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Selección múltiple</span>
        <ZnSelect v-model="etiquetas" label="Etiquetas" :options="etiquetasDisponibles" multiple />
        <span class="helper-text">Seleccionadas: {{ etiquetas.length }}</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 4: FECHAS Y HORAS -->
    <ZnSection title="4. Fechas y horas" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        Usan los selectores nativos del sistema (<code>date</code>, <code>time</code>,
        <code>datetime-local</code>) con los límites <code>min</code> y <code>max</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnDateInput</span>
        <ZnDateInput v-model="fecha" label="Fecha de reserva" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnTimeInput</span>
        <ZnTimeInput v-model="hora" label="Hora de entrega" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnDateTimeInput</span>
        <ZnDateTimeInput v-model="fechaHora" label="Inicio del evento" />
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 5: RANGOS NUMÉRICOS -->
    <ZnSection title="5. Rangos numéricos (ZnRangeInput)" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        <code>ZnRangeInput</code> acepta un número (un actuador) o un par
        <code>[mínimo, máximo]</code> (dos actuadores que nunca se cruzan). Admiten
        <code>min</code>, <code>max</code>, <code>step</code> y un formateador de valor.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Valor simple</span>
        <ZnRangeInput
          v-model="volumen"
          label="Volumen"
          :min="0"
          :max="100"
          :step="5"
          :value-format="(v) => `${v} %`"
        />
        <span class="helper-text">Valor: {{ volumen }}%</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Doble actuador (mínimo / máximo)</span>
        <ZnRangeInput
          v-model="rangoPrecio"
          label="Precio"
          :min="0"
          :max="500"
          :step="10"
          :value-format="(v) => `${v} €`"
        />
        <span class="helper-text">{{ rangoPrecio[0] }} € – {{ rangoPrecio[1] }} €</span>
      </ZnBox>
    </ZnSection>

    <!-- SECCIÓN 6: RANGOS DE FECHA Y HORA -->
    <ZnSection title="6. Rangos de fecha y hora" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        Los tres selectores enlazan un par de valores y limitan cada campo con el otro
        (<code>max</code> del inicio = fin y <code>min</code> del fin = inicio). Muestran
        error si el valor final es anterior al inicial.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnDateRangeInput</span>
        <ZnDateRangeInput v-model="rangoFechas" start-label="Llegada" end-label="Salida" />
        <span class="helper-text">{{ rangoFechas[0] || '—' }} → {{ rangoFechas[1] || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnTimeRangeInput</span>
        <ZnTimeRangeInput v-model="rangoHoras" start-label="Apertura" end-label="Cierre" />
        <span class="helper-text">{{ rangoHoras[0] || '—' }} → {{ rangoHoras[1] || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">ZnDateTimeRangeInput</span>
        <ZnDateTimeRangeInput v-model="rangoFechaHora" start-label="Inicio" end-label="Fin" />
        <span class="helper-text">
          {{ rangoFechaHora[0] || '—' }} → {{ rangoFechaHora[1] || '—' }}
        </span>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../components/DemoView.vue'
import {
  ZnSection,
  ZnBox,
  ZnSelect,
  ZnSingleLineText,
  ZnMultilineText,
  ZnEmailInput,
  ZnPhoneInput,
  ZnDateInput,
  ZnTimeInput,
  ZnDateTimeInput,
  ZnRangeInput,
  ZnDateRangeInput,
  ZnTimeRangeInput,
  ZnDateTimeRangeInput
} from '@zn-apps/ui-core'

const nombre = ref('')
const comentarios = ref('')
const busqueda = ref('')
const correo = ref('')
const correoValido = ref(true)
const telefono = ref('')

const paises = [
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'es', label: 'España' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú' },
  { value: 'uy', label: 'Uruguay' }
]
const pais = ref(null)

const etiquetasDisponibles = ['Trabajo', 'Personal', 'Urgente', 'Archivado', 'Compartido']
const etiquetas = ref(['Trabajo'])

const fecha = ref('')
const hora = ref('')
const fechaHora = ref('')

const volumen = ref(45)
const rangoPrecio = ref([100, 350])
const rangoFechas = ref(['', ''])
const rangoHoras = ref(['09:00', '18:00'])
const rangoFechaHora = ref(['', ''])
</script>
