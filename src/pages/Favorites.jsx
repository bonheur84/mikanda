import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { BookCard } from '../components/books/BookCard.jsx'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Favorites() {
  useDocumentTitle('Favoris')
  const { favorites } = useFavorites()

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Votre bibliothèque personnelle</p>
      <h1 className="mt-2 font-serif text-5xl">Favoris</h1>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f2ede3]">
            <Heart className="h-8 w-8 text-[#c17248]" />
          </div>
          <h2 className="mb-2 font-serif text-2xl">Aucun livre dans vos favoris</h2>
          <p className="mb-6 max-w-md text-sm text-[#705f57]">
            Vous n'avez pas encore ajouté de livre à vos favoris. Explorez la bibliothèque et ajoutez les œuvres que vous souhaitez retrouver facilement.
          </p>
          <Link to="/bibliotheque" className="rounded-lg bg-[#133a28] px-6 py-2 text-sm text-white hover:bg-[#245743]">
            Explorer la bibliothèque
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((book) => (
            <BookCard key={book.id} book={{ ...book, availability: book.status === 'Premium' ? 'premium' : 'free' }} />
          ))}
        </div>
      )}
    </main>
  )
}
