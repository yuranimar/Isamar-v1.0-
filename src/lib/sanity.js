import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset:   import.meta.env.VITE_SANITY_DATASET    || 'production',
  useCdn:    true,
  apiVersion: '2024-01-01',
})

export const urlFor = (source) => {
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/${import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id'}/production/${id}-${dimensions}.${format}`
}

export const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc, _createdAt desc) {
  _id,
  name,
  category,
  price,
  originalPrice,
  description,
  image,
  images,
  status,
  stock,
  material,
  dimensions,
  deliveryTime,
  careInstructions
}`
