/**
 * @zn-apps/ui-data-core
 *
 * Utilidades compartidas por `ui-data-form`, `ui-data-view` y `ui-data-editor`.
 * No depende de Vue ni del DOM: sólo manipula objetos JSON y describe el
 * contrato del esquema (`schema`) y de los valores (`value`).
 */

export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function clone(value) {
  if (Array.isArray(value)) return value.map(clone)
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]))
  }
  return value
}

export function merge(base, override) {
  if (!isObject(base)) return clone(override)
  const result = clone(base)
  if (!isObject(override)) return result

  for (const [key, value] of Object.entries(override)) {
    result[key] = isObject(result[key]) && isObject(value)
      ? merge(result[key], value)
      : clone(value)
  }
  return result
}

export function pathParts(path) {
  if (Array.isArray(path)) return path.map(String).filter(Boolean)
  if (typeof path !== 'string') return []
  return path.split('.').map((part) => part.trim()).filter(Boolean)
}

export function readAt(object, path) {
  const parts = pathParts(path)
  return parts.reduce((value, part) => value == null ? undefined : value[part], object)
}

/**
 * Devuelve una copia del objeto con el valor escrito en `path`.
 * Crea los objetos intermedios que falten; nunca muta la entrada.
 */
export function writeAt(object, path, value) {
  const parts = pathParts(path)
  if (!parts.length) return clone(value)
  const result = clone(object || {})
  let cursor = result
  parts.slice(0, -1).forEach((part) => {
    if (!isObject(cursor[part])) cursor[part] = {}
    cursor = cursor[part]
  })
  cursor[parts.at(-1)] = clone(value)
  return result
}

/** Tipos de campo soportados por el renderizador de `ui-data-form`. */
export const FieldTypes = Object.freeze({
  TEXT: 'text',
  TEXTAREA: 'textarea',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  SELECT: 'select',
  MULTI_SELECT: 'multi-select',
  /** Lista libre de valores escalares (tags), sin `options` predefinidas. */
  LIST: 'list',
  /** Texto enriquecido almacenado como Markdown. */
  RICHTEXT: 'richtext',
  SWITCH: 'switch',
  CHECKBOX: 'checkbox',
  RANGE: 'range'
})

/** Columnas del layout de una sección. */
export const LayoutColumns = Object.freeze({
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4
})

/** Posición de la etiqueta en `ui-data-view` / `ui-data-editor`. */
export const LabelPositions = Object.freeze({
  TOP: 'top',
  INLINE: 'inline'
})

/** Variantes MD3 de los campos de entrada. */
export const InputVariants = Object.freeze({
  OUTLINED: 'outlined',
  FILLED: 'filled'
})

/** Tamaños MD3 de los campos de entrada (`small` = densidad -2, 48px). */
export const InputSizes = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
})

export function normalizeInputVariant(value, fallback = InputVariants.OUTLINED) {
  return Object.values(InputVariants).includes(value) ? value : fallback
}

export function normalizeInputSize(value, fallback = InputSizes.MEDIUM) {
  return Object.values(InputSizes).includes(value) ? value : fallback
}

/* --------------------------------------------------------------------------
   Esquema (schema)
   -------------------------------------------------------------------------- */

/** Secciones declaradas en un esquema (tolerante a esquemas incompletos). */
export function schemaSections(schema) {
  return Array.isArray(schema?.sections) ? schema.sections.filter(Boolean) : []
}

/** Lista plana de todos los campos del esquema. */
export function schemaFields(schema) {
  return schemaSections(schema).flatMap((section) =>
    Array.isArray(section.fields) ? section.fields.filter(Boolean) : []
  )
}

/** Columnas efectivas de una sección (1 por defecto, limitado a 1..4). */
export function sectionColumns(section) {
  const columns = Number(section?.layout ?? section?.columns ?? LayoutColumns.ONE)
  if (!Number.isFinite(columns)) return LayoutColumns.ONE
  return Math.min(LayoutColumns.FOUR, Math.max(LayoutColumns.ONE, Math.round(columns)))
}

/**
 * Columnas que ocupa un campo dentro de su sección (`field.span`).
 * Se limita a las columnas efectivas de la sección y nunca es menor que 1.
 */
export function fieldSpan(field, columns = LayoutColumns.FOUR) {
  const effectiveColumns = Math.min(
    LayoutColumns.FOUR,
    Math.max(LayoutColumns.ONE, Number(columns) || LayoutColumns.ONE)
  )
  const span = Number(field?.span ?? 1)
  if (!Number.isFinite(span)) return LayoutColumns.ONE
  return Math.min(effectiveColumns, Math.max(LayoutColumns.ONE, Math.round(span)))
}

/** Construye un objeto con los valores `default` declarados en el esquema. */
export function collectDefaults(schema) {
  let data = {}
  for (const field of schemaFields(schema)) {
    if (field.path && Object.prototype.hasOwnProperty.call(field, 'default')) {
      data = writeAt(data, field.path, field.default)
    }
  }
  return data
}

/**
 * Combina los valores por defecto del esquema con un valor inicial.
 * El valor recibido tiene prioridad sobre los defaults.
 */
export function withDefaults(schema, value) {
  return merge(collectDefaults(schema), value)
}

/* --------------------------------------------------------------------------
   Formato de valores (ui-data-view / ui-data-editor)
   -------------------------------------------------------------------------- */

/** Normaliza opciones `primitivas` o `{ value, label }` a `{ value, label }`. */
export function normalizeOptions(options) {
  if (!Array.isArray(options)) return []
  return options.map((option) => {
    if (option !== null && typeof option === 'object') {
      return {
        value: option.value,
        label: option.label ?? String(option.value),
        disabled: Boolean(option.disabled)
      }
    }
    return { value: option, label: String(option), disabled: false }
  })
}

export function optionLabel(options, value) {
  const match = normalizeOptions(options).find((option) => option.value === value)
  return match ? match.label : value == null ? '' : String(value)
}

function isEmptyValue(value) {
  return value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0)
}

/**
 * Texto de presentación de un valor según su configuración de campo.
 *
 * @param {object} field Configuración del campo (`type`, `options`, ...).
 * @param {*} value Valor actual.
 * @param {object} [options] Textos de sustitución (i18n / preferencias).
 * @returns {string}
 */
export function formatFieldValue(field = {}, value, options = {}) {
  const {
    emptyText = '—',
    trueText = 'Yes',
    falseText = 'No',
    separator = ', '
  } = options

  if (isEmptyValue(value)) return emptyText

  const type = field.type

  if (type === FieldTypes.SELECT) {
    return optionLabel(field.options, value)
  }

  if (type === FieldTypes.MULTI_SELECT) {
    const values = Array.isArray(value) ? value : [value]
    if (values.length === 0) return emptyText
    return values.map((item) => optionLabel(field.options, item)).join(separator)
  }

  if (type === FieldTypes.LIST) {
    const values = Array.isArray(value) ? value : [value]
    if (values.length === 0) return emptyText
    return values.map((item) => String(item)).join(separator)
  }

  if (type === FieldTypes.RICHTEXT) {
    return String(value)
      .replace(/<[^>]+>/g, ' ')
      .replace(/[`*_~#>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  if (type === FieldTypes.RANGE && Array.isArray(value)) {
    return value.join(' – ')
  }

  if (type === FieldTypes.SWITCH || type === FieldTypes.CHECKBOX || typeof value === 'boolean') {
    return value ? trueText : falseText
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  return String(value)
}
