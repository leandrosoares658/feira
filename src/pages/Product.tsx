import { useState, type CSSProperties } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { store } from '../config'
import { getCategory, getProductBySlug, getSeller, related } from '../lib/catalog'
import { formatMoney, formatNumber } from '../lib/format'
import { useShop, type Choices } from '../state/context'
import { shippingCost } from '../lib/shipping'
import Breadcrumbs from '../components/Breadcrumbs'
import FavoriteButton from '../components/FavoriteButton'
import Icon from '../components/Icon'
import OptionPicker from '../components/OptionPicker'
import Price from '../components/Price'
import ProductImage from '../components/ProductImage'
import QtyStepper from '../components/QtyStepper'
import Rail from '../components/Rail'
import Rating from '../components/Rating'
import SellerLogo from '../components/SellerLogo'
import NotFound from './NotFound'

export default function Product() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  // A key reinicia escolhas e quantidade ao trocar de produto.
  return product ? <ProductView key={product.id} product={product} /> : <NotFound />
}

function ProductView({ product }: { product: NonNullable<ReturnType<typeof getProductBySlug>> }) {
  const { add } = useShop()
  const navigate = useNavigate()
  const category = getCategory(product.categoryId)
  const seller = getSeller(product.sellerId)
  const options = product.options ?? []

  // Pré-seleciona opções que só têm um valor disponível.
  const [choices, setChoices] = useState<Choices>(() =>
    Object.fromEntries(options.flatMap((o) => {
      const avail = o.values.filter((v) => !v.soldOut)
      return avail.length === 1 ? [[o.name, avail[0].label]] : []
    })),
  )
  const [qty, setQty] = useState(1)
  const [tried, setTried] = useState(false)
  const [active, setActive] = useState(0)
  const [cep, setCep] = useState('')

  const soldOut = product.stock === 0
  const missing = options.filter((o) => !choices[o.name])
  // Com fotos, uma miniatura por foto; sem fotos, três variações do painel tipográfico.
  const views = product.images?.length || 3

  const submit = (then?: () => void) => {
    setTried(true)
    if (missing.length || soldOut) return
    add(product.id, choices, qty, !then)
    then?.()
  }

  const cepOk = /^\d{5}-?\d{3}$/.test(cep)

  return (
    <>
      <div className="wrap pdp">
        <Breadcrumbs items={[...(category ? [{ label: category.name, to: `/c/${category.slug}` }] : []), { label: product.name }]} />
        <div className="pdp__grid">
          <div className="gallery">
            <div className="gallery__main">
              <ProductImage product={product} index={active} sizes="(min-width: 900px) 55vw, 100vw" priority />
              <FavoriteButton productId={product.id} className="gallery__fav" />
            </div>
            {views > 1 && (
            <div className="gallery__thumbs" role="tablist" aria-label="Imagens do produto">
              {Array.from({ length: views }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`Imagem ${i + 1}`}
                  className={active === i ? 'is-on' : ''}
                  onClick={() => setActive(i)}
                >
                  <ProductImage product={product} index={i} sizes="96px" />
                </button>
              ))}
            </div>
            )}
          </div>

          <div className="buy">
            {seller && (
              <Link to={`/loja/${seller.slug}`} className="buy__seller">
                <SellerLogo seller={seller} size="sm" /> {seller.name}
              </Link>
            )}
            <h1>{product.name}</h1>
            <div className="buy__rating">
              <Rating value={product.rating} count={product.reviews} />
              {product.badge && <span className="flag">{product.badge}</span>}
            </div>

            <Price price={product.price} compareAt={product.compareAt} size="lg" detail />

            {options.map((o) => (
              <OptionPicker
                key={o.name}
                option={o}
                value={choices[o.name]}
                error={tried && !choices[o.name]}
                onChange={(v) => setChoices((c) => ({ ...c, [o.name]: v }))}
              />
            ))}

            {soldOut ? (
              <div className="buy__soldout">
                <strong>Produto esgotado</strong>
                <p>Salve nos favoritos para encontrar de novo quando voltar.</p>
              </div>
            ) : (
              <>
                <div className="buy__qty">
                  <QtyStepper value={qty} max={product.stock} onChange={(n) => setQty(Math.max(1, Math.min(product.stock, n)))} />
                  <span className={product.stock <= 5 ? 'low' : ''}>
                    {product.stock <= 5 ? `Só ${product.stock} em estoque` : `${formatNumber(product.stock)} disponíveis`}
                  </span>
                </div>
                <div className="buy__ctas">
                  <button type="button" className="btn btn--block" onClick={() => submit(() => navigate('/checkout'))}>
                    Comprar agora
                  </button>
                  <button type="button" className="btn btn--ghost btn--block" onClick={() => submit()}>
                    Adicionar ao carrinho
                  </button>
                </div>
              </>
            )}

            {product.highlights && (
              <ul className="buy__highlights">
                {product.highlights.map((h) => (
                  <li key={h}><Icon name="check" size={16} /> {h}</li>
                ))}
              </ul>
            )}

            <div className="shipcalc">
              <label htmlFor="cep"><Icon name="truck" size={18} /> Calcular frete</label>
              <input
                id="cep"
                inputMode="numeric"
                placeholder="00000-000"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/[^\d-]/g, ''))}
              />
              {cepOk && (
                <ul>
                  {store.shipping.methods.map((m) => {
                    const cost = product.freeShipping ? 0 : shippingCost(product.price * qty, m.id)
                    return (
                      <li key={m.id}>
                        <span>{m.label}<small>{m.days}</small></span>
                        <strong>{cost === 0 ? 'Grátis' : formatMoney(cost)}</strong>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {seller && (
              <Link to={`/loja/${seller.slug}`} className="seller-strip" style={{ '--tone': seller.tone } as CSSProperties}>
                <SellerLogo seller={seller} />
                <span>
                  <strong>{seller.name}</strong>
                  <small>{seller.city} · {formatNumber(seller.sales)} vendas · <Rating value={seller.rating} compact /></small>
                </span>
                <Icon name="chevron" size={18} />
              </Link>
            )}
          </div>
        </div>

        <div className="pdp__details">
          <section>
            <h2>Sobre o produto</h2>
            <p>{product.description}</p>
          </section>
          {product.specs && (
            <section>
              <h2>Ficha técnica</h2>
              <dl className="specs">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
      <Rail title="Você também pode gostar" products={related(product)} />
    </>
  )
}
