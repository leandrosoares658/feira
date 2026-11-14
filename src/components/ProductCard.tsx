import { Link } from 'react-router'
import { store, type Product } from '../config'
import { getSeller, isOnSale } from '../lib/catalog'
import { discountPct } from '../lib/format'
import ProductImage from './ProductImage'
import FavoriteButton from './FavoriteButton'
import Price from './Price'
import Rating from './Rating'

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const seller = getSeller(product.sellerId)
  const off = discountPct(product.price, product.compareAt)
  const soldOut = product.stock === 0
  const free = product.freeShipping || product.price >= store.shipping.freeOver
  const swatches = product.options?.find((o) => o.values.some((v) => v.swatch))?.values

  return (
    <article className={`card ${soldOut ? 'is-soldout' : ''}`}>
      <Link to={`/p/${product.slug}`} className="card__media" tabIndex={-1} aria-hidden>
        <ProductImage product={product} priority={priority} />
      </Link>
      <div className="card__flags">
        {soldOut ? <span className="flag">Esgotado</span> : product.badge && <span className="flag">{product.badge}</span>}
        {isOnSale(product) && !soldOut && <span className="flag flag--sale">−{off}%</span>}
      </div>
      <FavoriteButton productId={product.id} className="card__fav" />
      <div className="card__body">
        {seller && <span className="card__seller">{seller.name}</span>}
        <h3 className="card__title">
          <Link to={`/p/${product.slug}`}>{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.reviews} compact />
        <Price price={product.price} compareAt={product.compareAt} />
        <div className="card__meta">
          {swatches && (
            <span className="card__swatches" title={swatches.map((v) => v.label).join(', ')}>
              {swatches.slice(0, 4).map((v) => (
                <i key={v.label} style={{ background: v.swatch }} />
              ))}
            </span>
          )}
          {free && !soldOut && <span className="card__ship">Frete grátis</span>}
        </div>
      </div>
    </article>
  )
}
