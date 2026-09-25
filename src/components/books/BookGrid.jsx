import { BookCard } from './BookCard.jsx'

export function BookGrid({ books, view = 'grid' }) {
  if (!books.length) {
    return (
      <p className="col-span-full py-16 text-center text-[#705f57]">Aucune œuvre ne correspond à vos filtres.</p>
    )
  }

  if (view === 'list') {
    return (
      <div className="grid grid-cols-1 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} variant="list" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
