import { useMemo, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { books, getAuthorNames, getCategories } from '../data/books.js'
import { filterBooks } from '../services/search.js'
import { STORAGE_KEYS, readString, writeString } from '../services/storage.js'
import { BookGrid } from '../components/books/BookGrid.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const ITEMS_PER_PAGE = 6
const ERAS = [
  'all',
  'Tradition orale',
  'Époque coloniale (1900-1960)',
  'Post-indépendance (1960-1990)',
  'Période contemporaine (1990-présent)',
]

export function Library() {
  useDocumentTitle('Bibliothèque')
  const [availability, setAvailability] = useState('all')
  const [categories, setCategories] = useState([])
  const [author, setAuthor] = useState('all')
  const [era, setEra] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState(() => readString(STORAGE_KEYS.bookView, 'grid') || 'grid')

  const allCategories = getCategories()
  const authors = getAuthorNames()

  const filtered = useMemo(
    () => filterBooks(books, { availability, categories, author, era, query }),
    [availability, categories, author, era, query],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const changeView = (next) => {
    setView(next)
    writeString(STORAGE_KEYS.bookView, next)
  }

  const reset = () => {
    setAvailability('all')
    setCategories([])
    setAuthor('all')
    setEra('all')
    setQuery('')
    setPage(1)
  }

  const toggleCategory = (category) => {
    setCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    )
    setPage(1)
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Catalogue</p>
      <h1 className="mt-2 font-serif text-5xl">Bibliothèque</h1>
      <p className="mt-4 max-w-xl text-[#705f57]">Explorez les œuvres, filtrez par genre, auteur ou époque, et ajoutez vos lectures aux favoris.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-xl border border-[#E5DDCB] bg-white p-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B5E4F]">Disponibilité</p>
            <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-[#F5EFE4] p-1 text-xs font-semibold">
              {['all', 'free', 'premium'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setAvailability(value); setPage(1) }}
                  className={`rounded-md px-2 py-1.5 ${availability === value ? 'bg-white text-[#211E1B] shadow-xs' : 'text-[#6B5E4F]'}`}
                >
                  {value === 'all' ? 'Tous' : value === 'free' ? 'Gratuit' : 'Premium'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B5E4F]">Catégories</p>
            <div className="max-h-60 space-y-1.5 overflow-y-auto">
              {allCategories.map((category) => (
                <label key={category} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="accent-[#133a28]"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F]">
            Auteur
            <select value={author} onChange={(event) => { setAuthor(event.target.value); setPage(1) }} className="mt-2 w-full rounded-lg border border-[#DDD1BE] bg-[#FAF6EE] px-3 py-2 text-sm font-normal">
              <option value="all">Tous les auteurs</option>
              {authors.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F]">
            Époque
            <select value={era} onChange={(event) => { setEra(event.target.value); setPage(1) }} className="mt-2 w-full rounded-lg border border-[#DDD1BE] bg-[#FAF6EE] px-3 py-2 text-sm font-normal">
              {ERAS.map((value) => (
                <option key={value} value={value}>{value === 'all' ? 'Toutes les époques' : value}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={reset} className="w-full rounded-lg border border-[#133a28] px-3 py-2 text-sm text-[#133a28]">
            Réinitialiser
          </button>
        </aside>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              placeholder="Nom de l'oeuvre..."
              className="h-11 flex-1 rounded-lg border border-[#DDD1BE] bg-white px-4 text-sm outline-none focus:border-[#133a28]"
              aria-label="Rechercher une œuvre"
            />
            <div className="flex overflow-hidden rounded-lg border border-[#DDD1BE]">
              <button type="button" aria-label="Afficher les livres en grille" onClick={() => changeView('grid')} className={`p-2 ${view === 'grid' ? 'bg-[#2D2319] text-white' : 'text-[#6B5E4F]'}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Afficher les livres en liste" onClick={() => changeView('list')} className={`p-2 ${view === 'list' ? 'bg-[#2D2319] text-white' : 'text-[#6B5E4F]'}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          <BookGrid books={pageItems} view={view} />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#705f57]">Page {page} sur {totalPages} ({filtered.length} œuvres)</p>
            <div className="flex gap-2">
              <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Précédent</button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${page === index + 1 ? 'bg-[#8E461F] text-white' : 'border border-[#DDD1BE]'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Suivant</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
