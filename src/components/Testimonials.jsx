import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IsamarLogo from './IsamarLogo'
import { useTestimonials } from '../hooks/useTestimonials'
import { urlFor } from '../lib/sanity'
import { buildWhatsAppURL } from '../lib/whatsapp'

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className={`w-3.5 h-3.5 ${i < count ? 'fill-gold' : 'fill-brown/15'}`}>
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z"/>
        </svg>
      ))}
    </div>
  )
}

function Avatar({ t }) {
  const photoUrl = t.photo ? urlFor(t.photo) : null
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={t.name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-rose flex items-center justify-center flex-shrink-0 border border-gold/20">
      <span className="font-serif text-[0.68rem] font-semibold text-burgundy">{t.initials}</span>
    </div>
  )
}

function TestimonialCard({ t, isActive }) {
  return (
    <motion.article
      layout
      className={`bg-white border transition-all duration-500 p-6 md:p-7 flex flex-col gap-4 h-full ${
        isActive
          ? 'border-gold/50 shadow-[0_4px_28px_rgba(212,175,55,0.13)]'
          : 'border-gold/15'
      }`}
    >
      {/* Comillas decorativas */}
      <div className="font-serif text-5xl text-gold/22 leading-none select-none -mb-2" aria-hidden="true">"</div>

      {/* Texto */}
      <p className="font-serif italic text-[0.97rem] md:text-[1.02rem] text-brown/78 leading-relaxed flex-1">
        {t.text}
      </p>

      {/* Etiqueta de producto */}
      {t.product && (
        <span className="self-start text-[0.56rem] tracking-[0.16em] uppercase text-gold border border-gold/32 px-2.5 py-1">
          {t.product}
        </span>
      )}

      {/* Autor */}
      <div className="flex items-center gap-3 pt-3 border-t border-gold/15">
        <Avatar t={t} />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[0.77rem] font-medium text-brown truncate">{t.name}</p>
          {t.city && <p className="text-[0.62rem] text-brown/42 tracking-wider">{t.city}</p>}
        </div>
        <StarRating count={t.rating} />
      </div>
    </motion.article>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gold/10 p-6 md:p-7 flex flex-col gap-4 animate-pulse">
      <div className="w-8 h-8 bg-rose rounded" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-rose rounded w-full" />
        <div className="h-3 bg-rose rounded w-5/6" />
        <div className="h-3 bg-rose rounded w-4/5" />
        <div className="h-3 bg-rose rounded w-3/4" />
      </div>
      <div className="h-5 bg-rose rounded w-1/3" />
      <div className="flex items-center gap-3 pt-3 border-t border-gold/10">
        <div className="w-9 h-9 rounded-full bg-rose" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-rose rounded w-24" />
          <div className="h-2.5 bg-rose rounded w-16" />
        </div>
        <div className="flex gap-0.5">
          {Array.from({length:5}).map((_,i)=>(
            <div key={i} className="w-3.5 h-3.5 bg-rose rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials()
  const [active, setActive]       = useState(0)
  const [paused, setPaused]       = useState(false)
  const intervalRef               = useRef(null)
  const total                     = testimonials.length || 1

  // Auto-avance cada 5s
  useEffect(() => {
    if (paused || loading) return
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % total)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [paused, loading, total])

  const goTo = i => {
    setActive(i)
    setPaused(true)
    clearInterval(intervalRef.current)
    setTimeout(() => setPaused(false), 8000)
  }

  const prev = () => goTo((active - 1 + total) % total)
  const next = () => goTo((active + 1) % total)

  const getVisible = () => {
    if (total < 3) return [active]
    const p = (active - 1 + total) % total
    const n = (active + 1) % total
    return [p, active, n]
  }

  return (
    <section className="py-16 md:py-24 bg-cream overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 sm:px-6 lg:px-16 mb-10 md:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="section-tag">Clientas felices</span>
            <h2 className="section-title">Lo que dicen <em className="italic">de nosotras</em></h2>
            <div className="divider" />
          </div>

          {/* Rating global */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 pb-1"
          >
            <IsamarLogo size={32} />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl text-burgundy font-light">5.0</span>
                <StarRating count={5} />
              </div>
              <p className="text-[0.6rem] tracking-[0.14em] uppercase text-brown/42 mt-0.5">
                {loading ? '…' : `${total} reseñas verificadas`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE: una tarjeta ── */}
      <div className="md:hidden">
        {loading ? (
          <div className="px-4 sm:px-6"><SkeletonCard /></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="px-4 sm:px-6"
            >
              <TestimonialCard t={testimonials[active]} isActive />
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex items-center justify-between px-4 sm:px-6 mt-5">
          <button onClick={prev} aria-label="Testimonio anterior"
            className="w-9 h-9 border border-gold/35 flex items-center justify-center text-brown/45 hover:border-gold hover:text-burgundy transition-all text-lg"
          >‹</button>

          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Reseña ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === active ? 'w-5 h-1.5 bg-burgundy' : 'w-1.5 h-1.5 bg-brown/18 hover:bg-brown/38'
                }`}
              />
            ))}
          </div>

          <button onClick={next} aria-label="Testimonio siguiente"
            className="w-9 h-9 border border-gold/35 flex items-center justify-center text-brown/45 hover:border-gold hover:text-burgundy transition-all text-lg"
          >›</button>
        </div>
      </div>

      {/* ── DESKTOP: 3 tarjetas ── */}
      <div className="hidden md:block px-8 lg:px-16">
        {loading ? (
          <div className="grid grid-cols-3 gap-5 lg:gap-7">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 lg:gap-7 items-start">
            {getVisible().map((tIdx, pos) => (
              <motion.div
                key={tIdx}
                animate={{
                  opacity: pos === 1 ? 1 : 0.52,
                  scale:   pos === 1 ? 1 : 0.97,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => pos !== 1 && goTo(tIdx)}
                className={pos !== 1 ? 'cursor-pointer' : ''}
              >
                <TestimonialCard t={testimonials[tIdx]} isActive={pos === 1} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={prev} aria-label="Anterior"
            className="w-9 h-9 border border-gold/35 flex items-center justify-center text-brown/45 hover:border-gold hover:text-burgundy transition-all text-lg"
          >‹</button>

          <div className="flex gap-2.5">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Reseña ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === active ? 'w-6 h-1.5 bg-burgundy' : 'w-1.5 h-1.5 bg-brown/18 hover:bg-brown/38'
                }`}
              />
            ))}
          </div>

          <button onClick={next} aria-label="Siguiente"
            className="w-9 h-9 border border-gold/35 flex items-center justify-center text-brown/45 hover:border-gold hover:text-burgundy transition-all text-lg"
          >›</button>
        </div>
      </div>

      {/* ── CTA inferior ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-12 md:mt-16 mx-4 sm:mx-6 lg:mx-16 border-t border-gold/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p className="font-serif italic text-brown/52 text-sm md:text-base text-center sm:text-left">
          ¿Ya tienes una pieza Isamar?{' '}
          <span className="text-burgundy not-italic">Tu opinión importa.</span>
        </p>
        <a
          href={buildWhatsAppURL(null, 'review')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-[0.65rem] flex-shrink-0"
        >
          Dejar mi reseña
        </a>
      </motion.div>

    </section>
  )
}
