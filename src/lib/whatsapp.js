/**
 * whatsapp.js — Motor centralizado de mensajes WA
 * Genera mensajes naturales en español adaptados al contexto exacto.
 *
 * buildWhatsAppURL(product, context, options) → URL string
 * buildGeneralWA(message)                     → URL string
 *
 * Contextos: 'buy' | 'custom' | 'ask' | 'notify' | 'cart' | 'review'
 */

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '573001234567'

const CAT_LABEL = {
  mantas:        'manta',
  accesorios:    'accesorio',
  personalizados:'pieza personalizada',
}

// ── Helpers ─────────────────────────────────────────────────

function productLine(p) {
  const cat   = CAT_LABEL[p.category] || 'pieza'
  const price = p.price !== 'Consultar' ? ` — ${p.price}` : ''
  return `*${p.name}*${price} (${cat})`
}

function techDetails(p) {
  const lines = []
  if (p.material)     lines.push(`• Material: ${p.material}`)
  if (p.dimensions)   lines.push(`• Dimensiones: ${p.dimensions}`)
  if (p.deliveryTime) lines.push(`• Entrega: ${p.deliveryTime}`)
  return lines.join('\n')
}

function discountNote(p) {
  return p.originalPrice ? ` _(antes ${p.originalPrice})_` : ''
}

function stockNote(p) {
  const s = p.stock
  if (s === null || s === undefined || s >= 4) return ''
  if (s === 1) return '\n⚠️ _¡Es la última unidad!_'
  return `\n⚠️ _Solo quedan ${s} unidades._`
}

function clean(str) {
  return str.replace(/\n{3,}/g, '\n\n').trim()
}

// ── Mensajes por contexto ────────────────────────────────────

function msgBuy(p) {
  const details  = techDetails(p)
  const discount = discountNote(p)
  const stock    = stockNote(p)

  return clean([
    'Hola Isamar! 👋 Me interesa hacer un pedido:',
    '',
    productLine(p) + discount + stock,
    details ? `\n${details}` : '',
    '',
    '¿Está disponible? ¿Cómo coordinamos el pago y envío?',
  ].join('\n'))
}

function msgCustom(p) {
  return clean([
    'Hola Isamar! 👋 Me interesa una pieza personalizada:',
    '',
    `*${p.name}*`,
    '',
    'Quisiera hablar sobre:',
    '• Los colores que prefiero',
    '• El tamaño o dimensiones',
    '• Detalles especiales (nombre, fecha, diseño)',
    '',
    '¿Cuándo podemos coordinar los detalles?',
  ].join('\n'))
}

function msgAsk(p, question = '') {
  return clean([
    `Hola Isamar! 👋 Tengo una pregunta sobre *${p.name}*:`,
    '',
    question || '¿Me puedes dar más información sobre este producto?',
  ].join('\n'))
}

function msgNotify(p, name = '', phone = '') {
  const who = name ? `Soy ${name}` : 'Soy clienta'
  return clean([
    `Hola Isamar! 👋 ${who}.`,
    '',
    'Por favor avísame cuando esté disponible:',
    productLine(p),
    phone ? `\nMi contacto: ${phone}` : '',
    '',
    '¡Gracias! 🙏',
  ].join('\n'))
}

function msgCart(items = []) {
  if (!items.length) return 'Hola Isamar! 👋 Me gustaría hacer un pedido.'

  const lines = items.map(({ product, quantity }) => {
    const qty   = quantity > 1 ? ` × ${quantity}` : ''
    const price = product.price !== 'Consultar' ? `  —  ${product.price}` : '  —  Consultar'
    return `• ${product.name}${qty}${price}`
  })

  return clean([
    'Hola Isamar! 👋 Me gustaría hacer el siguiente pedido:',
    '',
    ...lines,
    '',
    '¿Cómo coordinamos el pago y el envío? 😊',
  ].join('\n'))
}

// ── Export principal ─────────────────────────────────────────

export function buildWhatsAppURL(product, context = 'buy', options = {}) {
  let text = ''

  switch (context) {
    case 'buy':    text = msgBuy(product);                                 break
    case 'custom': text = msgCustom(product);                              break
    case 'ask':    text = msgAsk(product, options.question);               break
    case 'notify': text = msgNotify(product, options.name, options.phone); break
    case 'cart':   text = msgCart(options.items);                          break
    case 'review': text = 'Hola Isamar! 👋 Quiero dejar una reseña 🌟';   break
    default:       text = msgBuy(product)
  }

  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

export function buildGeneralWA(msg = 'Hola Isamar! 👋 Me gustaría obtener más información.') {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
}
