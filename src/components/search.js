export function setupSearch() {
  const searchInput = document.querySelector('input[type="search"], input[placeholder*="rechercher"], input[placeholder*="Rechercher"]')
  
  if (!searchInput) {
    console.log('Pas de champ de recherche trouvé')
    return
  }
  
  const resultsContainer = createSearchResultsContainer()
  searchInput.parentElement?.appendChild(resultsContainer)
  
  const books = [
    {
      id: 1,
      title: "Mbote Kinshasa",
      author: "Sony Labou Tansi",
      genre: "Roman",
      year: 1979,
      description: "Un roman vibrant sur la vie urbaine à Kinshasa"
    },
    {
      id: 2,
      title: "Le royaume Kongo du XVI au XVIII siecle",
      author: "Yambo Ouologuem",
      genre: "Roman",
      year: 1968,
      description: "Épopée historique sur l'empire Kongo"
    },
    {
      id: 3,
      title: "Chaos in Kinshasa",
      author: "V. Y. Mudimbe",
      genre: "Essai",
      year: 1979,
      description: "Analyse philosophique de la société congolaise"
    },
    {
      id: 4,
      title: "Chroniques congolaises",
      author: "Fiston Mwanza Mujila",
      genre: "Roman",
      year: 2021,
      description: "Récits contemporains du Congo"
    }
  ]
  
  let searchTimeout
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value
    
    clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(() => {
      performSearch(query, books, resultsContainer)
    }, 300)
  })
  
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add('hidden')
    }
  })
}

function createSearchResultsContainer() {
  const container = document.createElement('div')
  container.id = 'search-results'
  container.className = 'hidden absolute top-full left-0 right-0 mt-2 bg-white border border-[#d9d1c6] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto'
  return container
}

function performSearch(query, books, container) {
  container.innerHTML = ''
  
  if (query.length < 2) {
    container.classList.add('hidden')
    return
  }
  
  const results = searchBooks(query, books)
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center text-[#705f57]">
        <p>Aucun résultat trouvé pour "${query}"</p>
      </div>
    `
  } else {
    results.forEach((result, index) => {
      const resultElement = createSearchResultElement(result.book, result.relevance, index)
      container.appendChild(resultElement)
    })
  }
  
  container.classList.remove('hidden')
}

function searchBooks(query, books) {
  const normalizedQuery = query.toLowerCase()
  
  return books
    .map(book => ({
      book,
      relevance: calculateRelevance(normalizedQuery, book)
    }))
    .filter(result => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
}

function calculateRelevance(query, book) {
  let score = 0
  
  if (book.title.toLowerCase().includes(query)) {
    score += 10
  }
  
  if (book.author.toLowerCase().includes(query)) {
    score += 8
  }
  
  if (book.genre.toLowerCase().includes(query)) {
    score += 5
  }
  
  if (book.description.toLowerCase().includes(query)) {
    score += 3
  }
  
  if (book.title.toLowerCase().startsWith(query)) {
    score += 5
  }
  
  return score
}

function createSearchResultElement(book, relevance, index) {
  const element = document.createElement('a')
  element.href = 'vu_libre.html'
  element.className = 'block p-4 hover:bg-[#eae0d1] transition-colors border-b border-[#d9d1c6] last:border-b-0 animate-fade-in-up'
  element.style.animationDelay = `${index * 50}ms`
  
  element.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <h4 class="font-serif text-lg text-[#281e19]">${highlightMatch(book.title)}</h4>
        <p class="text-sm text-[#705f57]">${book.author}</p>
        <p class="text-xs text-[#c17248] mt-1">${book.genre} · ${book.year}</p>
      </div>
      <div class="text-xs text-[#705f57]">
        <span class="bg-[#eae0d1] px-2 py-1 rounded">${Math.round(relevance)}%</span>
      </div>
    </div>
  `
  
  return element
}

function highlightMatch(text) {
  return text
}
