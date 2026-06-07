import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '../lib/sanity'
import IsamarLogo from './IsamarLogo'
import { useDocumentTitle, buildProductMeta } from '../hooks/useDocumentTitle'
import { StockBadge } from './ProductCard'
import { useCart } from '../context/CartContext'
import { buildWhatsAppURL } from '../lib/whatsapp'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '573001234567'

const CAT = {
  mantas:        'Mantas',
  accesorios:    'Accesorios',
  personalizados:'Personalizados',
}

// Datos demo para campos técnicos mientras Sanity no esté configurado
const DEMO_TECH = {
  '1': { material:'Hilo merino 100%',           dimensions:'130 × 170 cm',      deliveryTime:'3–5 días hábiles', careInstructions:'Lavar a mano en agua fría'     },
  '2': { material:'Lana natural colombiana',    dimensions:'Talla única',        deliveryTime:'5–7 días hábiles', careInstructions:'Lavado en seco recomendado'   },
  '3': { material:'Fibra de algodón trenzada',  dimensions:'28 × 22 × 10 cm',   deliveryTime:'3–4 días hábiles', careInstructions:'Limpiar con paño húmedo'       },
  '4': { material:'Hilo acrílico premium',      dimensions:'Talla única',        deliveryTime:'1–2 días hábiles', careInstructions:'Lavar a mano suavemente'       },
  '5': { material:'A elección del cliente',     dimensions:'Personalizable',     deliveryTime:'7–10 días hábiles',careInstructions:'Según material elegido'        },
  '6': { material:'Hilo suave antialérgico',    dimensions:'Set completo bebé',  deliveryTime:'5–8 días hábiles', careInstructions:'Lavar a mano con jabón neutro' },
}

// buildWhatsAppURL importado desde lib/whatsapp.js

function RelatedCard({ product, onClick }) {
  const img = product.image ? urlFor(product.image) : null
  return (
    <button onClick={() => onClick(product)} className="text-left flex-shrink-0 w-36 group cursor-pointer">
      <div className="aspect-[3/4] bg-rose overflow-hidden mb-2 relative">
        {img
          ? <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-3xl text-burgundy/20 group-hover:scale-[1.04] transition-transform duration-500">🧶</div>
        }
        {product.status === 'out' && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[0.58rem] tracking-widest uppercase text-brown/55">Agotado</span>
          </div>
        )}
      </div>
      <p className="font-serif text-[0.9rem] text-brown leading-snug mb-0.5 group-hover:text-burgundy transition-colors">{product.name}</p>
      <p className="font-serif text-[0.9rem] text-burgundy">{product.price}</p>
    </button>
  )
}

export default function ProductDetailModal({ product, allProducts, onClose }) {
  const [activeImg, setActiveImg]     = useState(0)
  const [zoomActive, setZoomActive]   = useState(false)
  const [zoomPos, setZoomPos]         = useState({ x: 50, y: 50 })
  const [notifyPhone, setNotifyPhone] = useState('')
  const [notifyName, setNotifyName]   = useState('')
  const [notifySent, setNotifySent]   = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { add, isInCart, open: openCart } = useCart()
  const inCart = isInCart(product._id)

  const handleAdd = () => {
    add(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1800)
  }

  const isOut    = product.status === 'out'
  const isNew    = product.status === 'new'
  const isCustom = product.category === 'personalizados'

  // SEO — título dinámico mientras el producto está abierto
  const { title: productTitle, description: productDesc } = buildProductMeta(product)
  useDocumentTitle(productTitle, productDesc)

  // Construir array de imágenes: imagen principal + galería de Sanity
  const imageList = (() => {
    const all = []
    if (product.image) all.push(urlFor(product.image))
    if (product.images?.length) {
      product.images.forEach(img => {
        const u = urlFor(img)
        if (u && !all.includes(u)) all.push(u)
      })
    }
    return all.length ? all : [null]
  })()

  // Campos técnicos: vienen de Sanity si existen, si no usan demo
  const demo = DEMO_TECH[product._id] || {}
  const tech = {
    material:         product.material         || demo.material,
    dimensions:       product.dimensions       || demo.dimensions,
    deliveryTime:     product.deliveryTime     || demo.deliveryTime,
    careInstructions: product.careInstructions || demo.careInstructions,
  }

  // Precio tachado
  const hasDiscount = !!product.originalPrice

  // Relacionados: misma categoría, sin el actual
  const related = allProducts
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4)

  // Cerrar con Escape / bloquear scroll
  const handleKey = useCallback(e => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [handleKey])

  // Zoom de lupa al mover el mouse sobre la imagen
  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    setZoomPos({ x, y })
  }

  const handleNotify = () => {
    if (!notifyPhone.trim()) return
    const url = buildWhatsAppURL(product, 'notify', {
      name:  notifyName,
      phone: notifyPhone,
    })
    window.open(url, '_blank')
    setNotifySent(true)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="bd"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-brown/55 backdrop-blur-[3px]"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto bg-cream w-full md:w-[90vw] md:max-w-4xl max-h-[94vh] md:max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: '0 25px 80px rgba(61,46,35,0.35)' }}
        >

          {/* ── BARRA SUPERIOR ── */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gold/20 sticky top-0 bg-cream z-10">
            <div className="flex items-center gap-2.5">
              <IsamarLogo size={22} />
              <span className="text-[0.58rem] tracking-[0.22em] uppercase text-brown/45">
                {CAT[product.category] || product.category}
              </span>
              {isNew && (
                <span className="bg-burgundy text-rose text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5">
                  Nuevo
                </span>
              )}
            </div>
            <button onClick={onClose} aria-label="Cerrar" className="w-8 h-8 flex items-center justify-center text-brown/45 hover:text-burgundy transition-colors text-2xl leading-none font-light">
              ×
            </button>
          </div>

          {/* ── CUERPO PRINCIPAL ── */}
          <div className="grid md:grid-cols-2 gap-0">

            {/* ── IZQUIERDA: Galería ── */}
            <div className="bg-rose/30 p-5 flex flex-col gap-3">

              {/* Imagen principal con zoom */}
              <div
                className="relative aspect-[4/5] bg-rose overflow-hidden cursor-crosshair select-none"
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleMouseMove}
              >
                {imageList[activeImg] ? (
                  <img
                    src={imageList[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    style={
                      zoomActive
                        ? {
                            transform: 'scale(2.2)',
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            transition: 'transform-origin 0.05s',
                          }
                        : { transform: 'scale(1)', transition: 'transform 0.4s ease' }
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IsamarLogo size={110} className="opacity-18" />
                  </div>
                )}

                {/* Indicador de zoom */}
                {!zoomActive && imageList[activeImg] && (
                  <div className="absolute bottom-3 right-3 bg-cream/80 text-brown/50 text-[0.55rem] tracking-[0.12em] uppercase px-2 py-1 pointer-events-none">
                    Pasa el cursor para ampliar
                  </div>
                )}

                {/* Flechas navegación */}
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => Math.max(0, i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream/85 flex items-center justify-center text-brown text-lg hover:bg-cream transition-colors"
                      aria-label="Foto anterior"
                    >‹</button>
                    <button
                      onClick={() => setActiveImg(i => Math.min(imageList.length - 1, i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream/85 flex items-center justify-center text-brown text-lg hover:bg-cream transition-colors"
                      aria-label="Foto siguiente"
                    >›</button>
                  </>
                )}

                {/* Contador fotos */}
                {imageList.length > 1 && (
                  <div className="absolute bottom-3 left-3 bg-cream/80 text-brown/50 text-[0.55rem] tracking-wider uppercase px-2 py-1">
                    {activeImg + 1} / {imageList.length}
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {imageList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imageList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-14 aspect-square border-2 overflow-hidden transition-all duration-200 ${
                        activeImg === i
                          ? 'border-burgundy opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    >
                      {img
                        ? <img src={img} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-rose" />
                      }
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── DERECHA: Info + CTA ── */}
            <div className="p-6 lg:p-8 flex flex-col">

              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mb-2">
                {CAT[product.category] || product.category}
              </p>

              <h2 className="font-serif font-light text-3xl text-burgundy leading-tight mb-2">
                {product.name}
              </h2>

              {/* Precio */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-serif text-2xl text-burgundy">{product.price}</span>
                {hasDiscount && (
                  <span className="font-serif text-base text-brown/40 line-through">{product.originalPrice}</span>
                )}
              </div>

              {/* Stock urgency badge */}
              <div className="mb-4">
                <StockBadge product={product} />
              </div>

              <div className="w-10 h-px bg-gold mb-4" />

              <p className="font-serif text-[1rem] leading-relaxed text-brown/80 mb-5">
                {product.description || 'Pieza artesanal tejida a mano con dedicación y materiales cuidadosamente seleccionados.'}
              </p>

              {/* Detalles técnicos */}
              {(tech.material || tech.dimensions || tech.deliveryTime || tech.careInstructions) && (
                <div className="border border-gold/25 p-4 mb-5 grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { label: 'Material',          val: tech.material         },
                    { label: 'Dimensiones',        val: tech.dimensions       },
                    { label: 'Tiempo de entrega',  val: tech.deliveryTime     },
                    { label: 'Cuidados',           val: tech.careInstructions },
                  ].filter(f => f.val).map(f => (
                    <div key={f.label}>
                      <p className="text-[0.55rem] tracking-[0.16em] uppercase text-brown/38 mb-0.5">{f.label}</p>
                      <p className="font-serif text-[0.88rem] text-brown leading-snug">{f.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── CTA según estado ── */}
              {!isOut ? (
                <>
                  {/* Agregar a selección */}
                  <button
                    onClick={inCart ? openCart : handleAdd}
                    className={`w-full text-[0.68rem] tracking-[0.18em] uppercase px-6 py-3 mb-3 border transition-all duration-300 ${
                      addedToCart
                        ? 'bg-gold/12 border-gold text-gold'
                        : inCart
                        ? 'bg-burgundy/8 border-burgundy text-burgundy hover:bg-burgundy hover:text-rose'
                        : 'border-brown/22 text-brown hover:border-burgundy hover:text-burgundy'
                    }`}
                  >
                    {addedToCart ? '✓ Agregado a tu selección' : inCart ? 'Ver mi selección →' : '+ Agregar a mi selección'}
                  </button>

                  <a
                    href={buildWhatsAppURL(product, isCustom ? 'custom' : 'buy')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white text-[0.68rem] tracking-[0.18em] uppercase px-6 py-3.5 mb-3 hover:bg-[#1fbd5a] transition-colors"
                  >
                    {/* WhatsApp icon */}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {isCustom ? 'Consultar por WhatsApp' : 'Pedir por WhatsApp'}
                  </a>

                  <a
                    href={buildWhatsAppURL(product, 'ask')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-[0.63rem] tracking-[0.15em] uppercase text-brown/50 border border-brown/20 py-2.5 hover:border-gold hover:text-burgundy transition-all"
                  >
                    Hacer una pregunta
                  </a>
                </>
              ) : (
                /* ── AGOTADO: formulario "Avísame" ── */
                <div className="border border-gold/30 p-4 mb-3">
                  {!notifySent ? (
                    <>
                      <p className="text-[0.6rem] tracking-[0.16em] uppercase text-burgundy mb-3">
                        Avísame cuando llegue
                      </p>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={notifyName}
                        onChange={e => setNotifyName(e.target.value)}
                        className="w-full border border-brown/20 bg-white px-3 py-2 text-sm font-serif text-brown placeholder:text-brown/35 outline-none focus:border-gold transition-colors mb-2"
                      />
                      <input
                        type="tel"
                        placeholder="Tu WhatsApp (ej: 3001234567)"
                        value={notifyPhone}
                        onChange={e => setNotifyPhone(e.target.value)}
                        className="w-full border border-brown/20 bg-white px-3 py-2 text-sm font-serif text-brown placeholder:text-brown/35 outline-none focus:border-gold transition-colors mb-3"
                      />
                      <button
                        onClick={handleNotify}
                        disabled={!notifyPhone.trim()}
                        className="w-full bg-burgundy text-rose text-[0.63rem] tracking-[0.18em] uppercase py-2.5 hover:bg-burgundy/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Enviar aviso por WhatsApp
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <p className="font-serif italic text-burgundy text-sm mb-1">¡Listo! Te avisaré cuando esté disponible.</p>
                      <p className="text-[0.58rem] tracking-wider uppercase text-brown/40">Gracias por tu interés ♥</p>
                    </div>
                  )}
                </div>
              )}

              {/* Nota de confianza */}
              <p className="text-[0.56rem] tracking-wider uppercase text-brown/32 text-center mt-4 leading-relaxed">
                Envíos a todo Colombia · Pago contraentrega disponible
              </p>
            </div>
          </div>

          {/* ── PRODUCTOS RELACIONADOS ── */}
          {related.length > 0 && (
            <div className="px-5 lg:px-8 py-6 border-t border-gold/20">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mb-4">
                También te puede gustar
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {related.map(p => (
                  <RelatedCard
                    key={p._id}
                    product={p}
                    onClick={next => {
                      onClose()
                      setTimeout(() => window.dispatchEvent(new CustomEvent('open-product', { detail: next })), 60)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </>
  )
}
