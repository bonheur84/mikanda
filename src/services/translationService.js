// ============================================================
// MIKANDA — Service de Traduction
//
// Ce service abstrait les appels de traduction afin de pouvoir
// connecter n'importe quelle API de traduction (DeepL, Google
// Translate, LibreTranslate, etc.) sans modifier les composants.
//
// ⚠️  CONFIGURATION :
// Pour utiliser une API cloud, définir dans .env :
//   VITE_TRANSLATION_API_URL=https://api.votre-service.com
//
// ⚠️  NE JAMAIS mettre une clé API directement ici.
// Les clés doivent transiter par un backend proxy sécurisé.
//
// État actuel : mode MOCK (retourne un message clair que la
// traduction n'est pas disponible sans API configurée).
// Activer USE_MOCK_MODE = false quand l'API est prête.
// ============================================================

// Langues supportées par le service
export const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'ln', label: 'Lingála' },
]

// Mettre à false quand l'API est configurée
const USE_MOCK_MODE = !import.meta.env.VITE_TRANSLATION_API_URL

// Cache local pour éviter les requêtes répétées
const _cache = new Map()

function cacheKey(text, source, target) {
  return `${source}→${target}:${text.slice(0, 100)}`
}

// ---- API publique du service --------------------------------

export const translationService = {
  /**
   * Traduit un texte d'une langue source vers une langue cible.
   *
   * @param {string} text - Texte à traduire
   * @param {string} targetLanguage - Code langue cible (ex: 'en', 'es')
   * @param {string} sourceLanguage - Code langue source (défaut: 'fr')
   * @returns {Promise<{translation: string, source: string, target: string}>}
   * @throws {Error} Si l'API n'est pas configurée ou en cas d'erreur réseau
   */
  async translateText(text, targetLanguage, sourceLanguage = 'fr') {
    if (!text?.trim()) throw new Error('Aucun texte à traduire.')
    if (!targetLanguage) throw new Error('Langue cible requise.')
    if (sourceLanguage === targetLanguage) {
      return { translation: text, source: sourceLanguage, target: targetLanguage }
    }

    const key = cacheKey(text, sourceLanguage, targetLanguage)
    if (_cache.has(key)) {
      return _cache.get(key)
    }

    if (USE_MOCK_MODE) {
      throw new Error(
        'Le service de traduction n\'est pas encore configuré.\n' +
        'Pour l\'activer, définissez VITE_TRANSLATION_API_URL dans votre fichier .env\n' +
        'et connectez un backend proxy sécurisé avec la clé API.'
      )
    }

    // --- Intégration future API cloud ---
    // Exemple avec LibreTranslate (auto-hébergeable et gratuit) :
    const apiUrl = import.meta.env.VITE_TRANSLATION_API_URL

    const response = await fetch(`${apiUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      }),
      credentials: 'include', // Pour auth session backend
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Erreur de traduction (${response.status})`)
    }

    const data = await response.json()
    const result = {
      translation: data.translatedText,
      source: sourceLanguage,
      target: targetLanguage,
    }

    // Mettre en cache (limité à 200 entrées)
    if (_cache.size > 200) {
      const firstKey = _cache.keys().next().value
      _cache.delete(firstKey)
    }
    _cache.set(key, result)

    return result
  },

  /** Vide le cache de traduction. */
  clearCache() {
    _cache.clear()
  },

  /** Retourne true si le service est en mode mock (non configuré). */
  isMockMode() {
    return USE_MOCK_MODE
  },

  /** Retourne les langues supportées. */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES
  },
}
