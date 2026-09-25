import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ChevronRight, Quote } from 'lucide-react'
import { collections } from '../data/collections.js'
import { authors } from '../data/authors.js'
import { getFeaturedBooks } from '../data/books.js'
import { BookCard } from '../components/books/BookCard.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Home() {
  useDocumentTitle()
  const featured = getFeaturedBooks().slice(0, 4)
  const featuredAuthors = authors.slice(0, 3)
  const homeCollections = collections.slice(0, 6)

  return (
    <main>
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

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Explorer par genre</p>
            <h2 className="mt-2 font-serif text-3xl">Collections populaires</h2>
          </div>
          <Link to="/collections" className="hidden items-center gap-2 text-sm text-[#133a28] hover:underline sm:flex">
            Voir toutes les collections <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {homeCollections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative flex min-h-36 flex-col justify-end overflow-hidden bg-cover bg-center p-4 text-[#f5efe5] transition-transform hover:-translate-y-1"
              style={{ backgroundImage: `linear-gradient(rgba(19, 58, 40, 0.35), rgba(19, 58, 40, 0.8)), url('${collection.homeImage}')` }}
            >
              <p className="font-serif text-xl">{collection.shortTitle}</p>
              <p className="mt-1 text-[11px] text-[#f5ede5]/70">{collection.countLabel}</p>
            </Link>
          ))}
        </div>
      </section>

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
            {featured.map((book) => (
              <BookCard key={book.id} book={book} variant="home" />
            ))}
          </div>
        </div>
      </section>

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
        <div className="grid gap-5 md:grid-cols-3">
          {featuredAuthors.map((author) => (
            <Link key={author.id} to={`/auteurs/${author.id}`} className="flex gap-4 border-t border-[#d9d1c6] pt-5">
              {author.image ? (
                <img src={author.image} alt="" className="h-20 w-20 rounded-full object-cover grayscale" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#315d4b] font-serif text-white">{author.initials}</div>
              )}
              <div>
                <h3 className="font-serif text-xl">{author.name}</h3>
                <p className="mt-1 text-sm leading-5 text-[#705f57]">{author.bio}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#c17248]">{author.worksCount} œuvres</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#133a28] px-5 py-16 text-[#fff8fa] lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#fff8fa]/65">Collection du moment</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Kinshasa, écrire la ville</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#fff8fa]/75">
              Une sélection de romans, poèmes et récits qui donnent à entendre les rythmes, les tensions et les imaginaires de la capitale.
            </p>
            <Link to="/collections" className="mt-6 inline-flex items-center gap-2 border border-[#fff8fa]/40 px-5 py-3 text-sm hover:bg-[#fff8fa]/10">
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

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="relative overflow-hidden text-center">
          <Quote className="mx-auto mb-4 h-12 w-12 text-[#8E461F]/20" />
          <blockquote className="mx-auto max-w-3xl font-serif text-xl leading-snug font-bold text-[#2D2319] sm:text-2xl lg:text-3xl">
            « L'Occident a inventé une Afrique à sa convenance ; il nous appartient d'en déconstruire le discours pour retrouver notre propre voix. »
          </blockquote>
          <cite className="mt-4 block text-sm font-bold text-[#8E461F] not-italic">Valentin-Yves Mudimbe</cite>
          <p className="text-xs text-[#7A6E5E]">Extrait de <em>"The Invention of Africa"</em> (1988)</p>
        </div>
      </section>

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
            <a href="mailto:contact@mikanda.cd?subject=Proposer%20une%20œuvre" className="bg-[#133a28] px-6 py-3 text-center text-sm font-semibold text-white">
              Proposer une œuvre
            </a>
            <Link to="/apropos" className="border border-[#133a28] px-6 py-3 text-center text-sm font-semibold text-[#133a28]">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
