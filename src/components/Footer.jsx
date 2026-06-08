import IsamarLogo from './IsamarLogo'
import { buildGeneralWA } from '../lib/whatsapp'

const WA_URL = buildGeneralWA('Hola Isamar! 👋 Me interesa una pieza de tu colección 🧶')

const SOCIAL = [
  { label: 'Instagram', color: '#E1306C', href: 'https://instagram.com', 
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
  { label: 'Facebook',  color: '#4267B2', href: 'https://facebook.com',  icon: <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/> },
  { label: 'TikTok',    color: '#000000', href: 'https://tiktok.com',    icon: <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 3 3 0 0 1 1.04.17V7.1a5.94 5.94 0 0 0-2.41-.5 6 6 0 1 0 5.48 8.56V9.06a8.42 8.42 0 0 0 4.09 1.09V6.69z"/> },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#8B3A45] pt-16 pb-8 text-[#F8F0F0]">
      {/* Sección principal */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <span className="text-[0.6rem] tracking-[0.3em] uppercase opacity-60 mb-4 block">¿Lista para tu pieza?</span>
        <h2 className="font-serif text-3xl md:text-4xl mb-6 font-light">
          Hablemos sobre tu <em className="italic opacity-80">pedido</em>
        </h2>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
           className="inline-block px-8 py-3 bg-[#F8F0F0] text-[#8B3A45] hover:bg-[#EAD8D8] transition-all duration-300 uppercase tracking-[0.2em] text-[0.7rem] font-medium">
          Escribir por WhatsApp
        </a>
      </div>

      {/* Barra inferior */}
      <div className="px-6 md:px-16 flex flex-col items-center gap-8 border-t border-[#F8F0F0]/10 pt-8">

        {/* Logo + nombre */}
        <div className="flex items-center gap-3 opacity-90">
          <IsamarLogo size={24} variant="light" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-[0.2em]">ISAMAR</span>
            <span className="text-[0.5rem] tracking-[0.18em] uppercase opacity-60">Tejidos y Crochet</span>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          {SOCIAL.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
               className="group w-10 h-10 flex items-center justify-center rounded-full border border-[#F8F0F0]/20 transition-all duration-300 hover:bg-[#F8F0F0] hover:border-transparent">
              <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-colors duration-300"
                   viewBox="0 0 24 24" style={{ color: 'inherit' }}
                   onMouseOver={e => e.currentTarget.style.fill = s.color}
                   onMouseOut={e => e.currentTarget.style.fill = 'currentColor'}>
                {s.icon}
              </svg>
            </a>
          ))}
        </div>

        <p className="text-[0.5rem] tracking-[0.25em] uppercase opacity-30 text-center">
          © {new Date().getFullYear()} Isamar • Tejidos y Crochet
        </p>
      </div>
    </footer>
  )
}