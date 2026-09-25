import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t bg-[#292c27] px-5 py-12 text-[#e9e0d1] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3" aria-label="MIKANDA accueil">
            <img src="/assets/branding/logo_e9e0d1.svg" alt="logo" className="h-11 w-12" />
            <span>
              <span className="block font-serif text-xl font-bold leading-none tracking-wide">MIKANDA</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-[#e9e0d1]/70">La Bibliothèque congolaise</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#e9e0d1]/65">
            La bibliothèque numérique de la littérature congolaise.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-[#d4af72]">Bibliothèque</p>
          <div className="flex flex-col gap-3 text-sm text-[#e9e0d1]/70">
            <Link to="/bibliotheque" className="hover:text-[#e9e0d1]">Catalogue</Link>
            <Link to="/auteurs" className="hover:text-[#e9e0d1]">Auteurs</Link>
            <Link to="/collections" className="hover:text-[#e9e0d1]">Collections</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-[#d4af72]">Informations</p>
          <div className="flex flex-col gap-3 text-sm text-[#e9e0d1]/70">
            <Link to="/apropos" className="hover:text-[#e9e0d1]">À propos</Link>
            <Link to="/contact" className="hover:text-[#e9e0d1]">Contact</Link>
            <Link to="/inscription" className="hover:text-[#e9e0d1]">Abonnement</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-[#d4af72]">La communauté</p>
          <Link to="/rejoindre-equipe" className="text-sm text-[#e9e0d1]/70 hover:text-[#e9e0d1]">
            Rejoindre l'équipe
          </Link>
          <p className="mt-5 text-xs text-[#e9e0d1]/45">Lubumbashi, République démocratique du Congo</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-[#e9e0d1]/15 pt-5 text-xs text-[#e9e0d1]/45">
        © 2026 — Bibliothèque numérique de la littérature congolaise
      </div>
    </footer>
  )
}
