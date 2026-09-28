import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

// Clé de stockage pour les métadonnées de livres (PDF, langues, pages, statut, éditeur)
const ADMIN_BOOKS_META_KEY = 'mikanda-admin-books-meta'

export function getBookMeta(bookId) {
  const meta = readJson(ADMIN_BOOKS_META_KEY, {})
  return meta[bookId] || {}
}

export function saveBookMeta(bookId, data) {
  const meta = readJson(ADMIN_BOOKS_META_KEY, {})
  meta[bookId] = data
  writeJson(ADMIN_BOOKS_META_KEY, meta)
}

export function getAllBooksMeta() {
  return readJson(ADMIN_BOOKS_META_KEY, {})
}
