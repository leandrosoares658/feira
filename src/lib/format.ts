import { store } from '../config'

const money = new Intl.NumberFormat(store.locale, { style: 'currency', currency: store.currency })
const number = new Intl.NumberFormat(store.locale)

export const formatMoney = (n: number) => money.format(n)
export const formatNumber = (n: number) => number.format(n)

export const installmentText = (price: number) => {
  const n = store.installments
  return n > 1 ? `ou ${n}x de ${formatMoney(price / n)} sem juros` : ''
}

export const pixPrice = (price: number) => price * (1 - store.pixDiscount)

export const discountPct = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0

export const plural = (n: number, one: string, many: string) => `${formatNumber(n)} ${n === 1 ? one : many}`
