import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { books } from '../../data/books.js'
import { authors } from '../../data/authors.js'
import { searchCatalog } from '../../services/search.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'

export function SearchBar({ variant = 'desktop' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebouncedValue(query, 300)
  const results = debounced.length >= 2 ? searchCatalog(debounced, books, authors) : []
  const containerRef = useRef(null)

  useEffect(() => {
    const onClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${variant === 'mobile' ? 'w-full' : ''}`}>
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Rechercher..."
        aria-label="Rechercher des livres ou des auteurs"
        className={`${variant === 'mobile' ? 'w-full' : 'w-48'} rounded-sm border border-[#d9d1c6] px-3 py-1.5 pr-8 text-sm transition-all focus:border-[#133a28] focus:ring-1 focus:ring-[#133a28] focus:outline-none`}
      />
      <Search className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-[#705f57]" />
      {open && query.length >= 2 ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-[#d9d1c6] bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="p-4 text-center text-sm text-[#705f57]">Aucun résultat trouvé pour « {query} »</p>
          ) : (
            results.map((result) =>
              result.type === 'book' ? (
                <Link
                  key={`book-${result.item.id}`}
                  to={`/livres/${result.item.id}`}
                  className="block border-b border-[#d9d1c6] p-4 last:border-b-0 hover:bg-[#eae0d1]"
                  onClick={() => setOpen(false)}
                >
                  <h4 className="font-serif text-lg text-[#281e19]">{result.item.title}</h4>
                  <p className="text-sm text-[#705f57]">{result.item.author}</p>
                  <p className="mt-1 text-xs text-[#c17248]">
                    {result.item.category} · {result.item.year}
                  </p>
                </Link>
              ) : (
                <Link
                  key={`author-${result.item.id}`}
                  to={`/auteurs/${result.item.id}`}
                  className="block border-b border-[#d9d1c6] p-4 last:border-b-0 hover:bg-[#eae0d1]"
                  onClick={() => setOpen(false)}
                >
                  <h4 className="font-serif text-lg text-[#281e19]">{result.item.name}</h4>
                  <p className="text-sm text-[#705f57]">{result.item.genres?.join(' · ')}</p>
                </Link>
              ),
            )
          )}
        </div>
      ) : null}
    </div>
  )
}
