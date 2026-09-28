import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { collections } from '../data/collections.js'
import { authors } from '../data/authors.js'
import { books } from '../data/books.js'
import { BookCard } from '../components/books/BookCard.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { getMostReadBooks, getMostReadAuthors } from '../services/readCount.js'

// Collections à afficher sur la page d'accueil (les 5 catégories demandées)
const HOME_COLLECTION_IDS = ['romans', 'poesie-congolaise', 'contes-traditionnels', 'theatre', 'essais']

// Citations à faire défiler
const QUOTES = [
  {
    text: "L'Occident a inventé une Afrique à sa convenance ; il nous appartient d'en déconstruire le discours pour retrouver notre propre voix.",
    author: 'Valentin-Yves Mudimbe',
    source: '"The Invention of Africa" (1988)',
  },
  {
    text: "J'écris pour qu'il fasse homme en moi.",
    author: 'Sony Labou Tansi',
    source: 'Entretien, 1989',
  },
  {
    text: "Écrire, c'est habiter plusieurs rives.",
    author: 'Alain Mabanckou',
    source: '"Verre Cassé" (2005)',
  },
  {
    text: 'La langue est une mémoire.',
    author: 'Clémentine Faïk-Nzuji',
    source: 'Poésie et transmission, 2005',
  },
  {
    text: 'Un peuple se tient par sa mémoire.',
    author: 'Ndaywel è Nziem',
    source: '"Histoire générale du Congo" (1998)',
  },
]

function QuoteCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = next, -1 = prev
  const intervalRef = useRef(null)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const goTo = (index, dir = 1) => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, prefersReducedMotion ? 0 : 400)
  }

  const goNext = () => goTo((current + 1) % QUOTES.length, 1)
  const goPrev = () => goTo((current - 1 + QUOTES.length) % QUOTES.length, -1)

  useEffect(() => {
    if (prefersReducedMotion) return
    intervalRef.current = window.setInterval(goNext, 7000)
    return () => window.clearInterval(intervalRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, prefersReducedMotion])

  const quote = QUOTES[current]

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="relative overflow-hidden text-center">
        {/* Citation */}
        <div
          style={{
            transition: prefersReducedMotion ? 'none' : 'opacity 0.4s ease, transform 0.4s ease',
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateY(${direction * 12}px)`
              : 'translateY(0)',
          }}
        >
          <span className="mx-auto mb-6 block text-[#8E461F]/20 text-7xl leading-none select-none">❝</span>
          <blockquote className="mx-auto max-w-3xl font-serif text-xl leading-snug font-bold text-[#2D2319] sm:text-2xl lg:text-3xl">
            {quote.text}
          </blockquote>
          <cite className="mt-5 block text-sm font-bold text-[#8E461F] not-italic">{quote.author}</cite>
          <p className="mt-1 text-xs text-[#7A6E5E]">
            Extrait de <em>{quote.source}</em>
          </p>
        </div>

        {/* Contrôles */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Citation précédente"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9d1c6] text-[#705f57] transition-all hover:border-[#133a28] hover:text-[#133a28] hover:bg-[#f4ece2] active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Indicateurs */}
          <div className="flex gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Citation ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? 'w-6 bg-[#133a28]'
                    : 'w-2 bg-[#d9d1c6] hover:bg-[#c17248]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Citation suivante"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9d1c6] text-[#705f57] transition-all hover:border-[#133a28] hover:text-[#133a28] hover:bg-[#f4ece2] active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle()

  // Les 5 collections spécifiées dans l'ordre demandé
  const homeCollections = HOME_COLLECTION_IDS
    .map((id) => collections.find((c) => c.id === id))
    .filter(Boolean)

  // Livres les plus lus (avec fallback sur les données statiques)
  const popularBooks = getMostReadBooks(books, 4)

  // Auteurs les plus lus (avec fallback sur données statiques)
  const popularAuthors = getMostReadAuthors(authors, books, 4)

  return (
    <main>
      {/* Héro */}
      <section className="relative overflow-hidden border-b border-[#d9d1c6] bg-[#e9e0d1] px-5 pt-16 pb-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 max-w-2xl animate-fade-in-left">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#133a28]">Une mémoire vivante · Depuis la RDC</p>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-[#2e2923] sm:text-6xl lg:text-[84px]">
              Découvrez la richesse de la <em className="text-[#133a28]">littérature congolaise.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#655b50]">
              Une bibliothèque numérique dédiée aux œuvres, aux voix et aux archives qui racontent le Congo — accessible à toutes les générations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/bibliotheque" className="inline-flex items-center justify-between gap-3 bg-[#133a28] px-6 py-3.5 text-sm font-medium text-[#fff8fa] shimmer-effect glow-effect">
                Explorer la bibliothèque <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/auteurs" className="inline-flex items-center justify-between gap-2 border border-[#133a28]/40 px-6 py-3.5 text-sm font-medium text-[#133a28] hover:bg-[#f8f3e9]/50">
                Découvrir les auteurs
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg animate-fade-in-right">
            <div className="absolute -left-10 top-12 h-52 w-52 border border-[#133a28]/30 animate-float" />
            <div className="relative aspect-[0.86] overflow-hidden border-8 border-[#f5efe5] shadow-lg">
              <img src="/assets/images/livre (1).png" alt="Lectrice africaine dans une bibliothèque" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-[#2e2923]/85 p-5 text-[#f5efe5]">
                <p className="font-serif text-xl">« La littérature est une manière de rendre le monde habitable. »</p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-[#d9c6a3]">— MIKANDA, carnet éditorial</p>
              </div>
            </div>
            <div className="absolute -right-5 -bottom-6 flex items-center gap-3 bg-[#133a28] px-5 py-4 text-[#fff8fa] animate-pulse-slow">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest">+ 480 œuvres</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Explorer par genre</p>
            <h2 className="mt-2 font-serif text-3xl">Collection</h2>
          </div>
          <Link to="/collections" className="hidden items-center gap-2 text-sm text-[#133a28] hover:underline sm:flex">
            Voir toutes les collections <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {homeCollections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative flex min-h-40 flex-col justify-end overflow-hidden bg-cover bg-center p-4 text-[#f5efe5] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
              style={{ backgroundImage: `linear-gradient(rgba(19, 58, 40, 0.35), rgba(19, 58, 40, 0.82)), url('${collection.homeImage}')` }}
            >
              <p className="font-serif text-lg leading-tight">{collection.shortTitle}</p>
              <p className="mt-1 text-[11px] text-[#f5ede5]/70">{collection.countLabel}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Œuvres populaires */}
      <section className="border-y border-[#d9d1c6] bg-[#eae0d1]/45 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Le catalogue MIKANDA</p>
              <h2 className="mt-2 font-serif text-3xl">Œuvres populaires</h2>
            </div>
            <Link to="/bibliotheque" className="hidden items-center gap-2 text-sm text-[#133a28] hover:underline sm:flex">
              Tout le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {popularBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="home" />
            ))}
          </div>
        </div>
      </section>

      {/* Auteurs à découvrir */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Voix et parcours</p>
            <h2 className="mt-2 font-serif text-3xl">Auteurs à découvrir</h2>
          </div>
          <Link to="/auteurs" className="hidden items-center gap-2 text-sm text-[#133a28] hover:underline sm:flex">
            Annuaire des auteurs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularAuthors.map((author) => (
            <Link
              key={author.id}
              to={`/auteurs/${author.id}`}
              className="group flex gap-4 border-t border-[#d9d1c6] pt-5 transition-all duration-200 hover:bg-[#fdfaf3] hover:px-2 rounded-lg active:scale-95 p-2"
            >
              {author.image ? (
                <img src={author.image} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#315d4b] font-serif text-white text-lg">
                  {author.initials}
                </div>
              )}
              <div>
                <h3 className="font-serif text-xl group-hover:text-[#133a28]">{author.name}</h3>
                <p className="mt-1 text-sm leading-5 text-[#705f57] line-clamp-2">{author.bio}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#c17248]">{author.worksCount} œuvres</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Collection du moment */}
      <section className="bg-[#133a28] px-5 py-16 text-[#fff8fa] lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#fff8fa]/65">Collection du moment</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Kinshasa, écrire la ville</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#fff8fa]/75">
              Une sélection de romans, poèmes et récits qui donnent à entendre les rythmes, les tensions et les imaginaires de la capitale.
            </p>
            <Link to="/collections" className="mt-6 inline-flex items-center gap-2 border border-[#fff8fa]/40 px-5 py-3 text-sm transition-colors hover:bg-[#fff8fa]/10 active:scale-95">
              Découvrir la collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['/assets/images/livre (1).jfif', '/assets/images/livre (6).jfif', '/assets/images/livre (22).jfif'].map((src, index) => (
              <div key={src} className={`aspect-[0.72] overflow-hidden border-4 border-[#fff8fa]/15 ${index === 0 ? '-rotate-4' : index === 1 ? 'mt-8 rotate-2' : 'rotate-5'}`}>
                <img alt="Livres de la collection" className="h-full w-full object-cover" src={src} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citations rotatives */}
      <QuoteCarousel />

      {/* Un patrimoine à transmettre */}
      <section className="border-t border-[#d9d1c6] bg-[#e9e0d1] px-5 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Un patrimoine à transmettre</span>
            <h3 className="mt-2 font-serif text-3xl text-[#281e19] sm:text-4xl">Préservons ensemble notre patrimoine littéraire.</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#655b50]">
              Vous possédez un manuscrit, une ancienne édition introuvable ou des archives littéraires congolaises ? Contribuez au projet national de numérisation MIKANDA.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto">
            {/* Bouton lien vers le formulaire de soumission sur la page À propos */}
            <Link
              to="/apropos#soumission"
              className="bg-[#133a28] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1d5a3e] active:scale-95"
            >
              Proposer une œuvre
            </Link>
            <Link to="/apropos" className="border border-[#133a28] px-6 py-3 text-center text-sm font-semibold text-[#133a28] transition-colors hover:bg-[#133a28]/5 active:scale-95">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
