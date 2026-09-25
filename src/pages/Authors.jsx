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

  return (
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Voix et trajectoires</p>
      <h1 className="mt-2 font-serif text-5xl">Auteurs congolais</h1>
      <div className="mt-8 flex max-w-xl items-center border border-[#d9d1c6] bg-[#fdfaf3] px-3 focus-within:border-[#133a28] focus-within:ring-1 focus-within:ring-[#133a28]">
        <Search className="h-4 w-4 text-[#705f57]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 flex-1 bg-transparent px-3 text-sm outline-none"
          placeholder="Rechercher un auteur..."
          aria-label="Rechercher un auteur"
        />
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 overflow-x-auto border-y border-[#d9d1c6] py-4 text-sm text-[#705f57]">
        {letters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLetter((current) => (current === item ? '' : item))}
            className={`min-w-4 cursor-pointer hover:text-[#133a28] ${letter === item ? 'font-bold text-[#133a28]' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((author) => (
          <Link key={author.id} to={`/auteurs/${author.id}`} className="group border-t border-[#d9d1c6] pt-5 transition-all hover:bg-[#fdfaf3] hover:shadow-md">
            <div className="flex items-center gap-4">
              {author.image ? (
                <img alt={`Portrait de ${author.name}`} src={author.image} className="h-24 w-24 rounded-full object-cover grayscale transition-all group-hover:grayscale-0" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#315d4b] font-serif text-2xl text-[#f7f1e6]">{author.initials}</div>
              )}
              <div>
                <h2 className="font-serif text-2xl group-hover:text-[#133a28]">{author.name}</h2>
                <p className="mt-1 font-mono text-[10px] text-[#705f57]">{author.years}</p>
                <p className="mt-2 text-sm text-[#c17248]">{author.genres.join(' · ')}</p>
                <p className="mt-1 text-xs text-[#705f57]">{author.worksCount} œuvres</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#705f57]">{author.bio}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
