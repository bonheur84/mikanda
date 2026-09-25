import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Library, X } from 'lucide-react'
import { getBookById } from '../data/books.js'
import { readerSections } from '../data/reader.js'
import { STORAGE_KEYS, readString, writeString } from '../services/storage.js'
import {
  getBookmarks,
  getReadingProgress,
  saveBookmarks,
  saveHighlights,
  saveNotes,
  saveReadingProgress,
  getHighlights,
  getNotes,
} from '../services/reading.js'
import { ReaderToolbar } from '../components/reader/ReaderToolbar.jsx'
import { ReaderSettings } from '../components/reader/ReaderSettings.jsx'
import { TableOfContents } from '../components/reader/TableOfContents.jsx'
import { ReaderContent } from '../components/reader/ReaderContent.jsx'
import { ChapterNavigation } from '../components/reader/ChapterNavigation.jsx'
import { FavoriteButton } from '../components/books/FavoriteButton.jsx'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { NotFound } from './NotFound.jsx'

const THEMES = ['light', 'dark', 'sepia']
const THEME_STYLES = {
  light: 'bg-[#f4ecdc] text-[#332c28]',
  dark: 'bg-[#1a1a1a] text-[#e5e5e5]',
  sepia: 'bg-[#f4e4d4] text-[#5c4a3d]',
}
const ARTICLE_STYLES = {
  light: 'bg-white',
  dark: 'bg-[#2a2a2a]',
  sepia: 'bg-[#f9f1e8]',
}
const WIDTHS = { narrow: 'max-w-2xl', normal: 'max-w-4xl', wide: 'max-w-5xl' }

export function Reader() {
  const { id } = useParams()
  const book = getBookById(id)
  const navigate = useNavigate()
  const notify = useNotification()
  const [sectionIndex, setSectionIndex] = useState(0)
  const [progress, setProgress] = useState(() => (book ? getReadingProgress(book.id) : 0))
  const [theme, setTheme] = useState(() => readString(STORAGE_KEYS.theme, 'light') || 'light')
  const [fontSize, setFontSize] = useState(() => Number(readString(STORAGE_KEYS.fontSize, '18')) || 18)
  const [width, setWidth] = useState(() => readString(STORAGE_KEYS.width, 'normal') || 'normal')
  const [spacing, setSpacing] = useState(() => readString(STORAGE_KEYS.spacing, 'normal') || 'normal')
  const [immersive, setImmersive] = useState(() => readString(STORAGE_KEYS.immersive, 'false') === 'true')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [tocHidden, setTocHidden] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [doublePage, setDoublePage] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [query, setQuery] = useState('')
  useDocumentTitle(book ? `Lire — ${book.title}` : 'Lecteur')

  const section = readerSections[sectionIndex]

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const percent = height <= 0 ? 0 : Math.min(100, Math.round((window.scrollY / height) * 100))
      setProgress(percent)
      if (book) saveReadingProgress(book.id, percent)
      if (percent === 100 && section.id === 'chapter-5') setCompleted(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [book, section])

  useEffect(() => {
    const onKey = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return
      if (event.key === 'Escape') {
        setImmersive(false)
        writeString(STORAGE_KEYS.immersive, 'false')
        setSettingsOpen(false)
      }
      if (event.key === '+' || event.key === '=') changeFont(2)
      if (event.key === '-' || event.key === '_') changeFont(-2)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const changeFont = (delta) => {
    setFontSize((current) => {
      const next = Math.max(14, Math.min(24, current + delta))
      writeString(STORAGE_KEYS.fontSize, String(next))
      return next
    })
  }

  const cycleTheme = () => {
    setTheme((current) => {
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]
      writeString(STORAGE_KEYS.theme, next)
      notify.info(`Thème ${next === 'light' ? 'clair' : next === 'dark' ? 'sombre' : 'sépia'} activé`)
      return next
    })
  }

  const toggleImmersive = () => {
    setImmersive((current) => {
      const next = !current
      writeString(STORAGE_KEYS.immersive, String(next))
      notify.info(next ? 'Mode immersif activé' : 'Mode normal activé')
      return next
    })
  }

  if (!book) return <NotFound />

  const selectText = () => window.getSelection()?.toString().trim() || ''

  return (
    <div className={`min-h-dvh ${THEME_STYLES[theme]}`}>
      {!immersive && !focusMode ? (
        <ReaderToolbar
          progress={progress}
          fontSize={fontSize}
          onBack={() => navigate(-1)}
          onSearch={() => setSearchOpen((open) => !open)}
          onSettings={() => setSettingsOpen(true)}
          onImmersive={toggleImmersive}
          onTheme={cycleTheme}
          onDecreaseFont={() => changeFont(-2)}
          onIncreaseFont={() => changeFont(2)}
          onBookmark={() => {
            const bookmarks = getBookmarks(book.id)
            bookmarks.push({ section: section.id, position: window.scrollY, timestamp: Date.now() })
            saveBookmarks(book.id, bookmarks)
            notify.info('Signet ajouté')
          }}
          onHighlight={() => {
            if (!selectText()) return notify.warning('Sélectionnez du texte à surligner')
            const highlights = getHighlights(book.id)
            highlights.push({ text: selectText(), section: section.id })
            saveHighlights(book.id, highlights)
            notify.info('Texte surligné')
          }}
          onNote={() => {
            if (!selectText()) return notify.warning('Sélectionnez du texte pour ajouter une note')
            const noteText = window.prompt('Entrez votre note :')
            if (!noteText) return
            const notes = getNotes(book.id)
            notes.push({ text: noteText, selection: selectText(), section: section.id })
            saveNotes(book.id, notes)
            notify.info('Note ajoutée')
          }}
          onTranslate={() => {
            if (!selectText()) return notify.warning('Sélectionnez du texte à traduire')
            notify.info('Traduction non disponible (nécessite une API)')
          }}
          onAudio={() => notify.info('Mode audio non disponible (nécessite une API)')}
          onDoublePage={() => {
            setDoublePage((value) => !value)
            notify.info(doublePage ? 'Mode simple page activé' : 'Mode double page activé')
          }}
          onFocus={() => {
            setFocusMode((value) => !value)
            notify.info('Mode concentration activé')
          }}
          onToc={() => setTocHidden((value) => !value)}
        />
      ) : null}

      {searchOpen ? (
        <div className="border-b border-[#ded3c1] bg-white px-4 py-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher dans le texte..."
            className="w-full rounded-lg border border-[#ded3c1] px-3 py-2 text-sm outline-none"
          />
        </div>
      ) : null}

      <div className={`flex ${immersive ? 'justify-center' : ''}`}>
        {!immersive && !focusMode ? (
          <TableOfContents
            current={section.id}
            hidden={tocHidden}
            onSelect={(sectionId) => {
              const index = readerSections.findIndex((item) => item.id === sectionId)
              setSectionIndex(index)
              window.scrollTo(0, 0)
            }}
          />
        ) : null}
        <main className={`flex-1 ${WIDTHS[width]} mx-auto px-6 py-12 ${immersive ? 'min-h-screen' : ''}`}>
          <article className={`${ARTICLE_STYLES[theme]} rounded-xl p-8 shadow-sm sm:p-12 ${doublePage ? 'grid grid-cols-2 gap-8' : ''}`}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#8f7770]">{book.title}</p>
              <FavoriteButton book={book} variant="button" className="relative top-auto right-auto" />
            </div>
            <ReaderContent sectionId={section.id} book={book} fontSize={fontSize} spacing={spacing} />
            <ChapterNavigation
              disablePrev={sectionIndex === 0}
              disableNext={sectionIndex === readerSections.length - 1}
              onPrev={() => { setSectionIndex((index) => index - 1); window.scrollTo(0, 0) }}
              onNext={() => { setSectionIndex((index) => index + 1); window.scrollTo(0, 0) }}
            />
          </article>
        </main>
      </div>

      {immersive ? (
        <button type="button" onClick={toggleImmersive} aria-label="Quitter le mode immersif" className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-lg">
          <X className="h-6 w-6" />
        </button>
      ) : null}

      <ReaderSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        width={width}
        spacing={spacing}
        onWidth={(value) => { setWidth(value); writeString(STORAGE_KEYS.width, value); notify.info(`Largeur : ${value}`) }}
        onSpacing={(value) => { setSpacing(value); writeString(STORAGE_KEYS.spacing, value); notify.info(`Espacement : ${value}`) }}
      />

      {completed ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-lg rounded-xl bg-white p-12 text-center shadow-xl">
            <h2 className="mb-4 font-serif text-3xl">Vous avez terminé ce livre 🎉</h2>
            <p className="mb-8 text-sm text-[#705f57]">Merci d'avoir lu sur MIKANDA.</p>
            <div className="flex flex-col gap-3">
              <Link to="/bibliotheque" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#133a28] px-6 py-3 text-sm font-semibold text-white">
                <Library className="h-4 w-4" /> Retour à la bibliothèque
              </Link>
              <Link to="/favoris" className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm">
                <Heart className="h-4 w-4" /> Voir mes favoris
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
