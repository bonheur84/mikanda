import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { getAuthorById } from '../data/authors.js'
import { getBooksByAuthor } from '../data/books.js'
import { BookCard } from '../components/books/BookCard.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { NotFound } from './NotFound.jsx'

export function AuthorWorks() {
  const { id } = useParams()
  const author = getAuthorById(id)
  useDocumentTitle(author ? `Œuvres de ${author.name}` : 'Œuvres')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  if (!author) return <NotFound />

  const allWorks = getBooksByAuthor(author.id)
  const categories = [...new Set(allWorks.map((b) => b.category))].sort()

  const filtered = useMemo(() => {
    return allWorks.filter((book) => {
      const matchQuery = book.title.toLowerCase().includes(query.toLowerCase())
      const matchCat = !category || book.category === category
      return matchQuery && matchCat
    })
  }, [allWorks, query, category])

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8">
      {/* Retour */}
      <Link
        to={`/auteurs/${author.id}`}
        className="inline-flex items-center gap-2 text-xs text-[#8f7770] transition-colors hover:text-[#133a28]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour à la fiche auteur
      </Link>

      {/* En-tête */}
      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Catalogue complet</p>
        <h1 className="mt-2 font-serif text-5xl leading-tight">
          Œuvres de <em className="text-[#133a28]">{author.name}</em>
        </h1>
        <p className="mt-4 text-[#705f57]">
          {allWorks.length} {allWorks.length > 1 ? 'œuvres disponibles' : 'œuvre disponible'} dans notre catalogue.
        </p>
      </div>

      {/* Filtres */}
      {allWorks.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* Recherche */}
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] px-3 focus-within:border-[#133a28]">
            <Search className="h-4 w-4 text-[#705f57]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un titre..."
              className="h-10 flex-1 bg-transparent text-sm outline-none"
              aria-label="Rechercher une œuvre"
            />
          </div>

          {/* Filtre catégorie */}
          {categories.length > 1 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] px-3 text-sm outline-none focus:border-[#133a28]"
            >
              <option value="">Tous les genres</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Grille des œuvres */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-[#d9d1c6] py-16 text-center">
          <p className="text-sm text-[#8f7770]">Aucune œuvre trouvée.</p>
          {(query || category) && (
            <button
              type="button"
              onClick={() => { setQuery(''); setCategory('') }}
              className="mt-3 text-xs text-[#c17248] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          {(query || category) && (
            <p className="mt-4 text-xs text-[#8f7770]">
              {filtered.length} œuvre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
            </p>
          )}
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
