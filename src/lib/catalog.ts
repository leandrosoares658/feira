import { store, type Product } from '../config'
import { fetchCatalog } from './supabase'

let byId = new Map(store.products.map((p) => [p.id, p]))
let bySlug = new Map(store.products.map((p) => [p.slug, p]))

export let products = store.products

/** Troca o catálogo local pelo do banco, se ele responder. Chamado uma vez, antes do primeiro render. */
export async function hydrateCatalog() {
  const remote = await fetchCatalog(store.id)
  if (!remote) return 'local' as const
  // O banco não guarda logos: reaproveita os do preset pelo id do vendedor.
  const localLogo = new Map(store.sellers.map((s) => [s.id, s.logo]))
  remote.sellers = remote.sellers.map((s) => ({ ...s, logo: s.logo ?? localLogo.get(s.id) }))
  Object.assign(store, remote)
  products = store.products
  byId = new Map(products.map((p) => [p.id, p]))
  bySlug = new Map(products.map((p) => [p.slug, p]))
  return 'supabase' as const
}

export const getProduct = (id: string) => byId.get(id)
export const getProductBySlug = (slug: string) => bySlug.get(slug)
export const getCategory = (idOrSlug: string) => store.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
export const getSeller = (idOrSlug: string) => store.sellers.find((s) => s.id === idOrSlug || s.slug === idOrSlug)
export const isOnSale = (p: Product) => !!p.compareAt && p.compareAt > p.price

export function railProducts(rail: (typeof store.rails)[number]) {
  return products.filter(
    (p) =>
      (!rail.tag || p.tags?.includes(rail.tag)) &&
      (!rail.categoryId || p.categoryId === rail.categoryId) &&
      (!rail.onSale || isOnSale(p)),
  )
}

export function related(p: Product, n = 4) {
  return products
    .filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.categoryId === p.categoryId) - Number(a.categoryId === p.categoryId) || b.rating - a.rating)
    .slice(0, n)
}

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function search(q: string, list: Product[] = products) {
  const terms = norm(q).split(/\s+/).filter(Boolean)
  if (!terms.length) return list
  return list.filter((p) => {
    const hay = norm([p.name, p.description, getCategory(p.categoryId)?.name, getSeller(p.sellerId)?.name, ...Object.values(p.specs ?? {})].join(' '))
    return terms.every((t) => hay.includes(t))
  })
}

/* ---------- Filtros gerados a partir dos produtos ---------- */

export type Facet = { name: string; values: { label: string; swatch?: string; count: number }[] }

/** Cada nome de opção (Cor, Tamanho, Armazenamento…) vira um filtro, sem configurar nada. */
export function facetsFor(list: Product[]): Facet[] {
  const map = new Map<string, Map<string, { swatch?: string; count: number }>>()
  for (const p of list) {
    for (const o of p.options ?? []) {
      const m = map.get(o.name) ?? new Map()
      for (const v of o.values) {
        const cur = m.get(v.label) ?? { swatch: v.swatch, count: 0 }
        cur.count++
        m.set(v.label, cur)
      }
      map.set(o.name, m)
    }
  }
  return [...map]
    .filter(([, m]) => m.size > 1)
    .map(([name, m]) => ({ name, values: [...m].map(([label, v]) => ({ label, ...v })) }))
}

export type Filters = {
  sellers: string[]
  options: Record<string, string[]>
  minPrice?: number
  maxPrice?: number
  onSale: boolean
  freeShipping: boolean
  inStock: boolean
}

export const sorts = {
  relevancia: 'Mais relevantes',
  vendidos: 'Mais avaliados',
  menor: 'Menor preço',
  maior: 'Maior preço',
  desconto: 'Maior desconto',
} as const
export type SortKey = keyof typeof sorts

export function applyFilters(list: Product[], f: Filters, sort: SortKey) {
  const out = list.filter(
    (p) =>
      (!f.sellers.length || f.sellers.includes(p.sellerId)) &&
      (f.minPrice == null || p.price >= f.minPrice) &&
      (f.maxPrice == null || p.price <= f.maxPrice) &&
      (!f.onSale || isOnSale(p)) &&
      (!f.freeShipping || p.freeShipping || p.price >= store.shipping.freeOver) &&
      (!f.inStock || p.stock > 0) &&
      Object.entries(f.options).every(
        ([name, wanted]) => !wanted.length || p.options?.some((o) => o.name === name && o.values.some((v) => wanted.includes(v.label))),
      ),
  )
  const off = (p: Product) => (p.compareAt ? 1 - p.price / p.compareAt : 0)
  const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
    relevancia: (a, b) => b.rating * Math.log(b.reviews + 2) - a.rating * Math.log(a.reviews + 2),
    vendidos: (a, b) => b.reviews - a.reviews,
    menor: (a, b) => a.price - b.price,
    maior: (a, b) => b.price - a.price,
    desconto: (a, b) => off(b) - off(a),
  }
  return out.sort(cmp[sort])
}
