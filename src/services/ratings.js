// ============================================================
// MIKANDA — Service de notes (ratings)
//
// Calcule les notes moyennes à partir des avis réellement enregistrés.
// Un utilisateur = une note par livre.
// ============================================================

import { STORAGE_KEYS, readJson, writeJson } from './storage.js'
import { getCurrentUser } from './auth.js'

/**
 * Structure stockée :
 * { [bookId]: { [userId]: number } }
 *
 * Pour compatibilité avec l'ancien format { [bookId]: number },
 * on migre silencieusement à la lecture.
 */

function getRatingsStore() {
  return readJson(STORAGE_KEYS.ratings, {})
}

/**
 * Retourne la note donnée par l'utilisateur courant pour un livre.
 * Retourne null si aucune note.
 */
export function getRating(bookId) {
  const user = getCurrentUser()
  const store = getRatingsStore()
  const bookRatings = store[bookId]

  if (!bookRatings) return null

  // Ancien format : { [bookId]: number }
  if (typeof bookRatings === 'number') return bookRatings

  // Nouveau format : { [bookId]: { [userId]: number } }
  if (user && bookRatings[user.id] !== undefined) {
    return bookRatings[user.id]
  }
  return null
}

/**
 * Enregistre la note de l'utilisateur courant pour un livre.
 */
export function saveRating(bookId, rating) {
  const user = getCurrentUser()
  const store = getRatingsStore()
  const existing = store[bookId]

  let bookRatings
  if (!existing || typeof existing === 'number') {
    // Migrer ou initialiser
    bookRatings = {}
  } else {
    bookRatings = { ...existing }
  }

  const userId = user ? user.id : '__anonymous__'
  bookRatings[userId] = rating
  store[bookId] = bookRatings
  writeJson(STORAGE_KEYS.ratings, store)
}

/**
 * Calcule la note moyenne réelle d'un livre à partir des avis.
 * Retourne { average: number, count: number }
 */
export function getAverageRating(bookId, staticRating = null, staticReviews = 0) {
  const store = getRatingsStore()
  const bookRatings = store[bookId]

  let userRatings = []
  if (bookRatings && typeof bookRatings !== 'number') {
    userRatings = Object.values(bookRatings).filter((v) => typeof v === 'number')
  }

  if (userRatings.length === 0) {
    // Pas encore d'avis utilisateur — retourner les données statiques
    return {
      average: staticRating || 0,
      count: staticReviews || 0,
      hasUserRatings: false,
    }
  }

  const sum = userRatings.reduce((acc, r) => acc + r, 0)
  const avg = sum / userRatings.length

  // Pondération : si données statiques disponibles, les inclure
  if (staticRating && staticReviews > 0) {
    const totalCount = staticReviews + userRatings.length
    const weightedAvg = (staticRating * staticReviews + sum) / totalCount
    return {
      average: Math.round(weightedAvg * 10) / 10,
      count: totalCount,
      hasUserRatings: true,
    }
  }

  return {
    average: Math.round(avg * 10) / 10,
    count: userRatings.length,
    hasUserRatings: true,
  }
}

/**
 * Calcule la note moyenne globale d'un auteur à partir de tous ses livres.
 * Pondérée par le nombre d'avis de chaque livre.
 */
export function getAuthorAverageRating(authorBooks) {
  const store = getRatingsStore()
  let totalWeightedSum = 0
  let totalCount = 0

  authorBooks.forEach((book) => {
    const bookRatings = store[book.id]
    let userRatings = []

    if (bookRatings && typeof bookRatings !== 'number') {
      userRatings = Object.values(bookRatings).filter((v) => typeof v === 'number')
    }

    const staticRating = book.rating || 0
    const staticCount = book.reviews || 0

    if (userRatings.length > 0) {
      const userSum = userRatings.reduce((acc, r) => acc + r, 0)
      const totalBookCount = staticCount + userRatings.length
      const bookAvg = (staticRating * staticCount + userSum) / totalBookCount
      totalWeightedSum += bookAvg * totalBookCount
      totalCount += totalBookCount
    } else {
      totalWeightedSum += staticRating * staticCount
      totalCount += staticCount
    }
  })

  if (totalCount === 0) return { average: 0, count: 0 }
  return {
    average: Math.round((totalWeightedSum / totalCount) * 10) / 10,
    count: totalCount,
  }
}
