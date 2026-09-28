import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Building, Handshake, History, Info, Mail, MapPin, Send, ShieldCheck, University, Unlock } from 'lucide-react'
import { team } from '../data/team.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

// Partenaires avec logos symboliques (icônes + noms depuis les données du projet)
const PARTNERS = [
  { name: 'Bibliothèque nationale de la RDC', icon: BookOpen, color: '#133a28' },
  { name: 'Université de Kinshasa', icon: University, color: '#c17248' },
  { name: 'Institut Français du Congo', icon: Building, color: '#1877f2' },
  { name: 'Archives nationales', icon: Handshake, color: '#8e461f' },
  { name: 'Présence Africaine', icon: BookOpen, color: '#133a28' },
  { name: 'Centre Wallonie-Bruxelles', icon: Building, color: '#e31836' },
  { name: 'Université de Lubumbashi', icon: University, color: '#c17248' },
  { name: 'Alliance Française Kinshasa', icon: Building, color: '#002395' },
]

function PartnerBanner() {
  const trackRef = useRef(null)

  return (
    <div
      className="relative overflow-hidden border-y border-[#d9d1c6] bg-[#faf6ef] py-8"
      aria-label="Partenaires de MIKANDA"
    >
      {/* Dégradés sur les bords */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#faf6ef] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#faf6ef] to-transparent" />

      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-[#8f7770]">
        Nos partenaires institutionnels
      </p>

      {/* Bande défilante */}
      <div className="flex overflow-hidden">
        <div
          ref={trackRef}
          className="flex animate-scroll gap-12 whitespace-nowrap"
          style={{ animationDuration: '30s' }}
        >
          {/* Double le contenu pour un défilement infini fluide */}
          {[...PARTNERS, ...PARTNERS].map((partner, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`${partner.name}-${index}`}
              className="flex shrink-0 items-center gap-3 rounded-xl border border-[#d9d1c6] bg-white px-5 py-3 shadow-sm"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${partner.color}15` }}
              >
                <partner.icon className="h-4 w-4" style={{ color: partner.color }} />
              </div>
              <span className="font-serif text-sm text-[#1a1410]">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function About() {
  useDocumentTitle('À propos')
  const notify = useNotification()
  const [counts, setCounts] = useState({ works: 0, authors: 0, heritage: 0 })

  useEffect(() => {
    const duration = 900
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setCounts({
        works: Math.round(480 * t),
        authors: Math.round(126 * t),
        heritage: Math.round(1 * t),
      })
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <main>
      {/* Héro */}
      <section className="border-b border-[#d9d1c6] bg-[#eae0d1]/45 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c17248]">À propos de MIKANDA</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.04] sm:text-6xl">
              Une mémoire vivante, <em className="text-[#133a28]">accessible à tous.</em>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#705f57]">
              MIKANDA est une bibliothèque numérique culturelle dédiée aux œuvres, aux auteurs et aux archives de la République démocratique du Congo.
            </p>
          </div>
          <div className="rounded-r-xl border-l-2 border-[#c17248] bg-white/50 p-6 pl-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-[#c17248]/10 p-3"><BookOpen className="h-6 w-6 text-[#c17248]" /></div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#c17248]">Notre vision</span>
            </div>
            <p className="font-serif text-2xl leading-9">Préserver les voix d'hier, accompagner celles d'aujourd'hui et transmettre celles de demain.</p>
          </div>
        </div>
      </section>

      {/* Photo + texte */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <figure>
            <div className="aspect-[1.7] overflow-hidden bg-[#eae0d1]">
              <img src="/assets/images/mikanda-reading.jpg" alt="Lectrice africaine parmi les rayonnages d'une bibliothèque" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8f7770]">Lire, préserver, transmettre</figcaption>
          </figure>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Un espace pour les voix</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">La littérature comme lieu de rencontre.</h2>
            <p className="mt-5 leading-7 text-[#705f57]">Chaque ouvrage numérisé ouvre un passage entre les générations. MIKANDA rassemble ces récits pour que chacun puisse les découvrir, les étudier et les faire vivre à son tour.</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Notre raison d'être</p>
            <h2 className="mt-3 font-serif text-4xl">Notre mission</h2>
          </div>
          <div>
            <p className="text-xl leading-9 text-[#705f57]">Rendre le patrimoine littéraire congolais plus visible, plus accessible et plus durable, tout en plaçant la dignité des créateurs et la fiabilité des sources au cœur de chaque projet.</p>
            <div className="mt-10 grid gap-6 border-t border-[#d9d1c6] pt-8 sm:grid-cols-3">
              <Stat value={`${counts.works}+`} label="œuvres cataloguées" />
              <Stat value={counts.authors} label="auteurs référencés" />
              <Stat value={counts.heritage} label="patrimoine à transmettre" />
            </div>
          </div>
        </div>
      </section>

      {/* Charte */}
      <section className="border-y border-[#d9d1c6] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Nos engagements</p>
          <h2 className="mt-3 font-serif text-4xl">Notre charte</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Charter icon={Unlock} n="01" title="Accessibilité" text="Mettre les œuvres et les savoirs à portée de tous, avec une expérience claire pour les lecteurs, les étudiants et les chercheurs." />
            <Charter icon={ShieldCheck} n="02" title="Respect des droits" text="Travailler avec les auteurs, les éditeurs et les ayants droit pour diffuser chaque contenu avec justesse et responsabilité." />
            <Charter icon={History} n="03" title="Mémoire vivante" text="Documenter les voix du passé tout en donnant une place aux écritures contemporaines et aux nouvelles générations." />
          </div>
        </div>
      </section>

      {/* Partenaires — cartes statiques */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Construire ensemble</p>
        <h2 className="mt-3 font-serif text-4xl">Nos partenaires</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {PARTNERS.slice(0, 4).map((item) => (
            <div key={item.name} className="flex items-center gap-4 rounded-lg border border-[#d9d1c6] bg-white p-5 transition-colors hover:border-[#133a28]/30">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon className="h-5 w-5" style={{ color: item.color }} />
              </span>
              <span className="font-serif text-lg">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bandeau défilant des partenaires */}
      <PartnerBanner />

      {/* L'équipe */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">L'équipe derrière MIKANDA</p>
          <h2 className="mt-3 font-serif text-4xl">Nos contributeurs</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.slice(0, 4).map((member) => (
            <div key={member.name} className="rounded-xl border border-[#d9d1c6] bg-white p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#133a28] to-[#245743] font-serif text-2xl text-white">
                {member.initials}
              </div>
              <h3 className="font-serif text-lg">{member.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#c17248]">{member.role}</p>
              <p className="mt-3 text-sm text-[#705f57]">{member.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/rejoindre-equipe" className="text-sm font-medium text-[#133a28] hover:underline">Rejoindre l'équipe →</Link>
        </div>
      </section>

      {/* Formulaire de soumission de manuscrits — avec ancre #soumission */}
      <section id="soumission" className="border-y border-[#d9d1c6] px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl">Contact et soumission de manuscrits</h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="text-[#705f57]">
              <p className="max-w-xl leading-7">
                Vous êtes auteur, chercheur, famille d'écrivain disparu ou détenteur d'un manuscrit rare ? Contactez l'équipe de conservation de MIKANDA.
              </p>
              <div className="mt-8 space-y-5 text-sm">
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-[#133a28]" />
                  <span>
                    <strong className="block text-[#281e19]">Service de conservation</strong>
                    conservation@mikanda.cd
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-[#133a28]" />
                  <span>
                    <strong className="block text-[#281e19]">Siège</strong>
                    Avenue de la Justice, Gombe — Kinshasa
                  </span>
                </p>
              </div>
            </div>
            <form
              className="rounded-xl border border-[#d9d1c6] bg-white p-6 shadow-lg"
              onSubmit={(event) => {
                event.preventDefault()
                notify.success('Votre soumission a été envoyée avec succès ! L\'équipe MIKANDA vous contactera sous 5 à 10 jours ouvrables.')
                event.target.reset()
              }}
            >
              <h3 className="mb-4 font-serif text-xl text-[#1a1410]">Proposer une œuvre</h3>
              <label className="text-sm font-medium">
                Nom complet *
                <input required name="nom" className="mt-2 mb-4 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] px-4 py-3 text-sm outline-none focus:border-[#133a28] transition-colors" />
              </label>
              <label className="text-sm font-medium">
                Adresse e-mail *
                <input required type="email" name="email" className="mt-2 mb-4 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] px-4 py-3 text-sm outline-none focus:border-[#133a28] transition-colors" />
              </label>
              <label className="text-sm font-medium">
                Titre et description de l'œuvre *
                <textarea required name="message" rows="5" placeholder="Titre de l'œuvre, auteur, type de document (manuscrit, édition ancienne, archives...)..." className="mt-2 w-full rounded-lg border border-[#d9d1c6] bg-[#fdfaf3] px-4 py-3 text-sm outline-none focus:border-[#133a28] transition-colors" />
              </label>
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#f3eee4] p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#c17248]" />
                <p className="text-xs leading-5 text-[#705f57]">Les documents originaux restent la propriété de leurs détenteurs. MIKANDA procède uniquement à la numérisation dans le cadre d'un accord officiel.</p>
              </div>
              <button type="submit" className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-[#133a28] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d5a3e] active:scale-95">
                Envoyer au comité de conservation <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-serif text-4xl text-[#133a28]">{value}</p>
      <p className="mt-2 text-sm text-[#705f57]">{label}</p>
    </div>
  )
}

function Charter({ icon: Icon, n, title, text }) {
  return (
    <article className="rounded-xl border border-[#d9d1c6] bg-white p-8 transition-all hover:shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-lg bg-[#133a28]/10 p-3"><Icon className="h-6 w-6 text-[#133a28]" /></div>
        <span className="font-mono text-xs text-[#c17248]">{n}</span>
      </div>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#705f57]">{text}</p>
    </article>
  )
}
