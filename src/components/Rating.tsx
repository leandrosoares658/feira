import Icon from './Icon'
import { formatNumber } from '../lib/format'

export default function Rating({ value, count, compact }: { value: number; count?: number; compact?: boolean }) {
  return (
    <span className="rating" aria-label={`Nota ${value.toFixed(1)} de 5${count ? `, ${count} avaliações` : ''}`}>
      <Icon name="star" size={compact ? 13 : 15} filled />
      <span>{value.toFixed(1).replace('.', ',')}</span>
      {count != null && <span className="rating__count">({formatNumber(count)})</span>}
    </span>
  )
}
