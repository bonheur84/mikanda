import { useState, useEffect } from 'react'
import { Languages, Loader2, X, RefreshCw } from 'lucide-react'
import { translationService, SUPPORTED_LANGUAGES } from '../../services/translationService.js'

export function TranslationPanel({ text, onClose }) {
  const [targetLang, setTargetLang] = useState('en')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si pas de texte, on ferme (géré au niveau du parent normalement)
    if (!text) return

    let mounted = true
    async function translate() {
      setLoading(true)
      setError(null)
      try {
        const result = await translationService.translateText(text, targetLang)
        if (mounted) setTranslatedText(result.translation)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    translate()
    return () => { mounted = false }
  }, [text, targetLang])

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[#ded3c1] bg-[#f7f1e6]/97 shadow-2xl backdrop-blur-sm max-h-[50vh] flex flex-col">
      {/* Header du panel */}
      <div className="flex items-center justify-between border-b border-[#ded3c1] px-4 py-2 bg-[#efe6d6]/50">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1a1410]">
          <Languages className="h-4 w-4 text-[#c17248]" />
          Traduction
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#705f57]">Traduire en :</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="rounded-md border border-[#d9d1c6] bg-white px-2 py-1 text-[#1a1410] focus:border-[#133a28] focus:outline-none"
              disabled={loading}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          
          <button onClick={onClose}
            className="rounded-lg p-1.5 text-[#705f57] hover:bg-[#d9d1c6] hover:text-[#133a28]"
            title="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Texte original */}
        <div>
          <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8f7770]">Original</h4>
          <p className="text-sm text-[#705f57] italic line-clamp-3">{text}</p>
        </div>

        {/* Résultat traduction */}
        <div className="flex-1">
          <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#133a28]">Traduction ({SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.label})</h4>
          
          {loading ? (
            <div className="flex items-center justify-center py-6 text-[#c17248]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">Traduction en cours...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <X className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Erreur de traduction</p>
                  <p className="mt-1 whitespace-pre-wrap text-xs">{error}</p>
                </div>
              </div>
              {translationService.isMockMode() && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 flex items-center gap-1 text-xs font-semibold hover:underline"
                >
                  <RefreshCw className="h-3 w-3" /> Réessayer (simulé)
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-[#1a1410] whitespace-pre-wrap">
              {translatedText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
