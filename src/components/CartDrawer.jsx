import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { urlFor } from '../lib/sanity'
import IsamarLogo from './IsamarLogo'
import { buildWhatsAppURL } from '../lib/whatsapp'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '573001234567'

function CartItem({ item }) {
  const { remove, inc, dec } = useCart()
  const { product, quantity } = item
  const imgUrl = product.image ? urlFor(product.image) : null
  const isOut  = product.status === 'out'

  return (
    <div className="flex gap-3 py-4 border-b border-gold/15 last:border-0">

      {/* Imagen miniatura */}
      <div className="w-16 h-20 bg-rose flex-shrink-0 overflow-hidden">
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl text-burgundy/20">🧶</div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[0.6rem] tracking-[0.12em] uppercase text-brown/42 mb-0.5">
          {product.category}
        </p>
        <p className="font-serif text-[0.93rem] text-brown leading-snug mb-1.5 truncate">
          {product.name}
        </p>
        <p className="font-serif text-burgundy text-[0.93rem] mb-2">{product.price}</p>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-0">
          <button
            onClick={() => dec(product._id)}
            aria-label="Reducir cantidad"
            className="w-6 h-6 border border-brown/20 flex items-center justify-center text-brown/50 hover:border-burgundy hover:text-burgundy transition-colors text-sm leading-none"
          >−</button>
          <span className="w-7 text-center font-sans text-[0.78rem] text-brown">{quantity}</span>
          <button
            onClick={() => inc(product._id)}
            disabled={quantity >= 5}
            aria-label="Aumentar cantidad"
            className="w-6 h-6 border border-brown/20 flex items-center justify-center text-brown/50 hover:border-burgundy hover:text-burgundy transition-colors text-sm leading-none disabled:opacity-30 disabled:cursor-not-allowed"
          >+</button>
        </div>
      </div>

      {/* Quitar */}
      <button
        onClick={() => remove(product._id)}
        aria-label={`Quitar ${product.name}`}
        className="flex-shrink-0 text-brown/28 hover:text-burgundy transition-colors text-lg leading-none mt-0.5"
      >×</button>
    </div>
  )
}

export default function CartDrawer() {
  const { items, isOpen, close, clear, totalItems, buildWhatsAppMessage } = useCart()
  const isEmpty = items.length === 0
  const waUrl = buildWhatsAppURL(null, 'cart', { items })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-brown/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-cream flex flex-col"
            style={{ boxShadow: '-8px 0 48px rgba(61,46,35,0.18)' }}
            aria-label="Carrito de compras"
            role="dialog"
            aria-modal="true"
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20">
              <div className="flex items-center gap-2.5">
                <IsamarLogo size={24} />
                <div>
                  <p className="font-serif text-[1rem] text-burgundy leading-tight">Mi selección</p>
                  <p className="text-[0.58rem] tracking-[0.16em] uppercase text-brown/40">
                    {totalItems === 0
                      ? 'vacío'
                      : `${totalItems} ${totalItems === 1 ? 'pieza' : 'piezas'}`}
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Cerrar carrito"
                className="w-8 h-8 flex items-center justify-center text-brown/40 hover:text-burgundy transition-colors text-2xl leading-none"
              >×</button>
            </div>

            {/* ── Items / Empty state ── */}
            <div className="flex-1 overflow-y-auto px-5">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                  <IsamarLogo size={64} className="opacity-20" />
                  <p className="font-serif italic text-brown/45 text-lg">Tu selección está vacía</p>
                  <p className="text-[0.68rem] tracking-wider uppercase text-brown/30">
                    Explora la colección y agrega tus piezas favoritas
                  </p>
                  <button
                    onClick={close}
                    className="btn-secondary mt-2 text-[0.65rem]"
                  >
                    Ver colección
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  {items.map(item => (
                    <CartItem key={item.product._id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer con CTA ── */}
            {!isEmpty && (
              <div className="border-t border-gold/20 px-5 py-5 space-y-3">

                {/* Nota de precios */}
                <p className="text-[0.6rem] tracking-wider uppercase text-brown/35 text-center">
                  Los precios no incluyen el costo de envío
                </p>

                {/* Botón principal WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white text-[0.67rem] tracking-[0.18em] uppercase px-6 py-3.5 w-full hover:bg-[#1fbd5a] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pedir todo por WhatsApp
                </a>

                {/* Vaciar */}
                <button
                  onClick={clear}
                  className="w-full text-center text-[0.6rem] tracking-[0.15em] uppercase text-brown/35 hover:text-burgundy transition-colors py-1"
                >
                  Vaciar selección
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
