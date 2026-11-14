import { useState, type CSSProperties } from 'react'
import type { Seller } from '../config'

type Props = { seller: Seller; size?: 'sm' | 'md' | 'lg' }

/** Logo do vendedor; sem logo (ou se o arquivo falhar), a inicial no tom da loja. */
export default function SellerLogo({ seller, size = 'md' }: Props) {
  const [broken, setBroken] = useState(false)
  const cls = `seller-logo seller-logo--${size}`
  if (seller.logo && !broken) {
    return <img className={cls} src={seller.logo} alt="" width={64} height={64} loading="lazy" onError={() => setBroken(true)} />
  }
  return (
    <span className={`${cls} seller-logo--initial`} style={{ '--tone': seller.tone } as CSSProperties} aria-hidden>
      {seller.name[0]}
    </span>
  )
}
