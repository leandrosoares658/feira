import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="wrap page empty empty--page">
      <p className="eyebrow">Erro 404</p>
      <h1>Essa página não existe</h1>
      <p>O link pode estar quebrado ou o produto saiu do catálogo.</p>
      <div className="hero__ctas">
        <Link to="/" className="btn">Ir para o início</Link>
        <Link to="/busca" className="btn btn--ghost">Ver produtos</Link>
      </div>
    </div>
  )
}
