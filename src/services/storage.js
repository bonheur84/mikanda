// ============================================================
// MIKANDA — Service de stockage centralisé (LocalStorage)
// AVERTISSEMENT : LocalStorage n'est PAS une solution sécurisée
// pour la production. Ce système simule uniquement un backend
// jusqu'à l'intégration réelle d'une API Node.js/Express.
// ============================================================

export const STORAGE_KEYS = {
  // Navigation / UX
  favorites: 'mikanda-favorites',
  welcome: 'mikanda-welcome-seen',
  bookView: 'mikanda-book-view',

  // Lecteur
  progress: 'mikanda-reading-progress',
  theme: 'mikanda-reading-theme',
  fontSize: 'mikanda-reading-font-size',
  width: 'mikanda-reading-width',
  spacing: 'mikanda-reading-spacing',
  immersive: 'mikanda-reading-immersive',
  bookmarks: 'mikanda-bookmarks',
  highlights: 'mikanda-highlights',
  notes: 'mikanda-notes',

  // Notes & commentaires
  ratings: 'mikanda-ratings',
  comments: 'mikanda-comments',
  commentLikes: 'mikanda-comment-likes',

  // Authentification utilisateur
  user: 'mikanda-user',           // utilisateur courant connecté
  users: 'mikanda-users',         // liste de tous les comptes utilisateurs
  followedAuthors: 'mikanda-followed-authors',

  // Admin
  adminSession: 'mikanda-admin-session', // session admin séparée
  adminUsers: 'mikanda-admin-users',     // liste gérée côté admin

  // Profil & préférences
  userProfile: 'mikanda-user-profile',
  userSettings: 'mikanda-user-settings',

  // Activité récente
  recentActivity: 'mikanda-recent-activity',

  // Lectures réelles (par livre, par utilisateur/session)
  readCounts: 'mikanda-read-counts',
  readSessions: 'mikanda-read-sessions',
}

/** Lit une valeur JSON depuis le localStorage */
export function readJson(key, fallback = null) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

/** Écrit une valeur JSON dans le localStorage */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('[MIKANDA Storage] Impossible d\'écrire dans localStorage:', key)
  }
}

/** Lit une chaîne de caractères depuis le localStorage */
export function readString(key, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

/** Écrit une chaîne de caractères dans le localStorage */
export function writeString(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    console.warn('[MIKANDA Storage] Impossible d\'écrire dans localStorage:', key)
  }
}

/** Supprime une clé du localStorage */
export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    console.warn('[MIKANDA Storage] Impossible de supprimer la clé:', key)
  }
}
