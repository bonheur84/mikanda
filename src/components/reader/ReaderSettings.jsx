export function ReaderSettings({ open, onClose, width, spacing, onWidth, onSpacing }) {
  if (!open) return null

  return (
    <div id="settings-panel" className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4 sm:items-start sm:pt-20">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">Paramètres de lecture</h2>
          <button type="button" id="settings-close-button" onClick={onClose} className="text-sm text-[#705f57]">
            Fermer
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="mb-2 font-medium">Largeur</p>
            <div className="flex gap-2">
              {['narrow', 'normal', 'wide'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onWidth(value)}
                  className={`rounded-lg px-3 py-1.5 ${width === value ? 'bg-[#133a28] text-white' : 'bg-[#f4ecdc]'}`}
                >
                  {value === 'narrow' ? 'Étroit' : value === 'wide' ? 'Large' : 'Normal'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">Espacement</p>
            <div className="flex gap-2">
              {['compact', 'normal', 'comfortable'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSpacing(value)}
                  className={`rounded-lg px-3 py-1.5 ${spacing === value ? 'bg-[#133a28] text-white' : 'bg-[#f4ecdc]'}`}
                >
                  {value === 'compact' ? 'Compact' : value === 'comfortable' ? 'Confortable' : 'Normal'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
