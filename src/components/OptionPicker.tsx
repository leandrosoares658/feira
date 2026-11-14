import type { ProductOption } from '../config'

type Props = { option: ProductOption; value?: string; onChange: (v: string) => void; error?: boolean }

export default function OptionPicker({ option, value, onChange, error }: Props) {
  const hasSwatch = option.values.some((v) => v.swatch)
  return (
    <fieldset className={`picker ${error ? 'has-error' : ''}`}>
      <legend>
        {option.name}
        {value ? <span>: {value}</span> : error ? <em> — escolha uma opção</em> : null}
      </legend>
      <div className="picker__values">
        {option.values.map((v) => (
          <label
            key={v.label}
            className={`chip ${hasSwatch ? 'chip--swatch' : ''} ${v.soldOut ? 'is-out' : ''}`}
            title={v.soldOut ? `${v.label} — esgotado` : v.label}
          >
            <input type="radio" name={option.name} value={v.label} checked={value === v.label} disabled={v.soldOut} onChange={() => onChange(v.label)} />
            {hasSwatch && <i style={{ background: v.swatch }} aria-hidden />}
            <span className={hasSwatch ? 'sr-only' : ''}>{v.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
