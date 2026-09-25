import { Link } from 'react-router-dom'
import { collections } from '../data/collections.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Collections() {
  useDocumentTitle('Collections')

  return (
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Parcours éditoriaux</p>
      <h1 className="mt-2 font-serif text-5xl">Collections</h1>
      <p className="mt-4 max-w-xl text-[#705f57]">
        Des sélections pensées pour traverser les époques, les genres et les voix de la littérature congolaise.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="group relative min-h-64 overflow-hidden bg-cover bg-center p-6 text-[#f5efe5] transition-transform hover:-translate-y-1"
            style={{ backgroundImage: `url('${collection.image}')` }}
          >
            <div className="absolute inset-0 bg-[#133a28]/65" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#f5efe5]/60">Collection · {collection.countLabel}</p>
              <h2 className="mt-3 font-serif text-3xl">{collection.title}</h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#f5efe5]/75">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
