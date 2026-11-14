import { discountPct, formatMoney, installmentText, pixPrice } from '../lib/format'
import { store } from '../config'

type Props = { price: number; compareAt?: number; size?: 'md' | 'lg'; detail?: boolean }

export default function Price({ price, compareAt, size = 'md', detail = false }: Props) {
  const off = discountPct(price, compareAt)
  return (
    <div className={`price price--${size}`}>
      {off > 0 && compareAt && (
        <div className="price__was">
          <s>{formatMoney(compareAt)}</s>
          <span className="price__off">−{off}%</span>
        </div>
      )}
      <div className="price__now">{formatMoney(price)}</div>
      <div className="price__terms">{installmentText(price)}</div>
      {detail && store.pixDiscount > 0 && (
        <div className="price__pix">
          <strong>{formatMoney(pixPrice(price))}</strong> no Pix ({Math.round(store.pixDiscount * 100)}% de desconto)
        </div>
      )}
    </div>
  )
}
