import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, ExternalLink } from 'lucide-react'
import { books } from '../../data/books.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

export function AdminBooks() {
  useDocumentTitle('Livres — Admin MIKANDA')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = [...new Set(books.map((b) => b.category))]
  const filtered = books.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    const matchCat = !categoryFilter || b.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1410]">Livres</h1>
          <p className="mt-1 text-sm text-[#705f57]">{books.length} livres dans la bibliothèque</p>
        </div>
        <div className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          Les livres sont issus des données locales. La gestion CRUD nécessite un backend.
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7770]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou un auteur…"
            className="h-10 w-full rounded-lg border border-[#d9d1c6] pl-9 pr-4 text-sm focus:border-[#133a28] focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-[#e2ddd6] bg-white">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-[#e2ddd6] bg-[#f8f5f0]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Livre</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Auteur</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Catégorie</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Année</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Note</th>
              <th className="px-5 py-3 text-right font-semibold text-[#705f57]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe4]">
            {filtered.map((book) => (
              <tr key={book.id} className="hover:bg-[#faf8f4]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-10 w-8 shrink-0 rounded object-cover"
                    />
                    <span className="font-medium text-[#1a1410] line-clamp-2">{book.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#705f57]">{book.author}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full border border-[#d9d1c6] px-2.5 py-0.5 text-xs text-[#705f57]">
                    {book.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#705f57]">{book.year}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1 text-yellow-600">
                    ★ {book.rating}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    to={`/livres/${book.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#d9d1c6] px-2.5 py-1 text-xs text-[#705f57] hover:border-[#133a28] hover:text-[#133a28]"
                    target="_blank"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#8f7770]">Aucun livre trouvé.</div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-[#8f7770]">
        {filtered.length} résultat(s) · Gestion CRUD disponible après intégration backend
      </p>
    </div>
  )
}
