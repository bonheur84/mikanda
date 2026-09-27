// ============================================================
// MIKANDA — Routes protégées (authentification requise)
// ============================================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * Protège une route : redirige vers /connexion si non connecté.
 * Mémorise la page demandée pour y revenir après connexion.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  return children
}

/**
 * Protège une route admin : redirige vers /admin/login si non admin.
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
