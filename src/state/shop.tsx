import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { ShopContext } from './context'
import { store } from '../config'
import type { Choices, Line, ResolvedLine } from './context'
import { getProduct, getSeller } from '../lib/catalog'


type State = { lines: Line[]; favorites: string[] }
type Action =
  | { type: 'add'; productId: string; choices: Choices; qty: number }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'fav'; productId: string }

const STORAGE = `shop:${store.id}`
const lineKey = (id: string, c: Choices) => [id, ...Object.entries(c).map(([k, v]) => `${k}=${v}`)].join('|')

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) {
      const s = JSON.parse(raw) as State
      // Descarta itens de produtos que saíram do catálogo.
      return { lines: s.lines.filter((l) => getProduct(l.productId)), favorites: s.favorites.filter((id) => getProduct(id)) }
    }
  } catch { /* storage indisponível ou corrompido */ }
  return { lines: [], favorites: [] }
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const key = lineKey(a.productId, a.choices)
      const stock = getProduct(a.productId)?.stock ?? 0
      const existing = s.lines.find((l) => l.key === key)
      const lines = existing
        ? s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(stock, l.qty + a.qty) } : l))
        : [...s.lines, { key, productId: a.productId, choices: a.choices, qty: Math.min(stock, a.qty) }]
      return { ...s, lines }
    }
    case 'qty':
      return {
        ...s,
        lines: s.lines.map((l) => (l.key === a.key ? { ...l, qty: Math.max(1, Math.min(getProduct(l.productId)?.stock ?? 1, a.qty)) } : l)),
      }
    case 'remove':
      return { ...s, lines: s.lines.filter((l) => l.key !== a.key) }
    case 'clear':
      return { ...s, lines: [] }
    case 'fav':
      return {
        ...s,
        favorites: s.favorites.includes(a.productId) ? s.favorites.filter((x) => x !== a.productId) : [...s.favorites, a.productId],
      }
  }
}

function useShopState() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)) } catch { /* sem storage */ }
  }, [state])

  const derived = useMemo(() => {
    const lines: ResolvedLine[] = state.lines.flatMap((l) => {
      const product = getProduct(l.productId)
      return product ? [{ ...l, product }] : []
    })
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
    const savings = lines.reduce((n, l) => n + l.qty * Math.max(0, (l.product.compareAt ?? l.product.price) - l.product.price), 0)
    // Num marketplace cada vendedor despacha o seu pacote.
    const bySeller = Object.values(
      lines.reduce<Record<string, { seller: NonNullable<ReturnType<typeof getSeller>>; lines: ResolvedLine[] }>>((acc, l) => {
        const seller = getSeller(l.product.sellerId)
        if (seller) (acc[seller.id] ??= { seller, lines: [] }).lines.push(l)
        return acc
      }, {}),
    )
    const toFreeShipping = Math.max(0, store.shipping.freeOver - subtotal)
    return { lines, count, subtotal, savings, bySeller, toFreeShipping }
  }, [state.lines])

  return {
    ...derived,
    favorites: state.favorites,
    isFavorite: (id: string) => state.favorites.includes(id),
    toggleFavorite: (productId: string) => dispatch({ type: 'fav', productId }),
    add: (productId: string, choices: Choices = {}, qty = 1, openCart = true) => {
      dispatch({ type: 'add', productId, choices, qty })
      if (openCart) setCartOpen(true)
    },
    setQty: (key: string, qty: number) => dispatch({ type: 'qty', key, qty }),
    remove: (key: string) => dispatch({ type: 'remove', key }),
    clear: () => dispatch({ type: 'clear' }),
    cartOpen,
    setCartOpen,
  }
}

export type Shop = ReturnType<typeof useShopState>

export function ShopProvider({ children }: { children: ReactNode }) {
  return <ShopContext value={useShopState()}>{children}</ShopContext>
}
