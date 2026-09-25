import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

export function getRating(bookId) {
  const ratings = readJson(STORAGE_KEYS.ratings, {})
  return ratings[bookId] ?? null
}

export function saveRating(bookId, rating) {
  const ratings = readJson(STORAGE_KEYS.ratings, {})
  ratings[bookId] = rating
  writeJson(STORAGE_KEYS.ratings, ratings)
}
