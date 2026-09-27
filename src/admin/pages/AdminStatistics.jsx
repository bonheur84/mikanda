import { useMemo } from 'react'
import { BarChart3, BookOpen, Star, TrendingUp, Users } from 'lucide-react'
import { readJson, STORAGE_KEYS } from '../../services/storage.js'
import { books } from '../../data/books.js'
import { getAllUsers } from '../../services/auth.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

export function AdminStatistics() {
  useDocumentTitle('Statistiques — Admin MIKANDA')

  const stats = useMemo(() => {
    const users = getAllUsers().filter((u) => !u.isAdmin)
    const progress = readJson(STORAGE_KEYS.progress, {})
    const favorites = readJson(STORAGE_KEYS.favorites, [])
    const ratings = readJson(STORAGE_KEYS.ratings, {})

    const progressEntries = Object.entries(progress)
    const completedBooks = progressEntries.filter(([, p]) => p >= 100)
    const inProgressBooks = progressEntries.filter(([, p]) => p > 0 && p < 100)

    const ratingsValues = Object.values(ratings).filter((r) => typeof r === 'number')
    const avgRating = ratingsValues.length > 0
      ? (ratingsValues.reduce((a, b) => a + b, 0) / ratingsValues.length).toFixed(2)
      : 'N/A'

    // Top livres favoris (simulé)
    const favoriteArray = Array.isArray(favorites) ? favorites : []
    const topBooks = books
      .filter((b) => favoriteArray.includes(b.id))
      .slice(0, 5)

    // Catégories
    const catCount = books.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1
      return acc
    }, {})

    return { users, completedBooks, inProgressBooks, avgRating, ratingsValues, topBooks, catCount, favoriteArray }
  }, [])

  const cards = [
    { label: 'Utilisateurs', value: stats.users.length, icon: Users, color: 'bg-blue-50 text-blue-700' },
    { label: 'Livres totaux', value: books.length, icon: BookOpen, color: 'bg-[#e8f0eb] text-[#133a28]' },
    { label: 'Livres terminés', value: stats.completedBooks.length, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
    { label: 'Note moyenne', value: stats.avgRating, icon: Star, color: 'bg-yellow-50 text-yellow-700' },
  ]

  const catEntries = Object.entries(stats.catCount).sort(([, a], [, b]) => b - a)
  const maxCat = Math.max(...catEntries.map(([, v]) => v), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Statistiques</h1>
        <p className="mt-1 text-sm text-[#705f57]">Données locales — simulation frontend</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center gap-4 rounded-xl border border-[#e2ddd6] bg-white p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1410]">{c.value}</p>
              <p className="text-xs text-[#705f57]">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition par catégorie */}
        <div className="rounded-xl border border-[#e2ddd6] bg-white p-6">
          <h2 className="mb-4 font-semibold text-[#1a1410]">Livres par catégorie</h2>
          <div className="space-y-3">
            {catEntries.map(([cat, count]) => (
              <div key={cat}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[#705f57]">{cat}</span>
                  <span className="font-semibold text-[#1a1410]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f0ebe4]">
                  <div
                    className="h-full rounded-full bg-[#133a28]"
                    style={{ width: `${(count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top livres favoris */}
        <div className="rounded-xl border border-[#e2ddd6] bg-white p-6">
          <h2 className="mb-4 font-semibold text-[#1a1410]">Livres en favoris (locaux)</h2>
          {stats.topBooks.length === 0 ? (
            <p className="text-sm text-[#8f7770]">Aucun favori enregistré localement.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topBooks.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <img src={b.image} alt={b.title} className="h-10 w-8 shrink-0 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium text-[#1a1410] line-clamp-1">{b.title}</p>
                    <p className="text-xs text-[#705f57]">{b.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
