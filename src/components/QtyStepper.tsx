import Icon from './Icon'

type Props = { value: number; max: number; onChange: (n: number) => void; small?: boolean }

export default function QtyStepper({ value, max, onChange, small }: Props) {
  return (
    <div className={`qty ${small ? 'qty--sm' : ''}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Diminuir quantidade">
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade">
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}
