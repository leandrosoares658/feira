import { store } from '../config'

/** Frete de um carrinho: grátis acima do limite, senão o método escolhido. */
export function shippingCost(subtotal: number, methodId: string) {
  const m = store.shipping.methods.find((x) => x.id === methodId) ?? store.shipping.methods[0]
  if (m.price === 0) return 0
  return subtotal >= store.shipping.freeOver ? 0 : m.price
}
