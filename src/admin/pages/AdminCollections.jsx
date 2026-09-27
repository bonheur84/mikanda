import { Link } from 'react-router-dom'
import { ExternalLink, Library } from 'lucide-react'
import { collections } from '../../data/collections.js'
import { books } from '../../data/books.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

export function AdminCollections() {
  useDocumentTitle('Collections — Admin MIKANDA')

  function bookCount(collectionId) {
    return books.filter((b) => b.collections?.includes(collectionId)).length
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Collections</h1>
        <p className="mt-1 text-sm text-[#705f57]">{collections.length} collections dans la bibliothèque</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <div key={col.id} className="overflow-hidden rounded-xl border border-[#e2ddd6] bg-white">
            <img src={col.image} alt={col.title} className="h-32 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#1a1410]">{col.title}</p>
                  <p className="mt-0.5 text-xs text-[#705f57] line-clamp-2">{col.description}</p>
                </div>
                <Link to={`/collections/${col.id}`} target="_blank"
                  className="shrink-0 rounded-lg border border-[#d9d1c6] p-1.5 text-[#705f57] hover:border-[#133a28] hover:text-[#133a28]">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8f7770]">
                <Library className="h-3.5 w-3.5" />
                <span>{bookCount(col.id)} livre(s) associé(s)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
