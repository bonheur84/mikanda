import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, Heart, Star, Users } from 'lucide-react'
import { getAuthorById, authors as allAuthors } from '../data/authors.js'
import { getBooksByAuthor } from '../data/books.js'
import { ShareModal } from '../components/common/ShareModal.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { getFollowedAuthors, toggleFollowAuthor } from '../services/auth.js'
import { getAuthorAverageRating } from '../services/ratings.js'
import { getAuthorDistinctReaders } from '../services/readCount.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useState } from 'react'
import { NotFound } from './NotFound.jsx'

function formatReaders(count) {
  if (count === 0) return null // Pas encore de lecteurs enregistrés
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

export function AuthorDetails() {
  const { id } = useParams()
  const author = getAuthorById(id)
  const notify = useNotification()
  const [shareOpen, setShareOpen] = useState(false)
  const [followed, setFollowed] = useState(() => getFollowedAuthors().includes(id))
  const [showFollowConfirm, setShowFollowConfirm] = useState(false)
  useDocumentTitle(author?.name)

  if (!author) return <NotFound />

  const works = getBooksByAuthor(author.id)

  // Note moyenne calculée depuis les avis réels
  const { average: avgRating, count: reviewCount } = getAuthorAverageRating(works)
  const displayRating = avgRating > 0 ? avgRating : author.rating

  // Lecteurs distincts calculés
  const distinctReaders = getAuthorDistinctReaders(author.id, works)
  const displayReaders = formatReaders(distinctReaders) || author.readers

  // Auteurs suggérés après follow (mêmes genres en priorité)
  const suggestedAuthors = (() => {
    if (!followed || !showFollowConfirm) return []
    const genres = new Set(author.genres || [])
    const similar = allAuthors.filter(
      (a) =>
        a.id !== author.id &&
        (a.genres || []).some((g) => genres.has(g)),
    )
    if (similar.length >= 3) return similar.slice(0, 3)
    // Compléter avec les plus populaires
    const popular = allAuthors
      .filter((a) => a.id !== author.id && !similar.includes(a))
      .sort((a, b) => parseFloat(b.readers) - parseFloat(a.readers))
    return [...similar, ...popular].slice(0, 3)
  })()

  const handleFollow = () => {
    const next = toggleFollowAuthor(author.id)
    setFollowed(next)
    if (next) {
      setShowFollowConfirm(true)
      notify.success(`Vous suivez maintenant ${author.name}`)
    } else {
      setShowFollowConfirm(false)
      notify.info(`Vous ne suivez plus ${author.name}`)
    }
  }

  const shareUrl = `${window.location.origin}/auteurs/${author.id}`

  return (
    <main className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8">
      <Link to="/auteurs" className="inline-flex items-center gap-2 text-xs text-[#8f7770] transition-colors hover:text-[#133a28]">
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux auteurs
      </Link>

      {/* En-tête auteur */}
      <section className="mt-8 grid gap-10 border-b border-[#d9d1c6] pb-12 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="flex h-72 w-52 items-center justify-center overflow-hidden rounded-xl bg-[#315d4b]">
          {author.image ? (
            <img
              src={author.image}
              alt={`Portrait de ${author.name}`}
              className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
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

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Voir ses œuvres — lien vers page dédiée */}
            <Link
              to={`/auteurs/${author.id}/oeuvres`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#133a28] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#1d5a3e] hover:shadow-md active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5" /> Voir ses œuvres
            </Link>

            {/* Bouton Suivre / Suivi */}
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                followed
                  ? 'border-[#133a28] bg-[#133a28]/5 text-[#133a28] hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                  : 'border-[#d9d1c6] hover:border-[#133a28] hover:text-[#133a28]'
              }`}
              onClick={handleFollow}
            >
              <Heart className={`h-3.5 w-3.5 ${followed ? 'fill-current' : ''}`} />
              {followed ? 'Suivi · Cliquer pour désabonner' : 'Suivre'}
            </button>

            {/* Partager */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs transition-all hover:border-[#133a28] hover:text-[#133a28] active:scale-95"
              onClick={() => setShareOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Partager
            </button>
          </div>

          {/* Bannière de confirmation de suivi */}
          {showFollowConfirm && followed && (
            <div className="mt-4 rounded-xl border border-[#133a28]/20 bg-[#f0f7f4] p-4">
              <p className="text-sm font-medium text-[#133a28]">
                ✓ Vous suivez maintenant {author.name}
              </p>
              <p className="mt-1 text-xs text-[#705f57]">
                Vous recevrez des actualités sur ses nouvelles œuvres.
              </p>

              {/* Suggestions d'auteurs similaires */}
              {suggestedAuthors.length > 0 && (
                <div className="mt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8f7770]">
                    Auteurs similaires que vous pourriez apprécier
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {suggestedAuthors.map((suggested) => (
                      <Link
                        key={suggested.id}
                        to={`/auteurs/${suggested.id}`}
                        className="flex items-center gap-2 rounded-lg border border-[#d9d1c6] bg-white px-3 py-2 text-xs transition-all hover:border-[#133a28] hover:shadow-sm active:scale-95"
                      >
                        {suggested.image ? (
                          <img src={suggested.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#315d4b] text-[10px] text-white">
                            {suggested.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#1a1410]">{suggested.name}</p>
                          <p className="text-[#8f7770]">{suggested.genres.slice(0, 2).join(', ')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Corps de la fiche */}
      <div className="grid gap-12 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-14">
          {/* Biographie */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">01 · Parcours</p>
            <h2 className="mt-3 font-serif text-4xl">Biographie et parcours</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#705f57]">{author.longBio}</p>
          </section>

          {/* Chronologie */}
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

          {/* Citation */}
          <section className="bg-[#292c27] px-7 py-12 text-center text-[#f7f1e6]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af72]">03 · Voix</p>
            <blockquote className="mx-auto mt-5 max-w-3xl font-serif text-2xl italic sm:text-3xl">
              " {author.quote} "
            </blockquote>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af72]">— {author.name}</p>
          </section>

          {/* Œuvres en aperçu (3 max) */}
          {works.length ? (
            <section className="border-t border-[#d9d1c6] pt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">05 · Catalogue</p>
                  <h2 className="mt-3 font-serif text-4xl">Œuvres disponibles</h2>
                </div>
                {works.length > 3 && (
                  <Link
                    to={`/auteurs/${author.id}/oeuvres`}
                    className="flex items-center gap-1 text-sm text-[#133a28] hover:underline"
                  >
                    Voir tout ({works.length}) <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {works.slice(0, 3).map((book) => (
                  <Link
                    key={book.id}
                    to={`/livres/${book.id}`}
                    className="group rounded-xl border border-[#d9d1c6] bg-white p-4 transition-all hover:border-[#133a28] hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="mb-3 aspect-[0.7] overflow-hidden rounded-lg">
                      <img src={book.image} alt={book.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="font-medium text-[#1a1410] line-clamp-2">{book.title}</p>
                    <p className="mt-1 text-xs text-[#c17248]">{book.category} · {book.year}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Fiche latérale */}
        <aside className="self-start rounded-xl border border-[#d9d1c6] bg-[#f2ede3] p-7 lg:sticky lg:top-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c17248]">Fiche auteur</p>
          <dl className="mt-6 space-y-5 text-sm">
            <div><dt className="text-xs text-[#8f7770]">Nom complet</dt><dd className="mt-1 font-medium">{author.name}</dd></div>
            <div><dt className="text-xs text-[#8f7770]">Nationalité</dt><dd className="mt-1 font-medium">{author.country}</dd></div>
            <div><dt className="text-xs text-[#8f7770]">Activités</dt><dd className="mt-1 font-medium">{author.activities}</dd></div>
          </dl>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#d9d1c6] pt-6 text-center">
            <div>
              <span className="block font-serif text-xl text-[#133a28]">{author.worksCount}</span>
              <span className="text-[10px] uppercase text-[#8f7770]">Œuvres</span>
            </div>
            <div>
              <span className="flex items-center justify-center gap-1 font-serif text-xl text-[#133a28]">
                <Star className="h-4 w-4 fill-[#c17248] text-[#c17248]" />
                {displayRating}
              </span>
              <span className="text-[10px] uppercase text-[#8f7770]">
                Note{reviewCount > 0 ? ` (${reviewCount})` : ''}
              </span>
            </div>
            <div>
              <span className="flex items-center justify-center gap-1 font-serif text-xl text-[#133a28]">
                <Users className="h-4 w-4" />
              </span>
              <span className="block font-serif text-lg text-[#133a28]">{displayReaders}</span>
              <span className="text-[10px] uppercase text-[#8f7770]">Lecteurs</span>
            </div>
          </div>
          <Link to="/auteurs" className="mt-6 inline-flex items-center gap-2 text-sm text-[#133a28] underline">
            Voir tous les auteurs <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Partager — ${author.name}`}
        url={shareUrl}
        shareText={`Découvrez ${author.name} sur MIKANDA : ${shareUrl}`}
      />
    </main>
  )
}
