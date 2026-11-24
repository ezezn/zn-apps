/** Datos de ejemplo para la galería de @zn-apps/ui-data-charts. */

/** Una fila por mes: formato simple (una categoría y un valor). */
export const monthlySales = [
  { month: 'Ene', sales: 32 },
  { month: 'Feb', sales: 45 },
  { month: 'Mar', sales: 38 },
  { month: 'Abr', sales: 52 },
  { month: 'May', sales: 61 },
  { month: 'Jun', sales: 48 },
]

/** Una columna por serie: formato ancho con varias series por categoría. */
export const channelSales = [
  { month: 'Ene', online: 22, store: 14 },
  { month: 'Feb', online: 28, store: 17 },
  { month: 'Mar', online: 24, store: 19 },
  { month: 'Abr', online: 34, store: 21 },
  { month: 'May', online: 41, store: 20 },
  { month: 'Jun', online: 37, store: 24 },
]

/** Una fila por canal: datos para pie y donut. */
export const visitsByChannel = [
  { channel: 'Email', visits: 420 },
  { channel: 'Búsqueda', visits: 610 },
  { channel: 'Redes', visits: 340 },
  { channel: 'Directo', visits: 180 },
]

/** Formato largo: la serie viene en una columna (`channel`). */
export const trafficRows = [
  { channel: 'Email', month: 'Ene', visits: 120 },
  { channel: 'Email', month: 'Feb', visits: 150 },
  { channel: 'Email', month: 'Mar', visits: 140 },
  { channel: 'Email', month: 'Abr', visits: 180 },
  { channel: 'Búsqueda', month: 'Ene', visits: 210 },
  { channel: 'Búsqueda', month: 'Feb', visits: 240 },
  { channel: 'Búsqueda', month: 'Mar', visits: 260 },
  { channel: 'Búsqueda', month: 'Abr', visits: 300 },
  { channel: 'Redes', month: 'Ene', visits: 90 },
  { channel: 'Redes', month: 'Feb', visits: 130 },
  { channel: 'Redes', month: 'Mar', visits: 150 },
  { channel: 'Redes', month: 'Abr', visits: 170 },
]

const channelSeries = [
  { key: 'online', label: 'Online' },
  { key: 'store', label: 'Tienda' },
]

/**
 * Payloads exactos de la galería: cada entrada es el `data` y el `config` que
 * recibe `ZnChart`. La página de datos muestra estos mismos objetos.
 */
export const chartExamples = [
  {
    key: 'bar',
    title: 'Barras verticales',
    description: 'Una fila por categoría; `category` y `value` indican qué propiedades leer.',
    data: monthlySales,
    config: {
      type: 'bar',
      category: 'month',
      value: 'sales',
      height: 260,
      seriesLabel: 'Ventas',
      valueLabel: 'Ventas',
      xAxis: { title: 'Mes' },
      yAxis: { title: 'Unidades' },
    },
  },
  {
    key: 'bars',
    title: 'Barras agrupadas y apiladas',
    description: 'Formato ancho: `series` lista las columnas que se dibujan como series. La galería alterna el `type` entre agrupadas y apiladas.',
    data: channelSales,
    config: {
      type: 'bar-grouped',
      category: 'month',
      series: channelSeries,
      height: 280,
      legend: true,
      xAxis: { title: 'Mes' },
      yAxis: { title: 'Unidades' },
    },
  },
  {
    key: 'line',
    title: 'Líneas con series en columnas',
    description: 'Varias series sobre el mismo eje; `curve` y `points` controlan la forma de la línea.',
    data: channelSales,
    config: {
      type: 'line-multi',
      category: 'month',
      series: ['online', 'store'],
      colors: ['#6750A4', '#B26A00'],
      curve: 'smooth',
      points: true,
      height: 280,
      yAxis: { title: 'Unidades' },
    },
  },
  {
    key: 'line-long',
    title: 'Líneas con series extraídas',
    description: 'Formato largo: `series` nombra la columna que contiene el nombre de cada serie, sin transformar los datos.',
    data: trafficRows,
    config: {
      type: 'line-multi',
      category: 'month',
      value: 'visits',
      series: 'channel',
      curve: 'smooth',
      points: true,
      height: 280,
      yAxis: { title: 'Visitas' },
    },
  },
  {
    key: 'area',
    title: 'Áreas',
    description: 'El relleno usa el color de cada serie con opacidad reducida; `area` superpone y `area-stacked` acumula.',
    data: channelSales,
    config: {
      type: 'area',
      category: 'month',
      series: channelSeries,
      curve: 'smooth',
      points: true,
      height: 280,
      yAxis: { title: 'Unidades' },
    },
  },
  {
    key: 'circular',
    title: 'Pie y donut',
    description: 'Una sola serie de valores coloreada por categoría; `colors` reemplaza la paleta y `donut` configura el centro.',
    data: visitsByChannel,
    config: {
      type: 'donut',
      category: 'channel',
      value: 'visits',
      height: 300,
      colors: ['#6750A4', '#006A6A', '#0061A4', '#B26A00'],
      donut: { totalLabel: 'Visitas', innerRadius: 0.62 },
      valueLabel: 'Visitas',
      percentLabel: 'Cuota',
    },
  },
]

/** Configuraciones reducidas para las miniaturas de `ZnChartShape`. */
export const shapeExamples = [
  {
    key: 'shape-bar',
    label: 'Barras',
    data: monthlySales,
    config: { type: 'bar', category: 'month', value: 'sales' },
  },
  {
    key: 'shape-bars-stacked',
    label: 'Barras apiladas',
    data: channelSales,
    config: { type: 'bar-stacked', category: 'month', series: ['online', 'store'] },
  },
  {
    key: 'shape-line',
    label: 'Líneas',
    data: channelSales,
    config: { type: 'line-multi', category: 'month', series: ['online', 'store'], curve: 'smooth' },
  },
  {
    key: 'shape-area',
    label: 'Áreas apiladas',
    data: channelSales,
    config: { type: 'area-stacked', category: 'month', series: ['online', 'store'], curve: 'smooth' },
  },
  {
    key: 'shape-pie',
    label: 'Pie',
    data: visitsByChannel,
    config: { type: 'pie', category: 'channel', value: 'visits' },
  },
  {
    key: 'shape-donut',
    label: 'Donut',
    data: visitsByChannel,
    config: { type: 'donut', category: 'channel', value: 'visits', donut: { innerRadius: 0.62 } },
  },
]
