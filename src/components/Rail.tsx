import { Link } from 'react-router'
import type { Product } from '../config'
import ProductCard from './ProductCard'

export default function Rail({ title, products, more }: { title: string; products: Product[]; more?: string }) {
  if (!products.length) return null
  return (
    <section className="rail wrap">
      <header className="section-head">
        <h2>{title}</h2>
        {more && <Link to={more} className="link-arrow">Ver tudo</Link>}
      </header>
      <div className="rail__track" data-lenis-prevent-horizontal>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
