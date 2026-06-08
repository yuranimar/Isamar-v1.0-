import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

/*
  Fuente — añadir en index.html:
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Lora:ital,wght@0,400;1,500;1,600&display=swap" rel="stylesheet">
*/

/* ─── Paleta original ────────────────────────────────────────────────────── */
const C = {
  bg:         '#F8F0F0',
  gold:       '#C5A059',
  goldBright: '#F5D98B',
  wine:       '#8B3A45',
  wineDark:   '#4A1D23',
  ink:        '#2F0F15',   // texto principal
  inkMid:     '#5C2A32',   // subtítulo — más oscuro que antes para mejor lectura
  thread:     '#C5A059',
}

/* ─────────────────────────────────────────────────────────────────────────
   ArtisanButton
   Forma artesanal: esquinas con "pespunte" SVG + hilo que se traza al hover
   variant="filled"  → fondo vino, texto crema
   variant="outline" → transparente, borde vino punteado
   ───────────────────────────────────────────────────────────────────────── */
function ArtisanButton({ href, children, variant = 'filled' }) {
  const [hovered, setHovered] = useState(false)

  const isFilled = variant === 'filled'

  // Dimensiones del borde SVG — se adaptan al contenido vía padding fijo
  const W = 220
  const H = 48
  const R = 4          // radio de esquina
  const DASH = 6        // largo de cada guión del pespunte
  const GAP  = 4        // espacio entre guiones
  // Perímetro total del rectángulo redondeado (aprox)
  const perimeter = 2 * (W - 2 * R) + 2 * (H - 2 * R) + 2 * Math.PI * R

  return (
    <motion.a
      href={href}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: W,
        height: H,
        background: isFilled
          ? (hovered ? C.wineDark : C.wine)
          : (hovered ? `${C.gold}18` : 'transparent'),
        color: isFilled ? '#FFF5F5' : C.gold,
        fontFamily: "'Lora', serif",
        fontSize: '0.68rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s, color 0.3s',
        // sombra suave en filled
        boxShadow: isFilled
          ? (hovered ? `0 6px 24px ${C.wine}66` : `0 3px 14px ${C.wine}33`)
          : 'none',
      }}
    >
      {/* SVG de borde artesanal con pespunte */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W} height={H}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        {/* Marco base — línea continua fina */}
        <rect
          x="1" y="1" width={W - 2} height={H - 2} rx={R} ry={R}
          fill="none"
          stroke={isFilled ? `${C.goldBright}55` : `${C.gold}90`}
          strokeWidth="1"
        />
        {/* Pespunte — línea punteada encima, ligeramente desplazada */}
        <rect
          x="5" y="5" width={W - 10} height={H - 10} rx={R} ry={R}
          fill="none"
          stroke={isFilled ? `${C.goldBright}40` : `${C.gold}50`}
          strokeWidth="1"
          strokeDasharray={`${DASH} ${GAP}`}
        />
        {/* Hilo de hover — traza el borde exterior al pasar el cursor */}
        <motion.rect
          x="1" y="1" width={W - 2} height={H - 2} rx={R} ry={R}
          fill="none"
          stroke={isFilled ? C.goldBright : C.gold}
          strokeWidth="1.5"
          strokeDasharray={perimeter}
          animate={{ strokeDashoffset: hovered ? 0 : perimeter }}
          initial={{ strokeDashoffset: perimeter }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />
        {/* Pequeñas cruces en las esquinas — como puntos de bordado */}
        {[
          [8, 8], [W - 8, 8], [8, H - 8], [W - 8, H - 8]
        ].map(([cx, cy], i) => (
          <g key={i} stroke={isFilled ? `${C.goldBright}70` : `${C.gold}80`} strokeWidth="1">
            <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} />
            <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} />
          </g>
        ))}
      </svg>

      {/* Texto del botón */}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </motion.a>
  )
}

/* ─── Variantes ──────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
}

/* ─── Imágenes ───────────────────────────────────────────────────────────── */
const HERO_IMAGES = ['/hero/hero1.jpg', '/hero/hero2.jpg', '/hero/hero3.jpg']

/* ─────────────────────────────────────────────────────────────────────────
   EmbroideredChar
   Cada letra "entra" como si la aguja la bordara desde arriba:
   · clipPath top→bottom (la tela cede)
   · bounce suave en Y (tensión del hilo)
   · destello dorado breve (punta metálica de la aguja)
   ───────────────────────────────────────────────────────────────────────── */
function EmbroideredChar({ char, delay, color }) {
  if (char === ' ') return <span style={{ display: 'inline-block', width: '0.26em' }} />

  // Eliminamos clipPath y usamos una entrada con opacidad y un ligero deslizamiento
  const stitch = {
    hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const needle = {
    hidden: { opacity: 0, scale: 0.2 },
    show: {
      opacity: [0, 1, 0],
      scale:   [0.2, 1.8, 0],
      transition: { delay, duration: 0.4, ease: 'easeOut', times: [0, 0.2, 1] }
    }
  }

  return (
    <span style={{ position: 'relative', display: 'inline-block', overflow: 'visible' }}>
      <motion.span
        variants={needle} initial="hidden" animate="show"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 3,
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%', display: 'block',
          background: C.gold,
          boxShadow: `0 0 8px 2px ${C.gold}66`,
        }} />
      </motion.span>
      <motion.span
        variants={stitch} initial="hidden" animate="show"
        style={{ 
          display: 'inline-block', 
          color, 
          position: 'relative', 
          zIndex: 1,
          // Aseguramos que no haya cortes en los bordes
          willChange: 'transform, opacity' 
        }}
      >
        {char}
      </motion.span>
    </span>
  )
}

function EmbroideredText({ text, color, baseDelay = 0, staggerSec = 0.075 }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <EmbroideredChar key={i} char={char} color={color} delay={baseDelay + i * staggerSec} />
      ))}
    </>
  )
}

/* ─── Hilo que avanza bajo cada línea ───────────────────────────────────── */
function ThreadLine({ totalChars, baseDelay = 0, staggerSec = 0.075 }) {
  const duration = totalChars * staggerSec + 0.2
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 0.7 }}
      transition={{ delay: baseDelay, duration, ease: 'linear' }}
      style={{
        position: 'absolute', left: 0, bottom: '-4px',
        width: '100%', height: '2px',
        background: `linear-gradient(90deg, transparent, ${C.thread} 8%, ${C.thread} 92%, transparent)`,
        transformOrigin: 'left center',
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─── SVG: trama de tejido artesanal ─────────────────────────────────────── */
function WovenPattern() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="weave" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect x="0"  y="0"  width="7"  height="2" fill={C.wine} />
          <rect x="7"  y="7"  width="7"  height="2" fill={C.wine} />
          <rect x="0"  y="4"  width="2"  height="7" fill={C.gold} />
          <rect x="7"  y="11" width="2"  height="3" fill={C.gold} />
          <rect x="7"  y="0"  width="2"  height="3" fill={C.gold} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave)" />
    </svg>
  )
}

/* ─── Hook: solo imágenes que cargan ─────────────────────────────────────── */
function useValidImages(paths) {
  const [valid, setValid] = useState([])
  const ref = useRef(paths)
  useEffect(() => {
    Promise.all(ref.current.map(src =>
      new Promise(r => { const i = new Image(); i.onload = () => r(src); i.onerror = () => r(null); i.src = src })
    )).then(res => setValid(res.filter(Boolean)))
  }, [])
  return valid
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const images    = useValidImages(HERO_IMAGES)
  const hasImages = images.length > 0
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef = useRef(null)

  const LINE1 = 'Cada hilo,'
  const LINE2 = 'una historia'
  const line2Delay = 0.4 + LINE1.length * 0.075 + 0.15

  useEffect(() => {
    if (!hasImages || paused || images.length < 2) return
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % images.length), 6000)
    return () => clearInterval(timerRef.current)
  }, [hasImages, paused, images.length])

  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      style={{ background: C.bg }}
      aria-label="Bienvenida a Isamar"
    >

      {/* ── Fondo: slider o trama tejida ───────────────────────────────── */}
      <div className="absolute inset-0">
        {hasImages
          ? images.map((src, i) => (
              <motion.div
                key={src}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
                initial={{ opacity: 0 }}
                animate={{ scale: current === i ? 1.07 : 1, opacity: current === i ? 1 : 0 }}
                transition={{
                  scale:   { duration: 10,  ease: 'linear'    },
                  opacity: { duration: 2.5, ease: 'easeInOut' }
                }}
              />
            ))
          : <WovenPattern />
        }
      </div>

      {/* ── Overlay: viñeta cálida para dar profundidad ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%,
              transparent 20%,
              ${C.bg}88 60%,
              ${C.bg}DD 100%
            ),
            linear-gradient(180deg, ${C.bg}99 0%, transparent 30%, transparent 70%, ${C.bg}BB 100%)
          `,
          backdropFilter: hasImages ? 'blur(1px)' : 'none',
        }}
      />

      {/* ── Decoración: aros concéntricos visibles ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* aro grande derecha */}
        <div style={{
          position: 'absolute', top: '15%', right: '-8%',
          width: 420, height: 420, borderRadius: '50%',
          border: `1.5px solid ${C.gold}40`,
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '-8%',
          width: 320, height: 320, borderRadius: '50%',
          border: `1px dashed ${C.gold}28`,
          transform: 'translate(-50px, 50px)',
        }} />
        {/* aro pequeño izquierda */}
        <div style={{
          position: 'absolute', bottom: '18%', left: '-5%',
          width: 220, height: 220, borderRadius: '50%',
          border: `1px solid ${C.wine}30`,
        }} />
        {/* línea horizontal sutil arriba */}
        <div style={{
          position: 'absolute', top: '12%', left: '5%', right: '5%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${C.gold}30 30%, ${C.gold}30 70%, transparent)`,
        }} />
        {/* línea horizontal sutil abajo */}
        <div style={{
          position: 'absolute', bottom: '12%', left: '5%', right: '5%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${C.gold}30 30%, ${C.gold}30 70%, transparent)`,
        }} />
      </div>

      {/* ── Contenido ──────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        className="relative z-10 text-center px-6 max-w-2xl pt-24 pb-16 md:pt-0 md:pb-0"
      >
        {/* Hilo dorado superior */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{
            height: 2, maxWidth: 260, margin: '0 auto 1.8rem',
            background: `linear-gradient(90deg, transparent, ${C.gold} 20%, ${C.gold} 80%, transparent)`,
            transformOrigin: 'center',
          }}
        />

        {/* Etiqueta pill */}
        <motion.div variants={fadeUp}>
          <span
            className="inline-block text-[0.6rem] md:text-[0.68rem] tracking-[0.35em] uppercase px-6 py-2 mb-10"
            style={{
              color: C.wine,
              border: `1.5px solid ${C.wine}55`,
              fontFamily: "'Lora', serif",
              background: `${C.bg}CC`,
              letterSpacing: '0.3em',
            }}
          >
            Tejidos Artesanales · Hecho a Mano
          </span>
        </motion.div>

        {/* ── Título bordado ──────────────────────────────────────────── */}
        <div style={{
          fontSize: 'clamp(2.8rem, 9vw, 6rem)',
          lineHeight: 1.06,
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          marginBottom: '1.4rem',
        }}>
          {/* Fila 1: Cada hilo */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ThreadLine totalChars={LINE1.length} baseDelay={0.4} />
            <EmbroideredText text={LINE1} color={C.ink} baseDelay={0.4} />
          </div>
          
          {/* NUDO/PUNTO DE CADENA DECORATIVO ENTRE LÍNEAS
            SVG colocado en posición absoluta para enlazar visualmente
            el final de LINE1 con el inicio de LINE2.
          */}
          <div style={{ position: 'relative', height: 0, width: '100%' }}>
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                top: '-0.2em', // Ajuste para el interlineado
                right: '15%',    // Ajuste horizontal
                width: '0.8em',
                height: '0.8em',
                opacity: 0.8,
                transform: 'rotate(-15deg)'
              }}
            >
              {/* Eslabones de cadena crochet */}
              <motion.path
  d="M50 10 C 65 10, 75 25, 75 40 S 65 70, 50 70 S 25 55, 25 40 S 35 10, 50 10"
  stroke={C.thread}
  strokeWidth="6"
  fill="none"
  // Añade este efecto de "estiramiento"
  initial={{ pathLength: 0, scale: 0.8, opacity: 0 }}
  animate={{ pathLength: 1, scale: 1, opacity: 0.8 }}
  transition={{ delay: 1.2, duration: 0.8, ease: "backOut" }}
/>
              <motion.path
                d="M50 50 C 65 50, 75 65, 75 80 S 65 110, 50 110 S 25 95, 25 80 S 35 50, 50 50"
                stroke={C.wine}
                strokeWidth="6"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: line2Delay, duration: 0.5 }}
              />
            </svg>
          </div>
          <br />
          
          {/* Fila 2: una historia */}
          <div style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic' }}>
            <ThreadLine totalChars={LINE2.length} baseDelay={line2Delay} />
            <EmbroideredText text={LINE2} color={C.wine} baseDelay={line2Delay} />
          </div>
        </div>

        {/* Subtítulo */}
        <motion.p
          variants={fadeUp}
          className="italic text-base md:text-[1.05rem] mb-10 leading-relaxed"
          style={{ color: '#000000', fontFamily: "'Lora', serif" }}
        >
          Mantas y accesorios bordados con amor
          <br className="hidden sm:block" />
          {' '}para los momentos que más importan
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <ArtisanButton href="#catalog" variant="filled">
            Ver Colección
          </ArtisanButton>
          <ArtisanButton href="#about" variant="outline">
            Nuestra Historia
          </ArtisanButton>
        </motion.div>
      </motion.div>

      {/* ── Controles del slider ────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        {hasImages && images.length > 1 && (
          <button
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Reanudar' : 'Pausar'}
            className="w-7 h-7 flex items-center justify-center border text-xs transition-opacity hover:opacity-100"
            style={{ borderColor: `${C.gold}60`, color: `${C.gold}` }}
          >
            {paused ? '▶' : '⏸'}
          </button>
        )}
        {hasImages && images.length > 1 && (
          <div className="flex gap-1.5" role="tablist">
            {images.map((_, i) => (
              <button
                key={i} role="tab"
                aria-selected={current === i}
                aria-label={`Imagen ${i + 1}`}
                onClick={() => setCurrent(i)}
                style={{
                  background: current === i ? C.gold : `${C.gold}45`,
                  width: current === i ? 20 : 6,
                  height: 6, borderRadius: 9999,
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}