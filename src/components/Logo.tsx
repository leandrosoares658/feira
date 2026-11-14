import { Link, useLocation } from 'react-router'
import { store } from '../config'
import { scrollToTop } from '../lib/scroll'

const mark = store.brand.mark?.(store.theme.colors)

/** Símbolo + nome da marca. Sempre leva ao início (e ao topo, se já estiver nele). */
export default function Logo() {
  const { pathname, search } = useLocation()
  return (
    <Link
      to="/"
      className="logo"
      aria-label={`${store.brand.name} — início`}
      onClick={() => {
        if (pathname === '/' && !search) scrollToTop(true)
      }}
    >
      {mark && <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden dangerouslySetInnerHTML={{ __html: mark }} />}
      <span>{store.brand.name}</span>
    </Link>
  )
}
