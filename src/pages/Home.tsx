import { Link } from 'react-router'
import { m } from 'motion/react'
import type { CSSProperties } from 'react'
import { store } from '../config'
import { getProduct, getSeller, products, railProducts } from '../lib/catalog'
import { formatNumber } from '../lib/format'
import ProductImage from '../components/ProductImage'
import Price from '../components/Price'
import Rail from '../components/Rail'
import Rating from '../components/Rating'
import SellerLogo from '../components/SellerLogo'

const ease = [0.22, 1, 0.36, 1] as const
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

export default function Home() {
  const featured = getProduct(store.hero.productId) ?? products[0]
  const featuredSeller = getSeller(featured.sellerId)

  return (
    <>
      <section className="hero wrap">
        <div className="hero__copy">
          <m.p className="eyebrow" {...rise(0)}>{store.hero.eyebrow}</m.p>
          <m.h1 {...rise(0.06)}>{store.hero.title}</m.h1>
          <m.p className="hero__body" {...rise(0.12)}>{store.hero.body}</m.p>
          <m.div className="hero__ctas" {...rise(0.18)}>
            <Link to={store.hero.cta.to} className="btn">{store.hero.cta.label}</Link>
            <Link to="/lojas" className="btn btn--ghost">Conhecer as lojas</Link>
          </m.div>
          <m.dl className="hero__stats" {...rise(0.24)}>
            <div><dt>Lojas</dt><dd>{store.sellers.length}</dd></div>
            <div><dt>Produtos</dt><dd>{products.length}</dd></div>
            <div><dt>Pedidos entregues</dt><dd>{formatNumber(store.sellers.reduce((n, s) => n + s.sales, 0))}</dd></div>
          </m.dl>
        </div>
        <m.div
          className="hero__feature"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          <Link to={`/p/${featured.slug}`} className="hero__media">
            <ProductImage product={featured} sizes="(min-width: 900px) 45vw, 100vw" priority />
          </Link>
          <div className="hero__tag">
            <span className="hero__tag-seller">{featuredSeller?.name}</span>
            <Link to={`/p/${featured.slug}`} className="hero__tag-name">{featured.name}</Link>
            <Rating value={featured.rating} count={featured.reviews} compact />
            <Price price={featured.price} compareAt={featured.compareAt} />
          </div>
        </m.div>
      </section>

      <section className="wrap block">
        <header className="section-head">
          <h2>Navegue por categoria</h2>
        </header>
        <div className="cat-grid">
          {store.categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length
            return (
              <Link key={c.id} to={`/c/${c.slug}`} className="cat-tile" style={{ '--tone': c.tone } as CSSProperties}>
                <span className="cat-tile__name">{c.name}</span>
                <span className="cat-tile__blurb">{c.blurb}</span>
                <span className="cat-tile__count">{count} produtos</span>
              </Link>
            )
          })}
        </div>
      </section>

      {store.rails.map((r) => (
        <Rail
          key={r.title}
          title={r.title}
          products={railProducts(r)}
          more={r.categoryId ? `/c/${r.categoryId}` : r.onSale ? '/busca?oferta=1' : '/busca'}
        />
      ))}

      <section className="wrap block">
        <header className="section-head">
          <h2>Quem vende aqui</h2>
          <Link to="/lojas" className="link-arrow">Todas as lojas</Link>
        </header>
        <div className="seller-grid">
          {store.sellers.map((s) => (
            <Link key={s.id} to={`/loja/${s.slug}`} className="seller-card" style={{ '--tone': s.tone } as CSSProperties}>
              <SellerLogo seller={s} />
              <span className="seller-card__name">{s.name}</span>
              <span className="seller-card__city">{s.city}</span>
              <span className="seller-card__stats">
                <Rating value={s.rating} compact /> · {formatNumber(s.sales)} vendas
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap perks">
        {store.perks.map((p, i) => (
          <div key={p.title} className="perk">
            <span className="perk__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </section>
    </>
  )
}
