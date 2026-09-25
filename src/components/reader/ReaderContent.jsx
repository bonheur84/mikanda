import { poetryLines, readerContent, tocRows } from '../../data/reader.js'

export function ReaderContent({ sectionId, book, fontSize, spacing }) {
  const spacingClass = {
    compact: 'leading-tight',
    normal: 'leading-[1.9]',
    comfortable: 'leading-loose',
  }[spacing]

  if (sectionId === 'cover-page') {
    return (
      <div className="py-16 text-center">
        <img src={book.image} alt="" className="mx-auto mb-8 h-64 w-48 rounded-lg object-cover shadow-md" />
        <h1 className="mb-4 font-serif text-4xl font-bold">{book.title}</h1>
        <p className="mb-2 text-lg text-[#705f57]">{book.author}</p>
        <p className="text-sm text-[#8f7770]">{book.year} · {book.category}</p>
      </div>
    )
  }

  if (sectionId === 'poetry-section') {
    return (
      <div className="border-t border-[#ded3c1] py-8">
        <h2 className="mb-6 font-serif text-2xl">Poésie</h2>
        <div className="font-serif text-lg leading-loose italic">
          {poetryLines.map((line) => (
            <p key={line} className="mb-4">{line}</p>
          ))}
        </div>
      </div>
    )
  }

  if (sectionId === 'code-section') {
    return (
      <div className="border-t border-[#ded3c1] py-8">
        <h2 className="mb-6 font-serif text-2xl">Extrait de code</h2>
        <pre className="overflow-x-auto rounded-lg bg-[#f4ecdc] p-4 font-mono text-sm">
{`function memories() {
  return "Les souvenirs";
}`}
        </pre>
      </div>
    )
  }

  if (sectionId === 'table-section') {
    return (
      <div className="border-t border-[#ded3c1] py-8">
        <h2 className="mb-6 font-serif text-2xl">Table des matières</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ded3c1]">
              <th className="py-3 text-left text-[#8f7770]">Chapitre</th>
              <th className="py-3 text-left text-[#8f7770]">Titre</th>
              <th className="py-3 text-right text-[#8f7770]">Page</th>
            </tr>
          </thead>
          <tbody>
            {tocRows.map((row) => (
              <tr key={row.chapter} className="border-b border-[#f0e8dc]">
                <td className="py-3">{row.chapter}</td>
                <td className="py-3">{row.title}</td>
                <td className="py-3 text-right">{row.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const meta = {
    introduction: { kicker: null, title: 'Introduction' },
    'chapter-content': { kicker: 'Chapitre I', title: 'La mort' },
    'chapter-2': { kicker: 'Chapitre II', title: 'La ville' },
    'chapter-3': { kicker: 'Chapitre III', title: 'La mémoire' },
    'chapter-4': { kicker: 'Chapitre IV', title: 'L’héritage' },
    'chapter-5': { kicker: 'Chapitre V', title: 'Le futur' },
  }[sectionId]

  const paragraphs = readerContent[sectionId] || []

  return (
    <div>
      {meta ? (
        <div className="mb-8 text-center">
          {meta.kicker ? <span className="text-[11px] uppercase tracking-[0.24em] text-[#bd684c]">{meta.kicker}</span> : null}
          <h2 className="mt-4 font-serif text-5xl leading-tight font-medium">{meta.title}</h2>
        </div>
      ) : null}
      <div id="reading-content" className={`font-serif ${spacingClass}`} style={{ fontSize: `${fontSize}px` }}>
        {paragraphs.map((paragraph, index) =>
          paragraph.startsWith('QUOTE:') ? (
            <blockquote key={index} className="my-8 border-l-4 border-[#bd684c] pl-6 text-xl leading-8 text-[#8f8171] italic">
              {paragraph.replace('QUOTE:', '')}
            </blockquote>
          ) : (
            <p key={index} className="mb-6">{paragraph}</p>
          ),
        )}
      </div>
    </div>
  )
}
