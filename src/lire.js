import { notification } from './components/notifications.js'

const PROGRESS_KEY = 'mikanda-reading-progress'
const THEME_KEY = 'mikanda-reading-theme'
const FONT_SIZE_KEY = 'mikanda-reading-font-size'
const WIDTH_KEY = 'mikanda-reading-width'
const SPACING_KEY = 'mikanda-reading-spacing'
const IMMERSIVE_KEY = 'mikanda-reading-immersive'
const BOOKMARKS_KEY = 'mikanda-bookmarks'
const HIGHLIGHTS_KEY = 'mikanda-highlights'
const NOTES_KEY = 'mikanda-notes'

const bookId = 'book-1'
let currentSection = 'cover-page'

function getBookmarks() {
  try {
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}')
    return bookmarks[bookId] || []
  } catch {
    return []
  }
}

function saveBookmarks(bookmarks) {
  try {
    const allBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}')
    allBookmarks[bookId] = bookmarks
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(allBookmarks))
  } catch {
    console.error('Impossible de sauvegarder les signets')
  }
}

function toggleBookmark() {
  const bookmarks = getBookmarks()
  const scrollPosition = window.scrollY
  const section = currentSection
  
  const existingIndex = bookmarks.findIndex(b => b.section === section && b.position === scrollPosition)
  
  if (existingIndex !== -1) {
    bookmarks.splice(existingIndex, 1)
    notification.info('Signet supprimé')
  } else {
    bookmarks.push({
      section: section,
      position: scrollPosition,
      timestamp: Date.now()
    })
    notification.info('Signet ajouté')
  }
  
  saveBookmarks(bookmarks)
}

function highlightText() {
  const selection = window.getSelection()
  if (selection.toString().trim() === '') {
    notification.warning('Sélectionnez du texte à surligner')
    return
  }
  
  const range = selection.getRangeAt(0)
  const span = document.createElement('span')
  span.className = 'bg-yellow-200'
  span.style.padding = '2px 4px'
  span.style.borderRadius = '2px'
  
  try {
    range.surroundContents(span)
    selection.removeAllRanges()
    notification.info('Texte surligné')
  } catch {
    notification.error('Impossible de surligner ce texte')
  }
}

function addNote() {
  const selection = window.getSelection()
  if (selection.toString().trim() === '') {
    notification.warning('Sélectionnez du texte pour ajouter une note')
    return
  }
  
  const noteText = prompt('Entrez votre note :')
  if (!noteText || noteText.trim() === '') {
    return
  }
  
  const range = selection.getRangeAt(0)
  const span = document.createElement('span')
  span.className = 'border-b-2 border-blue-400 cursor-pointer'
  span.dataset.note = noteText
  span.addEventListener('click', () => {
    alert(noteText)
  })
  
  try {
    range.surroundContents(span)
    selection.removeAllRanges()
    notification.info('Note ajoutée')
  } catch {
    notification.error('Impossible d\'ajouter la note')
  }
}

function translateText() {
  const selection = window.getSelection()
  if (selection.toString().trim() === '') {
    notification.warning('Sélectionnez du texte à traduire')
    return
  }
  
  const text = selection.toString()
  notification.info('Traduction non disponible (nécessite une API)')
}

function toggleReadingMode() {
  notification.info('Mode lecture activé')
}

function toggleAudio() {
  notification.info('Mode audio non disponible (nécessite une API)')
}

let isDoublePage = false

function toggleDoublePage() {
  isDoublePage = !isDoublePage
  const main = document.querySelector('main')
  const article = document.querySelector('article')
  
  if (isDoublePage) {
    main.classList.remove('max-w-4xl')
    main.classList.add('max-w-6xl')
    article.classList.add('grid', 'grid-cols-2', 'gap-8')
    notification.info('Mode double page activé')
  } else {
    main.classList.add('max-w-4xl')
    main.classList.remove('max-w-6xl')
    article.classList.remove('grid', 'grid-cols-2', 'gap-8')
    notification.info('Mode simple page activé')
  }
}

function toggleFocusMode() {
  const aside = document.querySelectorAll('aside')
  const footer = document.querySelector('footer')
  
  aside.forEach(a => a.classList.toggle('hidden'))
  footer.classList.toggle('hidden')
  
  notification.info('Mode concentration activé')
}

function showSection(sectionId) {
  const sections = ['cover-page', 'introduction', 'chapter-content', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'poetry-section', 'code-section', 'table-section']
  
  sections.forEach(id => {
    const section = document.getElementById(id)
    if (section) {
      section.classList.add('hidden')
    }
  })
  
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.remove('hidden')
    currentSection = sectionId
  }
}

function getReadingProgress() {
  try {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    return progress[bookId] || 0
  } catch {
    return 0
  }
}

function saveReadingProgress(percent) {
  try {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    progress[bookId] = percent
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    console.error('Impossible de sauvegarder la progression')
  }
}

function updateProgress() {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  const percent = Math.min(100, Math.round((scrollTop / scrollHeight) * 100))
  
  const progressBar = document.querySelector('#progress-bar-fill')
  const progressText = document.querySelector('#progress-text')
  
  if (progressBar) {
    progressBar.style.width = `${percent}%`
  }
  
  if (progressText) {
    progressText.textContent = `${percent} %`
  }
  
  saveReadingProgress(percent)
  
  if (percent === 100 && currentSection === 'chapter-5') {
    showCompletionScreen()
  }
}

function showCompletionScreen() {
  const completionScreen = document.getElementById('completion-screen')
  if (completionScreen) return
  
  const theme = getTheme()
  const bgColors = {
    light: 'bg-[#f4ecdc]',
    dark: 'bg-[#1a1a1a]',
    sepia: 'bg-[#f4e4d4]'
  }
  
  const screen = document.createElement('div')
  screen.id = 'completion-screen'
  screen.className = `fixed inset-0 z-50 flex items-center justify-center ${bgColors[theme]} opacity-0 transition-opacity duration-500`
  
  screen.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl p-12 max-w-lg mx-4 text-center transform scale-95 transition-transform duration-500">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f2ede3] flex items-center justify-center">
        <i data-lucide="book-open" class="w-10 h-10 text-[#c17248]"></i>
      </div>
      <h2 class="font-serif text-3xl text-[#281e19] mb-4">Vous avez terminé ce livre 🎉</h2>
      <p class="text-sm text-[#705f57] mb-8">Merci d'avoir lu sur MIKANDA.</p>
      <div class="flex flex-col gap-3">
        <a href="biblio.html" class="inline-flex items-center justify-center gap-2 bg-[#133a28] px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-[#245743] transition-colors">
          <i data-lucide="library" class="w-4 h-4"></i>
          Retour à la bibliothèque
        </a>
        <a href="favori_livre.html" class="inline-flex items-center justify-center gap-2 border border-[#ded3c1] px-6 py-3 text-sm font-semibold text-[#8f8171] rounded-lg hover:border-[#315d4b] hover:text-[#315d4b] transition-colors">
          <i data-lucide="heart" class="w-4 h-4"></i>
          Voir mes favoris
        </a>
      </div>
    </div>
  `
  
  document.body.appendChild(screen)
  window.lucide.createIcons()
  
  requestAnimationFrame(() => {
    screen.classList.remove('opacity-0')
    screen.querySelector('div').classList.remove('scale-95')
  })
}

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light'
  } catch {
    return 'light'
  }
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

function applyTheme(theme) {
  const body = document.body
  const content = document.querySelector('article')
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  
  const themes = {
    light: {
      bodyBg: 'bg-[#f4ecdc]',
      bodyText: 'text-[#332c28]',
      contentBg: 'bg-white',
      headerBg: 'bg-[#f7f1e6]/95',
      footerBg: 'bg-[#f7f1e6]/95',
      asideBg: 'bg-[#f4ecdc]'
    },
    dark: {
      bodyBg: 'bg-[#1a1a1a]',
      bodyText: 'text-[#e5e5e5]',
      contentBg: 'bg-[#2a2a2a]',
      headerBg: 'bg-[#1a1a1a]/95',
      footerBg: 'bg-[#1a1a1a]/95',
      asideBg: 'bg-[#1a1a1a]'
    },
    sepia: {
      bodyBg: 'bg-[#f4e4d4]',
      bodyText: 'text-[#5c4a3d]',
      contentBg: 'bg-[#f9f1e8]',
      headerBg: 'bg-[#f4e4d4]/95',
      footerBg: 'bg-[#f4e4d4]/95',
      asideBg: 'bg-[#f4e4d4]'
    }
  }
  
  const t = themes[theme]
  
  body.className = body.className.replace(/bg-\[[^\]]+\]/g, t.bodyBg).replace(/text-\[[^\]]+\]/g, t.bodyText)
  
  if (content) {
    content.className = content.className.replace(/bg-\[[^\]]+\]/g, t.contentBg)
  }
  
  if (header) {
    header.className = header.className.replace(/bg-\[[^\]]+\]/g, t.headerBg)
  }
  
  if (footer) {
    footer.className = footer.className.replace(/bg-\[[^\]]+\]/g, t.footerBg)
  }
  
  document.querySelectorAll('aside').forEach(aside => {
    aside.className = aside.className.replace(/bg-\[[^\]]+\]/g, t.asideBg)
  })
  
  const darkModeButton = document.getElementById('dark-mode-button')
  if (darkModeButton) {
    const icon = darkModeButton.querySelector('i')
    if (icon) {
      if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun')
      } else {
        icon.setAttribute('data-lucide', 'moon')
      }
      window.lucide.createIcons()
    }
  }
}

function toggleTheme() {
  const currentTheme = getTheme()
  const themes = ['light', 'dark', 'sepia']
  const currentIndex = themes.indexOf(currentTheme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  
  applyTheme(nextTheme)
  saveTheme(nextTheme)
  notification.info(`Thème ${nextTheme === 'light' ? 'clair' : nextTheme === 'dark' ? 'sombre' : 'sépia'} activé`)
}

function getFontSize() {
  try {
    return parseInt(localStorage.getItem(FONT_SIZE_KEY) || 18)
  } catch {
    return 18
  }
}

function saveFontSize(size) {
  localStorage.setItem(FONT_SIZE_KEY, size.toString())
}

function applyFontSize(size) {
  const content = document.querySelector('#reading-content')
  if (!content) return
  
  const clampedSize = Math.max(14, Math.min(24, size))
  content.style.fontSize = `${clampedSize}px`
  
  const fontSizeDisplay = document.getElementById('font-size-display')
  if (fontSizeDisplay) {
    fontSizeDisplay.textContent = clampedSize
  }
}

function increaseFontSize() {
  const current = getFontSize()
  const next = Math.min(24, current + 2)
  applyFontSize(next)
  saveFontSize(next)
}

function decreaseFontSize() {
  const current = getFontSize()
  const next = Math.max(14, current - 2)
  applyFontSize(next)
  saveFontSize(next)
}

function getWidth() {
  try {
    return localStorage.getItem(WIDTH_KEY) || 'normal'
  } catch {
    return 'normal'
  }
}

function saveWidth(width) {
  localStorage.setItem(WIDTH_KEY, width)
}

function applyWidth(width) {
  const content = document.querySelector('article')
  if (!content) return
  
  const widths = {
    narrow: 'max-w-2xl',
    normal: 'max-w-4xl',
    wide: 'max-w-5xl'
  }
  
  content.className = content.className.replace(/max-w-\[?[^\]]+\]?/g, widths[width])
}

function toggleWidth() {
  const current = getWidth()
  const widths = ['narrow', 'normal', 'wide']
  const currentIndex = widths.indexOf(current)
  const nextWidth = widths[(currentIndex + 1) % widths.length]
  
  applyWidth(nextWidth)
  saveWidth(nextWidth)
  
  const labels = { narrow: 'Étroit', normal: 'Normal', wide: 'Large' }
  notification.info(`Largeur : ${labels[nextWidth]}`)
}

function getSpacing() {
  try {
    return localStorage.getItem(SPACING_KEY) || 'normal'
  } catch {
    return 'normal'
  }
}

function saveSpacing(spacing) {
  localStorage.setItem(SPACING_KEY, spacing)
}

function applySpacing(spacing) {
  const content = document.querySelector('#reading-content')
  if (!content) return
  
  const spacings = {
    compact: 'leading-tight',
    normal: 'leading-[1.9]',
    comfortable: 'leading-loose'
  }
  
  content.className = content.className.replace(/leading-\[[^\]]+\]/g, spacings[spacing])
}

function toggleSpacing() {
  const current = getSpacing()
  const spacings = ['compact', 'normal', 'comfortable']
  const currentIndex = spacings.indexOf(current)
  const nextSpacing = spacings[(currentIndex + 1) % spacings.length]
  
  applySpacing(nextSpacing)
  saveSpacing(nextSpacing)
  
  const labels = { compact: 'Compact', normal: 'Normal', comfortable: 'Confortable' }
  notification.info(`Espacement : ${labels[nextSpacing]}`)
}

function isImmersive() {
  try {
    return localStorage.getItem(IMMERSIVE_KEY) === 'true'
  } catch {
    return false
  }
}

function setImmersive(enabled) {
  localStorage.setItem(IMMERSIVE_KEY, enabled.toString())
}

function toggleImmersive() {
  const current = isImmersive()
  const newState = !current
  
  setImmersive(newState)
  applyImmersive(newState)
  
  notification.info(newState ? 'Mode immersif activé' : 'Mode normal activé')
}

function applyImmersive(enabled) {
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  const aside = document.querySelector('aside')
  const main = document.querySelector('main')
  const article = document.querySelector('article')
  
  let exitButton = document.getElementById('exit-immersive')
  
  if (enabled) {
    header.classList.add('opacity-0', 'pointer-events-none')
    footer.classList.add('opacity-0', 'pointer-events-none')
    aside.classList.add('hidden')
    main.classList.remove('max-w-4xl', 'px-12')
    main.classList.add('max-w-3xl', 'mx-auto', 'px-6', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'py-12')
    article.classList.remove('rounded-xl', 'shadow-sm', 'p-12')
    article.classList.add('w-full', 'bg-white', 'p-16')
    document.body.className = document.body.className.replace(/bg-\[[^\]]+\]/g, 'bg-white')
    
    if (!exitButton) {
      exitButton = document.createElement('button')
      exitButton.id = 'exit-immersive'
      exitButton.className = 'fixed top-4 right-4 z-50 flex items-center justify-center w-12 h-12 bg-[#1a1a1a] text-white rounded-full shadow-lg hover:bg-[#333] transition-colors'
      exitButton.setAttribute('aria-label', 'Quitter le mode immersif')
      exitButton.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>'
      exitButton.addEventListener('click', toggleImmersive)
      document.body.appendChild(exitButton)
      window.lucide.createIcons()
    }
  } else {
    header.classList.remove('opacity-0', 'pointer-events-none')
    footer.classList.remove('opacity-0', 'pointer-events-none')
    aside.classList.remove('hidden')
    main.classList.add('max-w-4xl', 'px-12')
    main.classList.remove('max-w-3xl', 'mx-auto', 'px-6', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'py-12')
    article.classList.add('rounded-xl', 'shadow-sm', 'p-12')
    article.classList.remove('w-full', 'bg-white', 'p-16')
    
    applyTheme(getTheme())
    
    if (exitButton) {
      exitButton.remove()
    }
  }
}

function showSettingsPanel() {
  const panel = document.getElementById('settings-panel')
  if (!panel) return
  
  panel.classList.toggle('hidden')
}

function hideSettingsPanel() {
  const panel = document.getElementById('settings-panel')
  if (panel) {
    panel.classList.add('hidden')
  }
}

function handleKeyboardShortcuts(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  
  if (e.key === 'Escape') {
    if (isImmersive()) {
      toggleImmersive()
    }
    hideSettingsPanel()
  }
  
  if (e.key === '+' || e.key === '=') {
    increaseFontSize()
  }
  
  if (e.key === '-' || e.key === '_') {
    decreaseFontSize()
  }
}

function setupChapterNavigation() {
  const tocButtons = document.querySelectorAll('.toc-btn')
  const prevButton = document.getElementById('prev-chapter')
  const nextButton = document.getElementById('next-chapter')
  
  tocButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      tocButtons.forEach(b => b.classList.remove('bg-[#315d4b]', 'text-white'))
      button.classList.add('bg-[#315d4b]', 'text-white')
      
      const section = button.getAttribute('data-section')
      showSection(section)
      
      window.scrollTo(0, 0)
    })
  })
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const currentButton = document.querySelector('.toc-btn.bg-\\[\\#315d4b\\]')
      if (currentButton) {
        const currentIdx = Array.from(tocButtons).indexOf(currentButton)
        if (currentIdx > 0) {
          tocButtons[currentIdx - 1].click()
        }
      }
    })
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentButton = document.querySelector('.toc-btn.bg-\\[\\#315d4b\\]')
      if (currentButton) {
        const currentIdx = Array.from(tocButtons).indexOf(currentButton)
        if (currentIdx < tocButtons.length - 1) {
          tocButtons[currentIdx + 1].click()
        }
      }
    })
  }
}

function initReading() {
  const savedProgress = getReadingProgress()
  
  if (savedProgress > 0 && savedProgress < 100) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const targetScroll = (savedProgress / 100) * scrollHeight
    window.scrollTo(0, targetScroll)
  }
  
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress)
  })
  
  const backButton = document.getElementById('back-button')
  if (backButton) {
    backButton.addEventListener('click', () => {
      history.back()
    })
  }
  
  const searchButton = document.getElementById('search-button')
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchPanel = document.getElementById('search-panel')
      if (searchPanel) {
        searchPanel.classList.toggle('hidden')
        if (!searchPanel.classList.contains('hidden')) {
          searchPanel.querySelector('input').focus()
        }
      }
    })
  }
  
  const settingsButton = document.getElementById('settings-button')
  if (settingsButton) {
    settingsButton.addEventListener('click', showSettingsPanel)
  }
  
  const closeButton = document.getElementById('settings-close-button')
  if (closeButton) {
    closeButton.addEventListener('click', hideSettingsPanel)
  }
  
  const immersiveButton = document.getElementById('immersive-button')
  if (immersiveButton) {
    immersiveButton.addEventListener('click', toggleImmersive)
  }
  
  const darkModeButton = document.getElementById('dark-mode-button')
  if (darkModeButton) {
    darkModeButton.addEventListener('click', toggleTheme)
  }
  
  const increaseFontButton = document.getElementById('increase-font')
  if (increaseFontButton) {
    increaseFontButton.addEventListener('click', increaseFontSize)
  }
  
  const decreaseFontButton = document.getElementById('decrease-font')
  if (decreaseFontButton) {
    decreaseFontButton.addEventListener('click', decreaseFontSize)
  }
  
  const bookmarkButton = document.querySelector('[aria-label="Ajouter un signet"]')
  if (bookmarkButton) {
    bookmarkButton.addEventListener('click', toggleBookmark)
  }
  
  const highlightButton = document.querySelector('[aria-label="Surligner"]')
  if (highlightButton) {
    highlightButton.addEventListener('click', highlightText)
  }
  
  const noteButton = document.querySelector('[aria-label="Ajouter une note"]')
  if (noteButton) {
    noteButton.addEventListener('click', addNote)
  }
  
  const translateButton = document.querySelector('[aria-label="Traduire"]')
  if (translateButton) {
    translateButton.addEventListener('click', translateText)
  }
  
  const readingModeButton = document.querySelector('[aria-label="Mode lecture"]')
  if (readingModeButton) {
    readingModeButton.addEventListener('click', toggleReadingMode)
  }
  
  const audioButton = document.querySelector('[aria-label="Mode audio"]')
  if (audioButton) {
    audioButton.addEventListener('click', toggleAudio)
  }
  
  const doublePageButton = document.querySelector('[aria-label="Double page"]')
  if (doublePageButton) {
    doublePageButton.addEventListener('click', toggleDoublePage)
  }
  
  const focusModeButton = document.querySelector('[aria-label="Mode concentration"]')
  if (focusModeButton) {
    focusModeButton.addEventListener('click', toggleFocusMode)
  }
  
  const tableOfContentsButton = document.querySelector('[aria-label="Table des matières"]')
  if (tableOfContentsButton) {
    tableOfContentsButton.addEventListener('click', () => {
      const toc = document.getElementById('toc')
      if (toc) {
        toc.classList.toggle('hidden')
      }
    })
  }
  
  document.addEventListener('keydown', handleKeyboardShortcuts)
  
  applyTheme(getTheme())
  applyFontSize(getFontSize())
  applyWidth(getWidth())
  applySpacing(getSpacing())
  
  if (isImmersive()) {
    applyImmersive(true)
  }
  
  showSection('cover-page')
  
  setupChapterNavigation()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReading)
} else {
  initReading()
}
