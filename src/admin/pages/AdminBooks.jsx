import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, ExternalLink, Edit2, X, Check } from 'lucide-react'
import { books } from '../../data/books.js'
import { getBookMeta, saveBookMeta } from '../../services/adminBooks.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useNotification } from '../../hooks/useNotification.jsx'

export function AdminBooks() {
  useDocumentTitle('Livres — Admin MIKANDA')
  const notify = useNotification()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // State pour la modale d'édition
  const [editingBook, setEditingBook] = useState(null)
  
  // États du formulaire
  const [pdfUrl, setPdfUrl] = useState('')
  const [pages, setPages] = useState('')
  const [availability, setAvailability] = useState('free')
  const [publisher, setPublisher] = useState('')
  
  // Gestion des langues
  const defaultLangs = ['Français', 'Anglais', 'Lingala', 'Swahili', 'Tshiluba']
  const [languages, setLanguages] = useState([])
  const [newLang, setNewLang] = useState('')

  const categories = [...new Set(books.map((b) => b.category))]
  
  // Appliquer les métadonnées pour l'affichage dans le tableau
  const enhancedBooks = books.map(book => {
    const meta = getBookMeta(book.id)
    return { ...book, ...meta }
  })

  const filtered = enhancedBooks.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    const matchCat = !categoryFilter || b.category === categoryFilter
    return matchSearch && matchCat
  })

  const openEditModal = (book) => {
    setEditingBook(book)
    setPdfUrl(book.pdfUrl || '')
    setPages(book.pages || '')
    setAvailability(book.availability || 'free')
    setPublisher(book.publisher || '')
    
    // Initialiser les langues (tableau ou chaîne vers tableau)
    let langs = []
    if (Array.isArray(book.languages)) langs = [...book.languages]
    else if (book.language) langs = [book.language]
    else langs = ['Français'] // fallback
    setLanguages(langs)
  }

  const closeEditModal = () => {
    setEditingBook(null)
  }

  const toggleLanguage = (lang) => {
    setLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  const addNewLanguage = () => {
    const trimmed = newLang.trim()
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed])
      setNewLang('')
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Sauvegarder dans le localStorage via le service
    saveBookMeta(editingBook.id, {
      pdfUrl: pdfUrl.trim() || null,
      pages: pages ? parseInt(pages, 10) : null,
      availability,
      publisher: publisher.trim() || null,
      languages: languages.length > 0 ? languages : ['Français']
    })
    
    notify.success('Métadonnées du livre mises à jour avec succès.')
    closeEditModal()
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1410]">Livres</h1>
          <p className="mt-1 text-sm text-[#705f57]">{books.length} livres dans la bibliothèque</p>
        </div>
        <div className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          Les livres sont issus des données locales. Seules les métadonnées peuvent être éditées ici.
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7770]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou un auteur…"
            className="h-10 w-full rounded-lg border border-[#d9d1c6] bg-white pl-9 pr-4 text-sm focus:border-[#133a28] focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border border-[#d9d1c6] bg-white px-3 text-sm focus:border-[#133a28] focus:outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-[#e2ddd6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="border-b border-[#e2ddd6] bg-[#f8f5f0]">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Livre</th>
                <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Auteur</th>
                <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Statut</th>
                <th className="px-5 py-3 text-center font-semibold text-[#705f57]">PDF</th>
                <th className="px-5 py-3 text-right font-semibold text-[#705f57]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ebe4]">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-[#faf8f4]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-10 w-8 shrink-0 rounded object-cover shadow-sm"
                      />
                      <div className="max-w-xs">
                        <span className="block font-medium text-[#1a1410] truncate">{book.title}</span>
                        <span className="block text-xs text-[#8f7770] truncate">{book.category} · {book.year}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#705f57]">{book.author}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      book.availability === 'premium' 
                        ? 'border-amber-200 bg-amber-50 text-amber-700' 
                        : 'border-green-200 bg-green-50 text-green-700'
                    }`}>
                      {book.availability === 'premium' ? 'Premium' : 'Gratuit'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {book.pdfUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3.5 w-3.5" /> Oui
                      </span>
                    ) : (
                      <span className="text-xs text-[#8f7770]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(book)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#d9d1c6] px-2.5 py-1.5 text-xs font-medium text-[#133a28] hover:bg-[#f4ece2]"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Éditer
                      </button>
                      <Link
                        to={`/livres/${book.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#d9d1c6] px-2.5 py-1.5 text-xs font-medium text-[#705f57] hover:bg-[#f4ece2]"
                        target="_blank"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Voir
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#8f7770]">Aucun livre trouvé.</div>
        )}
      </div>

      {/* Modale d'édition */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeEditModal}>
          <div 
            className="w-full max-w-lg overflow-hidden rounded-xl bg-[#faf6ef] shadow-2xl flex flex-col max-h-[90vh]" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#d9d1c6] bg-white px-6 py-4">
              <h2 className="font-serif text-xl text-[#1a1410]">Éditer les métadonnées</h2>
              <button onClick={closeEditModal} className="text-[#8f7770] hover:text-[#1a1410]">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto px-6 py-6">
              <div className="mb-6 flex gap-4">
                <img src={editingBook.image} alt="" className="h-24 w-16 rounded object-cover shadow-sm" />
                <div>
                  <h3 className="font-serif text-lg leading-tight">{editingBook.title}</h3>
                  <p className="text-sm text-[#705f57]">{editingBook.author}</p>
                </div>
              </div>

              <form id="edit-book-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1a1410]">Lien du PDF</label>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://exemple.com/livre.pdf"
                    className="w-full rounded-lg border border-[#d9d1c6] bg-white px-3 py-2 text-sm focus:border-[#133a28] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#8f7770]">Laissez vide si le livre n'est pas disponible en téléchargement PDF.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#1a1410]">Nombre de pages</label>
                    <input
                      type="number"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="Ex: 240"
                      min="1"
                      className="w-full rounded-lg border border-[#d9d1c6] bg-white px-3 py-2 text-sm focus:border-[#133a28] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#1a1410]">Statut</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full rounded-lg border border-[#d9d1c6] bg-white px-3 py-2 text-sm focus:border-[#133a28] focus:outline-none"
                    >
                      <option value="free">Gratuit</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1a1410]">Éditeur</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Ex: Présence Africaine"
                    className="w-full rounded-lg border border-[#d9d1c6] bg-white px-3 py-2 text-sm focus:border-[#133a28] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1410]">Langues disponibles</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {/* Afficher les langues uniques parmi les langues par défaut et celles du livre */}
                    {[...new Set([...defaultLangs, ...languages])].map(lang => (
                      <label key={lang} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d9d1c6] bg-white px-3 py-1.5 text-xs hover:bg-[#f4ece2]">
                        <input
                          type="checkbox"
                          checked={languages.includes(lang)}
                          onChange={() => toggleLanguage(lang)}
                          className="accent-[#133a28]"
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      placeholder="Autre langue..."
                      className="flex-1 rounded-lg border border-[#d9d1c6] bg-white px-3 py-1.5 text-xs focus:border-[#133a28] focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewLanguage())}
                    />
                    <button
                      type="button"
                      onClick={addNewLanguage}
                      className="rounded-lg bg-[#f4ece2] px-3 py-1.5 text-xs font-medium text-[#133a28] hover:bg-[#e6dccb]"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t border-[#d9d1c6] bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg border border-[#d9d1c6] px-4 py-2 text-sm font-medium text-[#705f57] hover:bg-[#f4ece2]"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="edit-book-form"
                className="rounded-lg bg-[#133a28] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d5a3e]"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
