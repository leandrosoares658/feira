import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { store } from '../config'
import { getSeller, products } from '../lib/catalog'
import { formatNumber } from '../lib/format'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductCard from '../components/ProductCard'
import Rating from '../components/Rating'
import SellerLogo from '../components/SellerLogo'
import NotFound from './NotFound'

export function Sellers() {
  return (
    <div className="wrap page">
      <Breadcrumbs items={[{ label: 'Lojas' }]} />
      <header className="page__head">
        <h1>Lojas</h1>
        <p>Cada produto é vendido e enviado pela loja que o anuncia. Conheça quem está por trás.</p>
      </header>
      <div className="seller-grid seller-grid--wide">
        {store.sellers.map((s) => (
          <Link key={s.id} to={`/loja/${s.slug}`} className="seller-card" style={{ '--tone': s.tone } as CSSProperties}>
            <SellerLogo seller={s} />
            <span className="seller-card__name">{s.name}</span>
            <span className="seller-card__city">{s.city}</span>
            <span className="seller-card__blurb">{s.blurb}</span>
            <span className="seller-card__stats">
              <Rating value={s.rating} compact /> · {formatNumber(s.sales)} vendas · {products.filter((p) => p.sellerId === s.id).length} produtos
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Seller() {
  const { slug = '' } = useParams()
  const seller = getSeller(slug)
  if (!seller) return <NotFound />
  const list = products.filter((p) => p.sellerId === seller.id)

  return (
    <div className="wrap page">
      <Breadcrumbs items={[{ label: 'Lojas', to: '/lojas' }, { label: seller.name }]} />
      <header className="seller-hero" style={{ '--tone': seller.tone } as CSSProperties}>
        <SellerLogo seller={seller} size="lg" />
        <div>
          <h1>{seller.name}</h1>
          <p>{seller.blurb}</p>
        </div>
        <dl>
          <div><dt>Nota</dt><dd><Rating value={seller.rating} /></dd></div>
          <div><dt>Vendas</dt><dd>{formatNumber(seller.sales)}</dd></div>
          <div><dt>Na {store.brand.name} desde</dt><dd>{seller.since}</dd></div>
          <div><dt>Envia de</dt><dd>{seller.city}</dd></div>
        </dl>
      </header>
      <h2 className="page__sub">{list.length} produtos</h2>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
