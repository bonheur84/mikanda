import { useState } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import { authors } from '../../data/authors.js'
import { books } from '../../data/books.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { Link } from 'react-router-dom'

export function AdminAuthors() {
  useDocumentTitle('Auteurs — Admin MIKANDA')
  const [search, setSearch] = useState('')

  const filtered = authors.filter((a) => {
    const q = search.toLowerCase()
    return !q || a.name.toLowerCase().includes(q) || (a.country || '').toLowerCase().includes(q)
  })

  function bookCount(authorId) {
    return books.filter((b) => b.authorId === authorId).length
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Auteurs</h1>
        <p className="mt-1 text-sm text-[#705f57]">{authors.length} auteurs dans la bibliothèque</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7770]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un auteur…"
            className="h-10 w-full rounded-lg border border-[#d9d1c6] pl-9 pr-4 text-sm focus:border-[#133a28] focus:outline-none" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((author) => (
          <div key={author.id} className="flex items-start gap-3 rounded-xl border border-[#e2ddd6] bg-white p-4">
            {author.photo ? (
              <img src={author.photo} alt={author.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#133a28] text-lg font-bold text-white">
                {author.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1a1410] truncate">{author.name}</p>
              {author.country && <p className="text-xs text-[#705f57]">{author.country}</p>}
              <p className="mt-1 text-xs text-[#8f7770]">{bookCount(author.id)} livre(s)</p>
            </div>
            <Link to={`/auteurs/${author.id}`} target="_blank"
              className="shrink-0 rounded-lg border border-[#d9d1c6] p-1.5 text-[#705f57] hover:border-[#133a28] hover:text-[#133a28]">
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-[#8f7770]">Aucun auteur trouvé.</div>
      )}
    </div>
  )
}
