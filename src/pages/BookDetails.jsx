import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, Download, Eye, Play, Share2, Star, Users } from 'lucide-react'
import { getBookById } from '../data/books.js'
import { getAuthorByName } from '../data/authors.js'
import { FavoriteButton } from '../components/books/FavoriteButton.jsx'
import { ShareModal } from '../components/common/ShareModal.jsx'
import { getComments, addComment, deleteComment, getCommentLikes, setCommentLike } from '../services/comments.js'
import { getRating, saveRating } from '../services/ratings.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { NotFound } from './NotFound.jsx'

const STATIC_COMMENTS = 214

export function BookDetails() {
  const { id } = useParams()
  const book = getBookById(id)
  const author = book ? getAuthorByName(book.author) : null
  const notify = useNotification()
  const [shareOpen, setShareOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [rating, setRating] = useState(() => (book ? getRating(book.id) : 0))
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [sort, setSort] = useState('recent')
  const [comments, setComments] = useState(() => (book ? getComments(book.id) : []))
  const [likes, setLikes] = useState(() => getCommentLikes())
  useDocumentTitle(book?.title)

  if (!book) return <NotFound />

  const displayRating = hoverRating || rating || 0
  const ordered = useMemo(() => {
    const copy = [...comments]
    copy.sort((a, b) => (sort === 'recent' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)))
    return copy
  }, [comments, sort])
  const topLevel = ordered.filter((item) => !item.parentId)

  const submitComment = (event) => {
    event.preventDefault()
    if (!text.trim()) {
      notify.error('Veuillez écrire un commentaire')
      return
    }
    if (!rating) {
      notify.error('Veuillez sélectionner une note')
      return
    }
    const next = addComment(book.id, {
      id: `comment-${Date.now()}`,
      text: text.trim(),
      rating,
      parentId: replyTo,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString(),
    })
    saveRating(book.id, rating)
    setComments(next)
    setText('')
    setReplyTo(null)
    notify.success('Commentaire envoyé')
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-xs text-[#8f7770]">
        <Link to="/bibliotheque" className="inline-flex items-center gap-1 hover:text-[#133a28]"><ArrowLeft className="h-3 w-3" /> Retour à la bibliothèque</Link>
      </div>
      <section className="grid gap-7 border-b border-[#d9d1c6] pb-10 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="relative aspect-[0.7] overflow-hidden rounded-lg bg-[#314c3d] shadow-[0_20px_40px_rgba(40,30,25,0.15)]">
            <img src={book.image} alt={`Couverture de ${book.title}`} className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.15em] text-[#8f7770]">Édition numérique Mikanda</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c17248]">{book.category} · {book.year}</span>
            <span className="flex items-center gap-1 text-xs text-[#b7924b]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-medium">{book.rating}</span>
              <span className="text-[#8f7770]">({book.reviews} avis)</span>
            </span>
          </div>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{book.title}</h1>
          <Link to={author ? `/auteurs/${author.id}` : '/auteurs'} className="mt-1 font-serif text-lg text-[#133a28] hover:underline">{book.author}</Link>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#705f57]">{book.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/livres/${book.id}/lire`} className="inline-flex items-center gap-2 rounded-lg bg-[#133a28] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#245743]">
              <Play className="h-3.5 w-3.5" /> Lire maintenant
            </Link>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs" onClick={() => notify.info('Téléchargement bientôt disponible')}>
              <Download className="h-3.5 w-3.5" /> Télécharger
            </button>
            <FavoriteButton book={book} variant="button" className="relative top-auto right-auto" />
            <button type="button" aria-label="Partager" className="rounded-lg border border-[#d9d1c6] p-2.5" onClick={() => setShareOpen(true)}>
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button type="button" aria-label="Aperçu" className="rounded-lg border border-[#d9d1c6] p-2.5" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
          <dl className="mt-7 grid max-w-2xl grid-cols-2 gap-x-8 border-y border-[#d9d1c6] py-4 text-xs sm:grid-cols-4">
            <div><dt className="font-mono text-[9px] uppercase text-[#8f7770]">Langue</dt><dd className="mt-1 font-medium">{book.language}</dd></div>
            <div><dt className="font-mono text-[9px] uppercase text-[#8f7770]">Pages</dt><dd className="mt-1 font-medium">{book.pages}</dd></div>
            <div><dt className="font-mono text-[9px] uppercase text-[#8f7770]">Statut</dt><dd className="mt-1 font-medium text-[#133a28]">{book.availability === 'free' ? 'Gratuit' : 'Premium'}</dd></div>
            <div><dt className="font-mono text-[9px] uppercase text-[#8f7770]">Éditeur</dt><dd className="mt-1 font-medium">{book.publisher}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8f7770]">
            <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{book.readingTime}</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />Format numérique</span>
            <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" />{book.readers} lecteurs</span>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-[#d9d1c6] py-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="font-serif text-3xl">À propos de cette œuvre</h2>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[#705f57]">{book.about}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {book.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f2ede3] px-3 py-1 text-xs">{tag}</span>)}
          </div>
          <h2 className="mt-12 font-serif text-3xl">Informations bibliographiques</h2>
          <dl className="mt-6 grid max-w-3xl grid-cols-1 gap-y-7 text-sm sm:grid-cols-2">
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">Titre original</dt><dd className="mt-2 font-medium">{book.title}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">Genre</dt><dd className="mt-2 font-medium">{book.category}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">Année</dt><dd className="mt-2 font-medium">{book.year}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">ISBN</dt><dd className="mt-2 font-medium">{book.isbn}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">Collection</dt><dd className="mt-2 font-medium">{book.collectionLabel}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase text-[#8f7770]">Pays</dt><dd className="mt-2 font-medium">{book.country}</dd></div>
          </dl>
        </div>
        <aside className="rounded-lg border border-[#d9d1c6] bg-[#f2ede3] p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c17248]">L'auteur</p>
          <Link to={author ? `/auteurs/${author.id}` : '/auteurs'} className="mt-5 block font-serif text-2xl hover:text-[#133a28]">{book.author}</Link>
          <p className="mt-2 text-xs text-[#705f57]">{author?.years} · {author?.country}</p>
          <p className="mt-8 text-sm leading-6 text-[#705f57]">{author?.bio}</p>
        </aside>
      </section>

      <section id="commentaires" className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">Avis des lecteurs</h2>
            <p className="mt-2 text-sm text-[#705f57]">{STATIC_COMMENTS + comments.length} lecteurs ont partagé leur expérience de cette œuvre.</p>
          </div>
          <button type="button" onClick={() => setSort((current) => (current === 'recent' ? 'oldest' : 'recent'))} className="text-sm text-[#705f57]">
            Trier : {sort === 'recent' ? 'plus récents' : 'plus anciens'}
          </button>
        </div>
        <form onSubmit={submitComment} className="mb-10 rounded-xl border border-[#d9d1c6] bg-white p-6">
          {replyTo ? (
            <button type="button" className="mb-3 text-xs text-[#705f57]" onClick={() => setReplyTo(null)}>Annuler la réponse</button>
          ) : null}
          <div className="mb-4 flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
                onMouseEnter={() => setHoverRating(value)}
                onClick={() => {
                  setRating(value)
                  saveRating(book.id, value)
                  notify.success(`Votre note de ${value} étoile${value > 1 ? 's' : ''} a été enregistrée`)
                }}
              >
                <Star className={`h-6 w-6 ${value <= displayRating ? 'fill-[#c17248] text-[#c17248]' : 'text-[#d9d1c6]'}`} />
              </button>
            ))}
          </div>
          <label htmlFor="comment" className="sr-only">Commentaire</label>
          <textarea
            id="comment"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={replyTo ? 'Écrivez votre réponse...' : 'Écrivez quelques lignes sur votre lecture...'}
            className="h-28 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] p-3 text-sm outline-none focus:border-[#133a28]"
          />
          <button type="submit" className="mt-4 rounded-lg bg-[#133a28] px-4 py-2 text-sm text-white">Envoyer</button>
        </form>
        {topLevel.map((comment) => {
          const replies = ordered.filter((item) => item.parentId === comment.id)
          const likeState = likes[`${book.id}-${comment.id}`] || {}
          return (
            <article key={comment.id} className="flex gap-4 border-t border-[#d9d1c6] py-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#133a28] font-serif text-white">V</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-sm font-semibold">Vous</h4>
                  <span className="text-[11px] text-[#8f7770]">{timeAgo(comment.date)}</span>
                  <span className="text-xs tracking-widest text-[#b7924b]">{'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}</span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#705f57]">{comment.text}</p>
                <div className="mt-3 flex gap-4 text-[11px] text-[#8f7770]">
                  <button type="button" className={likeState.like ? 'text-[#b7924b]' : ''} onClick={() => setLikes({ ...likes, [`${book.id}-${comment.id}`]: setCommentLike(book.id, comment.id, 'like') })}>J’aime</button>
                  <button type="button" onClick={() => { setReplyTo(comment.id); notify.info('Répondez à ce commentaire') }}>Répondre</button>
                  <button type="button" onClick={() => { setComments(deleteComment(book.id, comment.id)); notify.success('Commentaire supprimé') }}>Supprimer</button>
                </div>
                {replies.map((reply) => (
                  <div key={reply.id} className="mt-4 ml-6 border-l-2 border-[#d9d1c6] pl-4">
                    <p className="text-sm font-semibold">Vous · {timeAgo(reply.date)}</p>
                    <p className="mt-2 text-sm text-[#705f57]">{reply.text}</p>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </section>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-[#f8f3e9]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#d9d1c6] p-4">
              <h3 className="font-serif text-xl">Aperçu du livre</h3>
              <button type="button" onClick={() => setPreviewOpen(false)}>Fermer</button>
            </div>
            <div className="p-6">
              <p className="mb-4 font-serif text-2xl">Extrait de "{book.title}"</p>
              <p className="mb-4 text-sm leading-7 text-[#705f57]">{book.about}</p>
              <p className="text-sm leading-7 text-[#705f57]">{book.description}</p>
            </div>
            <div className="border-t border-[#d9d1c6] bg-[#f2ede3] p-4">
              <Link to={`/livres/${book.id}/lire`} className="inline-flex items-center gap-2 rounded-lg bg-[#133a28] px-6 py-3 text-sm font-semibold text-white">
                <Play className="h-4 w-4" /> Lire le livre complet
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (seconds < 60) return "À l'instant"
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`
  if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`
  return new Date(dateString).toLocaleDateString('fr-FR')
}
