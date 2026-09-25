import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function NotFound() {
  useDocumentTitle('Page introuvable')

  return (
    <main className="flex min-h-[calc(100vh-12rem)] items-center">
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <img src="/assets/images/Image Codex 25 sept. 2026, 14_38_32.png" alt="Illustration femme africaine avec livres" className="h-auto w-full rounded-2xl shadow-2xl" />
          </div>
          <div>
            <h1 className="mb-4 font-serif text-[8rem] leading-none text-[#133a28] sm:text-[12rem]">404</h1>
            <h2 className="mb-6 font-serif text-4xl">Page introuvable</h2>
            <p className="mb-8 max-w-xl text-lg text-[#705f57]">
              Oops ! La page que vous recherchez n'existe pas ou a peut-être été déplacée. Mais pas de panique, il y a plein d'autres belles histoires à découvrir sur MIKANDA.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#133a28] px-6 py-3 text-sm font-medium text-white">
                <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
              </Link>
              <Link to="/bibliotheque" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#133a28] px-6 py-3 text-sm font-medium text-[#133a28]">
                <BookOpen className="h-4 w-4" /> Explorer la bibliothèque
              </Link>
            </div>
          </div>
        </div>
        <blockquote className="mx-auto mt-16 max-w-2xl text-center">
          <p className="mb-4 font-serif text-2xl italic text-[#705f57]">« Un livre est un voyage, même quand on reste sur place. »</p>
          <cite className="text-sm text-[#c17248] not-italic">— MIKANDA</cite>
        </blockquote>
      </section>
    </main>
  )
}
