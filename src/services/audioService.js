// ============================================================
// MIKANDA — Service Audio (Text-to-Speech)
//
// Ce service abstrait la synthèse vocale afin de pouvoir
// remplacer window.speechSynthesis par une API cloud TTS
// (Google Cloud TTS, Azure Cognitive, ElevenLabs, etc.)
// sans modifier les composants React.
//
// ⚠️  CONFIGURATION :
// Pour utiliser une API cloud, définir dans .env :
//   VITE_TTS_API_URL=https://api.votre-service-tts.com
//   VITE_TTS_API_KEY=  ← NE JAMAIS mettre une clé secrète ici
//   (La clé API TTS doit transiter par un backend proxy sécurisé)
//
// Pour l'instant, le service utilise window.speechSynthesis
// (API native du navigateur, disponible sans clé API).
// ============================================================

const USE_BROWSER_TTS = true // Passer à false quand l'API cloud est prête

// ---- Singleton interne -------------------------------------

let _utterance = null
let _onProgress = null
let _onEnd = null

// ---- Voix françaises disponibles ---------------------------

function getBestFrenchVoice() {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'fr-FR' && v.localService) ||
    voices.find((v) => v.lang.startsWith('fr')) ||
    voices[0] ||
    null
  )
}

// ---- API publique du service -------------------------------

export const audioService = {
  /**
   * Démarre la lecture d'un texte.
   * @param {string} text - Le texte à lire
   * @param {Object} options
   * @param {number} options.rate - Vitesse (0.5 à 2, défaut 1)
   * @param {number} options.volume - Volume (0 à 1, défaut 1)
   * @param {Function} options.onWord - Callback à chaque mot
   * @param {Function} options.onEnd - Callback à la fin
   * @param {Function} options.onError - Callback en cas d'erreur
   */
  play({ text, rate = 1, volume = 1, onWord, onEnd, onError } = {}) {
    if (!text?.trim()) {
      onError?.('Aucun texte à lire.')
      return
    }

    if (!window.speechSynthesis) {
      onError?.('La synthèse vocale n\'est pas disponible dans ce navigateur.')
      return
    }

    if (USE_BROWSER_TTS) {
      this.stop()

      _utterance = new SpeechSynthesisUtterance(text)
      _utterance.lang = 'fr-FR'
      _utterance.rate = Math.max(0.5, Math.min(2, rate))
      _utterance.volume = Math.max(0, Math.min(1, volume))

      const voice = getBestFrenchVoice()
      if (voice) _utterance.voice = voice

      _utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onWord?.({
            charIndex: event.charIndex,
            charLength: event.charLength,
          })
        }
      }

      _utterance.onend = () => {
        _utterance = null
        onEnd?.()
        _onEnd?.()
      }

      _utterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          onError?.(`Erreur audio : ${event.error}`)
        }
      }

      _onEnd = onEnd
      window.speechSynthesis.speak(_utterance)
    } else {
      // --- Intégration future API cloud ---
      // Exemple avec Google Cloud TTS :
      // const apiUrl = import.meta.env.VITE_TTS_API_URL
      // const response = await fetch(`${apiUrl}/synthesize`, {
      //   method: 'POST',
      //   body: JSON.stringify({ text, languageCode: 'fr-FR', rate }),
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include', // Pour authentification session backend
      // })
      // const audioBlob = await response.blob()
      // const audioUrl = URL.createObjectURL(audioBlob)
      // const audio = new Audio(audioUrl)
      // audio.play()
      onError?.('API cloud TTS non configurée. Configurer VITE_TTS_API_URL dans .env')
    }
  },

  /** Met en pause la lecture. */
  pause() {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause()
    }
  },

  /** Reprend la lecture après une pause. */
  resume() {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume()
    }
  },

  /** Arrête complètement la lecture. */
  stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    _utterance = null
    _onProgress = null
  },

  /** Retourne true si une lecture est en cours. */
  isSpeaking() {
    return window.speechSynthesis?.speaking ?? false
  },

  /** Retourne true si la lecture est en pause. */
  isPaused() {
    return window.speechSynthesis?.paused ?? false
  },

  /** Retourne la liste des voix disponibles. */
  getVoices() {
    return window.speechSynthesis?.getVoices() ?? []
  },

  /** Charge les voix de manière asynchrone (nécessaire sur certains navigateurs). */
  loadVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis?.getVoices() ?? []
      if (voices.length > 0) {
        resolve(voices)
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices())
        }
      }
    })
  },
}
