/**
 * api/admin/upload-image.js — Sube imágenes a Sanity desde el servidor
 * El token nunca sale al cliente.
 */

export const config = { api: { bodyParser: false } }

const PROJECT_ID   = process.env.SANITY_PROJECT_ID
const DATASET      = process.env.SANITY_DATASET    || 'production'
const TOKEN        = process.env.SANITY_WRITE_TOKEN
const ADMIN_SECRET = process.env.ADMIN_SECRET

const MAX_SIZE_MB = 10

function isAuthorized(req) {
  if (!ADMIN_SECRET) return true
  return req.headers['x-admin-secret'] === ADMIN_SECRET
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'x-admin-secret')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })
  if (!isAuthorized(req))      return res.status(401).json({ error: 'Unauthorized' })
  if (!TOKEN || !PROJECT_ID)   return res.status(503).json({ error: 'Sanity not configured' })

  try {
    const chunks = []
    let totalSize = 0

    for await (const chunk of req) {
      totalSize += chunk.length
      if (totalSize > MAX_SIZE_MB * 1024 * 1024) {
        return res.status(413).json({ error: `File too large (max ${MAX_SIZE_MB}MB)` })
      }
      chunks.push(chunk)
    }

    const buffer      = Buffer.concat(chunks)
    const contentType = req.headers['content-type'] || 'image/jpeg'

    // Validar que sea imagen
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files allowed' })
    }

    const sanityRes = await fetch(
      `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}`,
      {
        method:  'POST',
        headers: {
          Authorization:  `Bearer ${TOKEN}`,
          'Content-Type': contentType,
        },
        body: buffer,
      }
    )

    const asset = await sanityRes.json()
    if (!sanityRes.ok) return res.status(sanityRes.status).json({ error: asset.error?.description || 'Upload failed' })

    return res.status(200).json({
      _type:  'image',
      asset:  { _type: '_reference', _ref: asset.document._id },
    })
  } catch (e) {
    console.error('upload-image error:', e)
    return res.status(500).json({ error: e.message })
  }
}
