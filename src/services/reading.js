import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

export function getReadingProgress(bookId) {
  const progress = readJson(STORAGE_KEYS.progress, {})
  return progress[bookId] || 0
}

export function saveReadingProgress(bookId, percent) {
  const progress = readJson(STORAGE_KEYS.progress, {})
  progress[bookId] = percent
  writeJson(STORAGE_KEYS.progress, progress)
}

export function getBookmarks(bookId) {
  const bookmarks = readJson(STORAGE_KEYS.bookmarks, {})
  return bookmarks[bookId] || []
}

export function saveBookmarks(bookId, bookmarks) {
  const all = readJson(STORAGE_KEYS.bookmarks, {})
  all[bookId] = bookmarks
  writeJson(STORAGE_KEYS.bookmarks, all)
}

export function getHighlights(bookId) {
  const highlights = readJson(STORAGE_KEYS.highlights, {})
  return highlights[bookId] || []
}

export function saveHighlights(bookId, highlights) {
  const all = readJson(STORAGE_KEYS.highlights, {})
  all[bookId] = highlights
  writeJson(STORAGE_KEYS.highlights, all)
}

export function getNotes(bookId) {
  const notes = readJson(STORAGE_KEYS.notes, {})
  return notes[bookId] || []
}

export function saveNotes(bookId, notes) {
  const all = readJson(STORAGE_KEYS.notes, {})
  all[bookId] = notes
  writeJson(STORAGE_KEYS.notes, all)
}
