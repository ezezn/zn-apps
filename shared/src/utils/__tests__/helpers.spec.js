import { describe, it, expect } from 'vitest'
import { formatDate } from '../helpers.js'

describe('formatDate', () => {
  it('retorna string vacío si la fecha es nula o vacía', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
  })

  it('formatea correctamente una fecha en español', () => {
    const formatted = formatDate('2026-05-15T12:00:00Z')
    expect(formatted).toContain('2026')
    expect(formatted.toLowerCase()).toContain('mayo')
  })

  it('acepta una instancia de Date', () => {
    const date = new Date(2026, 0, 1) // 1 de enero de 2026
    const formatted = formatDate(date)
    expect(formatted).toContain('2026')
    expect(formatted.toLowerCase()).toContain('enero')
  })
})
