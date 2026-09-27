// ============================================================
// MIKANDA — Contexte d'authentification global
//
// Fournit l'état utilisateur à toute l'application via React Context.
// Centralise toute la logique auth pour éviter qu'elle soit dispersée.
//
// ⚠️  SIMULATION FRONTEND UNIQUEMENT — Remplacer par une API
// backend sécurisée (JWT + refresh tokens) en production.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  ensureAdminAccount,
} from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // S'assurer que le compte admin existe au démarrage
  useEffect(() => {
    ensureAdminAccount()
  }, [])

  /** Connexion avec email + mot de passe */
  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const session = loginUser({ email, password })
      setUser(session)
      return session
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /** Inscription + connexion automatique */
  const register = useCallback(async ({ firstName, lastName, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const session = registerUser({ firstName, lastName, email, password })
      setUser(session)
      return session
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /** Déconnexion */
  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    setError(null)
  }, [])

  /** Mise à jour du profil */
  const updateProfile = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const updated = updateUserProfile(data)
      setUser(updated)
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /** Efface l'erreur courante */
  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin === true,
      login,
      register,
      logout,
      updateProfile,
      clearError,
    }),
    [user, loading, error, login, register, logout, updateProfile, clearError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
