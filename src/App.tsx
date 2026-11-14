import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { LazyMotion, domAnimation } from 'motion/react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { setLenis } from './lib/scroll'
import { ShopProvider } from './state/shop'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Seller, { Sellers } from './pages/Seller'
import Favorites from './pages/Favorites'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'c/:slug', element: <Catalog /> },
      { path: 'busca', element: <Catalog /> },
      { path: 'p/:slug', element: <Product /> },
      { path: 'lojas', element: <Sellers /> },
      { path: 'loja/:slug', element: <Seller /> },
      { path: 'favoritos', element: <Favorites /> },
      { path: 'checkout', element: <Checkout /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.12 })
    setLenis(lenis)
    let id = 0
    const raf = (t: number) => {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <ShopProvider>
        <RouterProvider router={router} />
      </ShopProvider>
    </LazyMotion>
  )
}
