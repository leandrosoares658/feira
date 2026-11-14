import type Lenis from 'lenis'

/** Instância única do Lenis, para pausar o scroll da página quando uma gaveta abre. */
let instance: Lenis | null = null
export const setLenis = (l: Lenis | null) => { instance = l }
export const getLenis = () => instance

export function lockScroll(lock: boolean) {
  if (lock) instance?.stop()
  else instance?.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

export function scrollToTop(smooth = false) {
  if (instance) instance.scrollTo(0, { immediate: !smooth })
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}
