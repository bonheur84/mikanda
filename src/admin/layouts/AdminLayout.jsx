import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Activity,
  BookOpen,
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Library,
  Mail,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNotification } from '../../hooks/useNotification.jsx'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/books', label: 'Livres', icon: BookOpen },
  { to: '/admin/authors', label: 'Auteurs', icon: Users },
  { to: '/admin/collections', label: 'Collections', icon: Library },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/comments', label: 'Commentaires', icon: MessageSquare },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/statistics', label: 'Statistiques', icon: BarChart3 },
  { to: '/admin/activity', label: 'Activité', icon: Activity },
  { to: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const notify = useNotification()
  const navigate = useNavigate()

  function handleLogout() {
    if (window.confirm('Déconnecter l\'administrateur ?')) {
      logout()
      notify.info('Déconnecté du panneau d\'administration.')
      navigate('/connexion')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f3f0]">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#e2ddd6] bg-[#133a28] text-[#e9e0d4] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo admin */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#c17248]" />
            <div>
              <span className="block font-serif text-lg uppercase tracking-wide">MIKANDA</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#c17248]">
                Administration
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c17248] text-sm font-bold text-white">
              {(user?.firstName || 'A').charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-white/60">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10"
            >
              <ChevronLeft className="h-3 w-3" />
              Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-400/30 px-2 py-1.5 text-xs text-red-300 hover:bg-red-900/30"
            >
              <LogOut className="h-3 w-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="flex items-center justify-between border-b border-[#e2ddd6] bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-[#f4ece2]"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg">MIKANDA Admin</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
