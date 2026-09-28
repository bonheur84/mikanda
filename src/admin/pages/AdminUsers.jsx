import { useState } from 'react'
import { Search, ToggleLeft, ToggleRight, Trash2, Shield } from 'lucide-react'
import { getAllUsers, toggleUserStatus, deleteUser } from '../../services/auth.js'
import { useNotification } from '../../hooks/useNotification.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useAuth } from '../../context/AuthContext.jsx'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function AdminUsers() {
  useDocumentTitle('Utilisateurs — Admin MIKANDA')
  const notify = useNotification()
  const { user: currentAdmin } = useAuth()
  const [users, setUsers] = useState(() => getAllUsers())
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.email.toLowerCase().includes(q) || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
  })

  function handleToggle(userId) {
    const updated = toggleUserStatus(userId)
    setUsers(updated)
    const u = updated.find((x) => x.id === userId)
    notify.info(u?.isActive ? 'Compte activé' : 'Compte désactivé')
  }

  function handleDelete(userId) {
    const u = users.find((x) => x.id === userId)
    if (u?.isAdmin) { notify.error('Impossible de supprimer un administrateur.'); return }
    if (!window.confirm(`Supprimer le compte de ${u?.firstName} ${u?.lastName} ?`)) return
    const updated = deleteUser(userId)
    setUsers(updated)
    notify.success('Utilisateur supprimé.')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Utilisateurs</h1>
        <p className="mt-1 text-sm text-[#705f57]">{users.filter(u => !u.isAdmin).length} utilisateur(s) enregistré(s)</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7770]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…" className="h-10 w-full rounded-lg border border-[#d9d1c6] pl-9 pr-4 text-sm focus:border-[#133a28] focus:outline-none" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e2ddd6] bg-white">
        <table className="w-full min-w-160 text-sm">
          <thead className="border-b border-[#e2ddd6] bg-[#f8f5f0]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Utilisateur</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Email</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Inscrit le</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Rôle</th>
              <th className="px-5 py-3 text-left font-semibold text-[#705f57]">Statut</th>
              <th className="px-5 py-3 text-right font-semibold text-[#705f57]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe4]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#faf8f4]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#133a28] text-xs font-bold text-white">
                      {(u.firstName || '?').charAt(0)}{(u.lastName || '').charAt(0)}
                    </div>
                    <span className="font-medium text-[#1a1410]">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#705f57]">{u.email}</td>
                <td className="px-5 py-3 text-[#705f57]">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3">
                  {u.isAdmin
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-[#133a28] px-2.5 py-0.5 text-xs font-semibold text-white"><Shield className="h-3 w-3" />Admin</span>
                    : <span className="rounded-full border border-[#d9d1c6] px-2.5 py-0.5 text-xs text-[#705f57]">Utilisateur</span>
                  }
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {u.isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.id !== currentAdmin?.id && !u.isAdmin && (
                      <>
                        <button onClick={() => handleToggle(u.id)} title={u.isActive ? 'Désactiver' : 'Activer'}
                          className="rounded-lg border border-[#d9d1c6] p-1.5 text-[#705f57] hover:border-[#133a28] hover:text-[#133a28]">
                          {u.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button onClick={() => handleDelete(u.id)} title="Supprimer"
                          className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {u.id === currentAdmin?.id && <span className="text-xs text-[#8f7770]">Vous</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#8f7770]">Aucun utilisateur trouvé.</div>
        )}
      </div>
    </div>
  )
}
