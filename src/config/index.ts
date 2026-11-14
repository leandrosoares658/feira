import type { StoreConfig } from './types'
import { moda } from './presets/moda'
import { eletronicos } from './presets/eletronicos'
import { variedades } from './presets/variedades'

export const presets: Record<string, StoreConfig> = { moda, eletronicos, variedades }

const KEY = 'store-preset'

/**
 * Ordem de escolha da loja:
 * 1. `?loja=moda` na URL (fica salvo na sessão)
 * 2. o que já estava salvo na sessão
 * 3. a variável de build VITE_STORE_PRESET
 * 4. "variedades"
 */
function resolve(): StoreConfig {
  const fromUrl = new URLSearchParams(location.search).get('loja')
  if (fromUrl && presets[fromUrl]) {
    try { sessionStorage.setItem(KEY, fromUrl) } catch { /* sem storage */ }
    return presets[fromUrl]
  }
  try {
    const saved = sessionStorage.getItem(KEY)
    if (saved && presets[saved]) return presets[saved]
  } catch { /* sem storage */ }
  const env = import.meta.env.VITE_STORE_PRESET as string | undefined
  return (env && presets[env]) || variedades
}

export const store = resolve()

/** Escreve o tema da loja como variáveis CSS. */
export function applyTheme(s: StoreConfig = store) {
  const root = document.documentElement
  const { colors, fonts, radius, scheme } = s.theme
  for (const [k, v] of Object.entries(colors)) {
    root.style.setProperty(`--${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}`, v)
  }
  root.style.setProperty('--font-display', fonts.display)
  root.style.setProperty('--font-body', fonts.body)
  root.style.setProperty('--radius', `${radius}px`)
  root.style.colorScheme = scheme
  root.dataset.scheme = scheme
  root.lang = s.locale
  document.title = `${s.brand.name} — ${s.brand.tagline}`
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors.bg)
  document.querySelector('meta[name="description"]')?.setAttribute('content', s.brand.tagline)
  const mark = s.brand.mark?.(colors)
  if (mark) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${colors.bg}"/>${mark}</svg>`
    document.querySelector('link[rel="icon"]')?.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`)
  }
}

export type * from './types'
