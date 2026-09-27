import { useState } from 'react'
import { Save, AlertTriangle } from 'lucide-react'
import { useNotification } from '../../hooks/useNotification.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { readJson, writeJson, removeKey, STORAGE_KEYS } from '../../services/storage.js'

const ADMIN_SETTINGS_KEY = 'mikanda-admin-settings'

const DEFAULT_SETTINGS = {
  siteName: 'MIKANDA',
  siteTagline: 'Bibliothèque numérique congolaise',
  contactEmail: 'contact@mikanda.cd',
  booksPerPage: 12,
  allowComments: true,
  allowRegistrations: true,
  maintenanceMode: false,
}

export function AdminSettings() {
  useDocumentTitle('Paramètres — Admin MIKANDA')
  const notify = useNotification()
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...readJson(ADMIN_SETTINGS_KEY, {}),
  }))

  function handleChange(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    writeJson(ADMIN_SETTINGS_KEY, settings)
    notify.success('Paramètres sauvegardés.')
  }

  function handleResetData() {
    if (!window.confirm(
      '⚠️ Ceci va supprimer TOUTES les données locales (commentaires, progression, favoris, utilisateurs).\n\nÊtes-vous sûr ?'
    )) return
    // Supprimer les données utilisateurs sauf session admin
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.user && key !== ADMIN_SETTINGS_KEY) {
        removeKey(key)
      }
    })
    notify.success('Données locales réinitialisées. Le compte admin a été conservé.')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Paramètres</h1>
        <p className="mt-1 text-sm text-[#705f57]">Configuration du panneau d'administration</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="rounded-xl border border-[#e2ddd6] bg-white p-6 space-y-5">
          <h2 className="font-semibold text-[#1a1410]">Informations du site</h2>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#705f57]">
            Nom du site
            <input value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none" />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#705f57]">
            Slogan
            <input value={settings.siteTagline} onChange={(e) => handleChange('siteTagline', e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none" />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#705f57]">
            Email de contact
            <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none" />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-[#705f57]">
            Livres par page
            <input type="number" min={6} max={48} value={settings.booksPerPage}
              onChange={(e) => handleChange('booksPerPage', Number(e.target.value))}
              className="mt-2 h-10 w-32 rounded-lg border border-[#d9d1c6] px-3 text-sm focus:border-[#133a28] focus:outline-none" />
          </label>

          <div className="space-y-3 border-t border-[#f0ebe4] pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#705f57]">Options</h3>

            {[
              { key: 'allowComments', label: 'Autoriser les commentaires' },
              { key: 'allowRegistrations', label: 'Autoriser les nouvelles inscriptions' },
              { key: 'maintenanceMode', label: 'Mode maintenance (non implémenté en frontend-only)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={settings[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="h-4 w-4 accent-[#133a28]" />
                <span className="text-sm text-[#705f57]">{label}</span>
              </label>
            ))}
          </div>

          <button type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#133a28] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d5a3e]">
            <Save className="h-4 w-4" /> Sauvegarder
          </button>
        </form>

        {/* Zone dangereuse */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h2 className="font-semibold text-red-700">Zone dangereuse</h2>
          </div>
          <p className="mb-4 text-xs text-red-600">
            Réinitialise toutes les données LocalStorage (commentaires, progression, favoris, utilisateurs).
            Le compte administrateur est conservé.
          </p>
          <button onClick={handleResetData}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Réinitialiser toutes les données locales
          </button>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
          ⚠️ Ces paramètres sont stockés localement dans le navigateur. En production, la configuration
          sera gérée côté backend (base de données + variables d'environnement serveur).
        </div>
      </div>
    </div>
  )
}
