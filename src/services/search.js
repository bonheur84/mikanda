export function searchCatalog(query, books, authors = []) {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2) return []

  const bookResults = books
    .map((book) => ({
      type: 'book',
      item: book,
      relevance: scoreBook(normalized, book),
    }))
    .filter((result) => result.relevance > 0)

  const authorResults = authors
    .map((author) => ({
      type: 'author',
      item: author,
      relevance: scoreAuthor(normalized, author),
    }))
    .filter((result) => result.relevance > 0)

  return [...bookResults, ...authorResults]
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 8)
}

function scoreBook(query, book) {
  let score = 0
  const title = book.title.toLowerCase()
  const author = book.author.toLowerCase()
  const category = book.category.toLowerCase()
  const description = (book.description || '').toLowerCase()

  if (title.includes(query)) score += 10
  if (title.startsWith(query)) score += 5
  if (author.includes(query)) score += 8
  if (category.includes(query)) score += 5
  if (description.includes(query)) score += 3
  return score
}

function scoreAuthor(query, author) {
  let score = 0
  const name = author.name.toLowerCase()
  const genres = (author.genres || []).join(' ').toLowerCase()
  const bio = (author.bio || '').toLowerCase()
  if (name.includes(query)) score += 12
  if (name.startsWith(query)) score += 4
  if (genres.includes(query)) score += 5
  if (bio.includes(query)) score += 2
  return score
}

export function filterBooks(books, filters) {
  return books.filter((book) => {
    if (filters.availability && filters.availability !== 'all') {
      if (book.availability !== filters.availability) return false
    }

    if (filters.categories?.length && !filters.categories.includes(book.category)) {
      return false
    }

    if (filters.author && filters.author !== 'all' && book.author !== filters.author) {
      return false
    }

    if (filters.era && filters.era !== 'all') {
      const year = book.year
      if (filters.era === 'Tradition orale' && year > 1900) return false
      if (filters.era === 'Époque coloniale (1900-1960)' && (year < 1900 || year > 1960)) return false
      if (filters.era === 'Post-indépendance (1960-1990)' && (year < 1960 || year > 1990)) return false
      if (filters.era === 'Période contemporaine (1990-présent)' && year < 1990) return false
    }

    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (!book.title.toLowerCase().includes(q) && !book.author.toLowerCase().includes(q)) {
        return false
      }
    }

    if (filters.collectionId && !(book.collections || []).includes(filters.collectionId)) {
      return false
    }

    return true
  })
}
