/**
 * stockInfo(product)
 * Devuelve la información de urgencia de stock para mostrar en tarjeta y modal.
 *
 * Reglas:
 *  - stock null / undefined → ilimitado, sin etiqueta
 *  - stock 0 + status 'out' → Agotado (lo maneja el status, no el stock)
 *  - stock 1  → "¡Última unidad!"
 *  - stock 2  → "Últimas 2 unidades"
 *  - stock 3  → "Últimas 3 unidades"
 *  - stock ≥4 → sin etiqueta de urgencia
 */
export function stockInfo(product) {
  const s = product?.stock
  const isUnlimited = s === null || s === undefined
  const isOut       = product?.status === 'out' || s === 0

  if (isUnlimited || isOut || s >= 4) {
    return { show: false, label: null, level: null }
  }

  const label = s === 1 ? '¡Última unidad!' : `Últimas ${s} unidades`

  // level drive color: 'critical' (1 ud) → rojo/borgoña, 'low' (2-3) → dorado
  const level = s === 1 ? 'critical' : 'low'

  return { show: true, label, level, count: s }
}
