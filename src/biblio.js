const authors = [
  'Sony Labou Tansi',
  'V. Y. Mudimbe',
  'Fiston Mwanza Mujila',
  'Clémentine Faïk-Nzuji',
  'In Koli Jean Bofane',
  'Henri Lopes',
  'Alain Mabanckou',
  'Emmanuel Dongala',
  'Tchicaya U Tam\'si',
  'Marie-Léontine Tsibinda',
  'Kama Sywor Kamanda',
  'Pius Ngandu Nkashama',
  'Mukala Kadima-Nzuji'
]

const books = [
  {
    id: 1,
    title: 'La Vie et demie',
    author: 'Sony Labou Tansi',
    category: 'Roman',
    year: 1979,
    availability: 'free',
    rating: 4.7,
    reviews: 204,
    readingTime: '~3h de lecture',
    image: 'assets/images/livre (1).jfif'
  },
  {
    id: 2,
    title: 'Le Pleurer-rire',
    author: 'Henri Lopes',
    category: 'Roman',
    year: 1979,
    availability: 'free',
    rating: 4.6,
    reviews: 176,
    readingTime: '~2h de lecture',
    image: 'assets/images/livre (5).jfif'
  },
  {
    id: 3,
    title: 'Tram 83',
    author: 'Fiston Mwanza Mujila',
    category: 'Roman',
    year: 2014,
    availability: 'free',
    rating: 4.8,
    reviews: 289,
    readingTime: '~4h de lecture',
    image: 'assets/images/livre (7).jfif'
  },
  {
    id: 4,
    title: 'Le Sang des lions',
    author: 'In Koli Jean Bofane',
    category: 'Roman',
    year: 2013,
    availability: 'premium',
    rating: 4.5,
    reviews: 156,
    readingTime: '~3h de lecture',
    image: 'assets/images/livre (8).jfif'
  },
  {
    id: 5,
    title: 'La Chambre des maries',
    author: 'Henri Lopes',
    category: 'Nouvelle',
    year: 1999,
    availability: 'free',
    rating: 4.4,
    reviews: 98,
    readingTime: '~1h de lecture',
    image: 'assets/images/livre (9).jfif'
  },
  {
    id: 6,
    title: 'Anthologie de la poésie congolaise',
    author: 'Clémentine Faïk-Nzuji',
    category: 'Poésie',
    year: 2005,
    availability: 'free',
    rating: 4.6,
    reviews: 145,
    readingTime: '~2h de lecture',
    image: 'assets/images/livre (12).jfif'
  },
  {
    id: 7,
    title: 'L\'Invention du parallèle',
    author: 'V. Y. Mudimbe',
    category: 'Essai',
    year: 1973,
    availability: 'premium',
    rating: 4.7,
    reviews: 201,
    readingTime: '~4h de lecture',
    image: 'assets/images/livre (13).jfif'
  },
  {
    id: 8,
    title: 'Mémoires de la terre',
    author: 'Kama Sywor Kamanda',
    category: 'Conte',
    year: 2001,
    availability: 'free',
    rating: 4.5,
    reviews: 112,
    readingTime: '~2h de lecture',
    image: 'assets/images/livre (14).jfif'
  },
  {
    id: 9,
    title: 'Le Prince de l\'antique',
    author: 'Alain Mabanckou',
    category: 'Roman',
    year: 2002,
    availability: 'premium',
    rating: 4.8,
    reviews: 342,
    readingTime: '~3h de lecture',
    image: 'assets/images/livre (15).jfif'
  },
  {
    id: 10,
    title: 'L\'Homme qui pleure',
    author: 'Emmanuel Dongala',
    category: 'Roman',
    year: 1998,
    availability: 'free',
    rating: 4.4,
    reviews: 167,
    readingTime: '~3h de lecture',
    image: 'assets/images/livre (16).jfif'
  },
  {
    id: 11,
    title: 'La Nuit des griots',
    author: 'Marie-Léontine Tsibinda',
    category: 'Poésie',
    year: 1995,
    availability: 'free',
    rating: 4.6,
    reviews: 134,
    readingTime: '~2h de lecture',
    image: 'assets/images/livre (17).jfif'
  },
  {
    id: 12,
    title: 'Le Feu sacré',
    author: 'Tchicaya U Tam\'si',
    category: 'Poésie',
    year: 1964,
    availability: 'premium',
    rating: 4.3,
    reviews: 89,
    readingTime: '~2h de lecture',
    image: 'assets/images/livre (3).jfif'
  }
]

let currentPage = 1
const itemsPerPage = 6
let filteredBooks = [...books]

let selectedAvailability = 'all'
let selectedCategories = []
let selectedAuthor = 'all'
let selectedEra = 'all'
let searchQuery = ''

function setupAvailabilityFilters() {
  const container = document.getElementById('availability-filters')
  if (!container) return
  
  const buttons = container.querySelectorAll('button')
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => {
        btn.classList.remove('bg-white', 'text-[#211E1B]', 'shadow-xs')
        btn.classList.add('text-[#6B5E4F]')
      })
      
      button.classList.add('bg-white', 'text-[#211E1B]', 'shadow-xs')
      button.classList.remove('text-[#6B5E4F]')
      
      const availability = button.dataset.availability
      selectedAvailability = availability
      applyFilters()
    })
  })
}

function setupCategoryFilters() {
  const container = document.getElementById('category-filters')
  if (!container) return
  
  const categoryButtons = container.querySelectorAll('button')
  
  categoryButtons.forEach(button => {
    const checkbox = button.querySelector('input[type="checkbox"]')
    const categoryLabel = button.dataset.category
    
    button.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked
      }
      
      if (checkbox.checked) {
        if (!selectedCategories.includes(categoryLabel)) {
          selectedCategories.push(categoryLabel)
        }
      } else {
        selectedCategories = selectedCategories.filter(cat => cat !== categoryLabel)
      }
      
      applyFilters()
    })
  })
}

function setupAuthorFilter() {
  const authorSelect = document.getElementById('author-filter')
  
  if (authorSelect) {
    authors.forEach(author => {
      const option = document.createElement('option')
      option.value = author
      option.textContent = author
      authorSelect.appendChild(option)
    })
    
    authorSelect.addEventListener('change', (e) => {
      selectedAuthor = e.target.value
      applyFilters()
    })
  }
}

function setupEraFilter() {
  const eraSelect = document.getElementById('era-filter')
  
  if (eraSelect) {
    eraSelect.addEventListener('change', (e) => {
      selectedEra = e.target.value
      applyFilters()
    })
  }
}

function setupSearchInput() {
  const searchInput = document.getElementById('search-input')
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase()
      applyFilters()
    })
  }
}

function applyFilters() {
  filteredBooks = books.filter(book => {
    if (selectedAvailability !== 'all') {
      if (selectedAvailability === 'free' && book.availability !== 'free') return false
      if (selectedAvailability === 'premium' && book.availability !== 'premium') return false
    }
    
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(book.category)) return false
    }
    
    if (selectedAuthor !== 'all') {
      if (book.author !== selectedAuthor) return false
    }
    
    if (selectedEra !== 'all') {
      const year = book.year
      if (selectedEra === 'Tradition orale' && year > 1900) return false
      if (selectedEra === 'Époque coloniale (1900-1960)' && (year < 1900 || year > 1960)) return false
      if (selectedEra === 'Post-indépendance (1960-1990)' && (year < 1960 || year > 1990)) return false
      if (selectedEra === 'Période contemporaine (1990-présent)' && year < 1990) return false
    }
    
    if (searchQuery) {
      if (!book.title.toLowerCase().includes(searchQuery)) return false
    }
    
    return true
  })
  
  currentPage = 1
  renderBooks()
  updatePagination()
}

function resetFilters() {
  selectedAvailability = 'all'
  selectedCategories = []
  selectedAuthor = 'all'
  selectedEra = 'all'
  searchQuery = ''
  
  const availabilityButtons = document.querySelectorAll('#availability-filters button')
  availabilityButtons.forEach(btn => {
    btn.classList.remove('bg-white', 'text-[#211E1B]', 'shadow-xs')
    btn.classList.add('text-[#6B5E4F]')
    if (btn.dataset.availability === 'all') {
      btn.classList.add('bg-white', 'text-[#211E1B]', 'shadow-xs')
      btn.classList.remove('text-[#6B5E4F]')
    }
  })
  
  const categoryCheckboxes = document.querySelectorAll('#category-filters input[type="checkbox"]')
  categoryCheckboxes.forEach(checkbox => {
    checkbox.checked = false
  })
  
  const authorSelect = document.getElementById('author-filter')
  if (authorSelect) {
    authorSelect.value = 'all'
  }
  
  const eraSelect = document.getElementById('era-filter')
  if (eraSelect) {
    eraSelect.value = 'all'
  }
  
  const searchInput = document.getElementById('search-input')
  if (searchInput) {
    searchInput.value = ''
  }
  
  applyFilters()
}

function renderBooks() {
  const grid = document.getElementById('books-grid')
  if (!grid) return
  
  const savedView = localStorage.getItem('bookView') || 'grid'
  const isListView = savedView === 'list'
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const booksToShow = filteredBooks.slice(startIndex, endIndex)
  
  grid.innerHTML = booksToShow.map(book => {
    const availabilityBadge = book.availability === 'free'
      ? '<span class="bg-[#1B4332]/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs shadow-xs font-mono">Gratuit</span>'
      : '<span class="bg-[#2D2319]/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 shadow-xs font-mono"><i data-lucide="lock" class="w-2.5 h-2.5"></i>Premium</span>'

    if (isListView) {
      return `
        <div class="border border-[#E5DDCB] rounded-xl overflow-hidden hover:shadow-lg transition-all group flex items-center gap-4 p-4">
          <div class="relative w-24 h-32 flex-shrink-0 bg-[#EFE9DC] overflow-hidden cursor-pointer rounded-lg">
            <img alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${book.image}">
            <div class="absolute top-1 left-1 flex flex-col gap-1 z-10">
              ${availabilityBadge}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="truncate font-serif text-lg text-[#281e19] group-hover:text-[#c17248] transition-colors">${book.title}</p>
            <p class="mt-1 truncate text-xs text-[#705f57]">${book.author}</p>
            <div class="mt-2 flex items-center gap-4 font-mono text-xs text-[#705f57]">
              <span class="font-medium">${book.category}</span>
              <span>${book.year}</span>
              <div class="flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i>
                <span>${book.readingTime}</span>
              </div>
            </div>
            <div class="mt-2 flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1 text-amber-700 font-semibold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i>
                <span>${book.rating}</span>
                <span class="text-[#9C8F7E] font-normal">(${book.reviews})</span>
              </div>
              <a href="vu_libre.html" class="text-xs font-semibold text-[#8E461F] hover:text-[#133a28] transition-colors">Détails →</a>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm bg-white/80 text-[#5C5245] hover:bg-white hover:text-rose-500 flex-shrink-0" aria-label="Ajouter aux favoris">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
        </div>
      `
    }

    return `
      <div class="border border-[#E5DDCB] rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
        <div class="relative aspect-3/4 bg-[#EFE9DC] overflow-hidden cursor-pointer">
          <img alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${book.image}">
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${availabilityBadge}
          </div>
          <button class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm z-10 bg-white/80 text-[#5C5245] hover:bg-white hover:text-rose-500" aria-label="Ajouter aux favoris">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <div class="absolute inset-0 bg-[#133a28]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="text-white font-medium text-sm">Voir détails</span>
          </div>
        </div>
        <div class="px-4 pb-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <p class="mt-3 truncate font-serif text-xl text-[#281e19] group-hover:text-[#c17248] transition-colors">${book.title}</p>
            <p class="mt-1 truncate text-xs text-[#705f57]">${book.author}</p>
            <div class="mt-2 flex items-center justify-between font-mono text-xs text-[#705f57]">
              <span class="font-medium">${book.category}</span>
              <span>${book.year}</span>
            </div>
            <div class="mt-2 flex items-center gap-2 text-xs text-[#8f7770]">
              <div class="flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i>
                <span>${book.readingTime}</span>
              </div>
              <div class="flex items-center gap-1">
                <i data-lucide="book-open" class="w-3 h-3"></i>
                <span>Format numérique</span>
              </div>
            </div>
          </div>
          <div class="pt-2.5 border-t border-[#8E461F]/50 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 text-amber-700 font-semibold">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i>
              <span>${book.rating}</span>
              <span class="text-[#9C8F7E] font-normal">(${book.reviews})</span>
            </div>
            <a href="vu_libre.html" class="text-xs font-semibold text-[#8E461F] flex items-center justify-between hover:text-[#133a28] transition-colors">Détails →</a>
          </div>
        </div>
      </div>
    `
  }).join('')

  lucide.createIcons()
  setupFavoriteButtons()
}

function updatePagination() {
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const pageLabel = document.getElementById('page-info')
  const prevButton = document.getElementById('prev-page')
  const nextButton = document.getElementById('next-page')
  const pageButtons = document.querySelectorAll('.page-num')
  
  if (pageLabel) {
    pageLabel.textContent = `Page ${currentPage} sur ${totalPages} (${filteredBooks.length} œuvres)`
  }
  
  if (prevButton) {
    prevButton.disabled = currentPage === 1
  }
  
  if (nextButton) {
    nextButton.disabled = currentPage === totalPages
  }
  
  pageButtons.forEach((btn, index) => {
    const pageNum = index + 1
    if (pageNum <= totalPages) {
      btn.textContent = pageNum
      btn.classList.remove('hidden')
      if (pageNum === currentPage) {
        btn.classList.add('bg-[#8E461F]', 'text-white', 'shadow-xs')
        btn.classList.remove('bg-white', 'border', 'border-[#DDD1BE]', 'text-[#2D2319]', 'hover:bg-[#FAF6EE]')
      } else {
        btn.classList.remove('bg-[#8E461F]', 'text-white', 'shadow-xs')
        btn.classList.add('bg-white', 'border', 'border-[#DDD1BE]', 'text-[#2D2319]', 'hover:bg-[#FAF6EE]')
      }
    } else {
      btn.classList.add('hidden')
    }
  })
}

function setupPagination() {
  const prevButton = document.getElementById('prev-page')
  const nextButton = document.getElementById('next-page')
  const pageButtons = document.querySelectorAll('.page-num')
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        renderBooks()
        updatePagination()
      }
    })
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
      if (currentPage < totalPages) {
        currentPage++
        renderBooks()
        updatePagination()
      }
    })
  }
  
  pageButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentPage = index + 1
      renderBooks()
      updatePagination()
    })
  })
}

function setupFavoriteButtons() {
  const heartButtons = document.querySelectorAll('button[aria-label="Ajouter aux favoris"]')
  
  heartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i')
      if (icon.classList.contains('text-rose-500')) {
        icon.classList.remove('text-rose-500', 'fill-rose-500')
        icon.classList.add('text-[#5C5245]')
      } else {
        icon.classList.add('text-rose-500', 'fill-rose-500')
        icon.classList.remove('text-[#5C5245]')
      }
    })
  })
}

function setupGridLayout() {
  const gridButton = document.getElementById('grid-view')
  const listButton = document.getElementById('list-view')
  const grid = document.getElementById('books-grid')
  
  if (!gridButton || !listButton || !grid) return
  
  function setGridView() {
    gridButton.classList.add('bg-[#2D2319]', 'text-white')
    gridButton.classList.remove('text-[#6B5E4F]')
    listButton.classList.remove('bg-[#2D2319]', 'text-white')
    listButton.classList.add('text-[#6B5E4F]')
    
    grid.classList.remove('grid-cols-1')
    grid.classList.add('sm:grid-cols-2', 'xl:grid-cols-3')
    
    localStorage.setItem('bookView', 'grid')
    renderBooks()
  }
  
  function setListView() {
    listButton.classList.add('bg-[#2D2319]', 'text-white')
    listButton.classList.remove('text-[#6B5E4F]')
    gridButton.classList.remove('bg-[#2D2319]', 'text-white')
    gridButton.classList.add('text-[#6B5E4F]')
    
    grid.classList.add('grid-cols-1')
    grid.classList.remove('sm:grid-cols-2', 'xl:grid-cols-3')
    
    localStorage.setItem('bookView', 'list')
    renderBooks()
  }
  
  gridButton.addEventListener('click', setGridView)
  listButton.addEventListener('click', setListView)
  
  const savedView = localStorage.getItem('bookView') || 'grid'
  if (savedView === 'list') {
    setListView()
  } else {
    setGridView()
  }
}

function initBiblio() {
  console.log('Initialisation biblio...')
  setTimeout(() => {
    console.log('Setup des filtres...')
    setupAvailabilityFilters()
    setupCategoryFilters()
    setupAuthorFilter()
    setupEraFilter()
    setupSearchInput()
    setupPagination()
    setupGridLayout()
    
    const resetButton = document.getElementById('reset-filters')
    if (resetButton) {
      resetButton.addEventListener('click', resetFilters)
    }
    
    console.log('Render des livres...')
    renderBooks()
    updatePagination()
    console.log('Initialisation terminée')
  }, 100)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBiblio)
} else {
  initBiblio()
}
