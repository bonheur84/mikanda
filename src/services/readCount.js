// ============================================================
// MIKANDA — Service de comptage de lectures réelles
//
// Enregistre une lecture quand un utilisateur commence effectivement
// à lire un livre. Évite les doublons (même session ou même utilisateur).
// ============================================================

import { STORAGE_KEYS, readJson, writeJson } from './storage.js'
import { getCurrentUser } from './auth.js'

/**
 * Retourne les données de lecture pour tous les livres.
 * Structure : { [bookId]: number }
 */
export function getReadCounts() {
  return readJson(STORAGE_KEYS.readCounts, {})
}

/**
 * Retourne le nombre de lectures réelles d'un livre.
 */
export function getReadCount(bookId) {
  const counts = getReadCounts()
  return counts[bookId] || 0
}

/**
 * Enregistre une lecture pour un livre si ce n'est pas déjà fait
 * pour cette session ou cet utilisateur.
 * Retourne true si la lecture a été comptée, false si déjà comptée.
 */
export function recordRead(bookId) {
  const sessions = readJson(STORAGE_KEYS.readSessions, {})
  const user = getCurrentUser()

  // Clé unique : userId si connecté, sinon sessionId stocké
  const sessionKey = user
    ? `user_${user.id}`
    : getOrCreateSessionId()

  const bookSessions = sessions[bookId] || []
  if (bookSessions.includes(sessionKey)) {
    return false // Déjà lu dans cette session/par cet utilisateur
  }

  // Marquer la session comme ayant lu ce livre
  bookSessions.push(sessionKey)
  sessions[bookId] = bookSessions
  writeJson(STORAGE_KEYS.readSessions, sessions)

  // Incrémenter le compteur
  const counts = getReadCounts()
  counts[bookId] = (counts[bookId] || 0) + 1
  writeJson(STORAGE_KEYS.readCounts, counts)

  return true
}

/**
 * Retourne les N livres les plus lus, triés par nombre de lectures.
 */
export function getMostReadBooks(books, limit = 4) {
  const counts = getReadCounts()

  const sorted = [...books].sort((a, b) => {
    const countA = counts[a.id] || 0
    const countB = counts[b.id] || 0
    if (countB !== countA) return countB - countA
    // Fallback : trier par rating statique
    return (b.rating || 0) - (a.rating || 0)
  })

  return sorted.slice(0, limit)
}

/**
 * Retourne les N auteurs les plus lus/consultés,
 * basé sur la somme des lectures de leurs livres.
 */
export function getMostReadAuthors(authors, books, limit = 4) {
  const counts = getReadCounts()

  // Calculer le total de lectures par auteur
  const authorReadCounts = {}
  books.forEach((book) => {
    const count = counts[book.id] || 0
    if (book.authorId) {
      authorReadCounts[book.authorId] = (authorReadCounts[book.authorId] || 0) + count
    }
  })

  const sorted = [...authors].sort((a, b) => {
    const countA = authorReadCounts[a.id] || 0
    const countB = authorReadCounts[b.id] || 0
    if (countB !== countA) return countB - countA
    // Fallback : trier par readers statique (convertir '3.2K' → 3200)
    return parseReaders(b.readers) - parseReaders(a.readers)
  })

  return sorted.slice(0, limit)
}

/**
 * Retourne le nombre de lecteurs distincts pour un auteur donné.
 */
export function getAuthorDistinctReaders(authorId, books) {
  const sessions = readJson(STORAGE_KEYS.readSessions, {})
  const authorBooks = books.filter((b) => b.authorId === authorId)

  const allReaders = new Set()
  authorBooks.forEach((book) => {
    const bookSessions = sessions[book.id] || []
    bookSessions.forEach((s) => allReaders.add(s))
  })

  return allReaders.size
}

// ---------- Utilitaires internes ----------------------------

function getOrCreateSessionId() {
  const key = '__mikanda_session_id__'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(key, id)
  }
  return id
}

function parseReaders(str) {
  if (!str) return 0
  if (typeof str === 'number') return str
  const s = String(str).replace(/\s/g, '').toLowerCase()
  if (s.endsWith('k')) return parseFloat(s) * 1000
  return parseFloat(s) || 0
}
