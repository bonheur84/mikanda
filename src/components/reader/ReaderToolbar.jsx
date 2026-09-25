import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Columns2,
  Eye,
  Highlighter,
  Languages,
  Maximize,
  Minus,
  Moon,
  Plus,
  Search,
  Settings,
  StickyNote,
  Volume2,
} from 'lucide-react'

export function ReaderToolbar({
  progress,
  fontSize,
  onBack,
  onSearch,
  onSettings,
  onImmersive,
  onTheme,
  onDecreaseFont,
  onIncreaseFont,
  onBookmark,
  onHighlight,
  onNote,
  onTranslate,
  onAudio,
  onDoublePage,
  onFocus,
  onToc,
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ded3c1] bg-[#f7f1e6]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="rounded-lg p-2 hover:bg-[#efe6d6]" aria-label="Retour">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Link to="/bibliotheque" className="hidden text-sm text-[#705f57] hover:text-[#133a28] sm:inline">
          Bibliothèque
        </Link>
      </div>
      <div className="mx-4 hidden h-1 flex-1 overflow-hidden rounded-full bg-[#ded3c1] md:block" aria-hidden>
        <div id="progress-bar-fill" className="h-full bg-[#c17248]" style={{ width: `${progress}%` }} />
      </div>
      <p id="progress-text" className="mr-3 hidden text-xs text-[#8f7770] sm:block">
        {progress} %
      </p>
      <div className="flex flex-wrap items-center justify-end gap-1">
        <IconButton label="Rechercher dans le texte" onClick={onSearch}><Search className="h-4 w-4" /></IconButton>
        <IconButton label="Paramètres" onClick={onSettings}><Settings className="h-4 w-4" /></IconButton>
        <IconButton label="Mode immersif" onClick={onImmersive}><Maximize className="h-4 w-4" /></IconButton>
        <IconButton label="Changer de thème" onClick={onTheme}><Moon className="h-4 w-4" /></IconButton>
        <IconButton label="Diminuer la taille du texte" onClick={onDecreaseFont}><Minus className="h-4 w-4" /></IconButton>
        <span className="px-1 text-xs" id="font-size-display">{fontSize}</span>
        <IconButton label="Augmenter la taille du texte" onClick={onIncreaseFont}><Plus className="h-4 w-4" /></IconButton>
        <IconButton label="Ajouter un signet" onClick={onBookmark}><Bookmark className="h-4 w-4" /></IconButton>
        <IconButton label="Surligner" onClick={onHighlight}><Highlighter className="h-4 w-4" /></IconButton>
        <IconButton label="Ajouter une note" onClick={onNote}><StickyNote className="h-4 w-4" /></IconButton>
        <IconButton label="Traduire" onClick={onTranslate}><Languages className="h-4 w-4" /></IconButton>
        <IconButton label="Mode lecture" onClick={onFocus}><Eye className="h-4 w-4" /></IconButton>
        <IconButton label="Mode audio" onClick={onAudio}><Volume2 className="h-4 w-4" /></IconButton>
        <IconButton label="Double page" onClick={onDoublePage}><Columns2 className="h-4 w-4" /></IconButton>
        <IconButton label="Table des matières" onClick={onToc}><Bookmark className="h-4 w-4" /></IconButton>
      </div>
    </header>
  )
}

function IconButton({ label, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="rounded-lg p-2 text-[#705f57] hover:bg-[#efe6d6] hover:text-[#133a28]">
      {children}
    </button>
  )
}
