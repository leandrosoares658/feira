import { useState } from 'react'
import { Link } from 'react-router'
import { m } from 'motion/react'
import { store } from '../config'
import { formatMoney } from '../lib/format'
import { scrollToTop } from '../lib/scroll'
import { useShop } from '../state/context'
import { shippingCost } from '../lib/shipping'
import { placeOrder } from '../lib/supabase'
import Breadcrumbs from '../components/Breadcrumbs'
import Icon from '../components/Icon'
import ProductImage from '../components/ProductImage'
import SellerLogo from '../components/SellerLogo'

type Pay = 'pix' | 'cartao' | 'boleto'
type Order = { id: string; email: string; total: number; pay: Pay; method: string; sellers: number }

const maskCep = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
const maskPhone = (v: string) =>
  v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2')
const maskCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const maskExp = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')

function Field({ label, wide, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; wide?: boolean }) {
  return (
    <label className={`field ${wide ? 'field--wide' : ''}`}>
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

export default function Checkout() {
  const { lines, bySeller, subtotal, clear } = useShop()
  const [method, setMethod] = useState(store.shipping.methods[0].id)
  const [pay, setPay] = useState<Pay>('pix')
  const [parcelas, setParcelas] = useState(1)
  const [masked, setMasked] = useState({ cep: '', phone: '', card: '', exp: '' })
  const [order, setOrder] = useState<Order | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const freight = shippingCost(subtotal, method)
  const discount = pay === 'pix' ? subtotal * store.pixDiscount : 0
  const total = subtotal + freight - discount
  const methodInfo = store.shipping.methods.find((x) => x.id === method)!

  if (order) {
    return (
      <div className="wrap page confirm">
        <m.div className="confirm__card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <span className="confirm__icon"><Icon name="check" size={28} /></span>
          <p className="eyebrow">Pedido {order.id}</p>
          <h1>Pedido recebido</h1>
          <p>
            Enviamos a confirmação para <strong>{order.email}</strong>.
            {order.sellers > 1 && ` Seus itens vêm de ${order.sellers} lojas e podem chegar em pacotes separados.`}
          </p>
          <dl className="confirm__facts">
            <div><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
            <div><dt>Pagamento</dt><dd>{{ pix: 'Pix', cartao: 'Cartão de crédito', boleto: 'Boleto' }[order.pay]}</dd></div>
            <div><dt>Entrega</dt><dd>{order.method}</dd></div>
          </dl>
          {order.pay === 'pix' && <p className="confirm__note">O código Pix vale por 30 minutos e também foi enviado por e-mail.</p>}
          {order.pay === 'boleto' && <p className="confirm__note">O boleto vence em 3 dias úteis. O pedido é liberado após a compensação.</p>}
          <Link to="/" className="btn">Continuar comprando</Link>
        </m.div>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="wrap page empty empty--page">
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione produtos para finalizar a compra.</p>
        <Link to="/busca" className="btn">Explorar produtos</Link>
      </div>
    )
  }

  return (
    <div className="wrap page checkout">
      <Breadcrumbs items={[{ label: 'Finalizar compra' }]} />
      <h1 className="checkout__title">Finalizar compra</h1>
      <form
        className="checkout__grid"
        onSubmit={async (e) => {
          e.preventDefault()
          if (sending) return
          const f = new FormData(e.currentTarget)
          const get = (k: string) => String(f.get(k) ?? '').trim()
          setSending(true)
          setError('')
          // Dados do cartão nunca saem do navegador: só a forma de pagamento vai para o banco.
          const result = await placeOrder({
            store_id: store.id,
            customer: { name: get('nome'), email: get('email'), phone: get('tel') },
            address: { cep: get('cep'), rua: get('rua'), numero: get('numero'), complemento: get('comp'), bairro: get('bairro'), cidade: get('cidade') },
            shipping_method: method,
            shipping_price: store.shipping.methods.find((x) => x.id === method)?.price ?? 0,
            free_over: store.shipping.freeOver,
            payment_method: pay,
            pix_discount: store.pixDiscount,
            installments: pay === 'cartao' ? parcelas : 1,
            items: lines.map((l) => ({ product_id: l.productId, qty: l.qty, choices: l.choices })),
          })
          setSending(false)
          if (result && 'error' in result) {
            setError(result.error)
            return
          }
          setOrder({
            // Sem banco (não configurado ou fora do ar), o pedido é só simulado.
            id: '#' + (result ? result.number : Math.floor(100000 + Math.random() * 900000)),
            email: get('email'),
            total,
            pay,
            method: `${methodInfo.label} · ${methodInfo.days}`,
            sellers: bySeller.length,
          })
          clear()
          scrollToTop()
        }}
      >
        <div className="checkout__steps">
          <fieldset className="step">
            <legend><span>1</span> Seus dados</legend>
            <div className="fields">
              <Field label="Nome completo" name="nome" autoComplete="name" required wide />
              <Field label="E-mail" name="email" type="email" autoComplete="email" required />
              <Field
                label="Celular"
                name="tel"
                type="tel"
                autoComplete="tel"
                required
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                title="Ex.: (11) 91234-5678"
                value={masked.phone}
                onChange={(e) => setMasked((s) => ({ ...s, phone: maskPhone(e.target.value) }))}
              />
            </div>
          </fieldset>

          <fieldset className="step">
            <legend><span>2</span> Entrega</legend>
            <div className="fields">
              <Field
                label="CEP"
                name="cep"
                inputMode="numeric"
                autoComplete="postal-code"
                required
                pattern="\d{5}-\d{3}"
                title="Ex.: 01310-100"
                value={masked.cep}
                onChange={(e) => setMasked((s) => ({ ...s, cep: maskCep(e.target.value) }))}
              />
              <Field label="Endereço" name="rua" autoComplete="address-line1" required wide />
              <Field label="Número" name="numero" required />
              <Field label="Complemento" name="comp" autoComplete="address-line2" />
              <Field label="Bairro" name="bairro" required />
              <Field label="Cidade" name="cidade" autoComplete="address-level2" required />
            </div>
            <div className="options">
              {store.shipping.methods.map((x) => {
                const cost = shippingCost(subtotal, x.id)
                return (
                  <label key={x.id} className={`option ${method === x.id ? 'is-on' : ''}`}>
                    <input type="radio" name="frete" checked={method === x.id} onChange={() => setMethod(x.id)} />
                    <span className="option__main">{x.label}<small>{x.days}</small></span>
                    <strong>{cost === 0 ? 'Grátis' : formatMoney(cost)}</strong>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="step">
            <legend><span>3</span> Pagamento</legend>
            <div className="options options--row">
              {([
                ['pix', 'Pix', store.pixDiscount ? `${Math.round(store.pixDiscount * 100)}% de desconto` : 'Aprovação na hora'],
                ['cartao', 'Cartão de crédito', `Até ${store.installments}x sem juros`],
                ['boleto', 'Boleto', 'Vence em 3 dias úteis'],
              ] as const).map(([id, label, sub]) => (
                <label key={id} className={`option ${pay === id ? 'is-on' : ''}`}>
                  <input type="radio" name="pagamento" checked={pay === id} onChange={() => setPay(id)} />
                  <span className="option__main">{label}<small>{sub}</small></span>
                </label>
              ))}
            </div>
            {pay === 'cartao' && (
              <div className="fields">
                <Field
                  label="Número do cartão"
                  name="cartao"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  pattern="(\d{4} ){3}\d{4}"
                  title="16 dígitos"
                  value={masked.card}
                  onChange={(e) => setMasked((s) => ({ ...s, card: maskCard(e.target.value) }))}
                  wide
                />
                <Field label="Nome impresso" name="titular" autoComplete="cc-name" required wide />
                <Field
                  label="Validade"
                  name="validade"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  required
                  pattern="(0[1-9]|1[0-2])/\d{2}"
                  value={masked.exp}
                  onChange={(e) => setMasked((s) => ({ ...s, exp: maskExp(e.target.value) }))}
                />
                <Field label="CVV" name="cvv" inputMode="numeric" autoComplete="cc-csc" required pattern="\d{3,4}" maxLength={4} />
                <label className="field field--wide">
                  <span>Parcelas</span>
                  <select value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
                    {Array.from({ length: store.installments }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}x de {formatMoney(total / n)} sem juros</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <p className="checkout__safe"><Icon name="shield" size={16} /> Ambiente de demonstração — nenhum pagamento é processado.</p>
          </fieldset>
        </div>

        <aside className="summary">
          <h2>Resumo</h2>
          {bySeller.map(({ seller, lines: ls }) => (
            <div key={seller.id} className="summary__group">
              <p className="summary__seller"><SellerLogo seller={seller} size="sm" /> {seller.name}</p>
              <ul>
                {ls.map((l) => (
                  <li key={l.key}>
                    <span className="summary__img"><ProductImage product={l.product} sizes="56px" /><b>{l.qty}</b></span>
                    <span className="summary__name">
                      {l.product.name}
                      {Object.keys(l.choices).length > 0 && <small>{Object.values(l.choices).join(' · ')}</small>}
                    </span>
                    <span>{formatMoney(l.product.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="sum-row"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="sum-row"><span>Frete</span><span>{freight === 0 ? 'Grátis' : formatMoney(freight)}</span></div>
          {discount > 0 && <div className="sum-row sum-row--save"><span>Desconto Pix</span><span>−{formatMoney(discount)}</span></div>}
          <div className="sum-row sum-row--total"><span>Total</span><span>{formatMoney(total)}</span></div>
          {error && <p className="checkout__error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--block" disabled={sending} aria-busy={sending}>
            {sending ? 'Enviando pedido…' : `${pay === 'pix' ? 'Gerar Pix' : pay === 'boleto' ? 'Gerar boleto' : 'Pagar'} · ${formatMoney(total)}`}
          </button>
        </aside>
      </form>
    </div>
  )
}
