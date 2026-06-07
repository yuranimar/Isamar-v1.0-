import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.16 } } }

const HERO_IMAGES = ['/hero/hero1.jpg', '/hero/hero2.jpg', '/hero/hero3.jpg']

// Cada imagen comprueba si existe antes de mostrarla
function useValidImages(paths) {
  const [valid, setValid] = useState([])

  useEffect(() => {
    Promise.all(
      paths.map(
        src => new Promise(resolve => {
          const img = new Image()
          img.onload  = () => resolve(src)
          img.onerror = () => resolve(null)
          img.src = src
        })
      )
    ).then(results => setValid(results.filter(Boolean)))
  }, [])

  return valid
}

export default function Hero() {
  const images = useValidImages(HERO_IMAGES)
  const hasImages = images.length > 0

  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!hasImages || paused || images.length < 2) return
    timerRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % images.length)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [hasImages, paused, images.length])

  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#F8F0F0]"
      aria-label="Bienvenida a Isamar"
    >
      {/* Slider de imágenes */}
      <div className="absolute inset-0">
        {hasImages ? (
          images.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ scale: current === i ? 1.08 : 1, opacity: current === i ? 1 : 0 }}
              transition={{
                scale:   { duration: 10, ease: 'linear' },
                opacity: { duration: 2.5, ease: 'easeInOut' },
              }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden={current !== i}
            />
          ))
        ) : (
          /* Fondo decorativo cuando no hay imágenes todavía */
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg, #C5A059 0, #C5A059 1px, transparent 0, transparent 50%
              )`,
              backgroundSize: '24px 24px',
            }}
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F8F0F0]/60 backdrop-blur-[2px]" />

      {/* Círculos decorativos */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full border border-[#C5A059]/15 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-20 h-20 md:w-48 md:h-48 rounded-full border border-[#C5A059]/10 pointer-events-none translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8" />

      {/* Contenido */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-2xl pt-24 pb-16 md:pt-0 md:pb-0"
      >
        <motion.div variants={fadeUp}>
          <span className="inline-block text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] uppercase text-[#8B3A45] border border-[#8B3A45] px-6 py-2 mb-10">
            Tejidos Artesanales · Hecho a Mano
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-serif font-light text-[#4A1D23] leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.4rem, 8vw, 5.5rem)' }}
        >
          Cada hilo,
          <br />
          <em className="italic text-[#8B3A45]">una historia</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-serif italic text-[#4A1D23]/80 text-base md:text-lg mb-10 leading-relaxed"
        >
          Mantas y accesorios bordados con amor
          <br className="hidden sm:block" />
          {' '}para los momentos que más importan
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#catalog"
            className="px-8 py-3 bg-[#8B3A45] text-white hover:bg-[#4A1D23] transition-colors uppercase tracking-widest text-xs"
          >
            Ver Colección
          </a>
          <a
            href="#about"
            className="px-8 py-3 border border-[#8B3A45]/30 text-[#8B3A45] hover:bg-[#8B3A45]/5 transition-colors uppercase tracking-widest text-xs"
          >
            Nuestra Historia
          </a>
        </motion.div>
      </motion.div>

      {/* Controles del slider */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">

        {/* Botón pausa — accesibilidad WCAG 2.1 */}
        {hasImages && images.length > 1 && (
          <button
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Reanudar presentación' : 'Pausar presentación'}
            className="w-7 h-7 flex items-center justify-center border border-[#C5A059]/40 text-[#C5A059]/60 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors text-xs"
          >
            {paused ? '▶' : '⏸'}
          </button>
        )}

        {/* Indicadores de slide */}
        {hasImages && images.length > 1 && (
          <div className="flex gap-1.5" role="tablist" aria-label="Imágenes del hero">
            {images.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={current === i}
                aria-label={`Imagen ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  current === i
                    ? 'w-5 h-1.5 bg-[#C5A059]'
                    : 'w-1.5 h-1.5 bg-[#C5A059]/35 hover:bg-[#C5A059]/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        <div className="hidden sm:flex flex-col items-center gap-2 mt-1">
          <div className="w-px h-8 bg-gradient-to-b from-[#C5A059] to-transparent" />
          <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C5A059]/60">Scroll</span>
        </div>
      </div>
    </section>
  )
}
