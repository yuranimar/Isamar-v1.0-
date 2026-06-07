import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildGeneralWA } from '../lib/whatsapp'

// ── Datos de envío ──────────────────────────────────────────
const SHIPPING_ZONES = [
  {
    zone: 'Medellín y Área Metropolitana',
    time: '1–2 días hábiles',
    price: '$8.000',
    icon: '🏙️',
  },
  {
    zone: 'Principales ciudades',
    detail: 'Bogotá, Cali, Barranquilla, Cartagena, Pereira',
    time: '3–5 días hábiles',
    price: '$12.000',
    icon: '📦',
  },
  {
    zone: 'Resto de Colombia',
    time: '5–8 días hábiles',
    price: '$15.000',
    icon: '🗺️',
  },
  {
    zone: 'Personalizado / Urgente',
    detail: 'Consultar disponibilidad',
    time: 'A coordinar',
    price: 'Consultar',
    icon: '⚡',
  },
]

// ── Preguntas frecuentes ────────────────────────────────────
const FAQS = [
  {
    q: '¿Cuánto tiempo tarda un producto personalizado?',
    a: 'Los productos personalizados toman entre 7 y 12 días hábiles dependiendo de la complejidad del bordado y el diseño. Te confirmaré el tiempo exacto por WhatsApp una vez hablemos de tu pedido.',
  },
  {
    q: '¿Cómo se hacen los pagos?',
    a: 'Aceptamos Nequi, Daviplata, transferencia bancaria y pago contraentrega (disponible en algunas ciudades). Una vez acordemos el pedido te envío los datos por WhatsApp.',
  },
  {
    q: '¿Puedo elegir los colores de mi pieza?',
    a: 'Sí, todos mis productos personalizados se hacen según tu paleta de colores. Para las piezas de catálogo también puedo hacer variaciones de color bajo pedido — pregúntame.',
  },
  {
    q: '¿Hacen cambios o devoluciones?',
    a: 'Para productos del catálogo acepto cambios dentro de los 5 días siguientes a la entrega, siempre que el artículo esté en perfectas condiciones. Los personalizados no tienen cambio por ser únicos, así que hablo contigo en detalle antes de empezar.',
  },
  {
    q: '¿Los materiales son de buena calidad?',
    a: 'Trabajo exclusivamente con hilos de calidad artesanal: merino, lana natural y algodón premium, elegidos por su suavidad y durabilidad. En cada producto te indico el material exacto.',
  },
  {
    q: '¿Hacen envíos internacionales?',
    a: 'Por ahora solo enviamos dentro de Colombia. Si estás en el exterior y quieres una pieza, escríbeme y buscamos una solución.',
  },
  {
    q: '¿Cómo cuido mi manta o tejido?',
    a: 'La mayoría de piezas se lavan a mano en agua fría con jabón neutro y se secan a la sombra. En cada producto encontrarás las instrucciones específicas de cuidado.',
  },
  {
    q: '¿Puedo ver más fotos de un producto antes de comprar?',
    a: '¡Claro! Escríbeme por WhatsApp con el nombre del producto y con gusto te envío fotos adicionales, videos del proceso o muestras de colores disponibles.',
  },
]

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-gold/18 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-4 md:py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`font-serif text-[0.97rem] md:text-[1.02rem] leading-snug transition-colors duration-200 ${
          isOpen ? 'text-burgundy' : 'text-brown group-hover:text-burgundy'
        }`}>
          {item.q}
        </span>
        <span className={`flex-shrink-0 w-5 h-5 border rounded-full flex items-center justify-center text-xs transition-all duration-300 mt-0.5 ${
          isOpen
            ? 'border-burgundy text-burgundy bg-rose/60 rotate-45'
            : 'border-brown/25 text-brown/45 group-hover:border-gold group-hover:text-gold'
        }`}>
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-serif italic text-[0.94rem] leading-relaxed text-brown/70 pb-5 pr-8">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqShipping() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = i => setOpenIndex(prev => prev === i ? null : i)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="px-4 sm:px-6 lg:px-16 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-12 md:mb-16">
          <span className="section-tag">Todo lo que necesitas saber</span>
          <h2 className="section-title">Envíos y <em className="italic">Preguntas frecuentes</em></h2>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── COLUMNA IZQUIERDA: Envíos ── */}
          <div>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-6">
              Política de envíos
            </p>

            {/* Tabla de zonas */}
            <div className="space-y-3 mb-8">
              {SHIPPING_ZONES.map((z, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="border border-gold/18 p-4 flex items-start gap-3 hover:border-gold/40 transition-colors"
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{z.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[0.78rem] font-medium text-brown mb-0.5">{z.zone}</p>
                    {z.detail && (
                      <p className="text-[0.65rem] text-brown/45 mb-1">{z.detail}</p>
                    )}
                    <p className="text-[0.65rem] tracking-wide text-brown/55">⏱ {z.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif text-burgundy text-[0.95rem]">{z.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Notas de envío */}
            <div className="bg-rose/40 border border-gold/20 p-5 space-y-2.5">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mb-3">Importante</p>
              {[
                'El envío se realiza una vez confirmado y pagado el pedido.',
                'Trabajamos con transportadoras nacionales: Servientrega, Coordinadora e Interrapidísimo.',
                'Te envío el número de guía por WhatsApp para que puedas rastrear tu paquete.',
                'Pago contraentrega disponible en Medellín y área metropolitana.',
                'El empaque es con cuidado y cariño — tus piezas llegan protegidas y listas para regalar.',
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 flex-shrink-0 text-xs">◆</span>
                  <p className="font-serif italic text-[0.87rem] text-brown/70 leading-snug">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUMNA DERECHA: FAQ ── */}
          <div>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-6">
              Preguntas frecuentes
            </p>

            <div>
              {FAQS.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>

            {/* CTA si no encontró respuesta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 p-5 border border-gold/22 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-[1rem] text-brown mb-0.5">¿No encontraste tu respuesta?</p>
                <p className="text-[0.68rem] tracking-wide text-brown/45 italic font-serif">
                  Escríbeme directamente, respondo rápido.
                </p>
              </div>
              <a
                href={buildGeneralWA('Hola Isamar! 👋 Tengo una pregunta sobre un pedido')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 text-center"
              >
                Preguntar
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
