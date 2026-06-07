/**
 * useDocumentTitle
 * Actualiza el <title> y la meta description del documento.
 * Se usa principalmente al abrir el detalle de un producto para que
 * la URL pueda compartirse con preview correcta (título dinámico).
 *
 * Uso:
 *   useDocumentTitle('Manta Luna de Miel — Isamar')
 *   useDocumentTitle(null) // restaura el título base
 */

import { useEffect } from 'react'

const BASE_TITLE = 'Isamar — Tejidos Artesanales Hechos a Mano'
const BASE_DESC  = 'Mantas, ruanas y accesorios tejidos a mano con amor. Cada pieza es única. Envíos a todo Colombia.'

export function useDocumentTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc  = document.querySelector('meta[name="description"]')
    const prevDesc  = metaDesc?.getAttribute('content') || BASE_DESC

    document.title = title || BASE_TITLE
    if (metaDesc && description) metaDesc.setAttribute('content', description)

    // También actualizar og:title y og:description
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc  = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.setAttribute('content', title || BASE_TITLE)
    if (ogDesc && description) ogDesc.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevDesc)
      if (ogTitle) ogTitle.setAttribute('content', BASE_TITLE)
      if (ogDesc) ogDesc.setAttribute('content', BASE_DESC)
    }
  }, [title, description])
}

/**
 * buildProductMeta — genera title y description para un producto dado
 */
export function buildProductMeta(product) {
  if (!product) return { title: null, description: null }

  const categoryLabel = {
    mantas:        'Manta tejida',
    accesorios:    'Accesorio tejido',
    personalizados:'Pieza personalizada',
  }[product.category] || 'Tejido artesanal'

  const title = `${product.name} — ${categoryLabel} | Isamar`

  const description = product.description
    ? `${product.description.slice(0, 130)}… Precio: ${product.price}. Envíos a todo Colombia.`
    : `${product.name} — ${categoryLabel} hecho a mano por Isamar. Precio: ${product.price}. Envíos a todo Colombia.`

  return { title, description }
}
