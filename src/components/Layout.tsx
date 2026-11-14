import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { scrollToTop } from '../lib/scroll'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => scrollToTop(), [pathname])

  return (
    <>
      <a href="#conteudo" className="skip">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
