import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { store } from '../config'
import { useShop } from '../state/context'
import { formatMoney } from '../lib/format'
import { lockScroll } from '../lib/scroll'
import Icon from './Icon'
import ProductImage from './ProductImage'
import QtyStepper from './QtyStepper'
import SellerLogo from './SellerLogo'

const ease = [0.22, 1, 0.36, 1] as const

export default function CartDrawer() {
  const { cartOpen, setCartOpen, bySeller, count, subtotal, savings, toFreeShipping, setQty, remove } = useShop()
  const navigate = useNavigate()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cartOpen) return
    lockScroll(true)
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [cartOpen, setCartOpen])

  const progress = Math.min(1, subtotal / store.shipping.freeOver)

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Carrinho">
          <m.div className="drawer__scrim" onClick={() => setCartOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <m.div
            ref={panel}
            tabIndex={-1}
            className="drawer__panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
          >
            <header className="drawer__head">
              <h2>Carrinho {count > 0 && <span>({count})</span>}</h2>
              <button type="button" className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">
                <Icon name="x" />
              </button>
            </header>

            {count === 0 ? (
              <div className="drawer__empty">
                <Icon name="bag" size={36} />
                <p>Seu carrinho está vazio.</p>
                <button type="button" className="btn" onClick={() => { setCartOpen(false); navigate('/busca') }}>
                  Explorar produtos
                </button>
              </div>
            ) : (
              <>
                <div className="ship-meter">
                  <p>
                    {toFreeShipping > 0 ? (
                      <>Faltam <strong>{formatMoney(toFreeShipping)}</strong> para o frete grátis</>
                    ) : (
                      <><Icon name="truck" size={16} /> Você ganhou <strong>frete grátis</strong></>
                    )}
                  </p>
                  <div className="ship-meter__bar"><span style={{ transform: `scaleX(${progress})` }} /></div>
                </div>

                <div className="drawer__body" data-lenis-prevent>
                  {bySeller.map(({ seller, lines }) => (
                    <section key={seller.id} className="cart-group">
                      <h3>
                        <SellerLogo seller={seller} size="sm" />
                        Vendido por <Link to={`/loja/${seller.slug}`} onClick={() => setCartOpen(false)}>{seller.name}</Link>
                      </h3>
                      <ul>
                        {lines.map((l) => (
                          <li key={l.key} className="line">
                            <Link to={`/p/${l.product.slug}`} onClick={() => setCartOpen(false)} className="line__img">
                              <ProductImage product={l.product} sizes="96px" />
                            </Link>
                            <div className="line__info">
                              <Link to={`/p/${l.product.slug}`} onClick={() => setCartOpen(false)} className="line__name">
                                {l.product.name}
                              </Link>
                              {Object.keys(l.choices).length > 0 && (
                                <p className="line__choices">{Object.entries(l.choices).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
                              )}
                              <div className="line__row">
                                <QtyStepper small value={l.qty} max={l.product.stock} onChange={(n) => setQty(l.key, n)} />
                                <strong>{formatMoney(l.product.price * l.qty)}</strong>
                              </div>
                              <button type="button" className="line__remove" onClick={() => remove(l.key)}>Remover</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <footer className="drawer__foot">
                  {savings > 0 && (
                    <div className="sum-row sum-row--save"><span>Você economiza</span><span>{formatMoney(savings)}</span></div>
                  )}
                  <div className="sum-row sum-row--total"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                  <p className="drawer__note">Frete e descontos calculados no próximo passo.</p>
                  <button type="button" className="btn btn--block" onClick={() => { setCartOpen(false); navigate('/checkout') }}>
                    Finalizar compra
                  </button>
                </footer>
              </>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
