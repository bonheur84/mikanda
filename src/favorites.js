const FAVORITES_KEY = 'mikanda-favorites'

function getFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

function isFavorite(bookId) {
  const favorites = getFavorites()
  return favorites.some(fav => fav.id === bookId)
}

function toggleFavorite(bookData) {
  const favorites = getFavorites()
  const existingIndex = favorites.findIndex(fav => fav.id === bookData.id)
  
  if (existingIndex !== -1) {
    favorites.splice(existingIndex, 1)
  } else {
    favorites.push(bookData)
  }
  
  saveFavorites(favorites)
  return existingIndex === -1
}

function updateFavoriteButton(button, isFav) {
  const icon = button.querySelector('i')
  
  if (isFav) {
    icon.classList.add('text-red-500', 'fill-red-500')
    icon.classList.remove('text-[#5C5245]')
    button.setAttribute('aria-label', 'Retirer des favoris')
  } else {
    icon.classList.remove('text-red-500', 'fill-red-500')
    icon.classList.add('text-[#5C5245]')
    button.setAttribute('aria-label', 'Ajouter aux favoris')
  }
}

function updateFavoritesCount() {
  const favorites = getFavorites()
  const countElements = document.querySelectorAll('.favorites-count')
  
  countElements.forEach(element => {
    element.textContent = favorites.length
  })
}

function setupFavoriteButtons() {
  const books = [
    {
      id: 'book-1',
      title: 'La Vie et demie',
      author: 'Sony Labou Tansi',
      image: 'assets/images/livre (1).jfif',
      category: 'Roman',
      year: 1979,
      rating: 4.7,
      reviews: 204,
      readingTime: '~3h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-2',
      title: 'Le Pleurer-rire',
      author: 'Henri Lopes',
      image: 'assets/images/livre (5).jfif',
      category: 'Roman',
      year: 1979,
      rating: 4.6,
      reviews: 176,
      readingTime: '~2h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-3',
      title: 'Tram 83',
      author: 'Fiston Mwanza Mujila',
      image: 'assets/images/livre (7).jfif',
      category: 'Roman',
      year: 2014,
      rating: 4.8,
      reviews: 289,
      readingTime: '~4h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-4',
      title: 'Le Sang des lions',
      author: 'In Koli Jean Bofane',
      image: 'assets/images/livre (8).jfif',
      category: 'Roman',
      year: 2013,
      rating: 4.5,
      reviews: 156,
      readingTime: '~3h de lecture',
      status: 'Premium',
      link: 'vu_libre.html'
    },
    {
      id: 'book-5',
      title: 'La Chambre des maries',
      author: 'Henri Lopes',
      image: 'assets/images/livre (9).jfif',
      category: 'Nouvelle',
      year: 1999,
      rating: 4.4,
      reviews: 98,
      readingTime: '~1h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-6',
      title: 'Anthologie de la poésie congolaise',
      author: 'Clémentine Faïk-Nzuji',
      image: 'assets/images/livre (12).jfif',
      category: 'Poésie',
      year: 2005,
      rating: 4.6,
      reviews: 145,
      readingTime: '~2h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-7',
      title: 'L\'Invention du parallèle',
      author: 'V. Y. Mudimbe',
      image: 'assets/images/livre (13).jfif',
      category: 'Essai',
      year: 1973,
      rating: 4.7,
      reviews: 201,
      readingTime: '~4h de lecture',
      status: 'Premium',
      link: 'vu_libre.html'
    },
    {
      id: 'book-8',
      title: 'Mémoires de la terre',
      author: 'Kama Sywor Kamanda',
      image: 'assets/images/livre (14).jfif',
      category: 'Conte',
      year: 2001,
      rating: 4.5,
      reviews: 112,
      readingTime: '~2h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-9',
      title: 'Le Prince de l\'antique',
      author: 'Alain Mabanckou',
      image: 'assets/images/livre (15).jfif',
      category: 'Roman',
      year: 2002,
      rating: 4.8,
      reviews: 342,
      readingTime: '~3h de lecture',
      status: 'Premium',
      link: 'vu_libre.html'
    },
    {
      id: 'book-10',
      title: 'L\'Homme qui pleure',
      author: 'Emmanuel Dongala',
      image: 'assets/images/livre (16).jfif',
      category: 'Roman',
      year: 1998,
      rating: 4.4,
      reviews: 167,
      readingTime: '~3h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-11',
      title: 'La Nuit des griots',
      author: 'Marie-Léontine Tsibinda',
      image: 'assets/images/livre (17).jfif',
      category: 'Poésie',
      year: 1995,
      rating: 4.6,
      reviews: 134,
      readingTime: '~2h de lecture',
      status: 'Gratuit',
      link: 'vu_libre.html'
    },
    {
      id: 'book-12',
      title: 'Le Feu sacré',
      author: 'Tchicaya U Tam\'si',
      image: 'assets/images/livre (3).jfif',
      category: 'Poésie',
      year: 1964,
      rating: 4.3,
      reviews: 89,
      readingTime: '~2h de lecture',
      status: 'Premium',
      link: 'vu_libre.html'
    }
  ]
  
  books.forEach(book => {
    const button = document.getElementById(`fav-${book.id}`)
    if (!button) return
    
    const isFav = isFavorite(book.id)
    updateFavoriteButton(button, isFav)
    
    button.addEventListener('click', () => {
      const isNowFavorite = toggleFavorite(book)
      updateFavoriteButton(button, isNowFavorite)
      
      if (isNowFavorite) {
        button.classList.add('scale-110')
        setTimeout(() => {
          button.classList.remove('scale-110')
        }, 150)
      }
      
      updateFavoritesCount()
    })
  })
}

function renderFavorites() {
  const favorites = getFavorites()
  const grid = document.getElementById('favorites-grid')
  
  if (!grid) return
  
  if (favorites.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-[#f2ede3] flex items-center justify-center mb-4">
          <i data-lucide="heart" class="w-8 h-8 text-[#c17248]"></i>
        </div>
        <h2 class="font-serif text-2xl text-[#281e19] mb-2">Aucun livre dans vos favoris</h2>
        <p class="text-sm text-[#705f57] mb-6 max-w-md">
          Vous n'avez pas encore ajouté de livre à vos favoris.
          Explorez la bibliothèque et ajoutez les œuvres que vous souhaitez retrouver facilement.
        </p>
        <a href="biblio.html" class="border border-[#133a28] bg-[#133a28] px-6 py-2 text-sm text-white rounded-lg transition-colors hover:bg-[#245743] hover:shadow-lg">
          Explorer la bibliothèque
        </a>
      </div>
    `
    lucide.createIcons()
    return
  }
  
  grid.innerHTML = favorites.map(book => {
    const statusBadge = book.status === 'Gratuit'
      ? '<span class="bg-[#1B4332]/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs shadow-xs font-mono">Gratuit</span>'
      : '<span class="bg-[#2D2319]/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 shadow-xs font-mono"><i data-lucide="lock" class="w-2.5 h-2.5"></i>Premium</span>'

    const ratingStr = String(book.rating)
    const reviewsStr = String(book.reviews)
    const yearStr = String(book.year)

    return `
      <div class="border border-[#E5DDCB] rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full" data-book-id="${book.id}">
        <div class="relative aspect-3/4 bg-[#EFE9DC] overflow-hidden cursor-pointer">
          <img alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${book.image}">
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${statusBadge}
          </div>
          <button id="fav-${book.id}" class="favorite-button absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm z-10 bg-white/80 text-red-500 fill-red-500 hover:bg-white hover:text-rose-500" aria-label="Retirer des favoris">
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
              <span>${yearStr}</span>
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
              <span>${ratingStr}</span>
              <span class="text-[#9C8F7E] font-normal">(${reviewsStr})</span>
            </div>
            <a href="${book.link}" class="text-xs font-semibold text-[#8E461F] flex items-center justify-between hover:text-[#133a28] transition-colors">Détails →</a>
          </div>
        </div>
      </div>
    `
  }).join('')
  
  lucide.createIcons()
  setupFavoriteButtons()
  updateFavoritesCount()
}

function initFavorites() {
  updateFavoritesCount()
  setupFavoriteButtons()
  
  if (window.location.pathname.includes('favori_livre.html')) {
    renderFavorites()
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFavorites)
} else {
  initFavorites()
}

window.addEventListener('storage', (e) => {
  if (e.key === FAVORITES_KEY) {
    updateFavoritesCount()
    if (window.location.pathname.includes('favori_livre.html')) {
      renderFavorites()
    }
  }
})
