import { describe, expect, it } from 'vitest'
import {
  FieldTypes,
  InputSizes,
  InputVariants,
  clone,
  collectDefaults,
  fieldSpan,
  formatFieldValue,
  merge,
  normalizeInputSize,
  normalizeInputVariant,
  readAt,
  sectionColumns,
  withDefaults,
  writeAt
} from '../index.js'

describe('ui-data-core · objetos', () => {
  it('lee y escribe rutas anidadas sin mutar el original', () => {
    const source = { profile: { name: 'Ada' } }
    const next = writeAt(source, 'profile.contact.email', 'ada@example.com')

    expect(readAt(next, 'profile.contact.email')).toBe('ada@example.com')
    expect(source.profile.contact).toBeUndefined()
    expect(readAt(next, 'profile.name')).toBe('Ada')
  })

  it('clona y mezcla objetos profundos', () => {
    const base = { a: 1, nested: { b: 2, keep: true } }
    const copy = clone(base)
    copy.nested.b = 99

    expect(base.nested.b).toBe(2)
    expect(merge(base, { nested: { b: 3 } })).toEqual({
      a: 1,
      nested: { b: 3, keep: true }
    })
  })
})

describe('ui-data-core · esquema', () => {
  const schema = {
    sections: [
      {
        layout: 9,
        fields: [
          { path: 'name', type: FieldTypes.TEXT, default: 'Anonymous' },
          { path: 'contact.email', type: FieldTypes.EMAIL }
        ]
      }
    ]
  }

  it('recoge defaults anidados', () => {
    expect(collectDefaults(schema)).toEqual({ name: 'Anonymous' })
  })

  it('aplica defaults sin pisar el valor inicial', () => {
    expect(withDefaults(schema, { name: 'Ada' })).toEqual({ name: 'Ada' })
    expect(withDefaults(schema, null)).toEqual({ name: 'Anonymous' })
  })

  it('limita las columnas del layout a 1..4', () => {
    expect(sectionColumns({ layout: 9 })).toBe(4)
    expect(sectionColumns({})).toBe(1)
  })

  it('resuelve field.span dentro de las columnas de la sección', () => {
    expect(fieldSpan({ span: 2 }, 2)).toBe(2)
    expect(fieldSpan({ span: 3 }, 2)).toBe(2)
    expect(fieldSpan({}, 2)).toBe(1)
    expect(fieldSpan({ span: 0 }, 2)).toBe(1)
    expect(fieldSpan({ span: 2 }, 4)).toBe(2)
  })
})

describe('ui-data-core · presentación de inputs', () => {
  it('expone las variantes MD3 y normaliza valores desconocidos', () => {
    expect(InputVariants).toEqual({ OUTLINED: 'outlined', FILLED: 'filled' })
    expect(normalizeInputVariant('filled')).toBe('filled')
    expect(normalizeInputVariant('flat')).toBe('outlined')
    expect(normalizeInputVariant(undefined, 'filled')).toBe('filled')
  })

  it('expone los tamaños MD3 y normaliza valores desconocidos', () => {
    expect(InputSizes).toEqual({ SMALL: 'small', MEDIUM: 'medium', LARGE: 'large' })
    expect(normalizeInputSize('large')).toBe('large')
    expect(normalizeInputSize('xl')).toBe('medium')
    expect(normalizeInputSize(null, 'small')).toBe('small')
  })
})

describe('ui-data-core · formato', () => {
  const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' }
  ]

  it('formatea selects simples y múltiples', () => {
    expect(formatFieldValue({ type: FieldTypes.SELECT, options }, 'a')).toBe('Alpha')
    expect(formatFieldValue({ type: FieldTypes.MULTI_SELECT, options }, ['a', 'b'])).toBe('Alpha, Beta')
  })

  it('formatea listas libres de valores', () => {
    expect(formatFieldValue({ type: FieldTypes.LIST }, ['md3', 'chips'])).toBe('md3, chips')
    expect(formatFieldValue({ type: FieldTypes.LIST }, [])).toBe('—')
    expect(formatFieldValue({ type: FieldTypes.LIST }, ['a'], { separator: ' | ' })).toBe('a')
  })

  it('formatea richtext a texto plano y declara el tipo', () => {
    expect(FieldTypes.RICHTEXT).toBe('richtext')
    expect(formatFieldValue({ type: FieldTypes.RICHTEXT }, '## Título\n\n**Texto**')).toBe('Título Texto')
    expect(formatFieldValue({ type: FieldTypes.RICHTEXT }, '')).toBe('—')
  })

  it('formatea booleanos y valores vacíos', () => {
    expect(formatFieldValue({ type: FieldTypes.SWITCH }, true)).toBe('Yes')
    expect(formatFieldValue({ type: FieldTypes.TEXT }, null)).toBe('—')
    expect(formatFieldValue({ type: FieldTypes.TEXT }, '', { emptyText: 'N/A' })).toBe('N/A')
  })
})
