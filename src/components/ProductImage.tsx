import type { CSSProperties } from 'react'
import type { Product } from '../config'
import { getCategory } from '../lib/catalog'

const WIDTHS = [480, 768] // manter igual a scripts/optimize-images.mjs
const srcSet = (name: string, ext: string) => WIDTHS.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ')

type Props = {
  product: Product
  /** Índice da imagem na galeria. */
  index?: number
  sizes?: string
  priority?: boolean
  className?: string
}

/**
 * Foto do produto (gerada por `npm run images`) ou, enquanto não houver foto,
 * um painel tipográfico no tom do produto — o catálogo nunca mostra imagem quebrada.
 */
export default function ProductImage({ product, index = 0, sizes = '(min-width: 900px) 25vw, 50vw', priority, className = '' }: Props) {
  const name = product.images?.[index]
  if (name) {
    return (
      <picture className={`pimg ${className}`}>
        <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
        <img
          src={`/images/${name}-768.jpg`}
          srcSet={srcSet(name, 'jpg')}
          sizes={sizes}
          alt={product.name}
          width={768}
          height={960}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </picture>
    )
  }
  const word = product.name.split(' ')[0]
  return (
    <div
      className={`pimg pimg--placeholder ${className}`}
      style={{ '--tone': product.tone, '--shift': `${12 + ((index * 23) % 40)}%` } as CSSProperties}
      role="img"
      aria-label={product.name}
    >
      <span className="pimg__cat">{getCategory(product.categoryId)?.name}</span>
      <span className="pimg__word" aria-hidden>{word}</span>
    </div>
  )
}
