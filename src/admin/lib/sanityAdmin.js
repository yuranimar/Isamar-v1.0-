/**
 * sanityAdmin.js — Cliente del panel admin
 *
 * SEGURIDAD:
 *   ✅ Solo lectura en el cliente (sin token)
 *   ✅ Escritura va siempre a /api/admin/* (servidor)
 *   ✅ VITE_ADMIN_SECRET es una clave pública que identifica al admin
 *      — el token real de Sanity NUNCA sale al navegador
 */

import { createClient } from '@sanity/client'

const PROJECT_ID    = import.meta.env.VITE_SANITY_PROJECT_ID || ''
const DATASET       = import.meta.env.VITE_SANITY_DATASET    || 'production'
const ADMIN_SECRET  = import.meta.env.VITE_ADMIN_SECRET      || ''

// Cliente de solo LECTURA — seguro en el cliente
const readClient = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  useCdn:     false,
  apiVersion: '2024-01-01',
})

export const ADMIN_PRODUCTS_QUERY = `
  *[_type == "product"] | order(order asc, _createdAt desc) {
    _id, _createdAt, name, category, price, originalPrice,
    description, image, images, status, stock,
    material, dimensions, deliveryTime, careInstructions, order
  }
`

export async function fetchProducts() {
  return readClient.fetch(ADMIN_PRODUCTS_QUERY)
}

// ─── Mutaciones — todas van al servidor ──────────────────────────────────────

async function adminFetch(path, body) {
  const res = await fetch(path, {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-admin-secret':  ADMIN_SECRET,   // identificador — el token real está en el servidor
    },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({ error: res.statusText }))

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }

  return data
}

export async function uploadImage(file) {
  const res = await fetch('/api/admin/upload-image', {
    method:  'POST',
    headers: {
      'Content-Type':   file.type,
      'x-admin-secret': ADMIN_SECRET,
    },
    body: file,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

export async function createProduct(data) {
  return adminFetch('/api/admin/product', { action: 'create', data })
}

export async function updateProduct(id, data) {
  return adminFetch('/api/admin/product', { action: 'update', id, data })
}

export async function deleteProduct(id) {
  return adminFetch('/api/admin/product', { action: 'delete', id })
}

export async function updateStatus(id, status) {
  return adminFetch('/api/admin/product', { action: 'status', id, status })
}

export function urlForAdmin(source) {
  if (!source?.asset?._ref) return null
  const ref   = source.asset._ref
  const parts = ref.split('-')
  if (parts.length < 4) return null
  const [, id, dimensions, format] = parts
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}`
}

export const isWriteConfigured = !!PROJECT_ID
