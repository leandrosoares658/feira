import { createClient } from '@supabase/supabase-js'
import type { Category, Product, Seller, StoreConfig } from '../config'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** null quando as variáveis não estão configuradas — o site segue com os dados locais. */
export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

const TIMEOUT = 3500

type ProductRow = {
  id: string; slug: string; name: string; category_id: string; seller_id: string
  price: number; compare_at: number | null; rating: number; reviews: number; stock: number
  free_shipping: boolean; badge: string | null; description: string; highlights: string[] | null
  specs: Record<string, string> | null; options: Product['options'] | null; images: string[] | null
  tone: string; tags: string[] | null
}

const opt = <T,>(v: T | null) => v ?? undefined

const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  categoryId: r.category_id,
  sellerId: r.seller_id,
  price: Number(r.price),
  compareAt: r.compare_at == null ? undefined : Number(r.compare_at),
  rating: Number(r.rating),
  reviews: r.reviews,
  stock: r.stock,
  freeShipping: r.free_shipping,
  badge: opt(r.badge),
  description: r.description,
  highlights: opt(r.highlights),
  specs: opt(r.specs),
  options: opt(r.options),
  images: opt(r.images),
  tone: r.tone,
  tags: opt(r.tags),
})

export type Catalog = Pick<StoreConfig, 'categories' | 'sellers' | 'products'>

/**
 * Busca o catálogo da loja no Supabase. Devolve null se não estiver configurado,
 * demorar demais (ex.: projeto pausado no plano grátis) ou vier vazio.
 */
export async function fetchCatalog(storeId: string): Promise<Catalog | null> {
  if (!supabase) return null
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const q = <T,>(table: string, cols: string) =>
      supabase.from(table).select(cols).eq('store_id', storeId).order('position').abortSignal(ctrl.signal).returns<T[]>()
    const [c, s, p] = await Promise.all([
      q<Category>('categories', 'id, slug, name, blurb, tone'),
      q<Seller>('sellers', 'id, slug, name, city, since, rating, sales, blurb, tone'),
      q<ProductRow>('products', '*'),
    ])
    if (c.error || s.error || p.error) throw c.error ?? s.error ?? p.error
    if (!p.data.length) return null
    return {
      categories: c.data,
      sellers: s.data.map((x) => ({ ...x, rating: Number(x.rating) })),
      products: p.data.map(toProduct),
    }
  } catch (e) {
    console.info('[catálogo] usando dados locais:', e instanceof Error ? e.message : e)
    return null
  } finally {
    clearTimeout(timer)
  }
}

export type OrderPayload = {
  store_id: string
  customer: { name: string; email: string; phone: string }
  address: Record<string, string>
  shipping_method: string
  shipping_price: number
  free_over: number
  payment_method: 'pix' | 'cartao' | 'boleto'
  pix_discount: number
  installments: number
  items: { product_id: string; qty: number; choices: Record<string, string> }[]
}

/** Grava o pedido. Devolve o número, ou null se o banco não estiver disponível. */
export async function placeOrder(payload: OrderPayload): Promise<{ number: number } | { error: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('place_order', { payload })
  if (!error) return { number: Number(data) }
  // Erros de regra (estoque, e-mail) voltam para o cliente; falhas de rede caem no modo local.
  if (error.code === 'P0001') return { error: error.message }
  console.info('[pedido] banco indisponível, pedido simulado:', error.message)
  return null
}
