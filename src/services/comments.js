import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

export function getComments(bookId) {
  const comments = readJson(STORAGE_KEYS.comments, {})
  return comments[bookId] || []
}

export function saveComments(bookId, comments) {
  const all = readJson(STORAGE_KEYS.comments, {})
  all[bookId] = comments
  writeJson(STORAGE_KEYS.comments, all)
}

export function addComment(bookId, comment) {
  const comments = getComments(bookId)
  const next = [comment, ...comments]
  saveComments(bookId, next)
  return next
}

export function deleteComment(bookId, commentId) {
  const comments = getComments(bookId).filter(
    (item) => item.id !== commentId && item.parentId !== commentId,
  )
  saveComments(bookId, comments)
  return comments
}

export function getCommentLikes() {
  return readJson(STORAGE_KEYS.commentLikes, {})
}

export function setCommentLike(bookId, commentId, type) {
  const likes = getCommentLikes()
  const key = `${bookId}-${commentId}`
  const current = likes[key] || { like: false, dislike: false }

  if (type === 'like') {
    current.like = !current.like
    if (current.like) current.dislike = false
  } else {
    current.dislike = !current.dislike
    if (current.dislike) current.like = false
  }

  likes[key] = current
  writeJson(STORAGE_KEYS.commentLikes, likes)
  return current
}
