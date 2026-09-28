import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * ConfirmDialog — Boîte de dialogue de confirmation élégante.
 *
 * Remplace window.confirm() par une modale soignée et accessible.
 *
 * Props :
 * - open       : boolean
 * - title      : string
 * - message    : string | ReactNode
 * - confirmLabel : string (défaut: "Confirmer")
 * - cancelLabel  : string (défaut: "Annuler")
 * - variant    : 'danger' | 'default'
 * - onConfirm  : () => void
 * - onCancel   : () => void
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'default',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel()
      if (event.key === 'Enter') onConfirm()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel, onConfirm])

  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className={`p-6 ${isDanger ? 'bg-red-50' : 'bg-[#f8f3e9]'}`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isDanger ? 'bg-red-100' : 'bg-[#133a28]/10'}`}>
              <AlertTriangle className={`h-6 w-6 ${isDanger ? 'text-red-600' : 'text-[#133a28]'}`} />
            </div>
            <div>
              <h2 id="confirm-title" className="font-serif text-xl text-[#1a1410]">{title}</h2>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="px-6 py-5">
          <p id="confirm-message" className="text-sm leading-6 text-[#705f57]">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#ede5d8] p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#d9d1c6] px-5 py-2.5 text-sm font-medium text-[#705f57] transition-colors hover:bg-[#f4ece2] focus:outline-none focus:ring-2 focus:ring-[#133a28] focus:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-[#133a28] hover:bg-[#1d5a3e] focus:ring-[#133a28]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
