import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header.jsx'
import { Footer } from './Footer.jsx'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-[#f8f3e9] text-[#281e19]">
      <Header />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
