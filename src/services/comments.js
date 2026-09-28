// ============================================================
// MIKANDA — Service de gestion des commentaires
//
// Gère les commentaires, réponses, likes et suppressions.
// La règle de suppression (seul l'auteur peut supprimer) est
// appliquée côté service, pas seulement côté UI.
// ============================================================

import { STORAGE_KEYS, readJson, writeJson } from './storage.js'
import { getCurrentUser } from './auth.js'

export function getComments(bookId) {
  const comments = readJson(STORAGE_KEYS.comments, {})
  return comments[bookId] || []
}

export function saveComments(bookId, comments) {
  const all = readJson(STORAGE_KEYS.comments, {})
  all[bookId] = comments
  writeJson(STORAGE_KEYS.comments, all)
}

/**
 * Ajoute un commentaire ou une réponse.
 * Enregistre l'userId de l'auteur si un utilisateur est connecté.
 */
export function addComment(bookId, comment) {
  const user = getCurrentUser()
  const enriched = {
    ...comment,
    userId: user?.id || null,
    userName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Anonyme',
    userInitials: user
      ? `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase()
      : 'A',
    likes: 0,
  }
  const comments = getComments(bookId)
  const next = [enriched, ...comments]
  saveComments(bookId, next)
  return next
}

/**
 * Supprime un commentaire ou une réponse.
 * Règle serveur : seul l'auteur (userId) ou un admin peut supprimer.
 * Supprime aussi toutes les réponses à ce commentaire.
 * @returns {{ comments: array, error: string|null }}
 */
export function deleteComment(bookId, commentId) {
  const user = getCurrentUser()
  const comments = getComments(bookId)
  const target = comments.find((c) => c.id === commentId)

  if (!target) {
    return { comments, error: 'Commentaire introuvable.' }
  }

  if (!user) {
    return { comments, error: 'Vous devez être connecté pour supprimer un commentaire.' }
  }

  if (target.userId && target.userId !== user.id && !user.isAdmin) {
    return { comments, error: 'Vous ne pouvez supprimer que vos propres commentaires.' }
  }

  const filtered = comments.filter(
    (item) => item.id !== commentId && item.parentId !== commentId,
  )
  saveComments(bookId, filtered)
  return { comments: filtered, error: null }
}

// ---------- Likes -------------------------------------------

export function getCommentLikes() {
  return readJson(STORAGE_KEYS.commentLikes, {})
}

/**
 * Toggle like d'un commentaire pour l'utilisateur courant.
 * Empêche de liker plusieurs fois.
 * Retourne { liked: bool, likeCount: number }
 */
export function toggleCommentLike(bookId, commentId) {
  const user = getCurrentUser()
  if (!user) return null

  const key = `${bookId}-${commentId}-${user.id}`
  const likesMap = getCommentLikes()
  const alreadyLiked = !!likesMap[key]

  if (alreadyLiked) {
    delete likesMap[key]
  } else {
    likesMap[key] = true
  }
  writeJson(STORAGE_KEYS.commentLikes, likesMap)

  // Mettre à jour le compteur dans le commentaire
  const comments = getComments(bookId)
  const next = comments.map((c) => {
    if (c.id === commentId) {
      const count = countLikes(bookId, commentId, likesMap)
      return { ...c, likes: count }
    }
    return c
  })
  saveComments(bookId, next)

  return { liked: !alreadyLiked, comments: next }
}

/**
 * Vérifie si l'utilisateur courant a liké un commentaire.
 */
export function hasUserLiked(bookId, commentId) {
  const user = getCurrentUser()
  if (!user) return false
  const key = `${bookId}-${commentId}-${user.id}`
  const likesMap = getCommentLikes()
  return !!likesMap[key]
}

/**
 * Compte le nombre total de likes pour un commentaire.
 */
function countLikes(bookId, commentId, likesMap = null) {
  const map = likesMap || getCommentLikes()
  const prefix = `${bookId}-${commentId}-`
  return Object.keys(map).filter((k) => k.startsWith(prefix)).length
}

/**
 * Synchronise les compteurs de likes de tous les commentaires d'un livre.
 * À appeler lors du chargement initial.
 */
export function syncCommentLikes(bookId) {
  const comments = getComments(bookId)
  const likesMap = getCommentLikes()
  const next = comments.map((c) => ({
    ...c,
    likes: countLikes(bookId, c.id, likesMap),
    userLiked: hasUserLiked(bookId, c.id),
  }))
  return next
}
