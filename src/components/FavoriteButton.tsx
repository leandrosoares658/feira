import Icon from './Icon'
import { useShop } from '../state/context'

export default function FavoriteButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useShop()
  const on = isFavorite(productId)
  return (
    <button
      type="button"
      className={`fav ${on ? 'is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(productId)
      }}
    >
      <Icon name="heart" size={18} filled={on} />
    </button>
  )
}
