import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 lg:px-16 bg-[#F8F0F0]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-[320px] md:max-w-md aspect-[4/5] bg-[#EAD8D8] overflow-hidden"
        >
          {/* Una sola imagen — reemplaza About.jpg por tu foto real */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url('/About.jpg')" }}
          />

          {/* Fallback decorativo cuando no hay imagen */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-7xl opacity-10 select-none">🧶</span>
          </div>

          {/* Marcos decorativos */}
          <div className="absolute top-[-4px] left-[-4px] w-6 h-6 border-t border-l border-[#C5A059]/50" />
          <div className="absolute top-[-4px] right-[-4px] w-6 h-6 border-t border-r border-[#C5A059]/50" />
          <div className="absolute bottom-[-4px] left-[-4px] w-6 h-6 border-b border-l border-[#C5A059]/50" />
          <div className="absolute bottom-[-4px] right-[-4px] w-6 h-6 border-b border-r border-[#C5A059]/50" />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#8B3A45]/70 mb-4 block font-medium">
            Nuestra Historia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#8B3A45] mb-6 font-light">
            Sobre <em className="italic opacity-80">Isamar</em>
          </h2>

          <div className="w-16 h-px bg-[#C5A059]/50 mb-8" />

          <blockquote className="font-serif italic text-[1.25rem] text-[#3d2e23] border-l-2 border-[#8B3A45] pl-6 mb-8 leading-snug">
            "Tejo con las manos lo que siento con el corazón."
          </blockquote>

          <p className="font-serif text-[1.05rem] leading-relaxed text-[#3d2e23]/80 mb-6">
            Soy Isamar, artesana apasionada por el tejido desde pequeña. Cada pieza que creo lleva
            horas de dedicación, hilos seleccionados con cuidado y el amor de quien entiende
            que el <strong className="font-medium text-[#8B3A45]">calor verdadero</strong> no solo viene de los materiales.
          </p>

          <p className="font-serif text-[1.05rem] leading-relaxed text-[#3d2e23]/80 mb-10">
            Mis piezas nacen como proyectos únicos: desde la elección del color hasta el último nudo,
            pensadas para quien las recibirá. Porque una pieza no es solo un objeto —
            es un <em className="italic text-[#8B3A45]">abrazo que permanece</em>.
          </p>

          <a
            href="#contact"
            className="inline-block px-10 py-4 bg-[#8B3A45] text-white hover:bg-[#A54552] transition-all duration-300 uppercase tracking-[0.2em] text-[0.7rem]"
          >
            Pedir una Pieza
          </a>
        </motion.div>
      </div>
    </section>
  )
}
