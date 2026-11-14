import { Link } from 'react-router'
import { getProduct } from '../lib/catalog'
import { useShop } from '../state/context'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductCard from '../components/ProductCard'

export default function Favorites() {
  const { favorites } = useShop()
  const list = favorites.flatMap((id) => getProduct(id) ?? [])

  return (
    <div className="wrap page">
      <Breadcrumbs items={[{ label: 'Favoritos' }]} />
      <header className="page__head">
        <h1>Favoritos</h1>
        <p>{list.length ? `${list.length} ${list.length === 1 ? 'produto salvo' : 'produtos salvos'} neste navegador.` : 'Toque no coração de um produto para guardá-lo aqui.'}</p>
      </header>
      {list.length ? (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Link to="/busca" className="btn">Explorar produtos</Link>
        </div>
      )}
    </div>
  )
}
