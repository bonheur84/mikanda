import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, Heart, Share2, Star } from 'lucide-react'
import { getAuthorById } from '../data/authors.js'
import { getBooksByAuthor } from '../data/books.js'
import { BookCard } from '../components/books/BookCard.jsx'
import { ShareModal } from '../components/common/ShareModal.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { getFollowedAuthors, toggleFollowAuthor } from '../services/auth.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useState } from 'react'
import { NotFound } from './NotFound.jsx'

export function AuthorDetails() {
  const { id } = useParams()
  const author = getAuthorById(id)
  const notify = useNotification()
  const [shareOpen, setShareOpen] = useState(false)
  const [followed, setFollowed] = useState(() => getFollowedAuthors().includes(id))
  useDocumentTitle(author?.name)

  if (!author) return <NotFound />

  const works = getBooksByAuthor(author.id)

  return (
    <main className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8">
      <Link to="/auteurs" className="inline-flex items-center gap-2 text-xs text-[#8f7770] hover:text-[#133a28]">
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux auteurs
      </Link>
      <section className="mt-8 grid gap-10 border-b border-[#d9d1c6] pb-12 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="flex h-72 w-52 items-center justify-center overflow-hidden rounded-xl bg-[#315d4b]">
          {author.image ? (
            <img src={author.image} alt={`Portrait de ${author.name}`} className="h-full w-full object-cover grayscale hover:grayscale-0" />
          ) : (
            <span className="font-serif text-5xl text-white">{author.initials}</span>
          )}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c17248]">Voix et trajectoires</p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">{author.name}</h1>
          <p className="mt-3 text-sm text-[#705f57]">{author.years} · {author.country}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {author.genres.map((genre) => (
              <span key={genre} className="rounded-full bg-[#f2ede3] px-3 py-1 text-xs">{genre}</span>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#705f57]">{author.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/bibliotheque" className="inline-flex items-center gap-2 rounded-lg bg-[#133a28] px-4 py-2.5 text-xs font-semibold text-white">
              <BookOpen className="h-3.5 w-3.5" /> Voir ses œuvres
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs"
              onClick={() => {
                const next = toggleFollowAuthor(author.id)
                setFollowed(next)
                notify.success(next ? 'Auteur suivi' : 'Auteur retiré')
              }}
            >
              <Heart className={`h-3.5 w-3.5 ${followed ? 'fill-red-500 text-red-500' : ''}`} /> {followed ? 'Suivi' : 'Suivre'}
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs" onClick={() => setShareOpen(true)}>
              <Share2 className="h-3.5 w-3.5" /> Partager
            </button>
          </div>
        </div>
      </section>
      <div className="grid gap-12 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-14">
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">01 · Parcours</p>
            <h2 className="mt-3 font-serif text-4xl">Biographie et parcours</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#705f57]">{author.longBio}</p>
          </section>
          {author.timeline?.length ? (
            <section className="border-t border-[#d9d1c6] pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">02 · Repères</p>
              <h2 className="mt-3 font-serif text-4xl">Chronologie de ses œuvres</h2>
              <div className="mt-8 border-l border-[#d9d1c6] pl-6">
                {author.timeline.map((item) => (
                  <div key={item.title} className="relative mb-7">
                    <span className="absolute top-1.5 -left-7 h-2.5 w-2.5 rounded-full bg-[#c17248]" />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#c17248]">{item.year}</p>
                    <p className="mt-1 font-serif text-xl">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          <section className="bg-[#292c27] px-7 py-12 text-center text-[#f7f1e6]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af72]">03 · Voix</p>
            <blockquote className="mx-auto mt-5 max-w-3xl font-serif text-2xl italic sm:text-3xl">“ {author.quote} ”</blockquote>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af72]">— {author.name}</p>
          </section>
          {works.length ? (
            <section className="border-t border-[#d9d1c6] pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">05 · Catalogue</p>
              <h2 className="mt-3 font-serif text-4xl">Œuvres disponibles</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {works.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            </section>
          ) : null}
        </div>
        <aside className="self-start rounded-xl border border-[#d9d1c6] bg-[#f2ede3] p-7 lg:sticky lg:top-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c17248]">Fiche auteur</p>
          <dl className="mt-6 space-y-5 text-sm">
            <div><dt className="text-xs text-[#8f7770]">Nom complet</dt><dd className="mt-1 font-medium">{author.name}</dd></div>
            <div><dt className="text-xs text-[#8f7770]">Nationalité</dt><dd className="mt-1 font-medium">{author.country}</dd></div>
            <div><dt className="text-xs text-[#8f7770]">Activités</dt><dd className="mt-1 font-medium">{author.activities}</dd></div>
          </dl>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#d9d1c6] pt-6 text-center">
            <div><span className="block font-serif text-xl text-[#133a28]">{author.worksCount}</span><span className="text-[10px] uppercase text-[#8f7770]">Œuvres</span></div>
            <div><span className="flex items-center justify-center gap-1 font-serif text-xl text-[#133a28]"><Star className="h-4 w-4 fill-[#c17248] text-[#c17248]" />{author.rating}</span><span className="text-[10px] uppercase text-[#8f7770]">Note</span></div>
            <div><span className="block font-serif text-xl text-[#133a28]">{author.readers}</span><span className="text-[10px] uppercase text-[#8f7770]">Lecteurs</span></div>
          </div>
          <Link to="/auteurs" className="mt-6 inline-flex items-center gap-2 text-sm text-[#133a28] underline">
            Voir tous les auteurs <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </div>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="Partager cet auteur" />
    </main>
  )
}
