import { useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { readJson, writeJson, STORAGE_KEYS } from '../../services/storage.js'
import { useNotification } from '../../hooks/useNotification.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { books } from '../../data/books.js'

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/** Aplatit les commentaires imbriqués {bookId: [...]} → tableau [{bookId, ...comment}] */
function flattenComments(raw) {
  if (!raw || typeof raw !== 'object') return []
  return Object.entries(raw).flatMap(([bookId, list]) =>
    Array.isArray(list) ? list.map((c) => ({ ...c, bookId })) : []
  )
}

export function AdminComments() {
  useDocumentTitle('Commentaires — Admin MIKANDA')
  const notify = useNotification()
  const [rawComments, setRawComments] = useState(() => readJson(STORAGE_KEYS.comments, {}))
  const [search, setSearch] = useState('')

  const allComments = flattenComments(rawComments).map((c) => ({
    ...c,
    bookTitle: books.find((b) => b.id === c.bookId)?.title || c.bookId || '—',
  }))

  const filtered = allComments.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.text?.toLowerCase().includes(q) || c.userName?.toLowerCase().includes(q) || c.bookTitle.toLowerCase().includes(q)
  })

  function handleDelete(bookId, commentId) {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    const updated = { ...rawComments }
    if (Array.isArray(updated[bookId])) {
      updated[bookId] = updated[bookId].filter(
        (c) => c.id !== commentId && c.parentId !== commentId
      )
      if (updated[bookId].length === 0) delete updated[bookId]
    }
    writeJson(STORAGE_KEYS.comments, updated)
    setRawComments(updated)
    notify.success('Commentaire supprimé.')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Commentaires</h1>
        <p className="mt-1 text-sm text-[#705f57]">{allComments.length} commentaire(s) stocké(s) localement</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7770]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="h-10 w-full rounded-lg border border-[#d9d1c6] pl-9 pr-4 text-sm focus:border-[#133a28] focus:outline-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e2ddd6] py-16 text-center text-sm text-[#8f7770]">
          {allComments.length === 0 ? 'Aucun commentaire dans le système.' : 'Aucun commentaire trouvé.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={`${c.bookId}-${c.id}`} className="flex items-start justify-between gap-4 rounded-xl border border-[#e2ddd6] bg-white p-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a1410]">{c.userName || 'Anonyme'}</span>
                  <span className="text-xs text-[#8f7770]">sur</span>
                  <span className="rounded-full bg-[#f4ece2] px-2 py-0.5 text-xs text-[#c17248]">{c.bookTitle}</span>
                  {c.rating && <span className="text-xs text-yellow-600">★ {c.rating}</span>}
                  <span className="text-xs text-[#8f7770]">{formatDate(c.timestamp)}</span>
                </div>
                <p className="mt-2 text-sm text-[#705f57] line-clamp-3">{c.text}</p>
              </div>
              <button onClick={() => handleDelete(c.bookId, c.id)} title="Supprimer"
                className="shrink-0 rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
