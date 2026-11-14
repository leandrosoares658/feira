import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { store } from '../config'
import { applyFilters, facetsFor, getCategory, isOnSale, products, search, sorts, type Filters, type SortKey } from '../lib/catalog'
import { lockScroll } from '../lib/scroll'
import Breadcrumbs from '../components/Breadcrumbs'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'

const OPT = 'f.'

export default function Catalog() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const category = slug ? getCategory(slug) : undefined

  useEffect(() => {
    if (!sheet) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [sheet])

  const q = params.get('q') ?? ''
  const sort = (params.get('ordem') as SortKey) in sorts ? (params.get('ordem') as SortKey) : 'relevancia'

  const base = useMemo(() => {
    const inCat = category ? products.filter((p) => p.categoryId === category.id) : products
    return search(q, inCat)
  }, [category, q])

  const filters: Filters = {
    sellers: params.getAll('vendedor'),
    options: Object.fromEntries(
      [...new Set([...params.keys()].filter((k) => k.startsWith(OPT)))].map((k) => [k.slice(OPT.length), params.getAll(k)]),
    ),
    minPrice: params.get('min') ? Number(params.get('min')) : undefined,
    maxPrice: params.get('max') ? Number(params.get('max')) : undefined,
    onSale: params.has('oferta'),
    freeShipping: params.has('frete'),
    inStock: params.has('estoque'),
  }
  const results = applyFilters([...base], filters, sort)
  const facets = facetsFor(base)
  const sellersHere = store.sellers.filter((s) => base.some((p) => p.sellerId === s.id))
  const activeCount =
    filters.sellers.length + Object.values(filters.options).flat().length + Number(filters.onSale) + Number(filters.freeShipping) +
    Number(filters.inStock) + Number(filters.minPrice != null || filters.maxPrice != null)

  if (slug && !category) return <NotFound />

  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    fn(next)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const toggleMulti = (key: string, value: string) =>
    update((p) => {
      const cur = p.getAll(key)
      p.delete(key)
      for (const v of cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]) p.append(key, v)
    })
  const toggleFlag = (key: string) => update((p) => (p.has(key) ? p.delete(key) : p.set(key, '1')))
  const clearAll = () => update((p) => [...p.keys()].filter((k) => k !== 'q').forEach((k) => p.delete(k)))

  const title = category?.name ?? (q ? `Resultados para “${q}”` : filters.onSale ? 'Ofertas' : 'Todos os produtos')
  const prices = base.map((p) => p.price)

  return (
    <div className="wrap catalog">
      <Breadcrumbs items={[{ label: title }]} />
      <header className="catalog__head">
        <div>
          <h1>{title}</h1>
          {category && <p className="catalog__blurb">{category.blurb}</p>}
        </div>
        <div className="catalog__tools">
          <button type="button" className="btn btn--ghost btn--sm catalog__filter-btn" onClick={() => setSheet(true)}>
            <Icon name="sliders" size={16} /> Filtros{activeCount > 0 && ` (${activeCount})`}
          </button>
          <label className="select">
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => update((p) => p.set('ordem', e.target.value))}>
              {Object.entries(sorts).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="catalog__layout">
        <aside className={`filters ${sheet ? 'is-open' : ''}`} aria-label="Filtros" data-lenis-prevent>
          <div className="filters__head">
            <h2>Filtros</h2>
            <button type="button" className="icon-btn" onClick={() => setSheet(false)} aria-label="Fechar filtros">
              <Icon name="x" />
            </button>
          </div>

          <div className="filter-group">
            <h3>Mostrar só</h3>
            {[
              ['oferta', 'Em oferta', base.some(isOnSale)],
              ['frete', 'Frete grátis', true],
              ['estoque', 'Com estoque', true],
            ].map(([key, label, show]) =>
              show ? (
                <label key={key as string} className="check">
                  <input type="checkbox" checked={params.has(key as string)} onChange={() => toggleFlag(key as string)} />
                  {label}
                </label>
              ) : null,
            )}
          </div>

          {prices.length > 1 && (
            <div className="filter-group">
              <h3>Preço</h3>
              <div className="price-range">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={`Mín. ${Math.floor(Math.min(...prices))}`}
                  key={`min-${params.get('min')}`}
                  defaultValue={params.get('min') ?? ''}
                  onBlur={(e) => update((p) => (e.target.value ? p.set('min', e.target.value) : p.delete('min')))}
                  aria-label="Preço mínimo"
                />
                <span>até</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={`Máx. ${Math.ceil(Math.max(...prices))}`}
                  key={`max-${params.get('max')}`}
                  defaultValue={params.get('max') ?? ''}
                  onBlur={(e) => update((p) => (e.target.value ? p.set('max', e.target.value) : p.delete('max')))}
                  aria-label="Preço máximo"
                />
              </div>
            </div>
          )}

          {facets.map((f) => {
            const swatch = f.values.some((v) => v.swatch)
            return (
              <div key={f.name} className="filter-group">
                <h3>{f.name}</h3>
                <div className={swatch ? 'filter-swatches' : 'filter-chips'}>
                  {f.values.map((v) => {
                    const on = filters.options[f.name]?.includes(v.label) ?? false
                    return (
                      <button
                        key={v.label}
                        type="button"
                        className={`chip ${swatch ? 'chip--swatch' : ''} ${on ? 'is-on' : ''}`}
                        aria-pressed={on}
                        title={v.label}
                        onClick={() => toggleMulti(OPT + f.name, v.label)}
                      >
                        {swatch && <i style={{ background: v.swatch }} aria-hidden />}
                        <span className={swatch ? 'sr-only' : ''}>{v.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {sellersHere.length > 1 && (
            <div className="filter-group">
              <h3>Loja</h3>
              {sellersHere.map((s) => (
                <label key={s.id} className="check">
                  <input type="checkbox" checked={filters.sellers.includes(s.id)} onChange={() => toggleMulti('vendedor', s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
          )}

          <div className="filters__foot">
            {activeCount > 0 && <button type="button" className="btn btn--ghost" onClick={clearAll}>Limpar</button>}
            <button type="button" className="btn" onClick={() => setSheet(false)}>Ver {results.length} produtos</button>
          </div>
        </aside>

        <section className="catalog__results" aria-live="polite">
          <p className="catalog__count">
            {results.length} {results.length === 1 ? 'produto' : 'produtos'}
            {activeCount > 0 && <button type="button" className="link" onClick={clearAll}>Limpar filtros</button>}
          </p>
          {results.length ? (
            <div className="grid">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>Nada por aqui</h2>
              <p>Nenhum produto combina com {q ? `“${q}” e ` : ''}esses filtros.</p>
              {activeCount > 0 && <button type="button" className="btn" onClick={clearAll}>Limpar filtros</button>}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
