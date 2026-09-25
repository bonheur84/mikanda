import { Link, useParams } from 'react-router-dom'
import { BookOpen, Plus } from 'lucide-react'
import { getCollectionById } from '../data/collections.js'
import { getBooksByCollection } from '../data/books.js'
import { BookGrid } from '../components/books/BookGrid.jsx'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { NotFound } from './NotFound.jsx'

export function CollectionDetails() {
  const { id } = useParams()
  const collection = getCollectionById(id)
  const { toggleFavorite, isFavorite } = useFavorites()
  const notify = useNotification()
  useDocumentTitle(collection?.title)

  if (!collection) return <NotFound />

  const works = getBooksByCollection(collection.id)

  const addAll = () => {
    works.forEach((book) => {
      if (!isFavorite(book.id)) toggleFavorite(book)
    })
    notify.success('Collection ajoutée aux favoris')
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Collection</p>
      <h1 className="mt-2 font-serif text-5xl">{collection.title}</h1>
      <p className="mt-4 max-w-xl text-[#705f57]">{collection.description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to={works[0] ? `/livres/${works[0].id}/lire` : '/bibliotheque'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#133a28] px-6 py-3 text-sm font-medium text-white">
          <BookOpen className="h-4 w-4" /> Commencer la collection
        </Link>
        <button type="button" onClick={addAll} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#133a28] px-6 py-3 text-sm font-medium text-[#133a28]">
          <Plus className="h-4 w-4" /> Tout ajouter à ma bibliothèque
        </button>
      </div>
      <h2 className="mt-10 mb-6 font-serif text-2xl">Œuvres incluses dans la collection ({works.length})</h2>
      <BookGrid books={works} />
    </main>
  )
}
