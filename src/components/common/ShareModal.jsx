import { useEffect } from 'react'
import { useNotification } from '../../hooks/useNotification.jsx'

export function ShareModal({ open, onClose, title = 'Partager ce livre' }) {
  const notify = useNotification()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const url = window.location.href
  const text = encodeURIComponent(`Découvrez ce livre sur MIKANDA: ${url}`)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      notify.success('Lien copié')
      onClose()
    } catch {
      notify.error('Impossible de copier le lien')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose} role="presentation">
      <div className="mx-4 w-full max-w-sm scale-100 rounded-lg bg-white shadow-xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="share-title">
        <div className="p-6">
          <h3 id="share-title" className="mb-4 font-serif text-xl text-[#281e19]">{title}</h3>
          <div className="space-y-2">
            <a href={`https://wa.me/?text=${text}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?text=${text}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">X / Twitter</a>
            <button type="button" onClick={copy} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-50">
              Copier le lien
            </button>
          </div>
          <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-sm text-[#705f57] hover:text-[#281e19]">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
