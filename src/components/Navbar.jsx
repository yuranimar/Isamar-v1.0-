import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IsamarLogo from './IsamarLogo'
import { useCart } from '../context/CartContext'
import { buildGeneralWA } from '../lib/whatsapp'

const NAV_WA = buildGeneralWA('Hola Isamar! 👋 Me gustaría hacer un pedido 🧶')
const LINKS = [
  { label: 'Colección', href: '#catalog' },
  { label: 'Sobre Isamar', href: '#about' },
  { label: 'Contacto', href: '#contact' },
]

function CartButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Carrito — ${count}`}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F0F0] border border-[#8B3A45]/10 text-[#8B3A45] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#C5A059] text-[#F8F0F0] text-[0.6rem] font-bold rounded-full flex items-center justify-center px-1"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, open: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navBg = scrolled || menuOpen ? 'bg-[#F8F0F0]/95 backdrop-blur-md shadow-[0_1px_0_rgba(139,58,69,0.08)]' : 'bg-transparent'

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="flex items-center justify-between px-5 md:px-12 py-3.5">
          {/* Logo */}
          <a href="#" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <IsamarLogo size={32} />
            <span className="font-serif text-lg font-semibold text-[#8B3A45] tracking-wide">ISAMAR</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8B3A45]/80 hover:text-[#C5A059] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <CartButton count={totalItems} onClick={openCart} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 text-[#8B3A45]">
              <span className={`block w-5 h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

  {/* Menú Móvil */}
<AnimatePresence>
  {menuOpen && (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      className="fixed inset-0 z-40 bg-[#F8F0F0] pt-24 px-6 md:hidden"
    >
      <nav className="flex flex-col gap-8">
        {LINKS.map(l => (
          <a 
            key={l.href} 
            href={l.href} 
            onClick={() => setMenuOpen(false)} 
            className="font-serif text-3xl text-[#8B3A45]"
          >
            {l.label}
          </a>
        ))}
        
        {/* Aquí está el botón actualizado con tu identidad de marca */}
        <a 
          href={NAV_WA} 
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 bg-[#8B3A45] text-[#F8F0F0] py-4 text-center tracking-[0.2em] uppercase text-[0.7rem] hover:bg-[#A54552] transition-colors"
        >
          Escribir a Isamar
        </a>
      </nav>
    </motion.div>
  )}
</AnimatePresence>    
    </>
  )
}