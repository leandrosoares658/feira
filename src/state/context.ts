import { createContext, use } from 'react'
import type { Product } from '../config'
import type { Shop } from './shop'

export type Choices = Record<string, string>
export type Line = { key: string; productId: string; qty: number; choices: Choices }
export type ResolvedLine = Line & { product: Product }

export const ShopContext = createContext<Shop | null>(null)

export function useShop() {
  const ctx = use(ShopContext)
  if (!ctx) throw new Error('useShop precisa estar dentro de <ShopProvider>')
  return ctx
}
