import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { collections } from '../data/collections.js'
import { books } from '../data/books.js'
import { BookCard } from '../components/books/BookCard.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Collections() {
  useDocumentTitle('Collections')
  const [activeCategory, setActiveCategory] = useState(null)

  // Catégories disponibles (toutes les collections)
  const categories = collections

  // Livres de la catégorie sélectionnée
  const categoryBooks = useMemo(() => {
    if (!activeCategory) return []
    return books.filter((b) => (b.collections || []).includes(activeCategory.id))
  }, [activeCategory])

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Parcours éditoriaux</p>
      <h1 className="mt-2 font-serif text-5xl">Collections</h1>
      <p className="mt-4 max-w-xl text-[#705f57]">
        Des sélections pensées pour traverser les époques, les genres et les voix de la littérature congolaise.
      </p>

      {/* Grille des collections */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((collection) => {
          const bookCount = books.filter((b) => (b.collections || []).includes(collection.id)).length
          const isActive = activeCategory?.id === collection.id

          return (
            <div key={collection.id} className="group flex flex-col">
              {/* Carte de la collection */}
              <button
                type="button"
                onClick={() => setActiveCategory(isActive ? null : collection)}
                className={`relative min-h-56 overflow-hidden bg-cover bg-center p-6 text-[#f5efe5] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 ${
                  isActive ? 'ring-4 ring-[#c17248] ring-offset-2' : ''
                }`}
                style={{ backgroundImage: `url('${collection.image}')` }}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-[#133a28]/75' : 'bg-[#133a28]/60 group-hover:bg-[#133a28]/70'}`} />
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#f5efe5]/60">
                    Collection · {bookCount} {bookCount > 1 ? 'œuvres' : 'œuvre'}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl">{collection.title}</h2>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[#f5efe5]/75">{collection.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#f5efe5]/80">
                    {isActive ? (
                      <span>Masquer les œuvres ↑</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Parcourir les œuvres <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Lien direct vers la page de la collection */}
              <Link
                to={`/collections/${collection.id}`}
                className="flex items-center justify-between border border-t-0 border-[#d9d1c6] bg-[#f8f3e9] px-4 py-2.5 text-xs text-[#705f57] transition-colors hover:bg-[#f0e8d8] hover:text-[#133a28]"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Voir la collection complète
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Livres de la catégorie sélectionnée */}
      {activeCategory && (
        <div className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Collection</p>
              <h2 className="mt-2 font-serif text-3xl">{activeCategory.title}</h2>
              <p className="mt-1 text-sm text-[#705f57]">
                {categoryBooks.length} {categoryBooks.length > 1 ? 'œuvres disponibles' : 'œuvre disponible'}
              </p>
            </div>
            <Link
              to={`/collections/${activeCategory.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#133a28] px-4 py-2 text-xs font-medium text-[#133a28] transition-colors hover:bg-[#133a28] hover:text-white"
            >
              Page complète <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {categoryBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d9d1c6] py-16 text-center">
              <p className="text-sm text-[#8f7770]">Aucune œuvre disponible dans cette collection pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
