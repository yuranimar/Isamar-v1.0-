/**
 * api/admin/product.js — CRUD de productos server-side
 *
 * El token de Sanity vive SOLO aquí (servidor), nunca en el cliente.
 *
 * Variables de entorno en Vercel (sin VITE_ — son privadas):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET
 *   SANITY_WRITE_TOKEN
 *   ADMIN_SECRET       ← string que el panel envía para autenticarse
 */

const PROJECT_ID   = process.env.SANITY_PROJECT_ID
const DATASET      = process.env.SANITY_DATASET      || 'production'
const TOKEN        = process.env.SANITY_WRITE_TOKEN
const ADMIN_SECRET = process.env.ADMIN_SECRET

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAuthorized(req) {
  // Si no hay secret configurado, cualquier petición pasa (modo dev)
  if (!ADMIN_SECRET) return true
  const header = req.headers['x-admin-secret']
  return header === ADMIN_SECRET
}

async function mutate(mutations) {
  const res = await fetch(API, {
    method:  'POST',
    headers: {
      Authorization:   `Bearer ${TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ mutations }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return {}
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:5173'
  )
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  // Auth
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })

  // Config check
  if (!TOKEN || !PROJECT_ID) {
    return res.status(503).json({ error: 'Sanity not configured — add SANITY_PROJECT_ID and SANITY_WRITE_TOKEN to Vercel env vars' })
  }

  const { action, id, data, status } = req.body || {}

  try {
    let result

    switch (action) {
      case 'create':
        if (!data) return res.status(400).json({ error: 'data required' })
        result = await mutate([{ create: { _type: 'product', ...sanitize(data) } }])
        break

      case 'update':
        if (!id || !data) return res.status(400).json({ error: 'id and data required' })
        result = await mutate([{ patch: { id, set: sanitize(data) } }])
        break

      case 'delete':
        if (!id) return res.status(400).json({ error: 'id required' })
        result = await mutate([{ delete: { id } }])
        break

      case 'status':
        if (!id || !status) return res.status(400).json({ error: 'id and status required' })
        const VALID_STATUSES = ['available', 'new', 'out']
        if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'invalid status' })
        result = await mutate([{ patch: { id, set: { status } } }])
        break

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` })
    }

    return res.status(200).json({ ok: true, result })
  } catch (e) {
    console.error('product handler error:', e)
    return res.status(500).json({ error: e.message })
  }
}
