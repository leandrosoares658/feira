import { Link } from 'react-router'
import { store } from '../config'
import Logo from './Logo'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>{store.brand.tagline}</p>
        </div>
        <div>
          <h3>Categorias</h3>
          <ul>
            {store.categories.map((c) => (
              <li key={c.id}><Link to={`/c/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Lojas</h3>
          <ul>
            {store.sellers.map((s) => (
              <li key={s.id}><Link to={`/loja/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Ajuda</h3>
          <ul>
            {store.perks.map((p) => (
              <li key={p.title}>{p.title}</li>
            ))}
          </ul>
        </div>
        <div className="footer__sell">
          <h3>Venda com a gente</h3>
          <p>Abra sua loja, cadastre produtos e receba pedidos de todo o país.</p>
          <Link to="/lojas" className="btn btn--ghost">Conhecer as lojas</Link>
        </div>
      </div>
      <div className="wrap footer__legal">
        <span>© {YEAR} {store.brand.name}</span>
        <span>Pagamento seguro · Pix · Cartão · Boleto</span>
      </div>
    </footer>
  )
}
