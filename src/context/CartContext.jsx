import { createContext, useContext, useReducer, useEffect } from 'react'

// ── Estado inicial ──────────────────────────────────────────
const initialState = {
  items: [],       // [{ product, quantity }]
  isOpen: false,   // drawer abierto/cerrado
}

// ── Reducer ─────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const exists = state.items.find(i => i.product._id === action.product._id)
      if (exists) {
        // Si ya está, solo aumenta cantidad (máx 5)
        return {
          ...state,
          items: state.items.map(i =>
            i.product._id === action.product._id
              ? { ...i, quantity: Math.min(i.quantity + 1, 5) }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] }
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.product._id !== action.id) }

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.product._id === action.id
            ? { ...i, quantity: Math.min(i.quantity + 1, 5) }
            : i
        ),
      }

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(i => i.product._id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0),
      }

    case 'CLEAR':
      return { ...state, items: [] }

    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_DRAWER':
      return { ...state, isOpen: true }

    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false }

    default:
      return state
  }
}

// ── Context ─────────────────────────────────────────────────
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, init => {
    // Persistir en sessionStorage para que sobreviva recargas dentro de la visita
    try {
      const saved = sessionStorage.getItem('isamar-cart')
      return saved ? { ...init, items: JSON.parse(saved) } : init
    } catch {
      return init
    }
  })

  // Sincronizar con sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('isamar-cart', JSON.stringify(state.items))
    } catch { /* quota exceeded — silenciar */ }
  }, [state.items])

  // Bloquear scroll cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  // ── Helpers ─────────────────────────────────────────────
  const add     = product  => dispatch({ type: 'ADD', product })
  const remove  = id       => dispatch({ type: 'REMOVE', id })
  const inc     = id       => dispatch({ type: 'INCREMENT', id })
  const dec     = id       => dispatch({ type: 'DECREMENT', id })
  const clear   = ()       => dispatch({ type: 'CLEAR' })
  const open    = ()       => dispatch({ type: 'OPEN_DRAWER' })
  const close   = ()       => dispatch({ type: 'CLOSE_DRAWER' })
  const toggle  = ()       => dispatch({ type: 'TOGGLE_DRAWER' })
  const isInCart = id      => state.items.some(i => i.product._id === id)

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0)

  // Construye el mensaje de WhatsApp con todos los productos
  const buildWhatsAppMessage = () => {
    if (!state.items.length) return ''
    const lines = state.items.map(
      i => `• ${i.product.name} × ${i.quantity}  —  ${i.product.price}`
    )
    return [
      'Hola Isamar! 👋 Me gustaría hacer el siguiente pedido:',
      '',
      ...lines,
      '',
      '¿Podemos coordinar el pago y envío?',
    ].join('\n')
  }

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      add, remove, inc, dec, clear,
      open, close, toggle,
      isInCart,
      buildWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
