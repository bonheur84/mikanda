import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, X } from 'lucide-react'
import { SearchBar } from '../search/SearchBar.jsx'
import { useFavorites } from '../../hooks/useFavorites.jsx'
import { getCurrentUser } from '../../services/auth.js'

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/bibliotheque', label: 'Bibliothèque' },
  { to: '/auteurs', label: 'Auteurs' },
  { to: '/collections', label: 'Collections' },
  { to: '/apropos', label: 'À propos' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useFavorites()
  const location = useLocation()
  const user = getCurrentUser()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let lastScroll = 0
    const onScroll = () => {
      const current = window.scrollY
      setScrolled(current > 50)
      setHidden(current > lastScroll && current > 100)
      lastScroll = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `transition-colors hover:text-[#133a28] ${isActive ? 'text-[#133a28] font-medium' : ''}`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 mx-auto max-w-7xl flex items-center justify-between border-b border-[#d9d1c6] bg-[#f8f3e9] px-5 py-4 lg:px-8 transition-transform duration-300 ${scrolled ? 'shadow-md' : ''} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <Link to="/" className="flex items-center gap-2" aria-label="MIKANDA accueil">
        <img src="/assets/branding/logo.svg" alt="logo MIKANDA" className="h-11 w-12" />
        <div className="leading-5">
          <span className="block font-serif text-xl font-bold uppercase leading-none tracking-wide">mikanda</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#705f57]">la bibliotheque congolaise</span>
        </div>
      </Link>

      <nav className="hidden items-center gap-7 text-sm text-[#705f57] lg:flex" aria-label="Navigation principale">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        <SearchBar />
        <Link to="/favoris" className="relative text-[#705f57] hover:text-[#133a28]" aria-label="Favoris">
          <Heart className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 rounded-full bg-[#c17248] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {count}
          </span>
        </Link>
        {user ? (
          <span className="text-sm text-[#133a28]">{user.name}</span>
        ) : (
          <Link to="/connexion" className="text-sm text-[#705f57] underline-offset-2 hover:text-[#133a28] hover:underline">
            Connexion
          </Link>
        )}
        <Link
          to="/inscription"
          className="border border-[#133a28] bg-[#133a28] px-4 py-2 text-sm text-[#fff8fa] transition-transform hover:-translate-y-0.5 hover:shadow-lg shimmer-effect glow-effect"
        >
          S'inscrire
        </Link>
      </div>

      <button
        type="button"
        className="rounded-sm p-2 transition-all hover:scale-110 hover:bg-[#eae0d1] lg:hidden"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {menuOpen ? (
        <div className="mobile-menu-animate fixed inset-x-0 top-16 z-40 border-b border-[#d9d1c6] bg-[#f8f3e9] px-5 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-4 text-sm text-[#705f57]" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <SearchBar variant="mobile" />
            <Link to="/favoris" className="text-sm text-[#705f57] hover:text-[#133a28]">
              Favoris ({count})
            </Link>
            <Link to="/connexion" className="text-sm text-[#705f57] hover:text-[#133a28]">
              Connexion
            </Link>
            <Link to="/inscription" className="border border-[#133a28] bg-[#133a28] px-4 py-2 text-center text-sm text-[#fff8fa] shimmer-effect">
              S'inscrire
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
