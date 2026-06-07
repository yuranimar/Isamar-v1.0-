import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

const DEMO_TESTIMONIALS = [
  {
    _id: 't1',
    name: 'Valentina M.',
    city: 'Medellín',
    rating: 5,
    text: 'Pedí una manta personalizada para el baby shower de mi hermana y quedó absolutamente preciosa. Isamar le puso el nombre del bebé bordado y los colores que pedimos. Todos los invitados preguntaron dónde la conseguimos.',
    product: 'Manta Personalizada',
    initials: 'VM',
    visible: true,
  },
  {
    _id: 't2',
    name: 'Carolina R.',
    city: 'Bogotá',
    rating: 5,
    text: 'La ruana que compré es de una calidad increíble. Se nota que cada punto está hecho con amor. Ya la he lavado varias veces y sigue perfecta. Definitivamente voy a pedir más piezas para regalos de navidad.',
    product: 'Ruana Borgoña',
    initials: 'CR',
    visible: true,
  },
  {
    _id: 't3',
    name: 'Daniela P.',
    city: 'Cali',
    rating: 5,
    text: 'El bolso tejido es mi favorito del momento. Lo combino con todo y siempre me preguntan dónde lo compré. La atención de Isamar fue súper personalizada, me explicó todo el proceso y fue muy paciente con mis dudas.',
    product: 'Bolso Tejido Camel',
    initials: 'DP',
    visible: true,
  },
  {
    _id: 't4',
    name: 'Mariana L.',
    city: 'Barranquilla',
    rating: 5,
    text: 'Le regalé el set de bebé a mi mejor amiga y lloró de la emoción. La manta es suavísima y el gorro es una monada. El empaque también es hermoso, llegó en una cajita con cinta y todo. Vale cada peso.',
    product: 'Set Regalo Bebé',
    initials: 'ML',
    visible: true,
  },
  {
    _id: 't5',
    name: 'Sofía T.',
    city: 'Pereira',
    rating: 5,
    text: 'Compré la diadema floral y es exactamente como en las fotos, incluso más linda en persona. El tejido es muy fino y delicado. La entrega fue rapidísima y el trato de Isamar muy cálido y cercano.',
    product: 'Diadema Floral',
    initials: 'ST',
    visible: true,
  },
]

const QUERY = `*[_type == "testimonial" && visible != false] | order(order asc, _createdAt desc) {
  _id, name, city, rating, text, product, photo, visible
}`

// Extrae las iniciales del nombre para el avatar
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
    if (!projectId || projectId === 'your-project-id') {
      setTimeout(() => {
        setTestimonials(DEMO_TESTIMONIALS)
        setLoading(false)
      }, 600)
      return
    }
    client.fetch(QUERY)
      .then(data => {
        // Añadir initials calculadas si no hay foto
        const enriched = data.map(t => ({ ...t, initials: getInitials(t.name) }))
        setTestimonials(enriched.length ? enriched : DEMO_TESTIMONIALS)
        setLoading(false)
      })
      .catch(() => {
        setTestimonials(DEMO_TESTIMONIALS)
        setLoading(false)
      })
  }, [])

  return { testimonials, loading }
}
