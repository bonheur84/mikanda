import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Download, Eye, Play, Share2, Star, Users, ThumbsUp, MessageSquare, Trash2, Reply } from 'lucide-react'
import { getBookById } from '../data/books.js'
import { getAuthorByName } from '../data/authors.js'
import { FavoriteButton } from '../components/books/FavoriteButton.jsx'
import { ShareModal } from '../components/common/ShareModal.jsx'
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx'
import {
  getComments,
  addComment,
  deleteComment,
  syncCommentLikes,
  toggleCommentLike,
  hasUserLiked,
} from '../services/comments.js'
import { getRating, saveRating, getAverageRating } from '../services/ratings.js'
import { getReadCount } from '../services/readCount.js'
import { getCurrentUser } from '../services/auth.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { NotFound } from './NotFound.jsx'

export function BookDetails() {
  const { id } = useParams()
  const book = getBookById(id)
  const author = book ? getAuthorByName(book.author) : null
  const notify = useNotification()
  const currentUser = getCurrentUser()

  const [shareOpen, setShareOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { commentId }
  const [hoverRating, setHoverRating] = useState(0)
  const [rating, setRating] = useState(() => (book ? getRating(book.id) : 0))
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState(null) // { id, userName }
  const [replyTexts, setReplyTexts] = useState({}) // { [commentId]: string }
  const [sort, setSort] = useState('recent')
  const [comments, setComments] = useState([])

  useDocumentTitle(book?.title)

  // Charger et synchroniser les commentaires avec les likes
  useEffect(() => {
    if (!book) return
    const synced = syncCommentLikes(book.id)
    setComments(synced)
  }, [book])

  if (!book) return <NotFound />

  // Note moyenne calculée
  const { average: avgRating, count: reviewCount } = getAverageRating(
    book.id,
    book.rating,
    book.reviews,
  )

  // Nombre de lectures réelles
  const realReadCount = getReadCount(book.id)
  const displayReaders = realReadCount > 0
    ? (realReadCount >= 1000 ? `${(realReadCount / 1000).toFixed(1)}K` : String(realReadCount))
    : book.readers

  const displayRating = hoverRating || rating || 0

  const ordered = useMemo(() => {
    const copy = [...comments]
    copy.sort((a, b) =>
      sort === 'recent'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date),
    )
    return copy
  }, [comments, sort])

  const topLevel = ordered.filter((item) => !item.parentId)

  // Soumettre un commentaire principal
  const submitComment = (event) => {
    event.preventDefault()
    if (!currentUser) {
      notify.error('Vous devez être connecté pour commenter')
      return
    }
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
      parentId: null,
      date: new Date().toISOString(),
    })
    saveRating(book.id, rating)
    setComments(next)
    setText('')
    setRating(0)
    notify.success('Commentaire envoyé')
  }

  // Soumettre une réponse à un commentaire
  const submitReply = (parentId) => {
    const replyText = replyTexts[parentId]?.trim()
    if (!currentUser) {
      notify.error('Vous devez être connecté pour répondre')
      return
    }
    if (!replyText) {
      notify.error('Veuillez écrire une réponse')
      return
    }
    const next = addComment(book.id, {
      id: `reply-${Date.now()}`,
      text: replyText,
      rating: 0,
      parentId,
      date: new Date().toISOString(),
    })
    setComments(next)
    setReplyTexts((prev) => ({ ...prev, [parentId]: '' }))
    setReplyTo(null)
    notify.success('Réponse envoyée')
  }

  // Liker un commentaire
  const handleLike = (commentId) => {
    if (!currentUser) {
      notify.info('Connectez-vous pour liker un commentaire')
      return
    }
    const result = toggleCommentLike(book.id, commentId)
    if (result) {
      setComments(result.comments)
    }
  }

  // Supprimer un commentaire (avec vérification côté service)
  const confirmDelete = (commentId) => {
    setDeleteTarget({ commentId })
  }

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return
    const { comments: next, error } = deleteComment(book.id, deleteTarget.commentId)
    if (error) {
      notify.error(error)
    } else {
      setComments(next)
      notify.success('Commentaire supprimé')
    }
    setDeleteTarget(null)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-xs text-[#8f7770]">
        <Link to="/bibliotheque" className="inline-flex items-center gap-1 hover:text-[#133a28]">
          <ArrowLeft className="h-3 w-3" /> Retour à la bibliothèque
        </Link>
      </div>

      {/* En-tête du livre */}
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
              <span className="font-medium">{avgRating}</span>
              <span className="text-[#8f7770]">({reviewCount} avis)</span>
            </span>
          </div>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{book.title}</h1>
          <Link to={author ? `/auteurs/${author.id}` : '/auteurs'} className="mt-1 font-serif text-lg text-[#133a28] hover:underline">
            {book.author}
          </Link>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#705f57]">{book.description}</p>

          {/* Boutons d'action */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to={`/livres/${book.id}/lire`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#133a28] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245743] active:scale-95"
            >
              <Play className="h-3.5 w-3.5" /> Lire maintenant
            </Link>

            {/* Bouton de téléchargement PDF */}
            {book.pdfUrl ? (
              <a
                href={book.pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs transition-colors hover:border-[#133a28] hover:text-[#133a28] active:scale-95"
              >
                <Download className="h-3.5 w-3.5" /> Télécharger PDF
              </a>
            ) : (
              <button
                type="button"
                title="PDF non disponible pour ce livre"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#d9d1c6] px-4 py-2.5 text-xs text-[#8f7770] opacity-60"
                onClick={() => notify.info('Le PDF de ce livre n\'est pas encore disponible.')}
              >
                <Download className="h-3.5 w-3.5" /> PDF non disponible
              </button>
            )}

            <FavoriteButton book={book} variant="button" className="relative top-auto right-auto" />
            <button
              type="button"
              aria-label="Partager"
              className="rounded-lg border border-[#d9d1c6] p-2.5 transition-colors hover:border-[#133a28] hover:text-[#133a28] active:scale-95"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Aperçu"
              className="rounded-lg border border-[#d9d1c6] p-2.5 transition-colors hover:border-[#133a28] hover:text-[#133a28] active:scale-95"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Métadonnées */}
          <dl className="mt-7 grid max-w-2xl grid-cols-2 gap-x-8 border-y border-[#d9d1c6] py-4 text-xs sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[9px] uppercase text-[#8f7770]">Langue(s)</dt>
              <dd className="mt-1 font-medium">
                {Array.isArray(book.languages) ? book.languages.join(', ') : (book.language || '—')}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase text-[#8f7770]">Pages</dt>
              <dd className="mt-1 font-medium">{book.pages || '—'}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase text-[#8f7770]">Statut</dt>
              <dd className={`mt-1 font-medium ${book.availability === 'free' ? 'text-[#133a28]' : 'text-[#c17248]'}`}>
                {book.availability === 'free' ? 'Gratuit' : 'Premium'}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase text-[#8f7770]">Éditeur</dt>
              <dd className="mt-1 font-medium">{book.publisher || '—'}</dd>
            </div>
          </dl>

          {/* Infos supplémentaires (sans heures de lecture) */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8f7770]">
            <span className="inline-flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />Format numérique</span>
            <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" />{displayReaders} lecteurs</span>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="grid gap-10 border-b border-[#d9d1c6] py-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="font-serif text-3xl">À propos de cette œuvre</h2>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[#705f57]">{book.about}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f2ede3] px-3 py-1 text-xs">{tag}</span>
            ))}
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

      {/* Commentaires */}
      <section id="commentaires" className="py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">Avis des lecteurs</h2>
            <p className="mt-2 text-sm text-[#705f57]">
              <span className="font-medium text-[#1a1410]">{avgRating} / 5</span>
              {' '}· {reviewCount} {reviewCount > 1 ? 'avis' : 'avis'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSort((s) => (s === 'recent' ? 'oldest' : 'recent'))}
            className="rounded-lg border border-[#d9d1c6] px-3 py-1.5 text-xs text-[#705f57] transition-colors hover:border-[#133a28] hover:text-[#133a28]"
          >
            Trier : {sort === 'recent' ? 'plus récents ↓' : 'plus anciens ↑'}
          </button>
        </div>

        {/* Formulaire de commentaire */}
        {currentUser ? (
          <form onSubmit={submitComment} className="mb-10 rounded-xl border border-[#d9d1c6] bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-medium text-[#1a1410]">Votre avis</p>
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
                    notify.success(`Note de ${value} étoile${value > 1 ? 's' : ''} enregistrée`)
                  }}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star className={`h-7 w-7 ${value <= displayRating ? 'fill-[#c17248] text-[#c17248]' : 'text-[#d9d1c6]'}`} />
                </button>
              ))}
            </div>
            <label htmlFor="comment" className="sr-only">Commentaire</label>
            <textarea
              id="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez quelques lignes sur votre lecture..."
              className="h-28 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] p-3 text-sm outline-none focus:border-[#133a28] transition-colors"
            />
            <button
              type="submit"
              className="mt-4 rounded-lg bg-[#133a28] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d5a3e] active:scale-95"
            >
              Publier mon avis
            </button>
          </form>
        ) : (
          <div className="mb-10 rounded-xl border border-[#d9d1c6] bg-[#f8f3e9] p-6 text-center">
            <p className="text-sm text-[#705f57]">
              <Link to="/connexion" className="font-semibold text-[#133a28] hover:underline">Connectez-vous</Link>
              {' '}pour laisser un avis sur ce livre.
            </p>
          </div>
        )}

        {/* Liste des commentaires */}
        {topLevel.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d9d1c6] py-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-[#d9d1c6]" />
            <p className="text-sm text-[#8f7770]">Aucun avis pour le moment. Soyez le premier à commenter !</p>
          </div>
        ) : (
          <div className="space-y-0">
            {topLevel.map((comment) => {
              const replies = ordered.filter((item) => item.parentId === comment.id)
              const isOwner = currentUser && (comment.userId === currentUser.id || !comment.userId)
              const userLiked = hasUserLiked(book.id, comment.id)
              const showReplyForm = replyTo?.id === comment.id

              return (
                <article key={comment.id} className="flex gap-4 border-t border-[#d9d1c6] py-6">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#133a28] font-serif text-sm text-white">
                    {comment.userInitials || 'V'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-sm font-semibold text-[#1a1410]">{comment.userName || 'Lecteur'}</h4>
                      <span className="text-[11px] text-[#8f7770]">{timeAgo(comment.date)}</span>
                      {comment.rating > 0 && (
                        <span className="text-xs tracking-widest text-[#b7924b]">
                          {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#705f57]">{comment.text}</p>

                    {/* Actions du commentaire */}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {/* Bouton like */}
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                          userLiked ? 'text-[#133a28] font-semibold' : 'text-[#8f7770] hover:text-[#133a28]'
                        }`}
                        title={currentUser ? (userLiked ? 'Retirer le like' : 'J\'aimer ce commentaire') : 'Connectez-vous pour liker'}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${userLiked ? 'fill-current' : ''}`} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                        J'aime
                      </button>

                      {/* Bouton répondre */}
                      {currentUser && (
                        <button
                          type="button"
                          onClick={() => setReplyTo(showReplyForm ? null : { id: comment.id, userName: comment.userName })}
                          className="flex items-center gap-1.5 text-[11px] text-[#8f7770] transition-colors hover:text-[#133a28]"
                        >
                          <Reply className="h-3.5 w-3.5" /> Répondre
                        </button>
                      )}

                      {/* Bouton supprimer (uniquement l'auteur ou admin) */}
                      {(isOwner || currentUser?.isAdmin) && (
                        <button
                          type="button"
                          onClick={() => confirmDelete(comment.id)}
                          className="flex items-center gap-1.5 text-[11px] text-[#8f7770] transition-colors hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Supprimer
                        </button>
                      )}
                    </div>

                    {/* Formulaire de réponse */}
                    {showReplyForm && (
                      <div className="mt-4 ml-4 border-l-2 border-[#d9d1c6] pl-4">
                        <p className="mb-2 text-xs text-[#8f7770]">
                          Répondre à <span className="font-medium text-[#1a1410]">{replyTo.userName}</span>
                        </p>
                        <textarea
                          value={replyTexts[comment.id] || ''}
                          onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                          placeholder="Écrivez votre réponse..."
                          className="h-20 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] p-3 text-sm outline-none focus:border-[#133a28] transition-colors"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => submitReply(comment.id)}
                            className="rounded-lg bg-[#133a28] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1d5a3e] active:scale-95"
                          >
                            Envoyer
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyTo(null)}
                            className="rounded-lg border border-[#d9d1c6] px-4 py-1.5 text-xs text-[#705f57] transition-colors hover:bg-[#f4ece2]"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Réponses au commentaire */}
                    {replies.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {replies.map((reply) => {
                          const replyIsOwner = currentUser && (reply.userId === currentUser.id || !reply.userId)
                          return (
                            <div key={reply.id} className="ml-6 border-l-2 border-[#d9d1c6] pl-4">
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#315d4b] font-serif text-xs text-white">
                                  {reply.userInitials || 'V'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold text-[#1a1410]">{reply.userName || 'Lecteur'}</span>
                                    <span className="text-[10px] text-[#8f7770]">{timeAgo(reply.date)}</span>
                                  </div>
                                  <p className="mt-1.5 text-sm text-[#705f57]">{reply.text}</p>
                                  {(replyIsOwner || currentUser?.isAdmin) && (
                                    <button
                                      type="button"
                                      onClick={() => confirmDelete(reply.id)}
                                      className="mt-1.5 flex items-center gap-1 text-[10px] text-[#8f7770] hover:text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3" /> Supprimer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Modales */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer ce commentaire"
        message="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce commentaire ? Les réponses associées seront également supprimées."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-[#f8f3e9]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#d9d1c6] p-4">
              <h3 className="font-serif text-xl">Aperçu du livre</h3>
              <button type="button" onClick={() => setPreviewOpen(false)} className="text-sm text-[#705f57] hover:text-[#1a1410]">Fermer</button>
            </div>
            <div className="p-6">
              <p className="mb-4 font-serif text-2xl">Extrait de « {book.title} »</p>
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
      )}
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
