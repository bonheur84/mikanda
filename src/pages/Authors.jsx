import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { authors } from '../data/authors.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function Authors() {
  useDocumentTitle('Auteurs')
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('')

  const filtered = useMemo(() => {
    return authors.filter((author) => {
      const matchesQuery = author.name.toLowerCase().includes(query.toLowerCase())
      const matchesLetter = letter ? author.name.toUpperCase().startsWith(letter) : true
      return matchesQuery && matchesLetter
    })
  }, [query, letter])

  const selectLetter = (l) => {
    setLetter((current) => (current === l ? '' : l))
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Voix et trajectoires</p>
      <h1 className="mt-2 font-serif text-5xl">Auteurs congolais</h1>

      {/* Recherche */}
      <div className="mt-8 flex max-w-xl items-center border border-[#d9d1c6] bg-[#fdfaf3] px-3 focus-within:border-[#133a28] focus-within:ring-1 focus-within:ring-[#133a28] transition-all">
        <Search className="h-4 w-4 text-[#705f57]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 flex-1 bg-transparent px-3 text-sm outline-none"
          placeholder="Rechercher un auteur..."
          aria-label="Rechercher un auteur"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-xs text-[#8f7770] hover:text-[#1a1410]"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtre alphabétique avec bouton "Tous" */}
      <div className="mt-8 border-y border-[#d9d1c6] py-4">
        <div className="flex flex-wrap items-center gap-1 text-sm text-[#705f57]">
          {/* Bouton "Tous" */}
          <button
            type="button"
            onClick={() => setLetter('')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              letter === ''
                ? 'bg-[#133a28] text-white'
                : 'hover:bg-[#f4ece2] hover:text-[#133a28] active:scale-95'
            }`}
          >
            Tous
          </button>

          {/* Séparateur */}
          <span className="mx-1 text-[#d9d1c6]">|</span>

          {letters.map((item) => {
            const hasAuthors = authors.some((a) => a.name.toUpperCase().startsWith(item))
            return (
              <button
                key={item}
                type="button"
                onClick={() => selectLetter(item)}
                disabled={!hasAuthors}
                className={`min-w-[1.5rem] cursor-pointer rounded-md px-1.5 py-1 text-xs transition-all ${
                  letter === item
                    ? 'bg-[#133a28] font-bold text-white'
                    : hasAuthors
                    ? 'hover:bg-[#f4ece2] hover:text-[#133a28] active:scale-95'
                    : 'cursor-default opacity-30'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Indicateur de filtre actif */}
        {(letter || query) && (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-xs text-[#8f7770]">
              {filtered.length} auteur{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              {letter && ` — Lettre : ${letter}`}
              {query && ` — Recherche : "${query}"`}
            </p>
            <button
              type="button"
              onClick={() => { setLetter(''); setQuery('') }}
              className="text-xs text-[#c17248] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Grille des auteurs */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-serif text-xl text-[#1a1410]">Aucun auteur trouvé</p>
          <p className="mt-2 text-sm text-[#8f7770]">Essayez une autre lettre ou un autre terme de recherche.</p>
          <button
            type="button"
            onClick={() => { setLetter(''); setQuery('') }}
            className="mt-4 rounded-lg border border-[#133a28] px-4 py-2 text-sm text-[#133a28] transition-colors hover:bg-[#133a28] hover:text-white"
          >
            Voir tous les auteurs
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((author) => (
            <Link
              key={author.id}
              to={`/auteurs/${author.id}`}
              className="group rounded-xl border border-[#d9d1c6] p-5 pt-5 transition-all duration-200 hover:border-[#133a28] hover:bg-[#fdfaf3] hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                {author.image ? (
                  <img
                    alt={`Portrait de ${author.name}`}
                    src={author.image}
                    className="h-20 w-20 rounded-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#315d4b] font-serif text-2xl text-[#f7f1e6] transition-all duration-200 group-hover:bg-[#133a28]">
                    {author.initials}
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-2xl transition-colors duration-200 group-hover:text-[#133a28]">
                    {author.name}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] text-[#705f57]">{author.years}</p>
                  <p className="mt-2 text-sm text-[#c17248]">{author.genres.join(' · ')}</p>
                  <p className="mt-1 text-xs text-[#705f57]">{author.worksCount} œuvres</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#705f57] line-clamp-2">{author.bio}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
