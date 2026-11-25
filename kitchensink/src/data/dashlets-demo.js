/** Datos de ejemplo para la galería de @zn-apps/ui-data-dashlet. */

/** Contador de ejemplo: valor, label y subtítulo */
export const counterExample = {
  data: [{ value: 128 }],
  config: {
    value: 128,
    label: 'Usuarios',
    subtitle: 'Activos',
    icon: 'people',
    variant: 'primary',
    filled: true
  }
}

/** Resumen de ejemplo: dos filas */
export const summaryExample = {
  data: [{ value: 250, secondaryValue: 75 }],
  config: {
    value: 250,
    subtitle: 'Objetivo',
    secondaryValue: 75,
    secondaryLabel: 'Avance',
    secondarySubtitle: 'Progreso',
    variant: 'success',
    filled: true,
    layout: 'double-row'
  }
}

/** Ejemplo side-by-side */
export const sideBySideExample = {
  data: [{ value: 150, secondaryValue: 80 }],
  config: {
    value: 150,
    subtitle: 'Ventas',
    secondaryValue: 80,
    secondaryLabel: 'Meta',
    secondarySubtitle: 'Meta trimestral',
    variant: 'info',
    filled: true,
    layout: 'side-by-side'
  }
}

/** Variantes de color */
export const variantsExamples = [
  { key: 'primary', label: 'Primary', variant: 'primary' },
  { key: 'warning', label: 'Warning', variant: 'warning' },
  { key: 'info', label: 'Info', variant: 'info' },
  { key: 'success', label: 'Success', variant: 'success' },
  { key: 'error', label: 'Error', variant: 'error' },
  { key: 'neutral', label: 'Neutral', variant: 'neutral' }
]

/** Ejemplos de sparkline */
export const sparklineExamples = [
  {
    key: 'sparkline-primary',
    label: 'Sparkline primary',
    data: [{ data: [10, 15, 12, 20, 18] }],
    config: {
      data: [10, 15, 12, 20, 18],
      variant: 'primary',
      filled: true,
      height: 40,
      width: 120
    }
  },
  {
    key: 'sparkline-success',
    label: 'Sparkline success',
    data: [{ data: [5, 8, 12, 7, 10] }],
    config: {
      data: [5, 8, 12, 7, 10],
      variant: 'success',
      filled: true,
      height: 40,
      width: 120
    }
  }
]

/** Ejemplos de progress */
export const progressExamples = [
  {
    key: 'progress-primary',
    label: 'Progress primary',
    data: [{ value: 75 }],
    config: { value: 75, max: 100, variant: 'primary', filled: true, height: 8 }
  },
  {
    key: 'progress-success',
    label: 'Progress success',
    data: [{ value: 50 }],
    config: { value: 50, max: 100, variant: 'success', filled: true, height: 8 }
  }
]

/**
 * Payloads exactos de la galería: cada entrada es el `data` y el `config` que
 * recibe `ZnDashlet`, `ZnDashletCounter`, `ZnDashletSummary`, `ZnDashletSparkline` y
 * `ZnDashletProgress`. La página de datos muestra estos mismos objetos.
 */
export const dashletExamples = [
  {
    key: 'counter',
    title: 'Contador',
    description: 'Card de contador con ícono, número y subtítulo.',
    data: [{ value: 128 }],
    config: {
      value: 128,
      label: 'Usuarios',
      subtitle: 'Activos',
      icon: 'people',
      variant: 'primary',
      filled: true
    }
  },
  {
    key: 'summary',
    title: 'Resumen',
    description:
      'Card de resumen con dos filas: valor grande y subtítulo arriba, número menor abajo.',
    data: [{ value: 250, secondaryValue: 75 }],
    config: {
      value: 250,
      subtitle: 'Objetivo',
      secondaryValue: 75,
      secondaryLabel: 'Avance',
      secondarySubtitle: 'Progreso',
      variant: 'success',
      filled: true,
      layout: 'double-row'
    }
  },
  {
    key: 'side-by-side',
    title: 'Side-by-side',
    description: 'Dos valores uno al lado del otro en layout horizontal.',
    data: [{ value: 150, secondaryValue: 80 }],
    config: {
      value: 150,
      subtitle: 'Ventas',
      secondaryValue: 80,
      secondaryLabel: 'Meta',
      secondarySubtitle: 'Meta trimestral',
      variant: 'info',
      filled: true,
      layout: 'side-by-side'
    }
  },
  ...variantsExamples.map((v) => ({
    key: `variant-${v.key}`,
    title: `Variante ${v.label}`,
    description: 'Card de dashboard con la variante de color indicada.',
    data: [{ value: 100 }],
    config: {
      value: 100,
      label: v.label,
      icon: 'trending_up',
      variant: v.variant,
      filled: true
    }
  })),
  ...sparklineExamples.map((s) => ({
    key: s.key,
    title: s.label,
    description: 'Sparkline de tendencia con los datos y configuración indicados.',
    data: s.data,
    config: s.config
  })),
  ...progressExamples.map((p) => ({
    key: p.key,
    title: p.label,
    description: 'Barra de progreso con el valor y configuración indicados.',
    data: p.data,
    config: p.config
  }))
]

/** Configuraciones reducidas para las miniaturas de `ZnDashlet`. */
export const shapeExamples = [
  {
    key: 'shape-counter',
    label: 'Contador',
    data: [{ value: 128 }],
    config: {
      value: 128,
      label: 'Usuarios',
      subtitle: 'Activos',
      icon: 'people',
      variant: 'primary',
      filled: true
    }
  },
  {
    key: 'shape-summary',
    label: 'Resumen',
    data: [{ value: 250, secondaryValue: 75 }],
    config: {
      value: 250,
      subtitle: 'Objetivo',
      secondaryValue: 75,
      secondaryLabel: 'Avance',
      secondarySubtitle: 'Progreso',
      variant: 'success',
      filled: true,
      layout: 'double-row'
    }
  },
  {
    key: 'shape-side-by-side',
    label: 'Side-by-side',
    data: [{ value: 150, secondaryValue: 80 }],
    config: {
      value: 150,
      subtitle: 'Ventas',
      secondaryValue: 80,
      secondaryLabel: 'Meta',
      secondarySubtitle: 'Meta trimestral',
      variant: 'info',
      filled: true,
      layout: 'side-by-side'
    }
  },
  {
    key: 'shape-sparkline-primary',
    label: 'Sparkline primary',
    data: [{ data: [10, 15, 12, 20, 18] }],
    config: {
      data: [10, 15, 12, 20, 18],
      variant: 'primary',
      filled: true,
      height: 40,
      width: 120
    }
  },
  {
    key: 'shape-sparkline-success',
    label: 'Sparkline success',
    data: [{ data: [5, 8, 12, 7, 10] }],
    config: {
      data: [5, 8, 12, 7, 10],
      variant: 'success',
      filled: true,
      height: 40,
      width: 120
    }
  },
  {
    key: 'shape-progress-primary',
    label: 'Progress primary',
    data: [{ value: 75 }],
    config: { value: 75, max: 100, variant: 'primary', filled: true, height: 8 }
  },
  {
    key: 'shape-progress-success',
    label: 'Progress success',
    data: [{ value: 50 }],
    config: { value: 50, max: 100, variant: 'success', filled: true, height: 8 }
  }
]
