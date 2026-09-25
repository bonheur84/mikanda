import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

export function getFavorites() {
  return readJson(STORAGE_KEYS.favorites, [])
}

export function saveFavorites(favorites) {
  writeJson(STORAGE_KEYS.favorites, favorites)
}

export function isFavorite(bookId) {
  return getFavorites().some((fav) => fav.id === bookId)
}

export function toggleFavorite(book) {
  const favorites = getFavorites()
  const index = favorites.findIndex((fav) => fav.id === book.id)

  if (index !== -1) {
    favorites.splice(index, 1)
    saveFavorites(favorites)
    return false
  }

  favorites.push({
    id: book.id,
    title: book.title,
    author: book.author,
    image: book.image,
    category: book.category,
    year: book.year,
    rating: book.rating,
    reviews: book.reviews,
    readingTime: book.readingTime,
    status: book.availability === 'premium' ? 'Premium' : 'Gratuit',
    authorId: book.authorId,
  })
  saveFavorites(favorites)
  return true
}
