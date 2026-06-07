import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import ProductCard, { ProductSkeleton } from './ProductCard'
import ProductDetailModal from './ProductDetailModal'

const FILTERS = [
  { key: 'todos',         label: 'Todos'          },
  { key: 'mantas',        label: 'Mantas'         },
  { key: 'accesorios',    label: 'Accesorios'     },
  { key: 'personalizados', label: 'Personalizados' },
]

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { products, loading } = useProducts()

  const filtered = activeFilter === 'todos'
    ? products
    : products.filter(p => p.category === activeFilter)

  useEffect(() => {
    const handler = e => setSelectedProduct(e.detail)
    window.addEventListener('open-product', handler)
    return () => window.removeEventListener('open-product', handler)
  }, [])

  return (
    <>
      <section id="catalog" className="py-16 md:py-24 px-4 sm:px-6 lg:px-16 bg-[#F8F0F0]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#8B3A45]/60 mb-2 block font-medium">Colección 2025</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#8B3A45]">Nuestros <em className="italic opacity-80">Productos</em></h2>
            <div className="w-16 h-px bg-[#8B3A45]/30 mt-4" />
          </div>

          {/* Filtros */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeFilter === f.key 
                    ? 'text-[#8B3A45] font-bold border-b border-[#8B3A45]' 
                    : 'text-[#8B3A45]/50 hover:text-[#8B3A45]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            : filtered.map((p, i) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  index={i}
                  onClick={() => setSelectedProduct(p)}
                />
              ))
          }
        </motion.div>

        {!loading && filtered.length === 0 && (
          <p className="text-center font-serif italic text-[#8B3A45]/40 py-20 text-lg">
            Estamos preparando más piezas de esta categoría.
          </p>
        )}
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            key={selectedProduct._id}
            product={selectedProduct}
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}