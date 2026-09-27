import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, MessageSquare, Heart, TrendingUp, Star, Mail, Activity } from 'lucide-react'
import { readJson, STORAGE_KEYS } from '../../services/storage.js'
import { books } from '../../data/books.js'
import { getAllUsers } from '../../services/auth.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

function getLocalStats() {
  const users = getAllUsers()
  const progress = readJson(STORAGE_KEYS.progress, {})
  const favorites = readJson(STORAGE_KEYS.favorites, [])
  const ratings = readJson(STORAGE_KEYS.ratings, {})
  const comments = readJson(STORAGE_KEYS.comments, [])

  const booksWithReaders = Object.keys(progress).length
  const totalRatings = Object.keys(ratings).length
  const avgRating =
    totalRatings > 0
      ? (Object.values(ratings).reduce((sum, r) => sum + r, 0) / totalRatings).toFixed(1)
      : 'N/A'

  return {
    totalBooks: books.length,
    totalUsers: users.filter((u) => !u.isAdmin).length,
    totalComments: Array.isArray(comments) ? comments.length : 0,
    totalFavorites: Array.isArray(favorites) ? favorites.length : 0,
    booksWithReaders,
    totalRatings,
    avgRating,
  }
}

export function AdminDashboard() {
  useDocumentTitle('Dashboard — Admin MIKANDA')
  const stats = useMemo(() => getLocalStats(), [])

  const statCards = [
    { label: 'Livres', value: stats.totalBooks, icon: BookOpen, color: 'text-[#133a28] bg-[#e8f0eb]', link: '/admin/books' },
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-blue-700 bg-blue-50', link: '/admin/users' },
    { label: 'Commentaires', value: stats.totalComments, icon: MessageSquare, color: 'text-purple-700 bg-purple-50', link: '/admin/comments' },
    { label: 'Favoris ajoutés', value: stats.totalFavorites, icon: Heart, color: 'text-rose-700 bg-rose-50', link: '/admin/users' },
    { label: 'Livres lus', value: stats.booksWithReaders, icon: TrendingUp, color: 'text-[#c17248] bg-[#f9ede3]', link: '/admin/books' },
    { label: 'Note moyenne', value: stats.avgRating, icon: Star, color: 'text-yellow-700 bg-yellow-50', link: '/admin/books' },
  ]

  const recentBooks = books.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#705f57]">
          Vue d'ensemble de la bibliothèque MIKANDA (données locales)
        </p>
        <div className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          ⚠️ Données simulées via LocalStorage — Non sécurisé pour la production
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="group flex items-center gap-4 rounded-xl border border-[#e2ddd6] bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1410]">{card.value}</p>
              <p className="text-sm text-[#705f57]">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Livres récents */}
        <div className="rounded-xl border border-[#e2ddd6] bg-white">
          <div className="flex items-center justify-between border-b border-[#e2ddd6] px-6 py-4">
            <h2 className="font-semibold text-[#1a1410]">Livres dans la bibliothèque</h2>
            <Link to="/admin/books" className="text-xs text-[#c17248] hover:underline">
              Voir tout →
            </Link>
          </div>
          <ul className="divide-y divide-[#f0ebe4]">
            {recentBooks.map((book) => (
              <li key={book.id} className="flex items-center gap-3 px-6 py-3">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-10 w-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#1a1410]">{book.title}</p>
                  <p className="truncate text-xs text-[#705f57]">{book.author}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#d9d1c6] px-2 py-0.5 text-xs text-[#705f57]">
                  {book.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions rapides */}
        <div className="rounded-xl border border-[#e2ddd6] bg-white">
          <div className="border-b border-[#e2ddd6] px-6 py-4">
            <h2 className="font-semibold text-[#1a1410]">Actions rapides</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-6">
            {[
              { to: '/admin/books', label: 'Gérer les livres', icon: BookOpen },
              { to: '/admin/users', label: 'Gérer les utilisateurs', icon: Users },
              { to: '/admin/comments', label: 'Modérer les commentaires', icon: MessageSquare },
              { to: '/admin/messages', label: 'Voir les messages', icon: Mail },
              { to: '/admin/statistics', label: 'Statistiques', icon: TrendingUp },
              { to: '/admin/activity', label: 'Journal d\'activité', icon: Activity },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-2 rounded-xl border border-[#e2ddd6] p-4 text-center text-sm text-[#705f57] transition-colors hover:border-[#133a28] hover:bg-[#f4f9f6] hover:text-[#133a28]"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
