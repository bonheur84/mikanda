import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites.jsx'

export function FavoriteButton({ book, className = '', variant = 'icon' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favored = isFavorite(book.id)

  const base =
    variant === 'icon'
      ? 'absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md hover:bg-white'
      : 'inline-flex items-center justify-center rounded-lg border border-[#d9d1c6] p-2.5 hover:border-[#c17248]'

  return (
    <button
      type="button"
      className={`${base} ${favored ? 'text-red-500' : 'text-[#5C5245] hover:text-rose-500'} ${className}`}
      aria-label={favored ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(book)
      }}
    >
      <Heart className={`h-4 w-4 ${favored ? 'fill-red-500' : ''}`} />
    </button>
  )
}
