import { useState } from 'react'
import { motion } from 'framer-motion'
import { urlFor } from '../lib/sanity'
import { stockInfo } from '../lib/stockInfo'
import { useCart } from '../context/CartContext'

const CATEGORY_LABELS = {
  mantas:        'Mantas',
  accesorios:    'Accesorios',
  personalizados:'Personalizados',
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="aspect-[3/4] mb-4"
        style={{
          background: 'linear-gradient(90deg,#F5E6E6 25%,#f0d8d8 50%,#F5E6E6 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div className="h-3 bg-rose rounded w-1/3 mb-2" />
      <div className="h-4 bg-rose rounded w-2/3 mb-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-rose rounded w-1/4" />
        <div className="h-3 bg-rose rounded w-1/5" />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

// Badge de urgencia — se usa también en el modal
export function StockBadge({ product, className = '' }) {
  const { show, label, level } = stockInfo(product)
  if (!show) return null

  const colors = level === 'critical'
    ? 'bg-burgundy text-rose'
    : 'bg-gold/95 text-brown'

  return (
    <span className={`inline-flex items-center gap-1 text-[0.56rem] tracking-[0.14em] uppercase px-2.5 py-1 font-medium ${colors} ${className}`}>
      {/* Punto pulsante */}
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${level === 'critical' ? 'bg-rose' : 'bg-brown'}`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${level === 'critical' ? 'bg-rose' : 'bg-brown'}`} />
      </span>
      {label}
    </span>
  )
}

export default function ProductCard({ product, index, onClick }) {
  const [hovered, setHovered]   = useState(false)
  const [added,   setAdded]     = useState(false)
  const { add, isInCart, open: openCart } = useCart()

  const imageUrl  = product.image ? urlFor(product.image) : null
  const isOut     = product.status === 'out'
  const isNew     = product.status === 'new'
  const inCart    = isInCart(product._id)

  const handleAdd = e => {
    e.stopPropagation()  // no abrir el modal
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleCartClick = e => {
    e.stopPropagation()
    openCart()
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* ── Imagen ── */}
      <div className="relative overflow-hidden aspect-[3/4] bg-rose mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${hovered ? 'scale-[1.06]' : 'scale-100'}`}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-serif text-5xl text-burgundy/20 transition-transform duration-700 ${hovered ? 'scale-[1.04]' : 'scale-100'}`}>
            🧶
          </div>
        )}

        {/* Overlay hover */}
        <div className={`absolute inset-0 bg-burgundy/5 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* ── Badges esquina superior izquierda ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && !isOut && (
            <span className="bg-burgundy text-rose text-[0.56rem] tracking-[0.14em] uppercase px-2.5 py-1">
              Nuevo
            </span>
          )}
          {isOut && (
            <span className="bg-brown/68 text-rose text-[0.56rem] tracking-[0.14em] uppercase px-2.5 py-1">
              Agotado
            </span>
          )}
          {/* Stock badge — solo si no está agotado */}
          {!isOut && <StockBadge product={product} />}
        </div>

        {/* "Ver detalles" en hover */}
        <div className={`absolute inset-x-0 bottom-0 flex justify-center pb-4 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <span className="bg-cream/95 text-burgundy text-[0.58rem] tracking-[0.18em] uppercase px-4 py-1.5 border border-gold/40">
            Ver detalles
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <p className="text-[0.56rem] md:text-[0.6rem] tracking-[0.13em] uppercase text-brown/48 mb-1">
        {CATEGORY_LABELS[product.category] || product.category}
      </p>
      <p className="font-serif text-[0.92rem] md:text-[1.03rem] text-brown mb-2 leading-snug">{product.name}</p>

      <div className="flex items-center justify-between gap-2">
        <span className="font-serif text-[0.98rem] md:text-[1.08rem] text-burgundy">{product.price}</span>
        <span className={`text-[0.53rem] md:text-[0.58rem] tracking-[0.1em] uppercase border-b pb-px transition-colors duration-300 flex-shrink-0 ${
          isOut
            ? 'text-brown/38 border-brown/18'
            : 'text-gold border-gold group-hover:text-burgundy group-hover:border-burgundy'
        }`}>
          {isOut ? 'Avisar' : 'Ver más →'}
        </span>
      </div>

      {/* Botón agregar al carrito */}
      {!isOut && (
        <button
          onClick={inCart ? handleCartClick : handleAdd}
          className={`mt-3 w-full text-[0.6rem] tracking-[0.15em] uppercase py-2 border transition-all duration-300 ${
            added
              ? 'bg-gold/15 border-gold text-gold'
              : inCart
              ? 'bg-burgundy/8 border-burgundy/40 text-burgundy hover:bg-burgundy hover:text-rose'
              : 'border-brown/18 text-brown/50 hover:border-burgundy hover:text-burgundy'
          }`}
        >
          {added ? '✓ Agregado' : inCart ? 'Ver selección' : '+ Agregar'}
        </button>
      )}
    </motion.article>
  )
}
