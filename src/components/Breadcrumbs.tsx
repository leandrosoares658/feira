import { Link } from 'react-router'

export default function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Você está em">
      <ol>
        <li><Link to="/">Início</Link></li>
        {items.map((it) => (
          <li key={it.label}>{it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}
