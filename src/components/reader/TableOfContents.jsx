import { readerSections } from '../../data/reader.js'

export function TableOfContents({ current, onSelect, hidden }) {
  if (hidden) return null

  return (
    <aside id="toc" className="w-full max-w-xs border-r border-[#ded3c1] bg-[#f4ecdc] p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
      <h2 className="mb-4 font-serif text-xl">Table des matières</h2>
      <nav className="flex flex-col gap-1" aria-label="Chapitres">
        {readerSections.map((section) => (
          <button
            key={section.id}
            type="button"
            data-section={section.id}
            onClick={() => onSelect(section.id)}
            className={`toc-btn rounded-lg px-3 py-2 text-left text-sm ${current === section.id ? 'bg-[#315d4b] text-white' : 'hover:bg-white'}`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
