import { useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'
import { store } from '../config'
import { useShop } from '../state/context'
import Icon from './Icon'
import Logo from './Logo'

export default function Header() {
  const { count, favorites, setCartOpen } = useShop()
  const [params] = useSearchParams()
  const current = params.get('q') ?? ''

  return (
    <header className="header">
      <p className="announce">{store.brand.announcement}</p>
      <div className="header__bar wrap">
        <Logo />
        {/* A key recria o campo quando a busca da URL muda. */}
        <SearchForm key={current} initial={current} />
        <nav className="header__actions" aria-label="Sua conta">
          <Link to="/favoritos" className="icon-btn" aria-label={`Favoritos (${favorites.length})`}>
            <Icon name="heart" />
            {favorites.length > 0 && <span className="dot">{favorites.length}</span>}
          </Link>
          <button type="button" className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Carrinho (${count} itens)`}>
            <Icon name="bag" />
            {count > 0 && <span className="dot">{count}</span>}
          </button>
        </nav>
      </div>
      <nav className="cats wrap" aria-label="Categorias">
        {store.categories.map((c) => (
          <NavLink key={c.id} to={`/c/${c.slug}`}>
            {c.name}
          </NavLink>
        ))}
        <NavLink to="/busca?oferta=1" className="cats__sale">Ofertas</NavLink>
        <NavLink to="/lojas">Lojas</NavLink>
      </nav>
    </header>
  )
}

function SearchForm({ initial }: { initial: string }) {
  const navigate = useNavigate()
  const [q, setQ] = useState(initial)
  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        navigate(q.trim() ? `/busca?q=${encodeURIComponent(q.trim())}` : '/busca')
      }}
    >
      <Icon name="search" size={18} />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar produtos, marcas e lojas"
        aria-label="Buscar"
        enterKeyHint="search"
      />
    </form>
  )
}
