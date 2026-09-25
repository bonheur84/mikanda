import { Link } from 'react-router-dom'
import { BookOpen, Clock, Lock, Star } from 'lucide-react'
import { FavoriteButton } from './FavoriteButton.jsx'

export function BookCard({ book, variant = 'grid' }) {
  const isPremium = book.availability === 'premium' || book.status === 'Premium'

  if (variant === 'list') {
    return (
      <article className="group flex items-center gap-4 rounded-xl border border-[#E5DDCB] p-4 transition-all hover:shadow-lg">
        <Link to={`/livres/${book.id}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EFE9DC]">
          <img alt={book.title} src={book.image} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/livres/${book.id}`}>
            <p className="truncate font-serif text-lg text-[#281e19] transition-colors group-hover:text-[#c17248]">{book.title}</p>
          </Link>
          <p className="mt-1 truncate text-xs text-[#705f57]">{book.author}</p>
          <div className="mt-2 flex items-center gap-4 font-mono text-xs text-[#705f57]">
            <span className="font-medium">{book.category}</span>
            <span>{book.year}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {book.readingTime}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {book.rating} <span className="font-normal text-[#9C8F7E]">({book.reviews})</span>
            </span>
            <Link to={`/livres/${book.id}`} className="font-semibold text-[#8E461F] hover:text-[#133a28]">
              Détails →
            </Link>
          </div>
        </div>
        <FavoriteButton book={book} className="relative top-auto right-auto" />
      </article>
    )
  }

  if (variant === 'home') {
    return (
      <Link to={`/livres/${book.id}`} className="group min-w-0">
        <div className="relative aspect-[0.7] overflow-hidden bg-[#ede7de] shadow-sm">
          <img src={book.image} alt={book.title} className="h-full w-full object-cover grayscale-[0.25] transition duration-500 group-hover:scale-105" />
          <div className={`absolute top-2 left-2 px-2 py-1 text-[9px] uppercase tracking-wider text-[#f5efe5] ${isPremium ? 'bg-[#b7924b]' : 'bg-[#314c3d]'}`}>
            {isPremium ? 'Premium' : 'Gratuit'}
          </div>
        </div>
        <p className="mt-3 truncate font-serif text-lg text-[#281e19] group-hover:text-[#c17248]">{book.title}</p>
        <p className="mt-1 truncate text-xs text-[#705f57]">{book.author}</p>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#705f57]">
          <span>{book.category}</span>
          <span>{book.year}</span>
        </div>
      </Link>
    )
  }

  return (
    <article className="group card-hover flex h-full flex-col overflow-hidden rounded-xl border border-[#E5DDCB]">
      <Link to={`/livres/${book.id}`} className="relative aspect-3/4 overflow-hidden bg-[#EFE9DC]">
        <img alt={book.title} src={book.image} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-2.5 left-2.5 z-10">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 rounded bg-[#2D2319]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
              <Lock className="h-2.5 w-2.5" /> Premium
            </span>
          ) : (
            <span className="rounded bg-[#1B4332]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-100">Gratuit</span>
          )}
        </div>
        <FavoriteButton book={book} />
        <div className="absolute inset-0 flex items-center justify-center bg-[#133a28]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-sm font-medium text-white">Voir détails</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3 px-4 pb-4">
        <div>
          <p className="mt-3 truncate font-serif text-xl text-[#281e19] transition-colors group-hover:text-[#c17248]">{book.title}</p>
          <p className="mt-1 truncate text-xs text-[#705f57]">{book.author}</p>
          <div className="mt-2 flex items-center justify-between font-mono text-xs text-[#705f57]">
            <span className="font-medium">{book.category}</span>
            <span>{book.year}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#8f7770]">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {book.readingTime}</span>
            <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> Format numérique</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#8E461F]/50 pt-2.5 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {book.rating} <span className="font-normal text-[#9C8F7E]">({book.reviews})</span>
          </span>
          <Link to={`/livres/${book.id}`} className="font-semibold text-[#8E461F] hover:text-[#133a28]">
            Détails →
          </Link>
        </div>
      </div>
    </article>
  )
}
