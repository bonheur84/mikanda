import { useState, useEffect, useRef } from 'react'
import { Navigate, Link } from 'react-router-dom'
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Heart,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Camera,
  Edit3,
  Check,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { readJson, STORAGE_KEYS } from '../services/storage.js'
import { books } from '../data/books.js'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

function getInitials(firstName, lastName) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase()
}

export function Profile() {
  useDocumentTitle('Mon profil')
  const { user, isAuthenticated, isAdmin, updateProfile, logout } = useAuth()
  const notify = useNotification()
  const { favorites } = useFavorites()

  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('stats')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setBio(user.bio || '')
    }
  }, [user])

  if (!isAuthenticated) return <Navigate to="/connexion" replace />

  // Statistiques de lecture
  const progressData = readJson(STORAGE_KEYS.progress, {})
  const ratingsData = readJson(STORAGE_KEYS.ratings, {})
  const commentsData = readJson(STORAGE_KEYS.comments, [])

  const booksInProgress = Object.entries(progressData)
    .filter(([, p]) => p > 0 && p < 100)
    .map(([id, p]) => ({ ...books.find((b) => b.id === id), progress: p }))
    .filter(Boolean)

  const booksCompleted = Object.entries(progressData)
    .filter(([, p]) => p >= 100)
    .map(([id]) => books.find((b) => b.id === id))
    .filter(Boolean)

  const userRatings = Object.entries(ratingsData)
  const userComments = commentsData.filter((c) => c.userId === user?.id || c.userName === `${user?.firstName} ${user?.lastName}`)
  const favBooks = favorites.map((id) => books.find((b) => b.id === id)).filter(Boolean)

  async function handleSaveProfile() {
    setSaving(true)
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), bio })
      notify.success('Profil mis à jour avec succès')
      setEditing(false)
    } catch (err) {
      notify.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setBio(user.bio || '')
    setEditing(false)
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify.error('Veuillez sélectionner une image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      notify.error('L\'image ne doit pas dépasser 2 Mo.')
      return
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        await updateProfile({ avatar: e.target.result })
        notify.success('Avatar mis à jour')
      } catch (err) {
        notify.error(err.message)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleLogout() {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout()
      notify.info('À bientôt sur MIKANDA !')
    }
  }

  const tabs = [
    { id: 'stats', label: 'Statistiques' },
    { id: 'reading', label: 'Lectures' },
    { id: 'favorites', label: `Favoris (${favBooks.length})` },
    { id: 'settings', label: 'Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-[#faf6ef] pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {/* En-tête profil */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Bannière */}
          <div className="h-32 bg-gradient-to-r from-[#133a28] via-[#1d5a3e] to-[#c17248]" />

          <div className="px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar */}
              <div className="-mt-14 flex items-end gap-4">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#133a28] text-2xl font-bold text-white shadow-md">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#c17248] text-white shadow hover:bg-[#a8633d]"
                    aria-label="Changer d'avatar"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="mb-1">
                  {editing ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Prénom"
                          className="h-9 rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none"
                        />
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Nom"
                          className="h-9 rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-serif text-2xl text-[#1a1410]">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="mt-0.5 text-sm text-[#705f57]">{user.email}</p>
                    </>
                  )}

                  {isAdmin && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#133a28] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      <Shield className="h-3 w-3" /> Administrateur
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#133a28] px-3 py-2 text-xs font-semibold text-[#133a28] hover:bg-[#133a28] hover:text-white"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Dashboard Admin
                  </Link>
                )}
                {editing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 rounded-lg border border-[#d9d1c6] px-3 py-2 text-xs text-[#705f57] hover:bg-[#f4ece2]"
                    >
                      <X className="h-3.5 w-3.5" /> Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg bg-[#133a28] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#d9d1c6] px-3 py-2 text-xs text-[#705f57] hover:bg-[#f4ece2]"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Modifier
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-3.5 w-3.5" /> Déconnexion
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Partagez quelque chose sur vous..."
                  rows={2}
                  className="w-full rounded-lg border border-[#d9d1c6] px-3 py-2 text-sm text-[#705f57] focus:border-[#133a28] focus:outline-none"
                />
              ) : (
                <p className="text-sm text-[#705f57]">
                  {user.bio || (
                    <span className="italic text-[#8f7770]">
                      Aucune biographie. Cliquez sur Modifier pour en ajouter une.
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Méta */}
            <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#8f7770]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Membre depuis {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.loginMethod === 'google' ? 'Compte Google' : 'Connexion par email'}
              </span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[#d9d1c6] bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#133a28] text-white'
                  : 'text-[#705f57] hover:bg-[#f4ece2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu onglets */}
        {activeTab === 'stats' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Heart className="h-5 w-5 text-[#c17248]" />} value={favBooks.length} label="Favoris" />
            <StatCard icon={<BookOpen className="h-5 w-5 text-[#133a28]" />} value={booksInProgress.length} label="En cours" />
            <StatCard icon={<Check className="h-5 w-5 text-green-600" />} value={booksCompleted.length} label="Terminés" />
            <StatCard icon={<Star className="h-5 w-5 text-yellow-500" />} value={userRatings.length} label="Notes données" />
          </div>
        )}

        {activeTab === 'reading' && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#1a1410]">Lectures en cours</h2>
            {booksInProgress.length === 0 ? (
              <EmptyState message="Aucune lecture en cours." link="/bibliotheque" linkLabel="Explorer la bibliothèque" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {booksInProgress.map((b) => (
                  <Link
                    key={b.id}
                    to={`/livres/${b.id}/lire`}
                    className="flex items-center gap-3 rounded-xl border border-[#d9d1c6] bg-white p-4 hover:border-[#133a28]"
                  >
                    <img src={b.image} alt={b.title} className="h-16 w-12 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-[#1a1410] line-clamp-1">{b.title}</p>
                      <p className="text-sm text-[#705f57]">{b.author}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-[#ede5d8]">
                        <div
                          className="h-full rounded-full bg-[#c17248]"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-[#8f7770]">{b.progress}% lu</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <h2 className="mt-8 font-serif text-xl text-[#1a1410]">Livres terminés</h2>
            {booksCompleted.length === 0 ? (
              <EmptyState message="Aucun livre terminé pour l'instant." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {booksCompleted.map((b) => (
                  <Link
                    key={b.id}
                    to={`/livres/${b.id}`}
                    className="flex items-center gap-3 rounded-xl border border-[#d9d1c6] bg-white p-4 hover:border-[#133a28]"
                  >
                    <img src={b.image} alt={b.title} className="h-14 w-10 rounded object-cover" />
                    <div>
                      <p className="font-medium text-[#1a1410] line-clamp-1">{b.title}</p>
                      <p className="text-sm text-[#705f57]">{b.author}</p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                        <Check className="h-3 w-3" /> Terminé
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="mb-4 font-serif text-xl text-[#1a1410]">Mes favoris</h2>
            {favBooks.length === 0 ? (
              <EmptyState message="Aucun favori pour l'instant." link="/bibliotheque" linkLabel="Découvrir des livres" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favBooks.map((b) => (
                  <Link
                    key={b.id}
                    to={`/livres/${b.id}`}
                    className="flex items-center gap-3 rounded-xl border border-[#d9d1c6] bg-white p-4 hover:border-[#133a28]"
                  >
                    <img src={b.image} alt={b.title} className="h-16 w-12 rounded object-cover" />
                    <div>
                      <p className="font-medium text-[#1a1410] line-clamp-2">{b.title}</p>
                      <p className="text-sm text-[#705f57]">{b.author}</p>
                      <p className="mt-1 text-xs text-[#8f7770]">{b.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-4">
            <h2 className="font-serif text-xl text-[#1a1410]">Paramètres du compte</h2>
            <div className="rounded-xl border border-[#d9d1c6] bg-white p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#705f57]">Email</p>
                <p className="mt-1 text-sm text-[#1a1410]">{user.email}</p>
                <p className="mt-0.5 text-xs text-[#8f7770]">
                  La modification de l'email nécessitera une vérification backend.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#705f57]">Méthode de connexion</p>
                <p className="mt-1 text-sm text-[#1a1410]">
                  {user.loginMethod === 'google' ? '🔵 Google' : '📧 Email / Mot de passe'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#705f57]">Mot de passe</p>
                <p className="mt-1 text-xs text-[#8f7770]">
                  La modification du mot de passe sera disponible lors de l'intégration backend sécurisée.
                </p>
              </div>

              <div className="border-t border-[#ede5d8] pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-600">Zone dangereuse</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" /> Se déconnecter
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
              ⚠️ Ce profil utilise une authentification simulée via LocalStorage. Ne partagez pas d'informations sensibles. Une authentification sécurisée sera intégrée lors du déploiement backend.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#d9d1c6] bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4ece2]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1a1410]">{value}</p>
        <p className="text-xs text-[#8f7770]">{label}</p>
      </div>
    </div>
  )
}

function EmptyState({ message, link, linkLabel }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d9d1c6] bg-white py-12 text-center">
      <p className="text-sm text-[#8f7770]">{message}</p>
      {link && (
        <Link to={link} className="mt-3 inline-block text-sm font-medium text-[#c17248] hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
