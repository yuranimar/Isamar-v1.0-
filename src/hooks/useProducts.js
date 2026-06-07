import { useState, useEffect } from 'react'
import { client, PRODUCTS_QUERY } from '../lib/sanity'

// Fallback demo products when Sanity is not configured
const DEMO_PRODUCTS = [
  { _id: '1', name: 'Manta Luna de Miel', category: 'mantas',        price: '$85.000',  status: 'new',       stock: 2,    description: 'Tejida en punto trenzado con hilo suave merino.' },
  { _id: '2', name: 'Ruana Borgoña',      category: 'mantas',        price: '$120.000', status: 'available', stock: null, description: 'Lana 100% natural en tono borgoña profundo.' },
  { _id: '3', name: 'Bolso Tejido Camel', category: 'accesorios',    price: '$55.000',  status: 'new',       stock: 1,    description: 'Trenzado a mano con asa de madera natural.' },
  { _id: '4', name: 'Diadema Floral',     category: 'accesorios',    price: '$35.000',  status: 'available', stock: 3,    description: 'Tejida a crochet con detalles de flores.' },
  { _id: '5', name: 'Manta Personalizada',category: 'personalizados', price: 'Consultar',status: 'available', stock: null, description: 'Diseño exclusivo con nombre bordado.' },
  { _id: '6', name: 'Set Regalo Bebé',    category: 'personalizados', price: '$95.000',  status: 'out',       stock: 0,    description: 'Manta y gorro personalizados para bebé.' },
]

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
    if (!projectId || projectId === 'your-project-id') {
      // Use demo data until Sanity is configured
      setTimeout(() => { setProducts(DEMO_PRODUCTS); setLoading(false) }, 800)
      return
    }
    client.fetch(PRODUCTS_QUERY)
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err  => { console.error(err); setProducts(DEMO_PRODUCTS); setLoading(false) })
  }, [])

  return { products, loading, error }
}
